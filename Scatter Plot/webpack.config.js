const path = require('path');

module.exports = {
  entry: './index.js', // Entry point for your code
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'dist') // Output directory
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // Add this option to force writing to disk
    devMiddleware: {
      writeToDisk: true,
    },
  },
};
