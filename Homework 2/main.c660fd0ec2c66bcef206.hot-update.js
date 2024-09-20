"use strict";
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ \"./tools.js\");\nconst {\r\n  select,\r\n  csv,\r\n  scaleLinear,\r\n  extent,\r\n  axisLeft,\r\n  axisBottom,\r\n  format,\r\n  line\r\n} = d3\r\n\r\n;\r\n\r\nconst svg = select('svg');\r\n\r\nconst width = +svg.attr('width');\r\nconst height = +svg.attr('height');\r\n\r\nconst render = (data) => {\r\n  const colors = {\r\n    'Iris-setosa': '#3CB371',\r\n    'Iris-versicolor': '#FF6347',\r\n    'Iris-virginica': '#4B0082',\r\n  };\r\n  const title = `Parallel Coordinates Visualization of Sepal and Petal Dimensions Across Iris Species`;\r\n  const yAxisLabel = `Value`\r\n  const xAxisLabel = `Variable`\r\n  const margin = {\r\n    top: 100,\r\n    right: 80,\r\n    bottom: 100,\r\n    left: 100,\r\n  };\r\n  const innerWidth = width - margin.left - margin.right;\r\n  const innerHeight = height - margin.top - margin.bottom;\r\n  const dimensions = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.extractKeys)(data)\r\n  const coordinate = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findMinMax)(data)\r\n  const yCoordinate = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findValues)(coordinate.min, coordinate.max, 1)\r\n  const xCoordinate = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findValues)(0, dimensions.length - 1, 1)\r\n\r\n  const g = svg.append('g')\r\n    .attr('transform', `translate(${margin.left}, ${margin.top})`)\r\n\r\n  const xScale = scaleLinear()\r\n    .domain([0, dimensions.length - 1]) // The number of element in dimensions array\r\n    .range([0, innerWidth - 100])\r\n\r\n  const yScale = {} // Should be a dictionary of scaleLinear objects\r\n  dimensions?.forEach((dim) => {\r\n    yScale[dim] = scaleLinear()\r\n      .domain([coordinate.min, coordinate.max])\r\n      .range([innerHeight, 0])\r\n      .nice()\r\n  })\r\n\r\n  // Draw one y-axis + multiple x-axis\r\n  const firstDimension = dimensions[0]\r\n  const axisLeftConfig = axisLeft(yScale[firstDimension])\r\n    .tickPadding(10)\r\n    .tickSize(-innerWidth + 50)\r\n    .tickValues(yCoordinate)\r\n\r\n  const yAxisG = g.append('g')\r\n    .attr('transform', `translate(0, 0)`)\r\n    .call(axisLeftConfig)\r\n\r\n  yAxisG\r\n    .append('text')\r\n    .attr('class', 'axis-label')\r\n    .attr('y', -40)\r\n    .attr('x', 10)\r\n    .attr('transform', `rotate(-90)`)\r\n    .attr('text-anchor', 'middle')\r\n    .text(yAxisLabel);\r\n\r\n  const axisBottomConfig = axisBottom(xScale)\r\n    .tickPadding(20)\r\n    .tickSize(-innerHeight)\r\n    .tickValues(xCoordinate)\r\n    .tickFormat((d, i) => dimensions[i])\r\n\r\n  // At the bottom\r\n  const xAxisG = g.append('g')\r\n    .attr('transform', `translate(0, ${yScale[firstDimension](coordinate.min)})`)\r\n    .call(axisBottomConfig)\r\n  \r\n    xAxisG\r\n    .append('text')\r\n    .attr('class', 'axis-label')\r\n    .attr('y', 50)\r\n    .attr('x', innerWidth)\r\n    .text(xAxisLabel);\r\n\r\n\r\n\r\n\r\n  // remove domain\r\n  xAxisG.selectAll('.domain').remove()\r\n  yAxisG.selectAll('.domain').remove()\r\n\r\n  // Draw some lines\r\n  const lineGenerator = line()\r\n    .x((d, i) => xScale(i))\r\n    .y((d, i) => yScale[dimensions[i]](d))\r\n\r\n  g.selectAll('path')\r\n    .data(data)\r\n    .enter()\r\n    .append('path')\r\n    .attr('fill', 'none')\r\n    .attr('class', 'data-line')\r\n    .attr('stroke', d => colors[d['class']])\r\n    .attr('stroke-width', 2)\r\n    .attr('opcity', 0)\r\n    .style('opacity', 0)\r\n    .transition()\r\n    .duration(1000)\r\n    .style('opacity', 0.3)\r\n    .attr('d', d => lineGenerator(dimensions.map(dim => d[dim])))\r\n\r\n  // Title\r\n  g.append('text')\r\n    .attr('class', 'title')\r\n    .attr('y', -40)\r\n    .text(title);\r\n};\r\n\r\nconst updateFields = (data) => {\r\n  render(data);\r\n};\r\n\r\n\r\n\r\ncsv('data.csv').then((data) => {\r\n  data.forEach((d) => {\r\n    d['sepal length'] = +d['sepal length'];\r\n    d['sepal width'] = +d['sepal width'];\r\n    d['petal length'] = +d['petal length'];\r\n    d['petal width'] = +d['petal width'];\r\n  });\r\n  const validData = data.filter(\r\n    (d) =>\r\n      !isNaN(d['sepal length']) &&\r\n      !isNaN(d['sepal width']) &&\r\n      !isNaN(d['petal length']) &&\r\n      !isNaN(d['sepal width']),\r\n  );\r\n  updateFields(validData);\r\n});\r\n\n\n//# sourceURL=webpack://homework-2/./index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ab5422711b275ef9b3bb")
/******/ })();
/******/ 
/******/ }
);