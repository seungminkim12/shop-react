const AWS = require("aws-sdk");
const ID = "AKIAS4QZPPTX4EPYPROZ";
const SECRET = "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";
const BUCKET_NAME = "shopreact";
const s3 = new AWS.S3({ accessKeyId: ID, secretAccessKey: SECRET });
const params = {
  Bucket: BUCKET_NAME,
  createBucketConfiguration: {
    // Set your region here
    LocationConstraint: "ap-northeast-2c",
  },
};
s3.createBucket(params, function (err, data) {
  if (err) console.log(err, err.stack);
  else console.log("Bucket Created Successfully", data.location);
});
