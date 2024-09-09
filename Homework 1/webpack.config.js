const path = require('path');

module.exports = {
  entry: './index.js', // Entry point for your code
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname), // Output directory set to the same directory as index.js
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname), // Serve files from the same directory
    },
    devMiddleware: {
      writeToDisk: true, // Forces writing the bundle to disk
    },
  },
};
