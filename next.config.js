function withWPEHeadless(nextConfig = {}) {
  const withTM = require('next-transpile-modules')(['@wpengine/headless']);

  return withTM(nextConfig);
}

module.exports = withWPEHeadless({
  generateBuildId: () => 'build',
  target: 'serverless',
  images: {
    domains: ['gymtonic.local', 'demo.sulphur.com.sg', 'backend.gymtonic.sg'],
    deviceSizes: [360, 375, 414, 768, 1024, 1366, 1600],
    imageSizes: [64, 96, 128],
  },
  // https://stackoverflow.com/questions/68565169/using-tailwind-arbitrary-value-support-with-scss/68959514#68959514
  webpack(config) {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));

    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (moduleLoader.loader.includes('resolve-url-loader'))
          moduleLoader.options.sourceMap = false;
      });
    });

    return config;
  },
});
