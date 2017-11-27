/*!
 * scroll-watcher - v1.0.0
 * A lightweight, blazing fast, rAF based, scroll watcher.
 * https://github.com/jonataswalker/scroll-watcher
 * Built: Mon Nov 27 2017 15:29:04 GMT-0200 (-02)
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

var tinyEmitter = E;

/**
  * Overwrites obj1's values with obj2's and adds
  * obj2's if non existent in obj1
  * @returns obj3 a new object based on obj1 and obj2
  */
function mergeOptions(obj1, obj2) {
  let obj3 = {};
  for (let attr1 in obj1) { obj3[attr1] = obj1[attr1]; }
  for (let attr2 in obj2) { obj3[attr2] = obj2[attr2]; }
  return obj3;
}

function assert(condition, message) {
  if ( message === void 0 ) message = 'Assertion failed';

  if (!condition) {
    if (typeof Error !== 'undefined') { throw new Error(message); }
    throw message; // Fallback
  }
}

/**
 * @param {Element|Array<Element>} element DOM node or array of nodes.
 * @param {String|Array<String>} classname Class or array of classes.
 * For example: 'class1 class2' or ['class1', 'class2']
 * @param {Number|undefined} timeout Timeout to remove a class.
 */


/**
 * @param {Element|Array<Element>} element DOM node or array of nodes.
 * @param {String|Array<String>} classname Class or array of classes.
 * For example: 'class1 class2' or ['class1', 'class2']
 * @param {Number|undefined} timeout Timeout to add a class.
 */



/**
 * @param {Element} element DOM node.
 * @param {String} classname Classname.
 * @return {Boolean}
 */


/**
 * @param {Element|Array<Element>} element DOM node or array of nodes.
 * @param {String} classname Classe.
 */


/**
 * Abstraction to querySelectorAll for increased
 * performance and greater usability
 * @param {String} selector
 * @param {Element} context (optional)
 * @param {Boolean} find_all (optional)
 * @return (find_all) {Element} : {Array}
 */
function find(selector, context, find_all) {
  if ( context === void 0 ) context = window.document;

  let simpleRe = /^(#?[\w-]+|\.[\w-.]+)$/,
      periodRe = /\./g,
      slice = Array.prototype.slice,
      matches = [];

  // Redirect call to the more performant function
  // if it's a simple selector and return an array
  // for easier usage
  if (simpleRe.test(selector)) {
    switch (selector[0]) {
      case '#':
        matches = [$(selector.substr(1))];
        break;
      case '.':
        matches = slice.call(context.getElementsByClassName(
          selector.substr(1).replace(periodRe, ' ')));
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
}

function toType(obj) {
  if (obj === window && obj.document && obj.location) { return 'window'; }
  else if (obj === document) { return 'htmldocument'; }
  else if (typeof obj === 'string') { return 'string'; }
  else if (isElement(obj)) { return 'element'; }
}

function evaluate(el) {
  let element;
  switch (toType(el)) {
    case 'window':
    case 'htmldocument':
    case 'element':
      element = el;
      break;
    case 'string':
      const t = (el[0] === '#' || el[0] === '.') ? el : '#' + el;
      element = find(t);
      break;
    default:
      console.warn('Unknown type');
  }
  return element;
}

function $(id) {
  id = (id[0] === '#') ? id.substr(1, id.length) : id;
  return document.getElementById(id);
}

function isElement(obj) {
  // DOM, Level2
  if ('HTMLElement' in window) {
    return (!!obj && obj instanceof HTMLElement);
  }
  // Older browsers
  return !!obj
    && typeof obj === 'object'
    && obj.nodeType === 1
    && !!obj.nodeName;
}















function getScroll() {
  return [
    window.pageXOffset
      || (document.documentElement && document.documentElement.scrollLeft)
      || document.body.scrollLeft,
    window.pageYOffset
      || (document.documentElement && document.documentElement.scrollTop)
      || document.body.scrollTop
  ];
}

function getViewportSize() {
  return {
    w: window.innerWidth || document.documentElement.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight
  };
}

function getDocumentHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function offset(element) {
  const rect = element.getBoundingClientRect();
  const docEl = document.documentElement;
  return {
    left: rect.left + window.pageXOffset - docEl.clientLeft,
    top: rect.top + window.pageYOffset - docEl.clientTop,
    width: element.offsetWidth,
    height: element.offsetHeight
  };
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var performanceNow = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
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
      var _now = performanceNow()
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

var raf_1 = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
};
var cancel = function() {
  caf.apply(root, arguments);
};
var polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf;
  object.cancelAnimationFrame = caf;
};

raf_1.cancel = cancel;
raf_1.polyfill = polyfill;

const EVENT_TYPE = {
  PAGELOAD      : 'page:load',
  SCROLLING     : 'scrolling',
  ENTER         : 'enter',
  FULL_ENTER    : 'enter:full',
  EXIT_PARTIAL  : 'exit:partial',
  EXIT          : 'exit'
};

const DEFAULT_OFFSET = {
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
  this.viewport = getViewportSize();
  this.loopBound = this.loop.bind(this);
  this.runLoop();
  this.setListeners();
  this.rafId = null;
};

Internal.prototype.loop = function loop () {
  if (this.lastXY.join() === getScroll().join()) {
    // Avoid calculations if not needed
    this.runLoop();
    return;
  } else {
    this.handleItems();
    this.runLoop();
  }
};

Internal.prototype.handleItems = function handleItems () {
    var this$1 = this;

  const evtData = this.getScrollData();
  this.Base.emit(EVENT_TYPE.SCROLLING, evtData);

  Object.keys(this.watching).forEach(function (k) {
    evtData.target = this$1.watching[k].node;
    this$1.recalculate(this$1.watching[k]);
    this$1.fireEvents(this$1.watching[k], evtData);
  });
};

Internal.prototype.fireEvents = function fireEvents (item, data) {
  if (item.isInViewport && !item.wasInViewport) {
    item.wasInViewport = true;
    item.wasFullyOut = false;
    item.emitter.emit(EVENT_TYPE.ENTER, data);
  }

  if (item.isPartialOut && !item.wasPartialOut) {
    item.wasPartialOut = true;
    item.wasFullyInViewport = false;
    item.emitter.emit(EVENT_TYPE.EXIT_PARTIAL, data);
  }

  if (item.isFullyOut && !item.wasFullyOut) {
    item.wasFullyOut = true;
    item.wasInViewport = false;
    item.wasFullyInViewport = false;
    item.emitter.emit(EVENT_TYPE.EXIT, data);
  }

  if (item.isFullyInViewport && !item.wasFullyInViewport) {
    item.wasFullyInViewport = true;
    item.wasPartialOut = false;
    item.wasFullyOut = false;
    item.emitter.emit(EVENT_TYPE.FULL_ENTER, data);
  }
};

Internal.prototype.getScrollData = function getScrollData () {
  const xy = getScroll();
  const scrollingDown = xy[1] > this.lastXY[1];
  this.lastXY = xy;
  return {
    scrollX: xy[0],
    scrollY: xy[1],
    scrollingDown: scrollingDown,
    scrollingUp: !scrollingDown
  };
};

Internal.prototype.stopLoop = function stopLoop () {
  raf_1.cancel(this.rafId);
};

Internal.prototype.runLoop = function runLoop () {
  this.rafId = raf_1(this.loopBound);
};

Internal.prototype.recalculate = function recalculate (item) {
  const el = {
    top: item.dimensions.top + item.offset.top,
    bottom: item.dimensions.top + item.offset.bottom + item.dimensions.height
  };

  const vp = {
    top: this.lastXY[1],
    bottom: this.lastXY[1] + this.viewport.h
  };

  item.isAboveViewport = el.top < vp.top;
  item.isBelowViewport = el.bottom > vp.bottom;
  item.isInViewport = el.top <= vp.bottom && el.bottom > vp.top;
  item.isFullyInViewport =
    (el.top >= vp.top && el.bottom <= vp.bottom)
    || (item.isAboveViewport && item.isBelowViewport);
  item.isFullyOut = !item.isInViewport && item.wasInViewport;
  item.isPartialOut =
    item.wasFullyInViewport && !item.isFullyInViewport && !item.isFullyOut;
};

Internal.prototype.setListeners = function setListeners () {
  const this_ = this;
  const onReadyState = function onReadyState(e) {
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
      }
    }
  };
  const onResize = function onResize(e) {
    this_.viewport = getViewportSize();
  };
  document.addEventListener('readystatechange', onReadyState, false);
  window.addEventListener('resize', onResize, false);
};

