webpackJsonp([6,10],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if (media) {
			styleElement.setAttribute("media", media);
		}

		if (sourceMap) {
			// https://developer.chrome.com/devtools/docs/javascript-debugging
			// this makes source maps inside style tags work properly in Chrome
			css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _vue = __webpack_require__(1);

	var _vue2 = _interopRequireDefault(_vue);

	var _vuex = __webpack_require__(23);

	var _vuex2 = _interopRequireDefault(_vuex);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_vue2.default.use(_vuex2.default);

	var state = {
		// 页面打开默认设置登录状态为否
		isLogin: false,
		// 保存登录信息
		userInfo: {
			'loginname': '',
			'avatar': '',
			'id': '',
			'accesstoken': ''
		},
		tipContent: '',
		tipShow: false,
		message_count: 0
	};

	var mutations = {
		// 设置登录

		ISLOGIN: function ISLOGIN(state) {
			state.isLogin = true;
		},

		// 退出登录
		NOTLOGIN: function NOTLOGIN(state) {
			state.isLogin = false;
		},

		// 设置登录用户信息
		SETUSERINFO: function SETUSERINFO(state, name, avatar, id, accesstoken) {
			state.userInfo.loginname = name;
			console.log(state.userInfo.loginname);
			state.userInfo.avatar = avatar;
			state.userInfo.id = id;
			state.userInfo.accesstoken = accesstoken;
		},

		// 设置tips弹窗的提示信息
		SETTIPCONTENT: function SETTIPCONTENT(state, content) {
			state.tipContent = content;
		},

		// 设置tips弹窗的显示隐藏状态
		SETTIPSHOW: function SETTIPSHOW(state, status) {
			state.tipShow = status;
		},

		// 设置未读消息条数
		SETNOTMESSAGECOUNT: function SETNOTMESSAGECOUNT(state, count) {
			state.message_count = count;
		}
	};

	exports.default = new _vuex2.default.Store({
		state: state,
		mutations: mutations
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Vuex v1.0.0-rc.2
	 * (c) 2016 Evan You
	 * Released under the MIT License.
	 */
	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  (global.Vuex = factory());
	}(this, function () { 'use strict';

	  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	  };

	  var classCallCheck = function (instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };

	  var createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }

	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();

	  var toConsumableArray = function (arr) {
	    if (Array.isArray(arr)) {
	      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	      return arr2;
	    } else {
	      return Array.from(arr);
	    }
	  };

	  /**
	   * Merge an array of objects into one.
	   *
	   * @param {Array<Object>} arr
	   * @return {Object}
	   */

	  function mergeObjects(arr) {
	    return arr.reduce(function (prev, obj) {
	      Object.keys(obj).forEach(function (key) {
	        var existing = prev[key];
	        if (existing) {
	          // allow multiple mutation objects to contain duplicate
	          // handlers for the same mutation type
	          if (Array.isArray(existing)) {
	            prev[key] = existing.concat(obj[key]);
	          } else {
	            prev[key] = [existing].concat(obj[key]);
	          }
	        } else {
	          prev[key] = obj[key];
	        }
	      });
	      return prev;
	    }, {});
	  }

	  /**
	   * Check whether the given value is Object or not
	   *
	   * @param {*} obj
	   * @return {Boolean}
	   */

	  function isObject(obj) {
	    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	  }

	  /**
	   * Get state sub tree by given keys.
	   *
	   * @param {Object} state
	   * @param {Array<String>} nestedKeys
	   * @return {Object}
	   */
	  function getNestedState(state, nestedKeys) {
	    return nestedKeys.reduce(function (state, key) {
	      return state[key];
	    }, state);
	  }

	  /**
	   * Hacks to get access to Vue internals.
	   * Maybe we should expose these...
	   */

	  var Watcher = void 0;
	  function getWatcher(vm) {
	    if (!Watcher) {
	      var noop = function noop() {};
	      var unwatch = vm.$watch(noop, noop);
	      Watcher = vm._watchers[0].constructor;
	      unwatch();
	    }
	    return Watcher;
	  }

	  var Dep = void 0;
	  function getDep(vm) {
	    if (!Dep) {
	      Dep = vm._data.__ob__.dep.constructor;
	    }
	    return Dep;
	  }

	  var hook = typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	  function devtoolPlugin(store) {
	    if (!hook) return;

	    hook.emit('vuex:init', store);

	    hook.on('vuex:travel-to-state', function (targetState) {
	      store.replaceState(targetState);
	    });

	    store.subscribe(function (mutation, state) {
	      hook.emit('vuex:mutation', mutation, state);
	    });
	  }

	  function override (Vue) {
	    var version = Number(Vue.version.split('.')[0]);

	    if (version >= 2) {
	      var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
	      Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
	    } else {
	      (function () {
	        // override init and inject vuex init procedure
	        // for 1.x backwards compatibility.
	        var _init = Vue.prototype._init;
	        Vue.prototype._init = function () {
	          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	          options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
	          _init.call(this, options);
	        };
	      })();
	    }

	    /**
	     * Vuex init hook, injected into each instances init hooks list.
	     */

	    function vuexInit() {
	      var options = this.$options;
	      var store = options.store;
	      var vuex = options.vuex;
	      // store injection

	      if (store) {
	        this.$store = store;
	      } else if (options.parent && options.parent.$store) {
	        this.$store = options.parent.$store;
	      }
	      // vuex option handling
	      if (vuex) {
	        if (!this.$store) {
	          console.warn('[vuex] store not injected. make sure to ' + 'provide the store option in your root component.');
	        }
	        var state = vuex.state;
	        var actions = vuex.actions;
	        var getters = vuex.getters;
	        // handle deprecated state option

	        if (state && !getters) {
	          console.warn('[vuex] vuex.state option will been deprecated in 1.0. ' + 'Use vuex.getters instead.');
	          getters = state;
	        }
	        // getters
	        if (getters) {
	          options.computed = options.computed || {};
	          for (var key in getters) {
	            defineVuexGetter(this, key, getters[key]);
	          }
	        }
	        // actions
	        if (actions) {
	          options.methods = options.methods || {};
	          for (var _key in actions) {
	            options.methods[_key] = makeBoundAction(this.$store, actions[_key], _key);
	          }
	        }
	      }
	    }

	    /**
	     * Setter for all getter properties.
	     */

	    function setter() {
	      throw new Error('vuex getter properties are read-only.');
	    }

	    /**
	     * Define a Vuex getter on an instance.
	     *
	     * @param {Vue} vm
	     * @param {String} key
	     * @param {Function} getter
	     */

	    function defineVuexGetter(vm, key, getter) {
	      if (typeof getter !== 'function') {
	        console.warn('[vuex] Getter bound to key \'vuex.getters.' + key + '\' is not a function.');
	      } else {
	        Object.defineProperty(vm, key, {
	          enumerable: true,
	          configurable: true,
	          get: makeComputedGetter(vm.$store, getter),
	          set: setter
	        });
	      }
	    }

	    /**
	     * Make a computed getter, using the same caching mechanism of computed
	     * properties. In addition, it is cached on the raw getter function using
	     * the store's unique cache id. This makes the same getter shared
	     * across all components use the same underlying watcher, and makes
	     * the getter evaluated only once during every flush.
	     *
	     * @param {Store} store
	     * @param {Function} getter
	     */

	    function makeComputedGetter(store, getter) {
	      var id = store._getterCacheId;

	      // cached
	      if (getter[id]) {
	        return getter[id];
	      }
	      var vm = store._vm;
	      var Watcher = getWatcher(vm);
	      var Dep = getDep(vm);
	      var watcher = new Watcher(vm, function (vm) {
	        return getter(vm.state);
	      }, null, { lazy: true });
	      var computedGetter = function computedGetter() {
	        if (watcher.dirty) {
	          watcher.evaluate();
	        }
	        if (Dep.target) {
	          watcher.depend();
	        }
	        return watcher.value;
	      };
	      getter[id] = computedGetter;
	      return computedGetter;
	    }

	    /**
	     * Make a bound-to-store version of a raw action function.
	     *
	     * @param {Store} store
	     * @param {Function} action
	     * @param {String} key
	     */

	    function makeBoundAction(store, action, key) {
	      if (typeof action !== 'function') {
	        console.warn('[vuex] Action bound to key \'vuex.actions.' + key + '\' is not a function.');
	      }
	      return function vuexBoundAction() {
	        for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
	          args[_key2] = arguments[_key2];
	        }

	        return action.call.apply(action, [this, store].concat(args));
	      };
	    }

	    // option merging
	    var merge = Vue.config.optionMergeStrategies.computed;
	    Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
	      if (!toVal) return fromVal;
	      if (!fromVal) return toVal;
	      return {
	        getters: merge(toVal.getters, fromVal.getters),
	        state: merge(toVal.state, fromVal.state),
	        actions: merge(toVal.actions, fromVal.actions)
	      };
	    };
	  }

	  var Vue = void 0;
	  var uid = 0;

	  var Store = function () {

	    /**
	     * @param {Object} options
	     *        - {Object} state
	     *        - {Object} actions
	     *        - {Object} mutations
	     *        - {Array} plugins
	     *        - {Boolean} strict
	     */

	    function Store() {
	      var _this = this;

	      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var _ref$state = _ref.state;
	      var state = _ref$state === undefined ? {} : _ref$state;
	      var _ref$mutations = _ref.mutations;
	      var mutations = _ref$mutations === undefined ? {} : _ref$mutations;
	      var _ref$modules = _ref.modules;
	      var modules = _ref$modules === undefined ? {} : _ref$modules;
	      var _ref$plugins = _ref.plugins;
	      var plugins = _ref$plugins === undefined ? [] : _ref$plugins;
	      var _ref$strict = _ref.strict;
	      var strict = _ref$strict === undefined ? false : _ref$strict;
	      classCallCheck(this, Store);

	      this._getterCacheId = 'vuex_store_' + uid++;
	      this._dispatching = false;
	      this._rootMutations = this._mutations = mutations;
	      this._modules = modules;
	      this._subscribers = [];
	      // bind dispatch to self
	      var dispatch = this.dispatch;
	      this.dispatch = function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        dispatch.apply(_this, args);
	      };
	      // use a Vue instance to store the state tree
	      // suppress warnings just in case the user has added
	      // some funky global mixins
	      if (!Vue) {
	        throw new Error('[vuex] must call Vue.use(Vuex) before creating a store instance.');
	      }
	      var silent = Vue.config.silent;
	      Vue.config.silent = true;
	      this._vm = new Vue({
	        data: {
	          state: state
	        }
	      });
	      Vue.config.silent = silent;
	      this._setupModuleState(state, modules);
	      this._setupModuleMutations(modules);
	      // add extra warnings in strict mode
	      if (strict) {
	        this._setupMutationCheck();
	      }
	      // apply plugins
	      devtoolPlugin(this);
	      plugins.forEach(function (plugin) {
	        return plugin(_this);
	      });
	    }

	    /**
	     * Getter for the entire state tree.
	     * Read only.
	     *
	     * @return {Object}
	     */

	    createClass(Store, [{
	      key: 'replaceState',


	      /**
	       * Replace root state.
	       *
	       * @param {Object} state
	       */

	      value: function replaceState(state) {
	        this._dispatching = true;
	        this._vm.state = state;
	        this._dispatching = false;
	      }

	      /**
	       * Dispatch an action.
	       *
	       * @param {String} type
	       */

	    }, {
	      key: 'dispatch',
	      value: function dispatch(type) {
	        var _this2 = this;

	        for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	          payload[_key2 - 1] = arguments[_key2];
	        }

	        var silent = false;
	        var isObjectStyleDispatch = false;
	        // compatibility for object actions, e.g. FSA
	        if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type.type && arguments.length === 1) {
	          isObjectStyleDispatch = true;
	          payload = type;
	          if (type.silent) silent = true;
	          type = type.type;
	        }
	        var handler = this._mutations[type];
	        var state = this.state;
	        if (handler) {
	          this._dispatching = true;
	          // apply the mutation
	          if (Array.isArray(handler)) {
	            handler.forEach(function (h) {
	              isObjectStyleDispatch ? h(state, payload) : h.apply(undefined, [state].concat(toConsumableArray(payload)));
	            });
	          } else {
	            isObjectStyleDispatch ? handler(state, payload) : handler.apply(undefined, [state].concat(toConsumableArray(payload)));
	          }
	          this._dispatching = false;
	          if (!silent) {
	            (function () {
	              var mutation = isObjectStyleDispatch ? payload : { type: type, payload: payload };
	              _this2._subscribers.forEach(function (sub) {
	                return sub(mutation, state);
	              });
	            })();
	          }
	        } else {
	          console.warn('[vuex] Unknown mutation: ' + type);
	        }
	      }

	      /**
	       * Watch state changes on the store.
	       * Same API as Vue's $watch, except when watching a function,
	       * the function gets the state as the first argument.
	       *
	       * @param {Function} fn
	       * @param {Function} cb
	       * @param {Object} [options]
	       */

	    }, {
	      key: 'watch',
	      value: function watch(fn, cb, options) {
	        var _this3 = this;

	        if (typeof fn !== 'function') {
	          console.error('Vuex store.watch only accepts function.');
	          return;
	        }
	        return this._vm.$watch(function () {
	          return fn(_this3.state);
	        }, cb, options);
	      }

	      /**
	       * Subscribe to state changes. Fires after every mutation.
	       */

	    }, {
	      key: 'subscribe',
	      value: function subscribe(fn) {
	        var subs = this._subscribers;
	        if (subs.indexOf(fn) < 0) {
	          subs.push(fn);
	        }
	        return function () {
	          var i = subs.indexOf(fn);
	          if (i > -1) {
	            subs.splice(i, 1);
	          }
	        };
	      }

	      /**
	       * Hot update mutations & modules.
	       *
	       * @param {Object} options
	       *        - {Object} [mutations]
	       *        - {Object} [modules]
	       */

	    }, {
	      key: 'hotUpdate',
	      value: function hotUpdate() {
	        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var mutations = _ref2.mutations;
	        var modules = _ref2.modules;

	        this._rootMutations = this._mutations = mutations || this._rootMutations;
	        this._setupModuleMutations(modules || this._modules);
	      }

	      /**
	       * Attach sub state tree of each module to the root tree.
	       *
	       * @param {Object} state
	       * @param {Object} modules
	       */

	    }, {
	      key: '_setupModuleState',
	      value: function _setupModuleState(state, modules) {
	        var _this4 = this;

	        if (!isObject(modules)) return;

	        Object.keys(modules).forEach(function (key) {
	          var module = modules[key];

	          // set this module's state
	          Vue.set(state, key, module.state || {});

	          // retrieve nested modules
	          _this4._setupModuleState(state[key], module.modules);
	        });
	      }

	      /**
	       * Bind mutations for each module to its sub tree and
	       * merge them all into one final mutations map.
	       *
	       * @param {Object} updatedModules
	       */

	    }, {
	      key: '_setupModuleMutations',
	      value: function _setupModuleMutations(updatedModules) {
	        var modules = this._modules;
	        Object.keys(updatedModules).forEach(function (key) {
	          modules[key] = updatedModules[key];
	        });
	        var updatedMutations = this._createModuleMutations(modules, []);
	        this._mutations = mergeObjects([this._rootMutations].concat(toConsumableArray(updatedMutations)));
	      }

	      /**
	       * Helper method for _setupModuleMutations.
	       * The method retrieve nested sub modules and
	       * bind each mutations to its sub tree recursively.
	       *
	       * @param {Object} modules
	       * @param {Array<String>} nestedKeys
	       * @return {Array<Object>}
	       */

	    }, {
	      key: '_createModuleMutations',
	      value: function _createModuleMutations(modules, nestedKeys) {
	        var _this5 = this;

	        if (!isObject(modules)) return [];

	        return Object.keys(modules).map(function (key) {
	          var module = modules[key];
	          var newNestedKeys = nestedKeys.concat(key);

	          // retrieve nested modules
	          var nestedMutations = _this5._createModuleMutations(module.modules, newNestedKeys);

	          if (!module || !module.mutations) {
	            return mergeObjects(nestedMutations);
	          }

	          // bind mutations to sub state tree
	          var mutations = {};
	          Object.keys(module.mutations).forEach(function (name) {
	            var original = module.mutations[name];
	            mutations[name] = function (state) {
	              for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	                args[_key3 - 1] = arguments[_key3];
	              }

	              original.apply(undefined, [getNestedState(state, newNestedKeys)].concat(args));
	            };
	          });

	          // merge mutations of this module and nested modules
	          return mergeObjects([mutations].concat(toConsumableArray(nestedMutations)));
	        });
	      }

	      /**
	       * Setup mutation check: if the vuex instance's state is mutated
	       * outside of a mutation handler, we throw en error. This effectively
	       * enforces all mutations to the state to be trackable and hot-reloadble.
	       * However, this comes at a run time cost since we are doing a deep
	       * watch on the entire state tree, so it is only enalbed with the
	       * strict option is set to true.
	       */

	    }, {
	      key: '_setupMutationCheck',
	      value: function _setupMutationCheck() {
	        var _this6 = this;

	        var Watcher = getWatcher(this._vm);
	        /* eslint-disable no-new */
	        new Watcher(this._vm, 'state', function () {
	          if (!_this6._dispatching) {
	            throw new Error('[vuex] Do not mutate vuex store state outside mutation handlers.');
	          }
	        }, { deep: true, sync: true });
	        /* eslint-enable no-new */
	      }
	    }, {
	      key: 'state',
	      get: function get() {
	        return this._vm.state;
	      },
	      set: function set(v) {
	        throw new Error('[vuex] Use store.replaceState() to explicit replace store state.');
	      }
	    }]);
	    return Store;
	  }();

	  function install(_Vue) {
	    if (Vue) {
	      console.warn('[vuex] already installed. Vue.use(Vuex) should be called only once.');
	      return;
	    }
	    Vue = _Vue;
	    override(Vue);
	  }

	  // auto install in dist mode
	  if (typeof window !== 'undefined' && window.Vue) {
	    install(window.Vue);
	  }

	  var index = {
	    Store: Store,
	    install: install
	  };

	  return index;

	}));

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(25)
	__vue_script__ = __webpack_require__(28)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\components\\header.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(35)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-367791a8/header.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/.npminstall/css-loader/0.23.1/css-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/style-rewriter.js!./../../node_modules/.npminstall/sass-loader/3.2.1/sass-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/selector.js?type=style&index=0!./header.vue", function() {
				var newContent = require("!!./../../node_modules/.npminstall/css-loader/0.23.1/css-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/style-rewriter.js!./../../node_modules/.npminstall/sass-loader/3.2.1/sass-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/selector.js?type=style&index=0!./header.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(13)();
	// imports


	// module
	exports.push([module.id, ".page-cover {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.4);\n  z-index: 98; }\n\n.header {\n  position: fixed;\n  top: 0px;\n  width: 100%;\n  height: 3rem;\n  top: 0px;\n  left: 0px;\n  margin-bottom: 1rem;\n  background: #fff;\n  border: 1px solid #e1e1e1;\n  text-align: center;\n  line-height: 3rem;\n  z-index: 10; }\n  .header .left-menu {\n    position: absolute;\n    width: 2rem;\n    height: 2rem;\n    top: 0.5rem;\n    left: 0.5rem;\n    background: url(" + __webpack_require__(27) + ") no-repeat;\n    background-size: 2rem; }\n", ""]);

	// exports


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGPC/xhBQAAAIlJREFUaAXt1cENgCAMBVDqeDqBF4fz4gS6Hk6gxkAIxscRmrZ5IfkpOQQIECBAgACB7gTibqM8L3uKGO9qmr3lfMS2TlfzhquH/u4j97eTjQgQIPB7AYHY/gsIxPbmJhIgQOBRQCA+ElUvEIjVSTUkQIBAuYBALDd820EgvhVTT4AAAQIEvitwAjgBIA27QtWpAAAAAElFTkSuQmCC"

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// <template>
	// 	<div class="page-cover"  v-show="coverShow" v-on:click="hideMenu"></div>
	// 	<div class="header">
	// 		<span class="left-menu" v-on:click="showMenu"></span>cnode.js
	// 	</div>
	// 	<nv-menu :showm="menuShow"></nv-menu>
	// </template>
	// <script>
	exports.default = {
		data: function data() {
			return {
				coverShow: false,
				menuShow: false
			};
		},
		methods: {
			showMenu: function showMenu() {
				this.coverShow = true;
				this.menuShow = true;
			},
			hideMenu: function hideMenu() {
				this.coverShow = false;
				this.menuShow = false;
			}

		},
		components: {
			'nv-menu': __webpack_require__(29)
		}
	};
	// </script>
	// <style lang="sass">
	// 	.page-cover {
	// 		position: fixed;
	// 		top: 0px;
	// 		left: 0px;
	// 		width: 100%;
	// 		height: 100%;
	// 		background: rgba(0, 0, 0, 0.4);
	// 		z-index: 98;
	// 	}
	// 	.header {
	// 		position: fixed;
	// 		top : 0px;
	// 		width: 100%;
	// 		height: 3rem;
	// 		top: 0px;
	// 		left: 0px;
	// 		margin-bottom: 1rem;
	// 		background: #fff;
	// 		border: 1px solid #e1e1e1;
	// 		text-align: center;
	// 		line-height: 3rem;
	// 		z-index: 10;
	// 		.left-menu {
	// 			position: absolute;
	// 			width: 2rem;
	// 			height: 2rem;
	// 			top: 0.5rem;
	// 			left: 0.5rem;
	// 			background: url('../img/nav.png') no-repeat;
	// 			background-size: 2rem;
	// 		}
	// 	}
	// </style>

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(30)
	__vue_script__ = __webpack_require__(32)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\components\\menu.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(34)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-aace1f8c/menu.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(31);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/.npminstall/css-loader/0.23.1/css-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/style-rewriter.js!./../../node_modules/.npminstall/sass-loader/3.2.1/sass-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/selector.js?type=style&index=0!./menu.vue", function() {
				var newContent = require("!!./../../node_modules/.npminstall/css-loader/0.23.1/css-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/style-rewriter.js!./../../node_modules/.npminstall/sass-loader/3.2.1/sass-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/selector.js?type=style&index=0!./menu.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(13)();
	// imports


	// module
	exports.push([module.id, ".meun {\n  position: fixed;\n  top: 0px;\n  left: -200px;\n  width: 200px;\n  height: 100%;\n  background: #444444;\n  -webkit-transition: all .3s ease;\n  transition: all .3s ease;\n  z-index: 99; }\n  .meun .user_info {\n    padding-top: 20px;\n    width: 100%; }\n    .meun .user_info .avatar {\n      width: 100%;\n      height: 40px;\n      text-align: center; }\n      .meun .user_info .avatar img {\n        width: 40px;\n        height: 40px;\n        border-radius: 20px;\n        cursor: pointer; }\n    .meun .user_info .name {\n      width: 100%; }\n      .meun .user_info .name p {\n        width: 100%;\n        padding: 5px 0;\n        color: #fff;\n        font-size: 14px;\n        text-align: center; }\n  .meun ul {\n    padding: 20px 0; }\n    .meun ul li {\n      position: relative;\n      color: #fff;\n      padding: 16px 0;\n      text-align: left;\n      text-indent: 10px;\n      line-height: 20px;\n      font-size: 20px;\n      margin: 0 25px; }\n      .meun ul li .message-count {\n        position: absolute;\n        display: inline-block;\n        top: 20px;\n        left: 100px;\n        width: 16px;\n        height: 16px;\n        background: #80bd01;\n        border-radius: 8px;\n        text-indent: 0px;\n        text-align: center;\n        font-size: 12px;\n        line-height: 16px; }\n\n.showMeun {\n  -webkit-transform: translateX(200px);\n          transform: translateX(200px); }\n", ""]);

	// exports


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _store = __webpack_require__(22);

	var _store2 = _interopRequireDefault(_store);

	var _getters = __webpack_require__(33);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// <template>
	// 	<div class="meun" :class="{'showMeun':showm}">
	// 		<div class="user_info" v-if="userLoginState" v-link="{name:'userhome',params:{username:this.user_name}}">
	// 			<div class="avatar">
	// 				<img :src="user_avatar" alt="">
	// 			</div>
	// 			<div class="name">
	// 				<p v-text="user_name"></p>
	// 			</div>
	// 		</div>
	// 		<ul>
	// 			<li v-link="{name:'home'}">首页</li>
	// 			<li v-link="{name : 'search'}">搜索</li>
	// 			<li v-link="{name : 'login'}" v-if="!userLoginState">登录</li>
	// 			<li v-link="{name : 'usermessage'}" v-if="userLoginState">未读消息<em v-if="ache_getNotMessageCount !== 0" class="message-count">{{ache_getNotMessageCount}}</em></li>
	// 			<li v-if="userLoginState">设置</li>
	// 			<li v-link="{name : 'about'}">关于</li>
	// 		</ul>
	// 	</div>
	// </template>
	// <script>
	exports.default = {
		props: ['showm'],
		data: function data() {
			return {
				user_name: this.getUserInfo.loginname || '',
				user_avatar: this.getUserInfo.avatar || ''
			};
		},
		vuex: {
			getters: {
				userLoginState: _getters.getLoginState,
				getUserInfo: _getters.getUserInfo,
				ache_getNotMessageCount: _getters.getNotMessageCount
			}
		}
	};
	// </script>
	// <style lang="sass">
	// 	.meun {
	// 		position: fixed;
	// 		top: 0px;
	// 		left:-200px;
	// 		width: 200px;
	// 		height: 100%;
	// 		background: #444444;
	// 		transition: all .3s ease;
	// 		z-index: 99;
	// 		.user_info {
	// 			padding-top : 20px;
	// 			width : 100%;
	// 			.avatar {
	// 				width : 100%;
	// 				height : 40px;
	// 				text-align : center;
	// 				img {
	// 					width : 40px;
	// 					height : 40px;
	// 					border-radius : 20px;
	// 					cursor : pointer;
	// 				}
	// 			}
	// 			.name {
	// 				width : 100%;
	// 				p {
	// 					width : 100%;
	// 					padding : 5px 0;
	// 					color : #fff;
	// 					font-size : 14px;
	// 					text-align : center;
	// 				}
	// 			}
	// 		}
	// 		ul {
	// 			padding: 20px 0;
	// 			li {
	// 				position: relative;
	// 			    color: #fff;
	// 			    padding: 16px 0;
	// 			    text-align: left;
	// 			    text-indent: 10px;
	// 			    line-height: 20px;
	// 			    font-size: 20px;
	// 			    margin: 0 25px;
	// 			    .message-count {
	// 			    	position: absolute;
	// 				    display: inline-block;
	// 				    top: 20px;
	// 				    left: 100px;
	// 				    width: 16px;
	// 				    height: 16px;
	// 				    background: #80bd01;
	// 				    border-radius: 8px;
	// 				    text-indent: 0px;
	// 				    text-align: center;
	// 				    font-size: 12px;
	// 				    line-height: 16px;
	// 			    }
	// 			}
	// 		}
	// 	}
	// 	.showMeun {
	// 		transform: translateX(200px);
	// 	}
	// </style>

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var getLoginState = exports.getLoginState = function getLoginState(state) {
		return state.isLogin;
	};
	var getUserInfo = exports.getUserInfo = function getUserInfo(state) {
		return state.userInfo;
	};
	var getTipShow = exports.getTipShow = function getTipShow(state) {
		return state.tipShow;
	};
	var getTipContent = exports.getTipContent = function getTipContent(state) {
		return state.tipContent;
	};
	var getNotMessageCount = exports.getNotMessageCount = function getNotMessageCount(state) {
		return state.message_count;
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"meun\" :class=\"{'showMeun':showm}\">\n\t<div class=\"user_info\" v-if=\"userLoginState\" v-link=\"{name:'userhome',params:{username:this.user_name}}\">\n\t\t<div class=\"avatar\">\n\t\t\t<img :src=\"user_avatar\" alt=\"\">\n\t\t</div>\n\t\t<div class=\"name\">\n\t\t\t<p v-text=\"user_name\"></p>\n\t\t</div>\n\t</div>\n\t<ul>\n\t\t<li v-link=\"{name:'home'}\">首页</li>\n\t\t<li v-link=\"{name : 'search'}\">搜索</li>\n\t\t<li v-link=\"{name : 'login'}\" v-if=\"!userLoginState\">登录</li>\n\t\t<li v-link=\"{name : 'usermessage'}\" v-if=\"userLoginState\">未读消息<em v-if=\"ache_getNotMessageCount !== 0\" class=\"message-count\">{{ache_getNotMessageCount}}</em></li>\n\t\t<li v-if=\"userLoginState\">设置</li>\n\t\t<li v-link=\"{name : 'about'}\">关于</li>\n\t</ul>\n</div>\n";

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"page-cover\"  v-show=\"coverShow\" v-on:click=\"hideMenu\"></div>\n<div class=\"header\">\n\t<span class=\"left-menu\" v-on:click=\"showMenu\"></span>cnode.js\n</div>\n<nv-menu :showm=\"menuShow\"></nv-menu>\n";

/***/ },
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// 修改用户登录状态为已经登录
	var isLogin = exports.isLogin = function isLogin(_ref) {
	  var dispatch = _ref.dispatch;

	  dispatch('ISLOGIN');
	};
	/**
	  *设置用户的登录信息
	  *参数 name用户名 avatar用户头像 id用户id accesstoken用户登录标识
	**/
	var setUserInfo = exports.setUserInfo = function setUserInfo(_ref2, name, avatar, id, accesstoken) {
	  var dispatch = _ref2.dispatch;

	  dispatch('SETUSERINFO', name, avatar, id, accesstoken);
	};
	/**
	  *设置弹框组件tips的提示内容
	  *
	**/
	var setTipContent = exports.setTipContent = function setTipContent(_ref3, content) {
	  var dispatch = _ref3.dispatch;

	  dispatch('SETTIPCONTENT', content);
	};
	/*
	 *设置tip弹窗组件的显示隐藏状态
	 */
	var setTipShow = exports.setTipShow = function setTipShow(_ref4, status) {
	  var dispatch = _ref4.dispatch;

	  dispatch('SETTIPSHOW', status);
	};
	/*
	 *设置未读消息的次数
	 */
	var setNotMessageCount = exports.setNotMessageCount = function setNotMessageCount(_ref5, count) {
	  var dispatch = _ref5.dispatch;

	  dispatch('SETNOTMESSAGECOUNT', count);
	};

/***/ },
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(70)
	__vue_script__ = __webpack_require__(73)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src\\vue\\usermessage.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(74)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-7af0dddb/usermessage.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(71);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/.npminstall/css-loader/0.23.1/css-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/style-rewriter.js!./../../node_modules/.npminstall/sass-loader/3.2.1/sass-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/selector.js?type=style&index=0!./usermessage.vue", function() {
				var newContent = require("!!./../../node_modules/.npminstall/css-loader/0.23.1/css-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/style-rewriter.js!./../../node_modules/.npminstall/sass-loader/3.2.1/sass-loader/index.js!./../../node_modules/.npminstall/vue-loader/8.5.3/vue-loader/lib/selector.js?type=style&index=0!./usermessage.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(13)();
	// imports


	// module
	exports.push([module.id, ".message {\n  overflow: hidden;\n  margin: 0 5px;\n  padding: 4rem 0 2rem; }\n  .message .passmessage, .message .unread {\n    margin-top: 5px; }\n    .message .passmessage .passmessage-title, .message .passmessage .unread-title, .message .unread .passmessage-title, .message .unread .unread-title {\n      background: #fff;\n      padding: 10px;\n      color: #80bd01;\n      font-size: 14px; }\n    .message .passmessage .passmessage-box, .message .passmessage .unread-box, .message .unread .passmessage-box, .message .unread .unread-box {\n      margin-top: 5px;\n      padding-top: 10px;\n      background: #fff;\n      opacity: 0.8; }\n      .message .passmessage .passmessage-box .passmessage-item, .message .passmessage .passmessage-box .unread-item, .message .passmessage .unread-box .passmessage-item, .message .passmessage .unread-box .unread-item, .message .unread .passmessage-box .passmessage-item, .message .unread .passmessage-box .unread-item, .message .unread .unread-box .passmessage-item, .message .unread .unread-box .unread-item {\n        position: relative;\n        padding: 10px;\n        background: #fff;\n        border-bottom: 1px solid #e1e1e1; }\n        .message .passmessage .passmessage-box .passmessage-item em, .message .passmessage .passmessage-box .unread-item em, .message .passmessage .unread-box .passmessage-item em, .message .passmessage .unread-box .unread-item em, .message .unread .passmessage-box .passmessage-item em, .message .unread .passmessage-box .unread-item em, .message .unread .unread-box .passmessage-item em, .message .unread .unread-box .unread-item em {\n          position: absolute;\n          right: 10px;\n          bottom: 10px; }\n      .message .passmessage .passmessage-box .nodata, .message .passmessage .unread-box .nodata, .message .unread .passmessage-box .nodata, .message .unread .unread-box .nodata {\n        position: relative;\n        padding-top: 40px;\n        color: #A8B5C3;\n        font-size: 16px;\n        text-align: center;\n        line-height: 40px; }\n        .message .passmessage .passmessage-box .nodata .nodataimg, .message .passmessage .unread-box .nodata .nodataimg, .message .unread .passmessage-box .nodata .nodataimg, .message .unread .unread-box .nodata .nodataimg {\n          position: absolute;\n          width: 40px;\n          height: 40px;\n          left: 0px;\n          top: 0px;\n          right: 0px;\n          margin: auto;\n          background: url(" + __webpack_require__(72) + ") no-repeat;\n          background-size: 100%; }\n", ""]);

	// exports


/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCQTU5MkRBMzVEMTYxMUU2OTQ2NkM0NDE1RTg2RjQxRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCQTU5MkRBNDVEMTYxMUU2OTQ2NkM0NDE1RTg2RjQxRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJBNTkyREExNUQxNjExRTY5NDY2QzQ0MTVFODZGNDFGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJBNTkyREEyNUQxNjExRTY5NDY2QzQ0MTVFODZGNDFGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VlHDsAAABGZJREFUeNrkm2doFEEUxyeWGHsPdgOJMTYiWLAXbKhBxfLBggohGhUUg4qIghXsLUKsiIkKISKoH2ygWKLYiTVqsGGsxBJLTEyM/8e+g/Pwttztzu5eHvwgl5vb3f/O7Mx7b96GlZeXi4poVTx/5OXl+WtTCUwBM0AXEAHywSmwHjxxi9iYmJh/RKlZNXAMHAC9WTRZc5AI7oGJbuxxLeHbQILK9+EgA/R07VD/j7Xh4a1llcFa0B9U59FQy+t7mkS+gHeg2A3CqafDdB6nH/gE6mu0ewvugkvgCHjsxKEeZfBY9XW0aQqGgdUgF5wHPZwm/LuE8w8AV8FufkwcITxb4nUkgeughROEnwFPJYrvyDc72m7hpWA6+C1RfCtwGkTavY7HgqqS551odprC7RLehycdO4xm+q12CG8MsmzobW+bBcbKFk493cQBDlYaaCBL+BjGCRbJEaDlwmlC2eKweCKR4wBLhU8NwFWVYTvNnuW9hVNAMt+hUWQcSLFKOC1f7R0cQi8DLa0QPtrhuYMaYLMVwnu7IHEyHgwyW3iccIelCvUEimHh9VwivB2YY3WQ4lRbzm61KcJLXSScRucqs4R/dVmvU9amc6A/9p4kXoOGLhJOnZYulJxdEfgBaDvoBrhvRPgLEO+yXu/E+NpLsIdXgEKtoX5ThI61FkoKm/L2I7WEZ4vQM8opnOCkhl/hF8HnEBRPwdcOMNCf8DJwUISmkc7tag5MKt+AULNXYKWacNpAyAghwcU8yZGbm6Xlsi4VcvbNrLbjLJji+J96fPV832HhMqPSlOGcX3huNEihSohHLhNMo3QxOzSnAo3OSsBMF4k+DNqCdXztQYWlVLWwz+GCc0BfMBm8MTMeXwQ+OlAwOVqzhVJ+dtmKRATVtSxwkGAqJNollMKktGB8Dj0ZGFrXzzlA9BXu4WRQYIYrp+cuJwv7SrWoTIx2eCjvf8dMH1aPkUe3QrJgSoVt5Nk6gztAyBZOtkEoNWoy7Ayvxwv9JRJkCi81umQEYC+EUgxAtXC5Vp7ISGK+GRhq0XX8EkpZKO2FF/lpEwW6CqWQsKYIslTEiPAJwpo8/FGh7IS+1Gg3WCh5NI9JE55gsmCKBeaBs3ZlJvTeoF4mnfMbO0XxBkU38nk0pDzjFNfWMEF0OrvB7wP4bXefSVBKj8cGeZ7bPGKmqYiuq/J7qoEf4fX5mizhzQM8fgGHt92EsuPhz8YJJS+W8p9RSKXeh4TymojHMmUN9VoGj1vGwcRSoZ2yXgLW8N+beMI7zQFSLGdTIrzaP2AHR4rwEgPHpPz8XI6V9Ri90EOFwp4qSirkTfLTtpBj7zJZQ/2Ljjbk1U0SSvF9joFroJ2OITrW8VscqOQIE0xvjz9U+Y56i4pyKI0baHb2Aq8ck9llpdr12uADC87kG/RHtst6g4dZHZ//n+Rn0oyCfnJV9zKOcWCoV/d7fX4GRvESI/MtBluis1UcMdFM3YGHnmstrKK+VPtXgAEAvqzQGmJXJEEAAAAASUVORK5CYII="

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _store = __webpack_require__(22);

	var _store2 = _interopRequireDefault(_store);

	var _getters = __webpack_require__(33);

	var _actions = __webpack_require__(51);

	var _header = __webpack_require__(24);

	var _header2 = _interopRequireDefault(_header);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// <template>
	// 	<nv-header></nv-header>
	// 	<div class="message">
	// 		<!-- 未读消息 -->
	// 		<div class="unread">
	// 			<div class="unread-title">未读消息</div>
	// 			<div class="unread-box">
	// 				<div v-for="message in hasnot_read_messages" class="passmessage-item">
	// 					<a href="#" v-link="{name:'userhome',params:{username:message.author.loginname}}">{{message.author.loginname}}</a>
	// 					{{message.text_desc}}
	// 					<a href='#' @click="" v-link="{name:'article',params:{id:message.topic.id}}">{{message.topic.title}}</a>
	// 					<em>{{message.create_at | getLastTime}}</em>
	// 				</div>
	// 				<div v-if="this.hasnot_read_messages.length === 0" class="nodata">
	// 					<div class="nodataimg"></div>
	// 						没有新消息
	// 				</div>
	// 			</div>
	// 		</div>
	// 		<!-- 过往消息 -->
	// 		<div class="passmessage">
	// 			<div class="passmessage-title">过往消息</div>
	// 			<div class="passmessage-box">
	// 				<div v-for="message in has_read_messages" class="passmessage-item">
	// 					<a href="#" v-link="{name:'userhome',params:{username:message.author.loginname}}">{{message.author.loginname}}</a>
	// 					{{message.text_desc}}
	// 					<a href='#' v-link="{name:'article',params:{id:message.topic.id}}">{{message.topic.title}}</a>
	// 					<em>{{message.create_at | getLastTime}}</em>
	// 				</div>
	// 				<div v-if="this.has_read_messages.length === 0" class="nodata">
	// 					<div class="nodataimg"></div>
	// 						没有消息
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// </template>
	// <script>
	exports.default = {
		data: function data() {
			return {
				accesstoken: this.ache_getUserInfo.accesstoken,
				hasnot_read_messages: [],
				has_read_messages: []
			};
		},
		ready: function ready() {
			var _this = this;

			if (this.ache_userLoginState) {
				var rqdata = {
					'accesstoken': this.accesstoken
				};
				$.post('https://cnodejs.org/api/v1/message/mark_all', rqdata, function (d) {
					if (d.success) {
						console.log('成功');
						// 设置未阅读数为0
						_this.hand_setNotMessageCount(0);
					}
				});
			}
		},
		route: {
			data: function data(transition) {
				var _this2 = this;

				var rqdata = {
					'accesstoken': this.accesstoken
				};
				$.get('https://cnodejs.org/api/v1/messages', rqdata, function (d) {
					if (d.success) {
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = d.data.has_read_messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var i = _step.value;

								if (i.type === 'at') {
									i['text_desc'] = '@中你';
								} else if (i.type === 'reply') {
									i['text_desc'] = '回复你';
								}
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}

						_this2.has_read_messages = d.data.has_read_messages;
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = d.data.hasnot_read_messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var _i = _step2.value;

								if (_i.type === 'at') {
									_i['text_desc'] = '@中你';
								} else if (_i.type === 'reply') {
									_i['text_desc'] = '回复你';
								}
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}

						_this2.hasnot_read_messages = d.data.hasnot_read_messages;
					}
				});
			}
		},
		components: {
			'nv-header': _header2.default
		},
		store: _store2.default,
		vuex: {
			actions: {
				hand_setNotMessageCount: _actions.setNotMessageCount
			},
			getters: {
				ache_userLoginState: _getters.getLoginState,
				ache_getUserInfo: _getters.getUserInfo
			}
		}
	};
	// </script>
	// <style lang="sass">
	// 	.message {
	// 		overflow: hidden;
	//     	margin: 0 5px;
	//     	padding: 4rem 0 2rem;
	//     	.passmessage, .unread {
	//     		margin-top: 5px;
	//     		.passmessage-title, .unread-title {
	//     			background: #fff;
	// 				padding: 10px;
	// 				color: #80bd01;
	// 				font-size: 14px;
	//     		}
	//     		.passmessage-box, .unread-box {
	//     			margin-top: 5px;
	// 				padding-top: 10px;
	// 				background: #fff;
	// 				opacity: 0.8;
	// 				.passmessage-item, .unread-item {
	// 					position: relative;
	// 					padding: 10px;
	// 					background: #fff;
	// 					border-bottom: 1px solid #e1e1e1;
	// 					span {
	//
	// 					}
	// 					em {
	// 						position: absolute;
	// 					    right: 10px;
	// 					    bottom: 10px;
	// 					}
	// 				}
	// 				.nodata {
	// 					position: relative;
	// 					padding-top: 40px;
	// 					color: #A8B5C3;
	// 					font-size: 16px;
	// 					text-align: center;
	// 					line-height: 40px;
	// 					.nodataimg {
	// 						position: absolute;
	// 						width: 40px;
	// 						height: 40px;
	// 						left: 0px;
	// 						top: 0px;
	// 						right: 0px;
	// 						margin: auto;
	// 						background: url('../img/nodata.png') no-repeat;
	// 						background-size: 100%;
	// 					}
	// 				}
	//     		}
	//     	}
	// 	}
	// </style>
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "\n<nv-header></nv-header>\n<div class=\"message\">\n\t<!-- 未读消息 -->\n\t<div class=\"unread\">\n\t\t<div class=\"unread-title\">未读消息</div>\n\t\t<div class=\"unread-box\">\n\t\t\t<div v-for=\"message in hasnot_read_messages\" class=\"passmessage-item\">\n\t\t\t\t<a href=\"#\" v-link=\"{name:'userhome',params:{username:message.author.loginname}}\">{{message.author.loginname}}</a>\n\t\t\t\t{{message.text_desc}}\n\t\t\t\t<a href='#' @click=\"\" v-link=\"{name:'article',params:{id:message.topic.id}}\">{{message.topic.title}}</a>\n\t\t\t\t<em>{{message.create_at | getLastTime}}</em>\n\t\t\t</div>\n\t\t\t<div v-if=\"this.hasnot_read_messages.length === 0\" class=\"nodata\">\n\t\t\t\t<div class=\"nodataimg\"></div>\n\t\t\t\t\t没有新消息\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<!-- 过往消息 -->\n\t<div class=\"passmessage\">\n\t\t<div class=\"passmessage-title\">过往消息</div>\n\t\t<div class=\"passmessage-box\">\n\t\t\t<div v-for=\"message in has_read_messages\" class=\"passmessage-item\">\n\t\t\t\t<a href=\"#\" v-link=\"{name:'userhome',params:{username:message.author.loginname}}\">{{message.author.loginname}}</a>\n\t\t\t\t{{message.text_desc}}\n\t\t\t\t<a href='#' v-link=\"{name:'article',params:{id:message.topic.id}}\">{{message.topic.title}}</a>\n\t\t\t\t<em>{{message.create_at | getLastTime}}</em>\n\t\t\t</div>\n\t\t\t<div v-if=\"this.has_read_messages.length === 0\" class=\"nodata\">\n\t\t\t\t<div class=\"nodataimg\"></div>\n\t\t\t\t\t没有消息\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";

/***/ }
]);