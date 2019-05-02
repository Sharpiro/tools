/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/index.js","vendors~app"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/element-functions.js":
/*!**********************************!*\
  !*** ./src/element-functions.js ***!
  \**********************************/
/*! exports provided: getTemplateContent, getStyleNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTemplateContent", function() { return getTemplateContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStyleNode", function() { return getStyleNode; });
function  getTemplateContent(htmlText) {
    const template = document.createElement('template');
    template.innerHTML = htmlText;
    return template.content.cloneNode(true);
}

function getStyleNode(styleText) {
    const style = document.createElement("style")
    style.innerHTML = styleText
    return style
}


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jsoneditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsoneditor */ "./node_modules/jsoneditor/index.js");
/* harmony import */ var jsoneditor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsoneditor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modal_modal_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal/modal-service */ "./src/modal/modal-service.js");




const modalService = new _modal_modal_service__WEBPACK_IMPORTED_MODULE_2__["ModalService"]()
const localStorageKey = "jsonData"

const initialJson = GetInitialJson()
const leftEditorOptions = { mode: 'code' }
const leftEditor = new jsoneditor__WEBPACK_IMPORTED_MODULE_0__(document.getElementById("leftEditor"), leftEditorOptions)
leftEditor.set(initialJson)

const rightEditorOptions = { mode: 'tree' }
const rightEditor = new jsoneditor__WEBPACK_IMPORTED_MODULE_0__(document.getElementById("rightEditor"), rightEditorOptions)
rightEditor.set(initialJson)

function updateRightEditor() {
    const leftJson = leftEditor.get()
    const jsonString = JSON.stringify(leftJson)
    localStorage.setItem(localStorageKey, jsonString)
    rightEditor.set(leftJson)
}

function updateLeftEditor() {
    const rightJson = rightEditor.get()
    const jsonString = JSON.stringify(rightJson)
    localStorage.setItem(localStorageKey, jsonString)
    leftEditor.set(rightJson)
}

function GetInitialJson() {
    try {
        const jsonString = localStorage.getItem(localStorageKey)
        if (jsonString && jsonString.length > 2) {
            const json = JSON.parse(jsonString)
            return json
        }
    }
    catch (err) {
        console.error("error occurred initializing json")
        console.log(err)
    }

    return INITIAL_JSON
}

document.onkeydown = event => {
    if (!event.ctrlKey) return
    event.preventDefault()

    if (event.shiftKey && event.code === "KeyR") {
        leftEditor.set(INITIAL_JSON)
        rightEditor.set(INITIAL_JSON)
    }
    else if (event.key === "s") {
        for (const element of event.path) {
            if (element.id == "rightEditor") {
                updateLeftEditor()
                return
            }
            if (element.id == "leftEditor") {
                updateRightEditor()
                return
            }
        }
    }
}

document.body.onload = () => document.body.style.display = "block"
rightButton.onclick = () => updateRightEditor()
leftButton.onclick = () => updateLeftEditor()
helpButton.onclick = () => modalService.open()

const INITIAL_JSON = {
    "Array": [1, 2, 3],
    "Boolean": true,
    "Null": null,
    "Number": 123,
    "Object": { "a": "b", "c": "d" },
    "String": "Hello World",
    "Color": "#aabbcc"
}


/***/ }),

/***/ "./src/modal/modal-component.css":
/*!***************************************!*\
  !*** ./src/modal/modal-component.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, "#data-modal-container {\r\n    display: none;\r\n    position: fixed;\r\n    z-index: 4;\r\n    padding-top: 100px;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    overflow: auto;\r\n    background-color: rgb(0, 0, 0);\r\n    background-color: rgba(0, 0, 0, 0.4);\r\n}\r\n\r\n.data-modal-content {\r\n    background-color: #fefefe;\r\n    margin: auto;\r\n    padding: 20px;\r\n    border: 1px solid #888;\r\n    width: 40%;\r\n}\r\n\r\n#close-button {\r\n    color: #aaaaaa;\r\n    float: right;\r\n    font-size: 28px;\r\n    font-weight: bold;\r\n}\r\n\r\n#close-button:hover,\r\n#close-button:focus {\r\n    color: #000;\r\n    text-decoration: none;\r\n    cursor: pointer;\r\n}\r\n", ""]);



/***/ }),

