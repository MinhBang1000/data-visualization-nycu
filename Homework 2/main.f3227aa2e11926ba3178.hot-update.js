/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatehomework_2"]("main",{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("const {\r\n  select,\r\n  csv,\r\n  scaleLinear,\r\n  extent,\r\n  axisLeft,\r\n  axisBottom,\r\n  format,\r\n} = d3\r\n\r\nconst svg = select('svg');\r\n\r\nconst width = +svg.attr('width');\r\nconst height = +svg.attr('height');\r\n\r\nconst render = (data, xAttr, yAttr) => {\r\n  const colors = {\r\n    'Iris-setosa': '#3CB371',\r\n    'Iris-versicolor': '#FF6347',\r\n    'Iris-virginica': '#4B0082',\r\n  };\r\n  const title = `Visualizing Sepal and Petal Dimensions Across Iris Species`;\r\n\r\n  \r\n};\r\n\r\nconst updateFields = (data) => {\r\n  svg.selectAll('g').remove();\r\n  const xAttr = document.getElementById('x-select').value;\r\n  const yAttr = document.getElementById('y-select').value;\r\n  render(data, xAttr, yAttr);\r\n};\r\n\r\n\r\n\r\ncsv('data.csv').then((data) => {\r\n  data.forEach((d) => {\r\n    d['sepal length'] = +d['sepal length'];\r\n    d['sepal width'] = +d['sepal width'];\r\n    d['petal length'] = +d['petal length'];\r\n    d['petal width'] = +d['petal width'];\r\n  });\r\n  const validData = data.filter(\r\n    (d) =>\r\n      !isNaN(d['sepal length']) &&\r\n      !isNaN(d['sepal width']) &&\r\n      !isNaN(d['petal length']) &&\r\n      !isNaN(d['sepal width']),\r\n  );\r\n  // updateFields(validData);\r\n});\r\n\n\n//# sourceURL=webpack://homework-2/./index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("8b3921752e33cc23eaaa")
/******/ })();
/******/ 
/******/ }
);