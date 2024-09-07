const { getDefaultConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: [
      /node_modules\/.*/
    ],
  },
};

module.exports = {
  ...getDefaultConfig(__dirname),
  ...config,
};
