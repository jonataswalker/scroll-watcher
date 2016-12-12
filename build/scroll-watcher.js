/*!
 * scroll-watcher - v0.5.0
 * A lightweight, blazing fast, rAF based, scroll watcher.
 * https://github.com/jonataswalker/scroll-watcher
 * Built: Mon Dec 12 2016 16:32:17 GMT-0200 (BRST)
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ScrollWatcher = factory());
}(this, (function () { 'use strict';

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }

    listener._ = callback;
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          { liveEvents.push(evts[i]); }
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

var index = E;

/**
 * @module utils
 * All the helper functions needed in this project
 */
var utils = {
  $: function $(id) {
    id = id[0] === '#' ? id.substr(1, id.length) : id;
    return document.getElementById(id);
  },
  isElement: function isElement(obj) {
    // DOM, Level2
    if ('HTMLElement' in window) {
      return (!!obj && obj instanceof HTMLElement);
    }
    // Older browsers
    return (!!obj && typeof obj === 'object' && obj.nodeType === 1 &&
        !!obj.nodeName);
  },
  evaluate: function evaluate(element) {
    var el;
    switch (this.toType(element)) {
      case 'window':
      case 'htmldocument':
      case 'element':
        el = element;
        break;
      case 'string':
        element = (element[0] === '#' || element[0] === '.') ?
            element : '#' + element;
        el = this.find(element);
        break;
      default:
        console.warn('Unknown type');
    }
    return el;
  },
  toType: function toType(obj) {
    if (obj === window && obj.document && obj.location) { return 'window'; }
    else if (obj === document) { return 'htmldocument'; }
    else if (typeof obj === 'string') { return 'string'; }
    else if (this.isElement(obj)) { return 'element'; }
  },
  /**
   * Abstraction to querySelectorAll for increased
   * performance and greater usability
   * @param {String} selector
   * @param {Element} context (optional)
   * @param {Boolean} find_all (optional)
   * @return (find_all) {Element} : {Array}
   */
  find: function find(selector, context, find_all) {
    if ( context === void 0 ) context = window.document;

    var simpleRegex = /^(#?[\w-]+|\.[\w-.]+)$/,
        periodRegex = /\./g,
        slice = Array.prototype.slice;
    var matches = [];

    // Redirect call to the more performant function
    // if it's a simple selector and return an array
    // for easier usage
    if (simpleRegex.test(selector)) {
      switch (selector[0]) {
        case '#':
          matches = [this.$(selector.substr(1))];
          break;
        case '.':
          matches = slice.call(context.getElementsByClassName(
            selector.substr(1).replace(periodRegex, ' ')));
          break;
        default:
          matches = slice.call(context.getElementsByTagName(selector));
      }
    } else {
      // If not a simple selector, query the DOM as usual
      // and return an array for easier usage
      matches = slice.call(context.querySelectorAll(selector));
    }

    return (find_all) ? matches : matches[0];
  },
  /**
   * Overwrites obj1's values with obj2's and adds
   * obj2's if non existent in obj1
   * @returns obj3 a new object based on obj1 and obj2
   */
  mergeOptions: function mergeOptions(obj1, obj2) {
    var obj3 = {};
    for (var attr1 in obj1) { obj3[attr1] = obj1[attr1]; }
    for (var attr2 in obj2) { obj3[attr2] = obj2[attr2]; }
    return obj3;
  },
  isDefAndNotNull: function isDefAndNotNull(val) {
    // Note that undefined == null.
    return val != null; // eslint-disable-line no-eq-null
  },
  assertEqual: function assertEqual(a, b, message) {
    if (a !== b) {
      throw new Error(message + ' mismatch: ' + a + ' != ' + b);
    }
  },
  assert: function assert(condition, message) {
    if ( message === void 0 ) message = 'Assertion failed';

    if (!condition) {
      if (typeof Error !== 'undefined') {
        throw new Error(message);
      }
      throw message; // Fallback
    }
  },
  now: function now() {
    // Polyfill for window.performance.now()
    // @license http://opensource.org/licenses/MIT
    // copyright Paul Irish 2015
    // https://gist.github.com/paulirish/5438650
    if ('performance' in window === false) { window.performance = {}; }

    Date.now = (Date.now || function () {  // thanks IE8
      return new Date().getTime();
    });

    if ('now' in window.performance === false) {
      var nowOffset = Date.now();
      if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart;
      }
      window.performance.now = function now() {
        return Date.now() - nowOffset;
      };
    }
    return window.performance.now();
  },
  offset: function offset(element) {
    var rect = element.getBoundingClientRect();
    var docEl = document.documentElement;
    return {
      left: rect.left + window.pageXOffset - docEl.clientLeft,
      top: rect.top + window.pageYOffset - docEl.clientTop,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  },
  getScroll: function getScroll() {
    return [
      window.pageXOffset
        || (document.documentElement && document.documentElement.scrollLeft)
        || document.body.scrollLeft,
      window.pageYOffset
        || (document.documentElement && document.documentElement.scrollTop)
        || document.body.scrollTop
    ];
  },
  getViewportSize: function getViewportSize() {
    return {
      w: window.innerWidth || document.documentElement.clientWidth,
      h: window.innerHeight || document.documentElement.clientHeight
    };
  },
  getDocumentHeight: function getDocumentHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var performanceNow = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(commonjsGlobal);
});

