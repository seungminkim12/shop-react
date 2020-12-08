const { json } = require("body-parser");
const express = require("express");
const router = express.Router();

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${date.now()}_${file.originalname}`);
  },
});

router.post("/image", (req, res) => {
  //가져온 이미지 저장
  upload(req, res, (err) => {
    if (err) return json({ success: false, err });
    return res.json({
      success: true,
      fliePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
