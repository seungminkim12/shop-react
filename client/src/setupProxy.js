const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://15.164.169.247:5000",
      changeOrigin: true,
    })
  );
};
