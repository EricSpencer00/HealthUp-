const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

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
  watchFolders: [
    // You can add additional watch folders here if needed
    path.resolve(__dirname, 'src'),
  ],
};

// Extend the default config with custom settings
module.exports = {
  ...getDefaultConfig(__dirname),
  ...config,
};
