import TinyEmitter from 'tiny-emitter';
import Internal from './internal';
import { assert, mergeOptions } from './helpers/mix';
import { resetProps, resetPartialProps, getProps } from './helpers/props';
import { isElement, evaluate, offset, getDocumentHeight } from './helpers/dom';
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
    const emitter = new TinyEmitter();
    const node = evaluate(element);

    assert(
      isElement(node),
      `Couldn't evaluate (${element}) to a valid DOM node`
    );

    offsetOpt =
      typeof opt_offset === 'number'
        ? { top: opt_offset, bottom: opt_offset }
        : mergeOptions(DEFAULT_OFFSET, opt_offset);

    Base.Internal.watching[idx] = {
      node,
      emitter,
      offset: offsetOpt,
      dimensions: offset(node),
    };

    resetProps(Base.Internal.watching[idx]);

    return {
      target: node,
      props: getProps(Base.Internal.watching[idx]),
      update: function() {
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
      once: function(eventName, callback) {
        emitter.once(eventName, callback, this);
        return this;
      },
      on: function(eventName, callback) {
        emitter.on(eventName, callback, this);
        return this;
      },
      off: function(eventName, callback) {
        emitter.off(eventName, callback, this);
        return this;
      },
    };
  }

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to bottom
   */
  windowAtBottom(_offset_ = 0) {
    const scrolled = Base.Internal.lastXY[1];
    const viewHeight = Base.Internal.viewport.h;
    _offset_ = parseInt(_offset_, 10);
    return scrolled + viewHeight >= getDocumentHeight() - _offset_;
  }

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to top
   */
  windowAtTop(_offset_ = 0) {
    const scrolled = Base.Internal.lastXY[1];
    _offset_ = parseInt(_offset_, 10);
    return scrolled <= _offset_;
  }
}
