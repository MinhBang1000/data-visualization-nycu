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

/***/ "./tools.js":
/*!******************!*\
  !*** ./tools.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createClassname: () => (/* binding */ createClassname),\n/* harmony export */   extractKeys: () => (/* binding */ extractKeys),\n/* harmony export */   findMinMax: () => (/* binding */ findMinMax),\n/* harmony export */   findR: () => (/* binding */ findR),\n/* harmony export */   findValues: () => (/* binding */ findValues),\n/* harmony export */   percentOf: () => (/* binding */ percentOf),\n/* harmony export */   replaceHyphenWithSpace: () => (/* binding */ replaceHyphenWithSpace)\n/* harmony export */ });\nconst extractKeys = (data) => {\r\n    const exampleObject = data[0]\r\n    const keys = Object.keys(exampleObject)\r\n    const dimensions = keys.filter(k => k !== 'class')\r\n    return dimensions\r\n}\r\n\r\nconst findMinMax = (data) => {\r\n    const exampleObject = data[0]\r\n    const keys = Object.keys(exampleObject)\r\n    const dimensions = keys.filter(k => k !== 'class')\r\n\r\n    let min = data[0][dimensions[0]]\r\n    let max = data[0][dimensions[0]]\r\n    data.forEach((d) => {\r\n        dimensions.forEach((dim) => {\r\n            min = min < d[dim] ? min : d[dim]\r\n        })\r\n        dimensions.forEach((dim) => {\r\n            max = max > d[dim] ? max : d[dim]\r\n        })\r\n    })\r\n    return {\r\n        max: Math.round(max),\r\n        min: Math.round(min)\r\n    }\r\n}\r\n\r\nconst findValues = (a,b,duration) => {\r\n    const values = []\r\n    const tempDura = duration\r\n    for (let i = a; i <= b; i++){\r\n        if (duration === 0 || i === a) {\r\n            values.push(i)\r\n            duration = tempDura\r\n        }\r\n        duration--\r\n    }\r\n    return values\r\n}\r\n\r\nconst replaceHyphenWithSpace = (str) => {\r\n    return str.replace(/-/g, ' ');\r\n}\r\n\r\nconst caculateR = (keyX, keyY, data) => {\r\n    // Extract values for the two keys\r\n    const xValues = data.map(d => d[keyX]);\r\n    const yValues = data.map(d => d[keyY]);\r\n\r\n    // Calculate means\r\n    const meanX = xValues.reduce((a, b) => a + b, 0) / xValues.length;\r\n    const meanY = yValues.reduce((a, b) => a + b, 0) / yValues.length;\r\n    \r\n\r\n    // Calculate the numerator and denominator for Pearson correlation\r\n    let numerator = 0;\r\n    let denominatorX = 0;\r\n    let denominatorY = 0;\r\n\r\n    for (let i = 0; i < xValues.length; i++) {\r\n        const diffX = xValues[i] - meanX;\r\n        const diffY = yValues[i] - meanY;\r\n        numerator += diffX * diffY;\r\n        denominatorX += diffX ** 2;\r\n        denominatorY += diffY ** 2;\r\n    }\r\n\r\n    // Calculate Pearson correlation coefficient\r\n    const r = numerator / Math.sqrt(denominatorX * denominatorY);\r\n    return r;\r\n};\r\n\r\n\r\nconst findR = (data, keys) => {\r\n    const arr = new Array() // Initialize an object to store correlation coefficients\r\n\r\n    for (let i = 0; i < keys.length; i++) { // Loop through all keys\r\n        for (let j = 0; j < keys.length; j++) {\r\n            const keyX = keys[i];\r\n            const keyY = keys[j];\r\n\r\n            // Ensure not to calculate the correlation of 'Sex'\r\n            if (keyX !== 'Sex' && keyY !== 'Sex') {\r\n                const r = caculateR(keyX, keyY, data); // Calculate correlation\r\n                arr.push({\r\n                    keyX: keyX,\r\n                    keyY: keyY,\r\n                    r: r\r\n                }) // Store the result\r\n            }\r\n        }\r\n    }\r\n    return arr; // Return the object containing correlation coefficients\r\n};\r\n\r\n\r\nconst createClassname = (value) => {\r\n    if (value < -1 || value > 1) {\r\n        return 'F'\r\n    }\r\n    // [-1, -0.5]\r\n    if (value <= -0.5) {\r\n        return 'A' \r\n    }\r\n    // (-0.5, 0]\r\n    if (value <= 0) {\r\n        return 'B'\r\n    }\r\n    // (0, 0.5]\r\n    if (value <= 0.5) {\r\n        return 'C'\r\n    }\r\n    // (0.5, 1]\r\n    return 'D'\r\n}\r\n\r\nconst percentOf = (value, percent) => {\r\n    return percent * value\r\n}\n\n//# sourceURL=webpack://homework-3/./tools.js?");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("f0b1bfff58a8ec4b9010")
/******/ })();
/******/ 
/******/ }
);