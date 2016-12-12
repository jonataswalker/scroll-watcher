import TinyEmitter from 'tiny-emitter';
import Internal from './internal';
import utils from './utils';
import { DEFAULT_OFFSET } from './constants';

/**
 * Principal class. Will be passed as argument to others.
 * @class Base
 */
export default class Base extends TinyEmitter {

  constructor() {
    if (!(this instanceof Base)) return new Base();
    super();
    this.counter = 0;
    Base.Internal = new Internal(this);
  }

  /**
   * @param {String|Element} element String or DOM node.
   * @param {Number|Object|undefined} opt_offset Element offset.
   */
  watch(element, opt_offset) {
    utils.assert(typeof element === 'string' || utils.isElement(element),
        '@param `element` should be string type or DOM Element!');
    utils.assert(
        typeof opt_offset === 'number' ||
        typeof opt_offset === 'object' ||
        typeof opt_offset === 'undefined',
        '@param `opt_offset` should be number or Object or undefined!');

    let offset;
    const this_ = this;
    const idx = ++this.counter;
    const emitter = new TinyEmitter();
    const node = utils.evaluate(element);
    utils.assert(utils.isElement(node),
        `Couldn't evaluate (${element}) to a valid DOM node`);

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
  }

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to bottom
   */
  windowAtBottom(offset = 0) {
    const scrolled = Base.Internal.lastXY[1];
    const viewHeight = Base.Internal.viewport.h;
    offset = parseInt(offset, 10);
    return scrolled + viewHeight >= utils.getDocumentHeight() - offset;
  }

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to top
   */
  windowAtTop(offset = 0) {
    const scrolled = Base.Internal.lastXY[1];
    offset = parseInt(offset, 10);
    return scrolled <= offset;
  }
}