var now$1 = performanceNow;
var root = typeof window === 'undefined' ? commonjsGlobal : window;
var vendors = ['moz', 'webkit'];
var suffix = 'AnimationFrame';
var raf = root['request' + suffix];
var caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix];
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix];
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60;

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now$1()
        , next = Math.max(0, frameDuration - (_now - last));
      last = next + _now;
      setTimeout(function() {
        var cp = queue.slice(0);
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0;
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last);
            } catch(e) {
              setTimeout(function() { throw e }, 0);
            }
          }
        }
      }, Math.round(next));
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    });
    return id
  };

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true;
      }
    }
  };
}

var index$1 = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
};
var cancel = function() {
  caf.apply(root, arguments);
};
var polyfill = function() {
  root.requestAnimationFrame = raf;
  root.cancelAnimationFrame = caf;
};

index$1.cancel = cancel;
index$1.polyfill = polyfill;

var EVENT_TYPE = {
  PAGELOAD      : 'page:load',
  SCROLLING     : 'scrolling',
  ENTER         : 'enter',
  FULL_ENTER    : 'enter:full',
  EXIT_PARTIAL  : 'exit:partial',
  EXIT          : 'exit'
};

var DEFAULT_OFFSET = {
  top: 0,
  bottom: 0
};

/**
 * Internal class.
 * @class Internal
 */
var Internal = function Internal(base) {
  this.Base = base;
  this.lastXY = [];
  this.watching = {};
  this.viewport = utils.getViewportSize();
  this.loopBound = this.loop.bind(this);
  this.loopBound();
  this.setListeners();
};

Internal.prototype.loop = function loop () {
    var this$1 = this;

  // console.log('loop', this.lastXY.join());
  if (this.lastXY.join() === utils.getScroll().join()) {
    // Avoid calculations if not needed
    index$1(this.loopBound);
    return false;
  } else {
    var xy = utils.getScroll();
    var scrolling_down = xy[1] > this.lastXY[1];
    this.lastXY = xy;
    var evt_data = {
      scrollX: this.lastXY[0],
      scrollY: this.lastXY[1],
      scrollingDown: scrolling_down,
      scrollingUp: !scrolling_down
    };
    this.Base.emit(EVENT_TYPE.SCROLLING, evt_data);

    Object.keys(this.watching).forEach(function (k) {
      var item = this$1.watching[k];
      this$1.recalculate(item);
      evt_data.target = item.node;

      if (item.isInViewport && !item.wasInViewport) {
        item.wasInViewport = true;
        item.wasFullyOut = false;
        item.emitter.emit(EVENT_TYPE.ENTER, evt_data);
      }

      if (item.isFullyOut && !item.wasFullyOut) {
        item.wasFullyOut = true;
        item.wasInViewport = false;
        item.emitter.emit(EVENT_TYPE.EXIT, evt_data);
      }

      if (item.isPartialOut && !item.wasPartialOut) {
        item.wasPartialOut = true;
        item.wasFullyInViewport = false;
        item.emitter.emit(EVENT_TYPE.EXIT_PARTIAL, evt_data);
      }

      if (item.isFullyInViewport && !item.wasFullyInViewport) {
        item.wasFullyInViewport = true;
        item.wasPartialOut = false;
        item.emitter.emit(EVENT_TYPE.FULL_ENTER, evt_data);
      }
    });
  }
  index$1(this.loopBound);
};

Internal.prototype.recalculate = function recalculate (item) {
  var node = {
    top: item.dimensions.top + item.offset.top,
    bottom: item.dimensions.top + item.offset.bottom + item.dimensions.height
  };
  var viewport = {
    top: this.lastXY[1],
    bottom: this.lastXY[1] + this.viewport.h
  };
  item.isAboveViewport = node.top < viewport.top;
  item.isBelowViewport = node.bottom > viewport.bottom;
  item.isInViewport = node.top <= viewport.bottom &&
      node.bottom >= viewport.top;
  item.isFullyInViewport = (node.top >= viewport.top &&
      node.bottom <= viewport.bottom) ||
      (item.isAboveViewport && item.isBelowViewport);
  item.isPartialOut = item.wasFullyInViewport && !item.isFullyInViewport;
  item.isFullyOut = !item.isInViewport && item.wasInViewport;
};

