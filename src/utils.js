/**
 * @module utils
 * All the helper functions needed in this project
 */
export default {
  $(id) {
    id = id[0] === '#' ? id.substr(1, id.length) : id;
    return document.getElementById(id);
  },
  isElement(obj) {
    // DOM, Level2
    if ('HTMLElement' in window) {
      return (!!obj && obj instanceof HTMLElement);
    }
    // Older browsers
    return (!!obj && typeof obj === 'object' && obj.nodeType === 1 &&
        !!obj.nodeName);
  },
  evaluate(element) {
    let el;
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
  toType(obj) {
    if (obj === window && obj.document && obj.location) return 'window';
    else if (obj === document) return 'htmldocument';
    else if (typeof obj === 'string') return 'string';
    else if (this.isElement(obj)) return 'element';
  },
  /**
   * Abstraction to querySelectorAll for increased
   * performance and greater usability
   * @param {String} selector
   * @param {Element} context (optional)
   * @param {Boolean} find_all (optional)
   * @return (find_all) {Element} : {Array}
   */
  find(selector, context = window.document, find_all) {
    const simpleRegex = /^(#?[\w-]+|\.[\w-.]+)$/,
        periodRegex = /\./g,
        slice = Array.prototype.slice;
    let matches = [];

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
  mergeOptions(obj1, obj2) {
    let obj3 = {};
    for (let attr1 in obj1) { obj3[attr1] = obj1[attr1]; }
    for (let attr2 in obj2) { obj3[attr2] = obj2[attr2]; }
    return obj3;
  },
  isDefAndNotNull(val) {
    // Note that undefined == null.
    return val != null; // eslint-disable-line no-eq-null
  },
  assertEqual(a, b, message) {
    if (a !== b) {
      throw new Error(message + ' mismatch: ' + a + ' != ' + b);
    }
  },
  assert(condition, message = 'Assertion failed') {
    if (!condition) {
      if (typeof Error !== 'undefined') {
        throw new Error(message);
      }
      throw message; // Fallback
    }
  },
  now() {
    // Polyfill for window.performance.now()
    // @license http://opensource.org/licenses/MIT
    // copyright Paul Irish 2015
    // https://gist.github.com/paulirish/5438650
    if ('performance' in window === false) window.performance = {};

    Date.now = (Date.now || function () {  // thanks IE8
      return new Date().getTime();
    });

    if ('now' in window.performance === false) {
      let nowOffset = Date.now();
      if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart;
      }
      window.performance.now = function now() {
        return Date.now() - nowOffset;
      };
    }
    return window.performance.now();
  },
  offset(element) {
    const rect = element.getBoundingClientRect();
    const docEl = document.documentElement;
    return {
      left: rect.left + window.pageXOffset - docEl.clientLeft,
      top: rect.top + window.pageYOffset - docEl.clientTop,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  },
  getScroll() {
    return [
      window.pageXOffset
        || (document.documentElement && document.documentElement.scrollLeft)
        || document.body.scrollLeft,
      window.pageYOffset
        || (document.documentElement && document.documentElement.scrollTop)
        || document.body.scrollTop
    ];
  },
  getViewportSize() {
    return {
      w: window.innerWidth || document.documentElement.clientWidth,
      h: window.innerHeight || document.documentElement.clientHeight
    };
  },
  getDocumentHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }
};
