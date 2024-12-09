const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.watchFolders = [
  // Add folders to watch specifically (if needed)
];

defaultConfig.resolver.blockList = [
  /node_modules\/.*\/node_modules\/.*/
];

module.exports = defaultConfig;
