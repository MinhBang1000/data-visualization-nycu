// const path = require('path');

// module.exports = {
//   entry: './index.js', // Entry point for your code
//   output: {
//     filename: 'bundle.js', // Output bundle file
//     path: path.resolve(__dirname), // Output directory set to the same directory as index.js
//   },
//   mode: 'development',
//   devServer: {
//     static: {
//       directory: path.join(__dirname), // Serve files from the same directory
//     },
//     devMiddleware: {
//       writeToDisk: true, // Forces writing the bundle to disk
//     },
//   },
// };

// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin'); // Automatically include bundle in index.html
// const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Clean up the 'dist' folder

// module.exports = {
//   entry: './index.js', // Entry point for your code
//   output: {
//     filename: 'bundle.js', // Output bundle file
//     path: path.resolve(__dirname, 'dist'), // Output directory set to 'dist'
//   },
//   mode: 'development', // Set mode based on environment (development or production)

//   devServer: {
//     static: {
//       directory: path.join(__dirname), // Serve files from the same directory
//     },
//     devMiddleware: {
//       writeToDisk: true, // Forces writing the bundle to disk
//     },
//   },

//   module: {
//     rules: [
//       {
//         test: /\.css$/, // To handle CSS files
//         use: ['style-loader', 'css-loader'], // Apply style and css loaders
//       },
//       {
//         test: /\.js$/, // To handle JS files
//         exclude: /node_modules/,
//         use: 'babel-loader', // Use babel for JS transpiling
//       },
//     ],
//   },

//   plugins: [
//     new CleanWebpackPlugin(), // Cleans the dist folder before each build
//     new HtmlWebpackPlugin({
//       template: './index.html', // Template HTML file
//       filename: 'index.html', // Output HTML in dist folder
//     }),
//   ],
// };


const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './index.js', // Entry point for your code
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'dist'), // Output directory set to 'dist'
    publicPath: './', // Ensure relative paths so it can work without a server
  },
  
  mode: 'production', // Set mode to production for optimized builds

  module: {
    rules: [
      {
        test: /\.css$/, // To handle CSS files
        use: ['style-loader', 'css-loader'], // Apply style and css loaders
      },
      {
        test: /\.js$/, // To handle JS files
        exclude: /node_modules/,
        use: 'babel-loader', // Use babel for JS transpiling
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(), // Cleans the dist folder before each build
    new HtmlWebpackPlugin({
      template: './index.html', // Template HTML file
      filename: 'index.html', // Output HTML in dist folder
    }),
  ],
};
