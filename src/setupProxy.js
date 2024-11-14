const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // ...
  app.use(
    '/task',
    createProxyMiddleware({
      target: 'https://stageapi.monkcommerce.app',
      changeOrigin: true,
    })
  );
};
