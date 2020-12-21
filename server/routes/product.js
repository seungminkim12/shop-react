const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage }).single("file");

router.post("/image", (req, res) => {
  //가져온 이미지 저장
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    // console.log("req :", res.req);
    return res.json({
      success: true,
      filePath: req.file.path,
      fileName: req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  //Save DB
  const product = new Product(req.body);
  console.log("==================product======================== : ", product);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let term = req.body.SearchTerm;
  let findArgs = {};

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

router.get("/products_by_id", (req, res) => {
  // /api/product/products_by_id=${productId}&type=single
  let type = req.query.type;
  let productIds = req.query.id;
  console.log("Products_by_id INN");

  if (type === "array") {
    let ids = req.query.id.split(",");
    console.log("==================ids==========", ids);
    productIds = ids.map((item) => {
      return item;
    });
    console.log("==================productIds", productIds);
  }

  //productId 를 이용해서 DB에서 정보가져옴
  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, product });
    });
});

module.exports = router;
