function withWPEHeadless(nextConfig = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires,global-require
  const withTM = require('next-transpile-modules')(['@wpengine/headless']);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  return withTM(nextConfig);
}

module.exports = withWPEHeadless({
  images: {
    deviceSizes: [200, 768, 1024, 1366, 1600],
    imageSizes: [32, 48, 64, 96, 128],
  },
});
