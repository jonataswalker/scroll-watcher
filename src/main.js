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
      node            : node,
      emitter         : emitter,
      offset          : offset,
      entered         : false,
      full_entered    : false,
      exited          : false,
      exited_partial  : false,
      dimensions      : utils.offset(node)
    };

    return {
      target: node,
      update: function () {
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
  }
}
