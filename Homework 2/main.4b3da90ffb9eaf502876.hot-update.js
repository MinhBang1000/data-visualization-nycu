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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ \"./tools.js\");\nconst {\r\n  select,\r\n  csv,\r\n  scaleLinear,\r\n  extent,\r\n  axisLeft,\r\n  axisBottom,\r\n  format,\r\n  line\r\n} = d3\r\n\r\n;\r\n\r\nconst svg = select('svg');\r\n\r\nconst width = +svg.attr('width');\r\nconst height = +svg.attr('height');\r\n\r\nconst render = (data) => {\r\n  const colors = {\r\n    'Iris-setosa': '#3CB371',\r\n    'Iris-versicolor': '#FF6347',\r\n    'Iris-virginica': '#4B0082',\r\n  };\r\n  const title = `Parallel Coordinates Visualization of Sepal and Petal Dimensions Across Iris Species`;\r\n  const margin = {\r\n    top: 100,\r\n    right: 80,\r\n    bottom: 100,\r\n    left: 100,\r\n  };\r\n  const innerWidth = width - margin.left - margin.right;\r\n  const innerHeight = height - margin.top - margin.bottom;\r\n  const dimensions = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.extractKeys)(data)\r\n  const coordinate = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findMinMax)(data)\r\n\r\n  const g = svg.append('g')\r\n    .attr('transform', `translate(${margin.left}, ${margin.top})`)\r\n\r\n  const xScale = scaleLinear()\r\n    .domain([0, dimensions.length - 1]) // The number of element in dimensions array\r\n    .range([0, innerWidth])\r\n\r\n  const yScale = {} // Should be a dictionary of scaleLinear objects\r\n  dimensions?.forEach((dim) => {\r\n    yScale[dim] = scaleLinear()\r\n      .domain([coordinate.min, coordinate.max])\r\n      .range([innerHeight, 0])\r\n      .nice()\r\n  })\r\n\r\n  // Draw some axis\r\n  dimensions?.forEach((dim, i) => {\r\n    const axisGroup = g.append('g')\r\n      .attr('transform', `translate(${xScale(i)}, 0)`)\r\n      .call(axisLeft(yScale[dim]))\r\n\r\n    // remove some components\r\n    axisGroup.selectAll('.tick line, .tick text')\r\n      .remove()\r\n\r\n    axisGroup.append('text')\r\n      .attr('x', 0)\r\n      .attr('y', -20)\r\n      .style('fill', 'black')\r\n      .attr('text-anchor', 'middle')\r\n      .attr('class', 'axis-label')\r\n      .text(dim)\r\n  })\r\n\r\n  // Draw some lines\r\n  const lineGenerator = line()\r\n    .x((d, i) => xScale(i))\r\n    .y((d, i) => yScale[dimensions[i]](d))\r\n\r\n  g.selectAll('path')\r\n    .data(data)\r\n    .enter()\r\n    .append('path')\r\n    .attr('fill', 'none')\r\n    .attr('stroke', d => colors[d['class']])\r\n    .attr('stroke-width', 2)\r\n    .attr('opcity', 0)\r\n    .style('opacity', 0)\r\n    .transition()\r\n    .duration(1000)\r\n    .style('opacity', 0.3)\r\n    .attr('d', d => lineGenerator(dimensions.map(dim => d[dim])))\r\n\r\n  // Title\r\n  g.append('text')\r\n    .attr('class', 'title')\r\n    .attr('y', -50)\r\n    .text(title);\r\n};\r\n\r\nconst updateFields = (data) => {\r\n  render(data);\r\n};\r\n\r\n\r\n\r\ncsv('data.csv').then((data) => {\r\n  data.forEach((d) => {\r\n    d['sepal length'] = +d['sepal length'];\r\n    d['sepal width'] = +d['sepal width'];\r\n    d['petal length'] = +d['petal length'];\r\n    d['petal width'] = +d['petal width'];\r\n  });\r\n  const validData = data.filter(\r\n    (d) =>\r\n      !isNaN(d['sepal length']) &&\r\n      !isNaN(d['sepal width']) &&\r\n      !isNaN(d['petal length']) &&\r\n      !isNaN(d['sepal width']),\r\n  );\r\n  updateFields(validData);\r\n});\r\n\n\n//# sourceURL=webpack://homework-2/./index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("38cadc6836ea930e45ab")
/******/ })();
/******/ 
/******/ }
);