/***/ "./src/modal/modal-component.html":
/*!****************************************!*\
  !*** ./src/modal/modal-component.html ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"data-modal-container\">\r\n    <div class=\"data-modal-content\">\r\n        <span id=\"close-button\">&times;</span>\r\n        <p><code>ctrl+s</code>: save active editor and copy to other editor</p>\r\n        <p><code>ctrl+shift+r</code>: reset all data</p>\r\n    </div>\r\n</div>";

/***/ }),

/***/ "./src/modal/modal-component.js":
/*!**************************************!*\
  !*** ./src/modal/modal-component.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _element_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../element-functions */ "./src/element-functions.js");
/* harmony import */ var _modal_component_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal-component.html */ "./src/modal/modal-component.html");
/* harmony import */ var _modal_component_html__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_modal_component_html__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _modal_component_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modal-component.css */ "./src/modal/modal-component.css");
/* harmony import */ var _modal_component_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modal_component_css__WEBPACK_IMPORTED_MODULE_3__);





customElements.define('data-modal', class extends HTMLElement {
    get closed() {
        return this._closed
    }

    constructor() {
        super();
        this._closed = new events__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]()

        const templateContent = Object(_element_functions__WEBPACK_IMPORTED_MODULE_1__["getTemplateContent"])(_modal_component_html__WEBPACK_IMPORTED_MODULE_2___default.a)
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(Object(_element_functions__WEBPACK_IMPORTED_MODULE_1__["getStyleNode"])(_modal_component_css__WEBPACK_IMPORTED_MODULE_3___default.a[0][1]))
        shadowRoot.appendChild(templateContent);
        this.dataModalContainer = shadowRoot.getElementById('data-modal-container')

        this.registerEvents(shadowRoot)
    }

    open() {
        this.dataModalContainer.style.display = "block";
    }

    close() {
        this.closed.emit(null)
        this.dataModalContainer.style.display = "none";
    }

    registerEvents(shadowRoot) {
        window.onmousedown = event => {
            if (event.path[0].id === "data-modal-container") {
                this.close()
            }
        }

        shadowRoot.getElementById("close-button").onclick = () => this.close()
    }
});


/***/ }),

/***/ "./src/modal/modal-service.js":
/*!************************************!*\
  !*** ./src/modal/modal-service.js ***!
  \************************************/
/*! exports provided: ModalService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalService", function() { return ModalService; });
/* harmony import */ var _modal_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal-component */ "./src/modal/modal-component.js");


