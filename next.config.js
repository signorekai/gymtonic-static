function withWPEHeadless(nextConfig = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires,global-require
  const withTM = require('next-transpile-modules')(['@wpengine/headless']);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  return withTM(nextConfig);
}

module.exports = withWPEHeadless({
  target: 'serverless',
  images: {
    domains: ['gymtonic.local', 'demo.sulphur.com.sg'],
    deviceSizes: [360, 375, 414, 768, 1024, 1366, 1600],
    imageSizes: [64, 96, 128],
  },
});
