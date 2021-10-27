const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// var storage = multer.memoryStorage();

var upload = multer({ storage }).single("file");
// var upload = multer({ storage });

router.post("/image", (req, res) => {
  //가져온 이미지 저장
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    console.log("res.req :", res.req);
    console.log(req.file.path, req.file.filename);
    return res.json({
      success: true,
      filePath: req.file.path,
      fileName: req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  //Save DB
  //new로 새로운 product객체 생성
  const product = new Product(req.body);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//landingPage 에 그릴때
router.post("/products", (req, res) => {
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let limit = req.body.limit ? parseInt(req.body.limit) : 4;
  let term = req.body.SearchTerm;
  let findArgs = {};

  //가격 설정 해주는 로직
  for (let key in req.body.newFilters) {
    if (req.body.newFilters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          //greater than equal
          $gte: req.body.newFilters[key][0],
          //less than equal
          $lte: req.body.newFilters[key][1],
        };
      } else {
        findArgs[key] = req.body.newFilters[key];
      }
    }
  }

  console.log("finArgs:", findArgs);

  //검색어 있을때 없을때
  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  } else {
    Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  }
});

//detailPage
router.get("/products_by_id", (req, res) => {
  // /api/product/products_by_id=${productId}&type=single
  let type = req.query.type;
  let productIds = req.query.id;

  if (type === "array") {
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }

  //type : signle = string, array =
  if (typeof productIds !== "string") {
    //productId 를 이용해서 DB에서 정보가져옴
    Product.find({ _id: { $in: productIds } })
      .populate("writer")
      .exec((err, product) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(product);
      });
  } else {
    Product.findOneAndUpdate(
      { _id: productIds },
      { $inc: { views: 1 } },
      { new: true },
      (err, product) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json(product);
      }
    );
  }
});

module.exports = router;
