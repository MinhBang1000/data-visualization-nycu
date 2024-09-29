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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools */ \"./tools.js\");\nconst {\r\n  select,\r\n  csv,\r\n  text,\r\n  scaleLinear,\r\n  extent,\r\n  axisLeft,\r\n  axisBottom,\r\n  format,\r\n  line,\r\n  mouse,\r\n  transition,\r\n  scaleBand\r\n} = d3\r\n\r\n;\r\n\r\n// Get started by setting up\r\nconst title = `Correlation Matrices of Abalone Attributes: A Comparative Analysis of Male, Female, and Infant Categories`;\r\nconst names = [\"Male Abalone\", \"Female Abalone\", \"Infant Abalone\"]\r\n\r\n// Layout\r\nconst margin = {\r\n  top: 64,\r\n  right: 64,\r\n  bottom: 64,\r\n  left: 64,\r\n};\r\nconst gap = {\r\n  top: 20,\r\n  bottom: 20,\r\n  left: 20,\r\n  right: 20\r\n}\r\n\r\nconst svg = select('svg')\r\n  .attr('width', \"100%\")\r\n  .attr('height', \"100%\");\r\n\r\nconst width = +svg.attr('width');\r\nconst height = +svg.attr('height');\r\n\r\n\r\nconst heatmapCreate = (keys, data, edgeLength, title) => {\r\n  const inversedKeys = new Array()\r\n  for (let i = keys.length - 1; i >= 0; i--) {\r\n    inversedKeys.push(keys[i])\r\n  }\r\n  const g = select('svg').append('g')\r\n\r\n  // Build the axis and scale axis - X axis\r\n  const xScale = scaleBand()\r\n    .domain(keys.filter(k => k !== 'Sex'))\r\n    .range([0, edgeLength])\r\n    .padding(0.05)\r\n  const xAxis = axisBottom(xScale)\r\n    .tickPadding(-10)\r\n  const xAxisG = g.append('g')\r\n    .attr('class', 'x-axis')\r\n    .attr('transform', `translate(${0},${edgeLength})`)\r\n    .call(xAxis)\r\n  // Config the tick x-axis\r\n\r\n  xAxisG.selectAll('.x-axis .tick text')\r\n    .attr('x', -10)\r\n\r\n  // Y - axis\r\n  const yScale = scaleBand()\r\n    .domain(inversedKeys.filter(k => k !== 'Sex'))\r\n    .range([edgeLength, 0])\r\n    .padding(0.05)\r\n  const yAxis = axisLeft(yScale)\r\n  const yAxisG = g.append('g')\r\n    .attr('class', 'y-axis')\r\n    .attr('transform', `translate(${0},${0})`)\r\n    .call(yAxis)\r\n\r\n  // Remove all domain and tick line\r\n  g.selectAll('.tick line').remove()\r\n  g.selectAll('.domain').remove()\r\n\r\n  const colorScale = scaleLinear()\r\n    .domain([-1, -0.5, 0, 0.5, 1])\r\n    .range(\r\n      [\"#000814\", \"#001d3d\", \"#001d3d\", \"#003566\", \"#90e0ef\"]\r\n    );\r\n\r\n  // Fill the rect inside the group container\r\n  const rects = g.selectAll('rect')\r\n    .data(data, d => d)\r\n    .enter()\r\n    .append('rect')\r\n    .attr('class', `data-rect`)\r\n    .attr('x', (d) => xScale(d.keyX))\r\n    .attr('y', (d) => yScale(d.keyY))\r\n    .attr('rx', 5)\r\n    .attr('ry', 5)\r\n    .attr('width', xScale.bandwidth())\r\n    .attr('height', yScale.bandwidth())\r\n    .attr('fill', (d) => colorScale(d.r))\r\n\r\n  // Append text inside each rectangle\r\n  rects.each(function (d) {\r\n    const rect = select(this); // Select the current rect\r\n    const x = parseFloat(rect.attr('x')) + xScale.bandwidth() / 2; // Center x\r\n    const y = parseFloat(rect.attr('y')) + yScale.bandwidth() / 2; // Center y\r\n    const color = d.r < 0.85 ? 'white' : 'black'\r\n\r\n    // Append text\r\n    const rectText = g.append('text')\r\n      .attr('x', x)\r\n      .attr('y', y)\r\n      .attr('dy', '.35em') // Vertically align text\r\n      .attr('class', 'data-rect-text')\r\n      .attr('text-anchor', 'middle') // Center text\r\n      .style('fill', `${color}`) // Set text color to black\r\n      .style('font-size', '10px') // Set the font size to a smaller value\r\n      .text(d.r % 1 === 0 ? Math.round(d.r) : d3.format('.2f')(d.r)); // Display whole number or rounded value\r\n\r\n    // Adding mouseenter and mouseleave function\r\n    rect.on('mouseenter', function () {\r\n      rectText.classed('data-rect-text-active', true)\r\n      rect.classed('data-rect-active', true)\r\n    })\r\n\r\n    rect.on('mouseleave', function () {\r\n      rectText.classed('data-rect-text-active', false)\r\n      rect.classed('data-rect-active', false)\r\n    })\r\n\r\n    rectText.on('mouseenter', function () {\r\n      rectText.classed('data-rect-text-active', true)\r\n      rect.classed('data-rect-active', true)\r\n    })\r\n\r\n    rectText.on('mouseleave', function () {\r\n      rectText.classed('data-rect-text-active', false)\r\n      rect.classed('data-rect-active', false)\r\n    })\r\n\r\n    // Adding mouseclick\r\n    rect.on('click', function () {\r\n      const flag = rectText.classed('data-rect-text-clicked')\r\n      rectText.classed('data-rect-text-clicked', !flag)\r\n    })\r\n\r\n    rectText.on('click', function () {\r\n      const flag = rectText.classed('data-rect-text-clicked')\r\n      rectText.classed('data-rect-text-clicked', !flag)\r\n    })\r\n  });\r\n  // Title\r\n  g.append('text')\r\n    .attr('class', 'h2-title')\r\n    .attr('y', -10)\r\n    .text(title);\r\n\r\n  g.style('opacity', 0)\r\n    .transition()\r\n    .duration(1000)\r\n    .style('opacity', 1)\r\n\r\n  return g\r\n}\r\n\r\nconst colorNoticeCreate = (colors, size) => {\r\n  const g = select('svg').append('g');\r\n\r\n  // Create the gradient definition\r\n  const defs = g.append('defs');\r\n  const linearGradient = defs.append('linearGradient')\r\n    .attr('id', 'colorGradient')\r\n    .attr('x1', '0%')\r\n    .attr('y1', '0%')\r\n    .attr('x2', '100%')\r\n    .attr('y2', '0%'); // Horizontal gradient\r\n\r\n  // Define the color stops based on the provided colors\r\n  const stops = [-1, -0.5, 0, 0.5, 1];\r\n  stops.forEach((stopValue, index) => {\r\n    linearGradient.append('stop')\r\n      .attr('offset', `${((index) / (stops.length - 1)) * 100}%`) // Calculate percentage offset\r\n      .style('stop-color', colors[index])\r\n      .style('stop-opacity', 1);\r\n  });\r\n\r\n  const xScale = scaleLinear()\r\n    .domain([-1, 1])\r\n    .range([0, size]);\r\n\r\n  const axisConfig = axisBottom(xScale)\r\n    .tickValues([-1, -0.5, 0, 0.5, 1])  // Specify the tick values\r\n    .tickFormat(d3.format(\".1f\"));       // Format to display one decimal place\r\n\r\n  const axisG = g.append('g')\r\n    .attr('class', 'color-axis')\r\n    .call(axisConfig);\r\n\r\n  axisG.selectAll('.tick line').remove();\r\n  axisG.selectAll('.domain').remove();\r\n\r\n  // Use the gradient for the rectangle fill\r\n  const rect = g.append('rect')\r\n    .attr('class', 'color-rect')\r\n    .attr('x', 0)\r\n    .attr('y', -12)\r\n    .attr('width', size)\r\n    .attr('height', 15)\r\n    .attr('fill', 'url(#colorGradient)'); // Use the gradient\r\n\r\n  // Title\r\n  const title = g.append('text')\r\n    .attr('class', 'h2-title-color')\r\n    .attr('x', 0)\r\n    .attr('y', -25)\r\n    .text(\"Value Scale\")\r\n\r\n\r\n  g.style('opacity', 0)\r\n    .transition()\r\n    .duration(1000)\r\n    .style('opacity', 1)\r\n\r\n  return g;\r\n};\r\n\r\n\r\nconst render = (processData, keys) => {\r\n  // Prepare the data\r\n  const inversedKeys = new Array()\r\n  for (let i = keys.length - 1; i >= 0; i--) {\r\n    inversedKeys.push(keys[i])\r\n  }\r\n  const edgeLength = 200\r\n\r\n\r\n  // Title\r\n  svg.append('text')\r\n    .attr('class', 'title')\r\n    .attr('y', margin.top)\r\n    .attr('x', 0)\r\n    .text(title)\r\n    .style('opacity', 0)\r\n    .transition()\r\n    .duration(1000)\r\n    .style('opacity', 1);\r\n\r\n\r\n  // Male heatmap\r\n  const g0 = heatmapCreate(keys, processData[0], edgeLength, names[0])\r\n  g0.attr('transform', `translate(${margin.left + 108}, ${margin.top + 100})`)\r\n\r\n  // Female heatmap\r\n  const g1 = heatmapCreate(keys, processData[1], edgeLength, names[1])\r\n  g1.attr('transform', `translate(${445}, ${margin.top + 100})`)\r\n  g1.selectAll(\".tick text\").remove()\r\n\r\n  // Infant heatmap\r\n  const g2 = heatmapCreate(keys, processData[2], edgeLength, names[2])\r\n  g2.attr('transform', `translate(${800}, ${margin.top + 100})`)\r\n  g2.selectAll(\".tick text\").remove()\r\n\r\n\r\n  // Color band\r\n  const cG = colorNoticeCreate([\"#000814\", \"#001d3d\", \"#001d3d\", \"#003566\", \"#90e0ef\"], 500)\r\n  cG.attr('transform', `translate(${margin.left + 274}, ${height})`)\r\n};\r\n\r\nconst updateFields = (processData, keys) => {\r\n  svg.selectAll('*').remove()\r\n  render(processData, keys)\r\n};\r\n\r\n\r\ntext('http://vis.lab.djosix.com:2024/data/abalone.data').then((data) => {\r\n  const parsedData = data.split('\\n').map(row => {\r\n    const columns = row.split(',');\r\n    return {\r\n      'Sex': columns[0],                      // Column 1: Sex\r\n      'Length': +columns[1],                  // Column 2: Length\r\n      'Diameter': +columns[2],                // Column 3: Diameter\r\n      'Height': +columns[3],                  // Column 4: Height\r\n      'Whole Weight': +columns[4],             // Column 5: Whole Weight\r\n      'Shucked Weight': +columns[5],           // Column 6: Shucked Weight\r\n      'Viscera Weight': +columns[6],           // Column 7: Viscera Weight\r\n      'Shell Weight': +columns[7],             // Column 8: Shell Weight\r\n      'Rings': +columns[8]                    // Column 9: Rings\r\n    };\r\n  })\r\n\r\n  // Assuming the data\r\n  const maleData = []\r\n  const femaleData = []\r\n  const infantData = []\r\n  const keys = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.extractKeys)(parsedData)\r\n  const allData = parsedData.filter(d => isNaN(d?.Sex))\r\n  allData.forEach((d) => {\r\n    if (d?.Sex === 'M') {\r\n      maleData.push(d)\r\n    } else if (d?.Sex === 'F') {\r\n      femaleData.push(d)\r\n    } else if (d?.Sex === 'I') {\r\n      infantData.push(d)\r\n    }\r\n  })\r\n  const male = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findR)(maleData, keys)\r\n  const female = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findR)(femaleData, keys)\r\n  const infant = (0,_tools__WEBPACK_IMPORTED_MODULE_0__.findR)(infantData, keys)\r\n  const processData = [\r\n    [...male], [...female], [...infant]\r\n  ]\r\n  updateFields(processData, keys)\r\n})\n\n//# sourceURL=webpack://homework-3/./index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d481672161ade9521229")
/******/ })();
/******/ 
/******/ }
);