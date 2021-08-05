const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");

const { auth } = require("../middleware/auth");
const async = require("async");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  return res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res
        .clearCookie("w_auth")
        .clearCookie("w_authExp")
        .status(200)
        .send({
          success: true,
        });
    }
  );
});

router.post("/addToCart", auth, (req, res) => {
  //User collection에  모든 정보 가져오기
  //미들웨어 auth 때문에 req.user <- 사용 가능
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    //가져온 정보에서 카트에 넣으려하는 상품이 이미 있는지 확인
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });
    //상품이 이미 있을때
    if (duplicate) {
      User.findOneAndUpdate(
        //미들웨어 auth 때문에 req.user <- 사용 가능
        { _id: req.user._id, "cart.id": req.body.productId },
        { $inc: { "cart.$.quantity": 1 } },
        //update된 userInfo 를 넘겨주기 위해 new: true (commit 느낌)
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          console.log(userInfo.cart);
          return res.status(200).json(userInfo.cart);
        }
      );
    }
    //상품이 있지 않을때
    else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: { id: req.body.productId, quantity: 1, date: Date.now() },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json(userInfo.cart);
        }
      );
    }
  });
});

router.get("/removeFromCart", auth, (req, res) => {
  //Cart안 상품 지워주기
  User.findOneAndUpdate(
    //auth 미들웨어 때문에 req.user.id 사용 가능
    { _id: req.user.id },
    { $pull: { cart: { id: req.query.id } } },
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map((item) => {
        return item.id;
      });
      //product collection 현재 남은 상품 가져오기
      Product.find({ _id: { $in: array } })
        .populate("writer")
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({ productInfo, cart });
        });
    }
  );
});

router.post("/successBuy", auth, (req, res) => {
  console.log("successBuy INN");
  //User 안 History에 간단한 결제정보
  let history = [];
  let transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID,
    });
  });
  //Payment 안 자세한 결제정보
  transactionData.user = {
    //From Middleware auth
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  transactionData.data = req.body.paymentData;
  transactionData.product = history;
  //history 정보 저장
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      //Payment에 transactionData 저장
      const payment = new Payment(transactionData);
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        //Product 안 sold 필드 정보 업데이트
        //상품 당 몇개의 quantity를 샀는지
        let products = [];
        doc.product.forEach((item) => {
          products.push({
            id: item.id,
            quantity: item.quantity,
          });
        });
        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              { _id: item.id },
              {
                $inc: {
                  sold: item.quantity,
                },
              },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.status(400).json({ success: false, err });
            return res.status(200).json({
              success: true,
              cart: userInfo.cart,
              cartDetail: [],
            });
          }
        );
      });
    }
  );
});
module.exports = router;
