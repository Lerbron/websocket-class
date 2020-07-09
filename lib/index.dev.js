(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["minsmap"] = factory();
	else
		root["minsmap"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return WebSocketClass; });\nconst status = {\n  CONNECTING: 0,\n  OPEN: 1,\n  CLOSING: 2,\n  CLOSED: 3\n};\nconst RECONNECT_TIMER_DURATION = 30 * 1000;\nconst PING_TIMER_DURATION = 30 * 1000;\nconst PONG_TIMER_DURATION = 30 * 1000;\nconst RECONNECT_MAX_COUNT = 10;\nclass WebSocketClass {\n  constructor({\n    url,\n    pingMsg = 'ping',\n    reconnectTimerDuration = RECONNECT_TIMER_DURATION,\n    pingTimerDuration = PING_TIMER_DURATION,\n    pongTimerDuration = PONG_TIMER_DURATION\n  }) {\n    this.url = url;\n    this.pingMsg = pingMsg;\n    this.instance = null;\n    this.status = status.CONNECTING;\n    this.pingTimer = null;\n    this.pongTimer = null;\n    this.reconnectTimer = null;\n    this.needDestroy = false;\n    this.isReconnecting = false;\n    this.pingTimerDuration = pingTimerDuration;\n    this.pongTimerDuration = pongTimerDuration;\n    this.reconnectTimerDuration = reconnectTimerDuration;\n    this.reconnectCount = 0;\n    this.create();\n  }\n\n  create() {\n    if (!('WebSocket' in window)) {\n      new Error('当前浏览器暂不支持不支持');\n      return null;\n    }\n\n    if (!this.url) {\n      new Error('WebSocket url不存在');\n      return null;\n    }\n\n    this.instance = new WebSocket(this.url);\n\n    this._onopen();\n\n    this._onmessage();\n\n    this._onclose();\n\n    this._onerror();\n  }\n\n  reconnect() {\n    if (this.needDestroy || this.isReconnecting || this.reconnectCount > RECONNECT_MAX_COUNT) return null;\n    clearTimeout(this.reconnectTimer);\n    this.isReconnecting = true;\n    this.reconnectCount += 1;\n    this.reconnectTimer = setTimeout(() => {\n      this.create();\n      this.isReconnecting = false;\n    }, this.reconnectTimerDuration);\n  }\n\n  sendPing() {\n    this.send(this.pingMsg);\n  }\n\n  _onopen() {\n    this.instance.onopen = e => {\n      clearTimeout(this.RECONNEC_TTIMER);\n      this.status = status.OPEN;\n      this.onopen && typeof this.onopen === 'function' && this.onopen(e);\n    };\n  }\n\n  _onmessage() {\n    this.instance.onmessage = e => {\n      this.onmessage && typeof this.onmessage === 'function' && this.onmessage(e);\n      this.resetPing();\n      this.createPing();\n    };\n  }\n\n  _onclose() {\n    this.instance.onclose = e => {\n      this.resetPing();\n      this.onclose && typeof this.onclose === 'function' && this.onclose(e);\n      this.reconnect();\n    };\n  }\n\n  _onerror() {\n    this.instance.onerror = e => {\n      this.resetPing();\n      this.onerror && typeof this.onerror === 'function' && this.onerror(e);\n      this.reconnect();\n    };\n  }\n\n  send(data) {\n    if (this.instance.readyState === status.OPEN) {\n      this.instance.send(JSON.stringify(data));\n    } else if (this.instance.readyState === status.CONNECTING) {\n      setTimeout(() => {\n        this.instance.send(JSON.stringify(data));\n      }, 1000);\n    } else if (this.instance.readyState === status.CLOSED || this.instance.readyState === status.CLOSING) {\n      return null;\n    }\n  }\n\n  destroy() {\n    this.resetPing();\n    this.instance.close();\n    this.needDestroy = true;\n  }\n\n  createPing() {\n    this.pingTimer = setTimeout(() => {\n      this.send(this.pingMsg);\n      this.pongTimer = setTimeout(() => {\n        this.instance.close();\n      }, this.pongTimerDuration);\n    }, this.pingTimerDuration);\n  }\n\n  resetPing() {\n    clearTimeout(this.pingTimer);\n    clearTimeout(this.pongTimer);\n  }\n\n}\n\n//# sourceURL=webpack://minsmap/./src/index.js?");

/***/ })

/******/ });
});