Internal.prototype.setListeners = function setListeners () {
  var this_ = this;
  var onReadyState = function onReadyState(e) {
    if (typeof document !== 'undefined') {
      switch (document.readyState) {
        case 'loading':
        case 'interactive':
          break;
        case 'complete':
          this_.Base.emit(EVENT_TYPE.PAGELOAD, {
            scrollX: this_.lastXY[0],
            scrollY: this_.lastXY[1]
          });
          document.removeEventListener('readystatechange', onReadyState);
          break;
        default:
          break;
      }
    }
  };
  var onResize = function onResize(e) {
    this_.viewport = utils.getViewportSize();
  };
  document.addEventListener('readystatechange', onReadyState, false);
  window.addEventListener('resize', onResize, false);
};

/**
 * Principal class. Will be passed as argument to others.
 * @class Base
 */
var Base = (function (TinyEmitter$$1) {
  function Base() {
    if (!(this instanceof Base)) { return new Base(); }
    TinyEmitter$$1.call(this);
    this.counter = 0;
    Base.Internal = new Internal(this);
  }

  if ( TinyEmitter$$1 ) Base.__proto__ = TinyEmitter$$1;
  Base.prototype = Object.create( TinyEmitter$$1 && TinyEmitter$$1.prototype );
  Base.prototype.constructor = Base;

  /**
   * @param {String|Element} element String or DOM node.
   * @param {Number|Object|undefined} opt_offset Element offset.
   */
  Base.prototype.watch = function watch (element, opt_offset) {
    utils.assert(typeof element === 'string' || utils.isElement(element),
        '@param `element` should be string type or DOM Element!');
    utils.assert(
        typeof opt_offset === 'number' ||
        typeof opt_offset === 'object' ||
        typeof opt_offset === 'undefined',
        '@param `opt_offset` should be number or Object or undefined!');

    var offset;
    var this_ = this;
    var idx = ++this.counter;
    var emitter = new TinyEmitter$$1();
    var node = utils.evaluate(element);
    utils.assert(utils.isElement(node),
        ("Couldn't evaluate (" + element + ") to a valid DOM node"));

    if (typeof opt_offset === 'number') {
      offset = {
        top: opt_offset,
        bottom: opt_offset
      };
    } else {
      offset = utils.mergeOptions(DEFAULT_OFFSET, opt_offset);
    }
    Base.Internal.watching[idx] = {
      node                : node,
      emitter             : emitter,
      offset              : offset,
      dimensions          : utils.offset(node)
    };
    reset(Base.Internal.watching[idx]);

    function reset(item) {
      item.isInViewport       = false;
      item.wasInViewport      = false;
      item.isAboveViewport    = false;
      item.wasAboveViewport   = false;
      item.isBelowViewport    = false;
      item.wasBelowViewport   = false;
      item.isPartialOut       = false;
      item.wasPartialOut      = false;
      item.isFullyOut         = false;
      item.wasFullyOut        = false;
      item.isFullyInViewport  = false;
      item.wasFullyInViewport = false;
    }

    return {
      target: node,
      update: function () {
        reset(Base.Internal.watching[idx]);
        Base.Internal.watching[idx].dimensions = utils.offset(node);
      },
      once: function (eventName, callback) {
        emitter.once(eventName, callback, this);
        return this;
      },
      on: function (eventName, callback) {
        emitter.on(eventName, callback, this);
        return this;
      },
      off: function (eventName, callback) {
        emitter.off(eventName, callback, this);
        return this;
      }
    };
  };

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to bottom
   */
  Base.prototype.windowAtBottom = function windowAtBottom (offset) {
    if ( offset === void 0 ) offset = 0;

    var scrolled = Base.Internal.lastXY[1];
    var viewHeight = Base.Internal.viewport.h;
    offset = parseInt(offset, 10);
    return scrolled + viewHeight >= utils.getDocumentHeight() - offset;
  };

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to top
   */
  Base.prototype.windowAtTop = function windowAtTop (offset) {
    if ( offset === void 0 ) offset = 0;

    var scrolled = Base.Internal.lastXY[1];
    offset = parseInt(offset, 10);
    return scrolled <= offset;
  };

  return Base;
}(index));

return Base;

})));
