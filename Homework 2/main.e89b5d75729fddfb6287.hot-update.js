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

/***/ "./tools.js":
/*!******************!*\
  !*** ./tools.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   extractKeys: () => (/* binding */ extractKeys),\n/* harmony export */   findMinMax: () => (/* binding */ findMinMax),\n/* harmony export */   findValues: () => (/* binding */ findValues)\n/* harmony export */ });\nconst extractKeys = (data) => {\r\n    const exampleObject = data[0]\r\n    const keys = Object.keys(exampleObject)\r\n    const dimensions = keys.filter(k => k !== 'class')\r\n    return dimensions\r\n}\r\n\r\nconst findMinMax = (data) => {\r\n    const exampleObject = data[0]\r\n    const keys = Object.keys(exampleObject)\r\n    const dimensions = keys.filter(k => k !== 'class')\r\n\r\n    let min = data[0][dimensions[0]]\r\n    let max = data[0][dimensions[0]]\r\n    data.forEach((d) => {\r\n        dimensions.forEach((dim) => {\r\n            min = min < d[dim] ? min : d[dim]\r\n        })\r\n        dimensions.forEach((dim) => {\r\n            max = max > d[dim] ? max : d[dim]\r\n        })\r\n    })\r\n    return {\r\n        max: Math.round(max),\r\n        min: Math.round(min)\r\n    }\r\n}\r\n\r\nconst findValues = (a,b,duration) => {\r\n    const values = []\r\n    const tempDura = duration\r\n    for (let i = a; i <= b; i++){\r\n        if (duration == 0) {\r\n            values.push(i)\r\n        }\r\n    }\r\n    return values\r\n}\n\n//# sourceURL=webpack://homework-2/./tools.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1bff7587b1119e170bb7")
/******/ })();
/******/ 
/******/ }
);