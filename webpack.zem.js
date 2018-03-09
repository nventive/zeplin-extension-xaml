function updateConfig(config) {
  config.module.rules.push({
    test: /\.mustache$/,
    loader: require.resolve('mustache-loader'),
  });

  return config;
}

module.exports = updateConfig;
