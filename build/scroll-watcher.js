/**
 * A (yet another) cross-browser, event-based, scroll watcher.
 * https://github.com/jonataswalker/scroll-watcher
 * Version: v0.1.0
 * Built: 2016-09-29T13:46:00-03:00
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

    listener._ = callback
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
          liveEvents.push(evts[i]);
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
  isInside: function isInside(ref) {
    if ( ref === void 0 ) ref = {};
    var scroll = ref.scroll;
    var viewport = ref.viewport;
    var node = ref.node;
    var offset = ref.offset;
    var full = ref.full;


  },
  intersectRect: function intersectRect(rect1, rect2) {
    return rect1.left <= rect2.right
        && rect2.left <= rect1.right
        && rect1.top <= rect2.bottom
        && rect2.top <= rect1.bottom;
  },
  containsRectangle: function containsRectangle(rect1, rect2) {
    return rect2.left >= rect1.left
        && rect2.top >= rect1.top
        && rect2.right <= rect1.right
        && rect2.bottom <= rect1.bottom;
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
  },
  raf: window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame,
  caf: function caf(id) {
    var cancel = window.cancelAnimationFrame
      || window.webkitCancelAnimationFrame
      || window.mozCancelAnimationFrame;
    cancel.call(window, id);
  }
};

var EVENT_TYPE = {
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
};

Internal.prototype.loop = function loop () {
    var this$1 = this;

  if (this.lastXY.join() === utils.getScroll().join()) {
    // Avoid calculations if not needed
    utils.raf.call(window, this.loopBound);
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

      //console.info('in: ', in_, 'id: ', item.node.id);
      // console.info('id: ', item.node.id, 'dimensions: ', item.dimensions);

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
  utils.raf.call(window, this.loopBound);
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

/**
 * Principal class. Will be passed as argument to others.
 * @class Base
 */
var Base = (function (TinyEmitter$$1) {
  function Base() {
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
        emitter.once(eventName, callback);
        return this;
      },
      on: function (eventName, callback) {
        emitter.on(eventName, callback);
        return this;
      },
      off: function (eventName, callback) {
        emitter.off(eventName, callback);
        return this;
      }
    };
  };

  return Base;
}(index));

return Base;

})));
