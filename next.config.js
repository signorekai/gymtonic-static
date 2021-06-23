function withWPEHeadless(nextConfig = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires,global-require
  const withTM = require('next-transpile-modules')(['@wpengine/headless']);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  return withTM(nextConfig);
}

module.exports = withWPEHeadless();