function resetProps(item) {
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

function resetPartialProps(item) {
  item.isInViewport       = false;
  item.isAboveViewport    = false;
  item.isBelowViewport    = false;
  item.isPartialOut       = false;
  item.isFullyOut         = false;
  item.isFullyInViewport  = false;
}

function getProps(item) {
  return {
    isInViewport: item.isInViewport,
    isFullyInViewport: item.isFullyInViewport,
    isAboveViewport: item.isAboveViewport,
    isBelowViewport: item.isBelowViewport,
    isPartialOut: item.isPartialOut,
    isFullyOut: item.isFullyOut,
  };
}

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
    assert(
      typeof element === 'string' || isElement(element),
      '@param `element` should be string type or DOM Element!'
    );

    assert(
      typeof opt_offset === 'number' ||
        typeof opt_offset === 'object' ||
        typeof opt_offset === 'undefined',
      '@param `opt_offset` should be number or Object or undefined!'
    );

    let offsetOpt;
    const idx = ++this.counter;
    const emitter = new TinyEmitter$$1();
    const node = evaluate(element);

    assert(
      isElement(node),
      ("Couldn't evaluate (" + element + ") to a valid DOM node")
    );

    offsetOpt = typeof opt_offset === 'number'
      ? { top: opt_offset, bottom: opt_offset }
      : mergeOptions(DEFAULT_OFFSET, opt_offset);

    Base.Internal.watching[idx] = {
      node: node,
      emitter: emitter,
      offset: offsetOpt,
      dimensions: offset(node)
    };

    resetProps(Base.Internal.watching[idx]);

    return {
      target: node,
      props: getProps(Base.Internal.watching[idx]),
      update: function () {
        const item = Base.Internal.watching[idx];
        const data = Base.Internal.getScrollData();
        data.target = item.node;

        Base.Internal.stopLoop();
        resetPartialProps(item);
        item.dimensions = offset(node);
        Base.Internal.recalculate(item);
        this.props = getProps(item);
        Base.Internal.fireEvents(item, data);
        Base.Internal.runLoop();
        return this;
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
  Base.prototype.windowAtBottom = function windowAtBottom (_offset_) {
    if ( _offset_ === void 0 ) _offset_ = 0;

    const scrolled = Base.Internal.lastXY[1];
    const viewHeight = Base.Internal.viewport.h;
    _offset_ = parseInt(_offset_, 10);
    return scrolled + viewHeight >= getDocumentHeight() - _offset_;
  };

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to top
   */
  Base.prototype.windowAtTop = function windowAtTop (_offset_) {
    if ( _offset_ === void 0 ) _offset_ = 0;

    const scrolled = Base.Internal.lastXY[1];
    _offset_ = parseInt(_offset_, 10);
    return scrolled <= _offset_;
  };

  return Base;
}(tinyEmitter));

return Base;

})));
