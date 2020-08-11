/**
 * modules = {
 *  './src/index.js': function () {},
 *  './src/num.js': function () {},
 *  './src/tmp.js': function () {}
 * }
 */
(function (modules) { // webpackBootstrap
  /**
   * install a JSONP callback for chunk loading
   * 模块加载成功，更改缓存中的模块状态，并且执行模块内容
   * @param {*} data = [
   *  [chunkId],
   *  {
   *    './src/info.js': function () {}
   *  }
   * ]
   */
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];


    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback
    var moduleId, chunkId, i = 0, resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      // 这里将模块的加载状态改为了 0，表示加载完成
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        // 执行模块代码
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);

    while (resolves.length) {
      resolves.shift()();
    }

  };


  // The module cache, 模块缓存，类似于 commonJS 的 require 缓存机制，只不过这里的 key 是相对路径
  var installedModules = {};


  /**
   * 定义 chunk 的加载情况，比如 main = 0 是已加载
   * object to store loaded and loading chunks
   * undefined = chunk not loaded
   * null = chunk preloaded/prefetched
   * Promise = chunk loading
   * 0 = chunk loaded
   */
  var installedChunks = {
    "main": 0
  };



  // script path function， 返回需要动态加载的 chunk 的路径
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + chunkId + ".main.js"
  }

  /**
   * The require function
   * 接收一个 moduleId，其实就是一个模块相对路径，然后查缓存（没有则添加缓存），
   * 然后执行模块代码，返回模块运行后的 module.exports
   * 一句话总结就是 加载指定模块然后执行，返回执行结果（module.exports)
   * 
   * __webpack_require__(__webpack_require__.s = "./src/index.js")
   */
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    /**
     * Create a new module (and put it into the cache)
     * 
     * // 示例
     * module = installedModules['./src/index.js'] = {
     *  i: './src/index.js',
     *  l: false,
     *  exports: {}
     * }
     */
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    /**
     * Execute the module function
     * modules['./src/index.js'] is a function
     */
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // This file contains only the entry chunk.
  // The chunk loading function for additional chunks
  /**
   * 
   */
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];

    // JSONP chunk loading for javascript

    // 从缓存中找该模块
    var installedChunkData = installedChunks[chunkId];
    
    // 0 means "already installed".
    if (installedChunkData !== 0) { 
      
      // 说明模块没有安装

      // a Promise means "currently loading".
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        // setup Promise in chunk cache
        var promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push(installedChunkData[2] = promise);

        // start chunk loading, create script element
        var script = document.createElement('script');
        var onScriptComplete;

        script.charset = 'utf-8';
        // 设置超时时间
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        // script.src = __webpack_public_path__ + chunkId + main.js, 即模块路径
        script.src = jsonpScriptSrc(chunkId);

        // create error before stack unwound to get useful stacktrace later
        var error = new Error();

        // 加载结果处理函数
        onScriptComplete = function (event) {
          // avoid mem leaks in IE.
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          var chunk = installedChunks[chunkId];
          if (chunk !== 0) {
            // chunk 状态不为 0 ，说明加载出问题了
            if (chunk) {
              var errorType = event && (event.type === 'load' ? 'missing' : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
              error.name = 'ChunkLoadError';
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        // 超时定时器，超时以后执行
        var timeout = setTimeout(function () {
          onScriptComplete({ type: 'timeout', target: script });
        }, 120000);
        // 加载出错或者加载成功的处理函数
        script.onerror = script.onload = onScriptComplete;
        // 将 script 标签添加到 head 标签尾部
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises);
  };

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  /**
   * define getter function for harmony exports
   * @param {*} exports = {}
   * @param {*} name = 模块名
   * @param {*} getter => 模块函数
   * 
   * 在 exports 对象上定义一个 key value，key 为模块名称，value 为模块的可执行函数
   * exports = {
   *  moduleName: module function
   * } 
   */
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  /**
   * define __esModule on exports
   * @param {*} exports = {}
   * 
   * exports = {
   *  __esModule: true
   * }
   */
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // on error function for async loading
  __webpack_require__.oe = function (err) { console.error(err); throw err; };

  var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;


  /**
   * 入口位置
   * Load entry module and return exports
   */
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  ({
    // 代码中所有的 import moduleName from 'xxModule' 变成了以下的 Map 对象

    // /src/index.js 模块
    "./src/index.js":
      /**
       * @param module = {
       *  i: './src/index.js',
       *  l: false,
       *  exports: {}
       * 
       * @param __webpack_exports__ = module.exports = {}
       * 
       * @param __webpack_require__ => 自定义的 require 函数，加载指定模块，并执行模块代码，返回执行结果
       * 
       */
      (function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /**
         * 
         * define __esModule on exports
         * __webpack_exports = module.exports = {
         *  __esModule: true
         * }
         */
        __webpack_require__.r(__webpack_exports__);
        // 加载 ./src/num.js 模块
        var _num_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/num.js");
        Object(_num_js__WEBPACK_IMPORTED_MODULE_0__["print"])()
        function button() {
          const button = document.createElement('button')
          const text = document.createTextNode('click me')
          button.appendChild(text)
          /**
           * 异步执行部分
           */
          button.onclick = e => __webpack_require__.e(0)
            // 模块异步加载完成后，开始执行模块内容 => window["webpackJsonp"].push = window["webpackJsonp"].push = function (data) {}
            .then(__webpack_require__.bind(null, "./src/info.js"))
            .then(res => {
              console.log(res.log)
            })
          return button
        }
        document.body.appendChild(button())
        //# sourceURL=webpack:///./src/index.js?");
      }),

    // /src/num.js 模块
    "./src/num.js":
       /**
       * @param module = {
       *  i: './src/num.js',
       *  l: false,
       *  exports: {}
       * 
       * @param __webpack_exports__ = module.exports = {}
       * 
       * @param __webpack_require__ => 自定义的 require 函数，加载指定模块，并执行模块代码，返回执行结果
       * 
       */
      (function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
         /**
         * 
         * define __esModule on exports
         * __webpack_exports = module.exports = {
         *  __esModule: true
         * }
         */
        __webpack_require__.r(__webpack_exports__);
        /**
         * module.exports = {
         *  __esModule: true,
         *  print
         * }
         */
        __webpack_require__.d(__webpack_exports__, "print", function () { return print; });
        // 加载 ./src/tmp.js 模块
        var _tmp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/tmp.js");
        function print() {
          Object(_tmp_js__WEBPACK_IMPORTED_MODULE_0__["tmpPrint"])()
          console.log('我是 num.js 的 print 方法')
        }
        //# sourceURL=webpack:///./src/num.js?");
      }),

    // /src/tmp.js 模块
    "./src/tmp.js":
      /**
       * @param module = {
       *  i: './src/num.js',
       *  l: false,
       *  exports: {}
       * 
       * @param __webpack_exports__ = module.exports = {}
       * 
       * @param __webpack_require__ => 自定义的 require 函数，加载指定模块，并执行模块代码，返回执行结果
       * 
       */
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
         /**
         * 
         * define __esModule on exports
         * __webpack_exports = module.exports = {
         *  __esModule: true
         * }
         */
        __webpack_require__.r(__webpack_exports__);
        /**
         * module.exports = {
         *  __esModule: true,
         *  tmpPrint
         * }
         */
        __webpack_require__.d(__webpack_exports__, "tmpPrint", function () { return tmpPrint; });
        function tmpPrint() {
          console.log('tmp.js print')
        }
        //# sourceURL=webpack:///./src/tmp.js?");
      })
  });