const path = require('path');

module.exports = {
  entry: './index.js', // Entry point for your code
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname), // Output in the same directory as index.js
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname), // Serve files from the root directory
    },
    devMiddleware: {
      writeToDisk: true, // Force writing to disk
    },
  },
};
