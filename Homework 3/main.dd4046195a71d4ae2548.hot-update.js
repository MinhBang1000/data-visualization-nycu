"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatehomework_3"]("main",{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ \"./tools.js\");\nconst {\r\n  select,\r\n  csv,\r\n  text,\r\n  scaleLinear,\r\n  extent,\r\n  axisLeft,\r\n  axisBottom,\r\n  format,\r\n  line,\r\n  mouse,\r\n  transition,\r\n  scaleBand\r\n} = d3\r\n\r\n;\r\n\r\nconst svg = select('svg');\r\n\r\nconst width = +svg.attr('width');\r\nconst height = +svg.attr('height');\r\n\r\n\r\nconst heatmapCreate = (keys, data, edgeLength, title) => {\r\n  const inversedKeys = new Array()\r\n  for (let i = keys.length - 1; i >= 0; i--) {\r\n    inversedKeys.push(keys[i])\r\n  }\r\n  // Container Group 0 - Male\r\n  const g = select('svg').append('g')\r\n  // Build the axis and scale axis - X axis\r\n  const xScale = scaleBand()\r\n    .domain(keys.filter(k => k !== 'Sex'))\r\n    .range([0, edgeLength])\r\n    .padding(0)\r\n  const xAxis = axisBottom(xScale)\r\n    .tickPadding(-10)\r\n  const xAxisG = g.append('g')\r\n    .attr('class', 'x-axis')\r\n    .attr('transform', `translate(${0},${edgeLength})`)\r\n    .call(xAxis)\r\n  // Config the tick x-axis\r\n  xAxisG.selectAll('.x-axis .tick text')\r\n    .attr('x', -10)\r\n  // Y - axis\r\n  const yScale = scaleBand()\r\n    .domain(inversedKeys.filter(k => k !== 'Sex'))\r\n    .range([edgeLength, 0])\r\n    .padding(0)\r\n  const yAxis = axisLeft(yScale)\r\n  const yAxisG = g.append('g')\r\n    .attr('class', 'y-axis')\r\n    .attr('transform', `translate(${0},${0})`)\r\n    .call(yAxis)\r\n\r\n  // Remove all domain and tick line\r\n  g.selectAll('.tick line').remove()\r\n  g.selectAll('.domain').remove()\r\n\r\n  const colorScale = scaleLinear()\r\n    .domain([-1, -0.5, 0, 0.5, 1])\r\n    .range(\r\n      [\"#000814\", \"#001d3d\", \"#001d3d\", \"#003566\", \"#90e0ef\"]\r\n    );\r\n\r\n  // Fill the rect inside the group container\r\n  const rects = g.selectAll('rect')\r\n    .data(data, d => d)\r\n    .enter()\r\n    .append('rect')\r\n    .attr('class', 'data-rect')\r\n    // .attr(\"rx\", 4)\r\n    // .attr(\"ry\", 4)\r\n    .attr('x', (d) => xScale(d.keyX))\r\n    .attr('y', (d) => yScale(d.keyY))\r\n    .attr('width', xScale.bandwidth())\r\n    .attr('height', yScale.bandwidth())\r\n    .attr('fill', (d) => colorScale(d.r))\r\n\r\n  // Append text inside each rectangle\r\n  rects.each(function (d) {\r\n    const rect = select(this); // Select the current rect\r\n    const x = parseFloat(rect.attr('x')) + xScale.bandwidth() / 2; // Center x\r\n    const y = parseFloat(rect.attr('y')) + yScale.bandwidth() / 2; // Center y\r\n\r\n    const color = d.r < 0.85 ? 'white' : 'black'\r\n\r\n    // Append text\r\n    g.append('text')\r\n      .attr('x', x)\r\n      .attr('y', y)\r\n      .attr('dy', '.35em') // Vertically align text\r\n      .attr('text-anchor', 'middle') // Center text\r\n      .style('fill', `${color}`) // Set text color to black\r\n      .style('font-size', '10px') // Set the font size to a smaller value\r\n      .text(d.r % 1 === 0 ? Math.round(d.r) : d3.format('.2f')(d.r)); // Display whole number or rounded value\r\n  });\r\n  // Title\r\n  g.append('text')\r\n    .attr('class', 'h2-title')\r\n    .attr('y', -10)\r\n    .text(title);\r\n  return g\r\n}\r\n\r\n\r\nconst render = (data) => {\r\n  \r\n  // Introduction\r\n  const title = `Correlation Matrices of Abalone Attributes: A Comparative Analysis of Male, Female, and Infant Categories`;\r\n  const names = [\"Male Abalone\", \"Female Abalone\", \"Infant Abalone\"]\r\n  \r\n  // Layout\r\n  const margin = {\r\n    top: 80,\r\n    right: 100,\r\n    bottom: 80,\r\n    left: 100,\r\n  };\r\n  const gap = {\r\n    top: 20,\r\n    bottom: 20,\r\n    left: 20,\r\n    right: 20\r\n  }\r\n\r\n  // Prepare the data\r\n  const edgeLength = 300\r\n  const maleData = []\r\n  const femaleData = []\r\n  const infantData = []\r\n  const keys = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.extractKeys)(data)\r\n  const inversedKeys = new Array()\r\n  for (let i = keys.length - 1; i >= 0; i--) {\r\n    inversedKeys.push(keys[i])\r\n  }\r\n  const allData = data.filter(d => isNaN(d?.Sex))\r\n  allData.forEach((d) => {\r\n    if (d?.Sex === 'M') {\r\n      maleData.push(d)\r\n    } else if (d?.Sex === 'F') {\r\n      femaleData.push(d)\r\n    } else if (d?.Sex === 'I') {\r\n      infantData.push(d)\r\n    }\r\n  })\r\n  const all = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findR)(allData, keys)\r\n  const male = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findR)(maleData, keys)\r\n  const female = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findR)(femaleData, keys)\r\n  const infant = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findR)(infantData, keys)\r\n\r\n\r\n  // Male heatmap\r\n  const g0 = heatmapCreate(keys, male, edgeLength, names[0])\r\n  g0.attr('transform', `translate(${margin.left}, ${margin.top + 2*gap.top})`)\r\n\r\n\r\n  // Female heatmap\r\n  const g1 = heatmapCreate(keys, female, edgeLength, names[1])\r\n  g1.attr('transform', `translate(${margin.left + 400}, ${margin.top + 2*gap.top})`)\r\n\r\n  // Infant heatmap\r\n  const g2 = heatmapCreate(keys, infant, edgeLength, names[2])\r\n  g2.attr('transform', `translate(${margin.left + 800}, ${margin.top + 2*gap.top})`)\r\n\r\n  svg.selectAll('.h2-title')\r\n    .attr('x', 3*gap.left)\r\n\r\n\r\n  svg.append('text')\r\n    .attr('class', 'title')\r\n    .attr('y', margin.top - 10)\r\n    .attr('x', margin.left)\r\n    .text(title)\r\n  \r\n};\r\n\r\nconst updateFields = (data) => {\r\n  svg.selectAll('*').remove()\r\n  render(data)\r\n};\r\n\r\n\r\ntext('abalone.data').then((data) => {\r\n  const parsedData = data.split('\\n').map(row => {\r\n    const columns = row.split(',');\r\n    return {\r\n      'Sex': columns[0],                      // Column 1: Sex\r\n      'Length': +columns[1],                  // Column 2: Length\r\n      'Diameter': +columns[2],                // Column 3: Diameter\r\n      'Height': +columns[3],                  // Column 4: Height\r\n      'Whole Weight': +columns[4],             // Column 5: Whole Weight\r\n      'Shucked Weight': +columns[5],           // Column 6: Shucked Weight\r\n      'Viscera Weight': +columns[6],           // Column 7: Viscera Weight\r\n      'Shell Weight': +columns[7],             // Column 8: Shell Weight\r\n      'Rings': +columns[8]                    // Column 9: Rings\r\n    };\r\n  })\r\n  updateFields(parsedData)\r\n})\n\n//# sourceURL=webpack://homework-3/./index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4ab92172b9c6e5cdff1c")
/******/ })();
/******/ 
/******/ }
);