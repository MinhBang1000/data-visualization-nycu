/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatemaking_bar_chart"]("main",{

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("const {\r\n    select,\r\n    selectAll,\r\n    csv,\r\n    scaleLinear, \r\n    scaleBand,\r\n    max,\r\n    axisLeft,\r\n    axisBottom,\r\n    format\r\n} = d3\r\n\r\nconst svg = select('svg')\r\nconst width = +svg.attr('width')\r\nconst height = +svg.attr('height')\r\n\r\nconst render = (data) => {\r\n    const xValue = (d) => d.population\r\n    const yValue = (d) => d.country\r\n    \r\n    const margin = {\r\n        top: 60,\r\n        bottom: 100,\r\n        left: 100,\r\n        right: 100\r\n    }\r\n\r\n    const innerWidth = width - margin.left - margin.right\r\n    const innerHeight = height - margin.top - margin.bottom\r\n\r\n    const g = svg.append('g')\r\n        .attr('transform', `translate(${margin.left}, ${margin.top})`)\r\n\r\n    const xScale = scaleLinear()\r\n        .domain([0, max(data, d => d.population)])\r\n        .range([0, innerWidth])\r\n\r\n    const yScale = scaleBand()\r\n        .domain(data.map(yValue))\r\n        .range([0, innerHeight])\r\n        .padding(0.3)\r\n\r\n    const xAxisTickFormat = number => \r\n        format('.3s')(number)\r\n        .replace('G','B')\r\n\r\n    const xAxis = axisBottom(xScale)\r\n        .tickFormat(xAxisTickFormat)\r\n        .tickSize(-innerHeight)\r\n        \r\n    const yAxis = axisLeft(yScale)\r\n        .tickSize(-innerWidth)\r\n\r\n    const leftAxis = g.append('g').call(yAxis)\r\n    const bottomAxis = g.append('g').call(xAxis)\r\n    bottomAxis.attr('transform', `translate(0, ${innerHeight})`)\r\n\r\n    // delete lines\r\n    bottomAxis.selectAll('.domain')\r\n        .remove()\r\n    leftAxis.selectAll('.domain')\r\n        .remove()\r\n    // add label of axis\r\n    bottomAxis.append('text')\r\n        .text('Population')\r\n        .attr('x', innerWidth/2)\r\n        .attr('y', 50)\r\n        .attr('class', 'axis-label')\r\n        .attr('fill','black')\r\n\r\n    // add the title of chart\r\n    g.append('text')\r\n        .attr('class', 'title')\r\n        .text('Top 10 Most Populous Countries')\r\n\r\n    g.selectAll('circle')\r\n        .data(data).enter()\r\n            .append('circle')\r\n                .attr('class', 'scatter-plot')\r\n                .attr('cy', d => yScale(yValue(d)) + yScale.bandwidth() / 2)\r\n                .attr('cx', d => xScale(xValue(d)))\r\n                .attr('r', yScale.bandwidth() / 2)\r\n\r\n    // Doing a transition\r\n}\r\n\r\ncsv('data.csv')\r\n    .then(data => {\r\n        data.forEach(element => {\r\n            element.population = +element?.population*1000  \r\n        })\r\n        render(data)\r\n    })\r\n\n\n//# sourceURL=webpack://making-bar-chart/./index.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("41165e2c5de1bf812002")
/******/ })();
/******/ 
/******/ }
);