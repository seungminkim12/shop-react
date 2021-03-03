const fs = require("fs");
const AWS = require("aws-sdk");
const BUCKET_NAME = "shopreact";
const s3 = new AWS.S3({
  accessKeyId: "AKIAS4QZPPTX4EPYPROZ",
  secretAccessKey: "AKIAS4QZPPTXQLHOMZMK",
});
const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);
  const params = {
    Bucket: BUCKET_NAME,
    Key: "test.txt", //File name you want to save as in S3
    Body: fileContent,
  };

  s3.upload(params, function (err, data) {
    if (err) throw err;
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};
uploadFile("../uploads/test.txt");
module.exports = { uploadFile };