class ModalService {
    open() {
        const dataModal = document.createElement("data-modal")
        dataModal.closed.on(null, () => {
            document.body.removeChild(dataModal)
        })
        document.body.appendChild(dataModal)
        dataModal.open()
    }
}


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnQtZnVuY3Rpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kYWwvbW9kYWwtY29tcG9uZW50LmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kYWwvbW9kYWwtY29tcG9uZW50Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGFsL21vZGFsLWNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kYWwvbW9kYWwtc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzP2UzMjAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQVEsb0JBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQWlCLDRCQUE0QjtBQUM3QztBQUNBO0FBQ0EsMEJBQWtCLDJCQUEyQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHVCQUF1QjtBQUN2Qzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN0SkE7QUFBQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDVkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXdDO0FBQ3BCO0FBQ2dDOztBQUVwRCx5QkFBeUIsaUVBQVk7QUFDckM7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0IsdUJBQXVCLHVDQUFVO0FBQ2pDOztBQUVBLDRCQUE0QjtBQUM1Qix3QkFBd0IsdUNBQVU7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQkFBcUI7QUFDcEM7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNqRkEsMkJBQTJCLG1CQUFPLENBQUMsd0dBQW1EO0FBQ3RGO0FBQ0EsY0FBYyxRQUFTLDBCQUEwQixzQkFBc0Isd0JBQXdCLG1CQUFtQiwyQkFBMkIsZ0JBQWdCLGVBQWUsb0JBQW9CLHFCQUFxQix1QkFBdUIsdUNBQXVDLDZDQUE2QyxLQUFLLDZCQUE2QixrQ0FBa0MscUJBQXFCLHNCQUFzQiwrQkFBK0IsbUJBQW1CLEtBQUssdUJBQXVCLHVCQUF1QixxQkFBcUIsd0JBQXdCLDBCQUEwQixLQUFLLHFEQUFxRCxvQkFBb0IsOEJBQThCLHdCQUF3QixLQUFLOzs7Ozs7Ozs7Ozs7O0FDRnB1QiwwSUFBMEksZ0w7Ozs7Ozs7Ozs7OztBQ0ExSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXNDO0FBQ2lDO0FBQ3JCO0FBQ0c7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsbURBQVk7O0FBRXZDLGdDQUFnQyw2RUFBa0IsQ0FBQyw0REFBWTtBQUMvRCw4Q0FBOEMsZUFBZTtBQUM3RCwrQkFBK0IsdUVBQVksQ0FBQywyREFBZ0I7QUFDNUQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN6Q0Q7QUFBQTtBQUFBO0FBQTBCOztBQUVuQjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNYQSx1QyIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJhcHBcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL3NyYy9pbmRleC5qc1wiLFwidmVuZG9yc35hcHBcIl0pO1xuIFx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiByZWFkeVxuIFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4iLCJleHBvcnQgZnVuY3Rpb24gIGdldFRlbXBsYXRlQ29udGVudChodG1sVGV4dCkge1xyXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xyXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFRleHQ7XHJcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZU5vZGUoc3R5bGVUZXh0KSB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKVxyXG4gICAgc3R5bGUuaW5uZXJIVE1MID0gc3R5bGVUZXh0XHJcbiAgICByZXR1cm4gc3R5bGVcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBKU09ORWRpdG9yIGZyb20gXCJqc29uZWRpdG9yXCJcclxuaW1wb3J0ICcuL3N0eWxlLmNzcydcclxuaW1wb3J0IHsgTW9kYWxTZXJ2aWNlIH0gZnJvbSBcIi4vbW9kYWwvbW9kYWwtc2VydmljZVwiXHJcblxyXG5jb25zdCBtb2RhbFNlcnZpY2UgPSBuZXcgTW9kYWxTZXJ2aWNlKClcclxuY29uc3QgbG9jYWxTdG9yYWdlS2V5ID0gXCJqc29uRGF0YVwiXHJcblxyXG5jb25zdCBpbml0aWFsSnNvbiA9IEdldEluaXRpYWxKc29uKClcclxuY29uc3QgbGVmdEVkaXRvck9wdGlvbnMgPSB7IG1vZGU6ICdjb2RlJyB9XHJcbmNvbnN0IGxlZnRFZGl0b3IgPSBuZXcgSlNPTkVkaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnRFZGl0b3JcIiksIGxlZnRFZGl0b3JPcHRpb25zKVxyXG5sZWZ0RWRpdG9yLnNldChpbml0aWFsSnNvbilcclxuXHJcbmNvbnN0IHJpZ2h0RWRpdG9yT3B0aW9ucyA9IHsgbW9kZTogJ3RyZWUnIH1cclxuY29uc3QgcmlnaHRFZGl0b3IgPSBuZXcgSlNPTkVkaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0RWRpdG9yXCIpLCByaWdodEVkaXRvck9wdGlvbnMpXHJcbnJpZ2h0RWRpdG9yLnNldChpbml0aWFsSnNvbilcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJpZ2h0RWRpdG9yKCkge1xyXG4gICAgY29uc3QgbGVmdEpzb24gPSBsZWZ0RWRpdG9yLmdldCgpXHJcbiAgICBjb25zdCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobGVmdEpzb24pXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShsb2NhbFN0b3JhZ2VLZXksIGpzb25TdHJpbmcpXHJcbiAgICByaWdodEVkaXRvci5zZXQobGVmdEpzb24pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxlZnRFZGl0b3IoKSB7XHJcbiAgICBjb25zdCByaWdodEpzb24gPSByaWdodEVkaXRvci5nZXQoKVxyXG4gICAgY29uc3QganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHJpZ2h0SnNvbilcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUtleSwganNvblN0cmluZylcclxuICAgIGxlZnRFZGl0b3Iuc2V0KHJpZ2h0SnNvbilcclxufVxyXG5cclxuZnVuY3Rpb24gR2V0SW5pdGlhbEpzb24oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGpzb25TdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2VLZXkpXHJcbiAgICAgICAgaWYgKGpzb25TdHJpbmcgJiYganNvblN0cmluZy5sZW5ndGggPiAyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXHJcbiAgICAgICAgICAgIHJldHVybiBqc29uXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBvY2N1cnJlZCBpbml0aWFsaXppbmcganNvblwiKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gSU5JVElBTF9KU09OXHJcbn1cclxuXHJcbmRvY3VtZW50Lm9ua2V5ZG93biA9IGV2ZW50ID0+IHtcclxuICAgIGlmICghZXZlbnQuY3RybEtleSkgcmV0dXJuXHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGV2ZW50LmNvZGUgPT09IFwiS2V5UlwiKSB7XHJcbiAgICAgICAgbGVmdEVkaXRvci5zZXQoSU5JVElBTF9KU09OKVxyXG4gICAgICAgIHJpZ2h0RWRpdG9yLnNldChJTklUSUFMX0pTT04pXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChldmVudC5rZXkgPT09IFwic1wiKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGV2ZW50LnBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaWQgPT0gXCJyaWdodEVkaXRvclwiKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVMZWZ0RWRpdG9yKClcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlkID09IFwibGVmdEVkaXRvclwiKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVSaWdodEVkaXRvcigpXHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYm9keS5vbmxvYWQgPSAoKSA9PiBkb2N1bWVudC5ib2R5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcclxucmlnaHRCdXR0b24ub25jbGljayA9ICgpID0+IHVwZGF0ZVJpZ2h0RWRpdG9yKClcclxubGVmdEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gdXBkYXRlTGVmdEVkaXRvcigpXHJcbmhlbHBCdXR0b24ub25jbGljayA9ICgpID0+IG1vZGFsU2VydmljZS5vcGVuKClcclxuXHJcbmNvbnN0IElOSVRJQUxfSlNPTiA9IHtcclxuICAgIFwiQXJyYXlcIjogWzEsIDIsIDNdLFxyXG4gICAgXCJCb29sZWFuXCI6IHRydWUsXHJcbiAgICBcIk51bGxcIjogbnVsbCxcclxuICAgIFwiTnVtYmVyXCI6IDEyMyxcclxuICAgIFwiT2JqZWN0XCI6IHsgXCJhXCI6IFwiYlwiLCBcImNcIjogXCJkXCIgfSxcclxuICAgIFwiU3RyaW5nXCI6IFwiSGVsbG8gV29ybGRcIixcclxuICAgIFwiQ29sb3JcIjogXCIjYWFiYmNjXCJcclxufVxyXG4iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiKShmYWxzZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIiNkYXRhLW1vZGFsLWNvbnRhaW5lciB7XFxyXFxuICAgIGRpc3BsYXk6IG5vbmU7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgei1pbmRleDogNDtcXHJcXG4gICAgcGFkZGluZy10b3A6IDEwMHB4O1xcclxcbiAgICBsZWZ0OiAwO1xcclxcbiAgICB0b3A6IDA7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIG92ZXJmbG93OiBhdXRvO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMCwgMCwgMCk7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXHJcXG59XFxyXFxuXFxyXFxuLmRhdGEtbW9kYWwtY29udGVudCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XFxyXFxuICAgIG1hcmdpbjogYXV0bztcXHJcXG4gICAgcGFkZGluZzogMjBweDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzg4ODtcXHJcXG4gICAgd2lkdGg6IDQwJTtcXHJcXG59XFxyXFxuXFxyXFxuI2Nsb3NlLWJ1dHRvbiB7XFxyXFxuICAgIGNvbG9yOiAjYWFhYWFhO1xcclxcbiAgICBmbG9hdDogcmlnaHQ7XFxyXFxuICAgIGZvbnQtc2l6ZTogMjhweDtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxufVxcclxcblxcclxcbiNjbG9zZS1idXR0b246aG92ZXIsXFxyXFxuI2Nsb3NlLWJ1dHRvbjpmb2N1cyB7XFxyXFxuICAgIGNvbG9yOiAjMDAwO1xcclxcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG59XFxyXFxuXCIsIFwiXCJdKTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgaWQ9XFxcImRhdGEtbW9kYWwtY29udGFpbmVyXFxcIj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiZGF0YS1tb2RhbC1jb250ZW50XFxcIj5cXHJcXG4gICAgICAgIDxzcGFuIGlkPVxcXCJjbG9zZS1idXR0b25cXFwiPiZ0aW1lczs8L3NwYW4+XFxyXFxuICAgICAgICA8cD48Y29kZT5jdHJsK3M8L2NvZGU+OiBzYXZlIGFjdGl2ZSBlZGl0b3IgYW5kIGNvcHkgdG8gb3RoZXIgZWRpdG9yPC9wPlxcclxcbiAgICAgICAgPHA+PGNvZGU+Y3RybCtzaGlmdCtyPC9jb2RlPjogcmVzZXQgYWxsIGRhdGE8L3A+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PlwiOyIsImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XHJcbmltcG9ydCB7IGdldFRlbXBsYXRlQ29udGVudCwgZ2V0U3R5bGVOb2RlIH0gZnJvbSBcIi4uL2VsZW1lbnQtZnVuY3Rpb25zXCJcclxuaW1wb3J0IHRlbXBsYXRlVGV4dCBmcm9tICcuL21vZGFsLWNvbXBvbmVudC5odG1sJztcclxuaW1wb3J0IGNvbXBvbmVudENzc0RhdGEgZnJvbSAnLi9tb2RhbC1jb21wb25lbnQuY3NzJztcclxuXHJcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnZGF0YS1tb2RhbCcsIGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgZ2V0IGNsb3NlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2xvc2VkXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbG9zZWQgPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGVDb250ZW50ID0gZ2V0VGVtcGxhdGVDb250ZW50KHRlbXBsYXRlVGV4dClcclxuICAgICAgICBjb25zdCBzaGFkb3dSb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XHJcbiAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChnZXRTdHlsZU5vZGUoY29tcG9uZW50Q3NzRGF0YVswXVsxXSkpXHJcbiAgICAgICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZUNvbnRlbnQpO1xyXG4gICAgICAgIHRoaXMuZGF0YU1vZGFsQ29udGFpbmVyID0gc2hhZG93Um9vdC5nZXRFbGVtZW50QnlJZCgnZGF0YS1tb2RhbC1jb250YWluZXInKVxyXG5cclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKHNoYWRvd1Jvb3QpXHJcbiAgICB9XHJcblxyXG4gICAgb3BlbigpIHtcclxuICAgICAgICB0aGlzLmRhdGFNb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2VkLmVtaXQobnVsbClcclxuICAgICAgICB0aGlzLmRhdGFNb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJFdmVudHMoc2hhZG93Um9vdCkge1xyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNlZG93biA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnBhdGhbMF0uaWQgPT09IFwiZGF0YS1tb2RhbC1jb250YWluZXJcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZS1idXR0b25cIikub25jbGljayA9ICgpID0+IHRoaXMuY2xvc2UoKVxyXG4gICAgfVxyXG59KTtcclxuIiwiaW1wb3J0IFwiLi9tb2RhbC1jb21wb25lbnRcIlxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZGFsU2VydmljZSB7XHJcbiAgICBvcGVuKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGFNb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkYXRhLW1vZGFsXCIpXHJcbiAgICAgICAgZGF0YU1vZGFsLmNsb3NlZC5vbihudWxsLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZGF0YU1vZGFsKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkYXRhTW9kYWwpXHJcbiAgICAgICAgZGF0YU1vZGFsLm9wZW4oKVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiJdLCJzb3VyY2VSb290IjoiIn0=