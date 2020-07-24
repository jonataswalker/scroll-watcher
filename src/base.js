import {
  assert,
  resetProperties,
  resetPartialProperties,
  getProperties,
  fireEvents,
} from './helpers/mix.js';
import {
  isElement,
  getOffset,
  getDocumentHeight,
  getScroll,
  getViewportSize,
} from './helpers/dom.js';
import { DEFAULT_OFFSET, EVENT_TYPE } from './constants.js';
import Mitt from './emitter.js';

export default function () {
  const watcher = {
    counter: 0,
    requestAnimationId: null,
    lastXY: [],
    watching: {},
    viewport: getViewportSize(),
    props: null,
  };

  const emitter = new Mitt();

  function initialize() {
    handleAnimationFrame();

    const onReadyState = () => {
      if (typeof document !== 'undefined') {
        switch (document.readyState) {
          case 'loading':
          case 'interactive':
            break;
          case 'complete':
            emitter.emit(EVENT_TYPE.PAGELOAD, {
              scrollX: watcher.lastXY[0],
              scrollY: watcher.lastXY[1],
            });
            document.removeEventListener('readystatechange', onReadyState);

            break;

          default:
        }
      }
    };

    document.addEventListener('readystatechange', onReadyState, false);
    window.addEventListener(
      'resize',
      () => {
        watcher.viewport = getViewportSize();
      },
      false
    );
  }

  function watch(element, initOffset) {
    const node = isElement(element) ? element : document.querySelector(element);

    assert(isElement(node), "Couldn't find target in DOM");
    assert(
      typeof initOffset === 'number' ||
        typeof initOffset === 'object' ||
        typeof initOffset === 'undefined',
      '@param `initOffset` should be number or Object or undefined!'
    );

    const optionsOffset =
      typeof initOffset === 'number'
        ? { top: initOffset, bottom: initOffset }
        : Object.assign(DEFAULT_OFFSET, initOffset);

    const watchingEmitter = new Mitt();
    const watching = {
      node,
      offset: optionsOffset,
      dimensions: getOffset(node),
      emitter: watchingEmitter,
    };

    watcher.counter += 1;
    watcher.watching[watcher.counter] = watching;
    resetProperties(watching);

    return {
      target: node,
      props: getProperties(watching),

      update() {
        const data = getScrollData();

        data.target = watching.node;
        window.cancelAnimationFrame(watcher.requestAnimationId);
        resetPartialProperties(watching);

        watching.dimensions = getOffset(node);
        recalculate(watching);

        watcher.props = getProperties(watching);
        fireEvents(watching, data);
        handleAnimationFrame();

        return this;
      },

      once(eventName, callback) {
        const wrappedHandler = (evt) => {
          callback(evt);
          watchingEmitter.off(eventName, wrappedHandler);
        };

        watchingEmitter.on(eventName, wrappedHandler);

        return this;
      },

      on(eventName, callback) {
        watchingEmitter.on(eventName, callback, this);

        return this;
      },

      off(eventName, callback) {
        watchingEmitter.off(eventName, callback, this);

        return this;
      },
    };
  }

  function getScrollData() {
    const xy = getScroll();
    const scrollingDown = xy[1] > watcher.lastXY[1];

    watcher.lastXY = xy;

    return {
      scrollX: xy[0],
      scrollY: xy[1],
      scrollingDown,
      scrollingUp: !scrollingDown,
    };
  }

  function recalculate(item) {
    const el = {
      top: item.dimensions.top + item.offset.top,
      bottom: item.dimensions.top + item.offset.bottom + item.dimensions.height,
    };

    const vp = {
      top: watcher.lastXY[1],
      bottom: watcher.lastXY[1] + watcher.viewport.h,
    };

    item.isAboveViewport = el.top < vp.top;
    item.isBelowViewport = el.bottom > vp.bottom;
    item.isInViewport = el.top <= vp.bottom && el.bottom > vp.top;
    item.isFullyInViewport =
      (el.top >= vp.top && el.bottom <= vp.bottom) ||
      (item.isAboveViewport && item.isBelowViewport);
    item.isFullyOut = !item.isInViewport && item.wasInViewport;
    item.isPartialOut = item.wasFullyInViewport && !item.isFullyInViewport && !item.isFullyOut;
  }

  function handleAnimationFrame() {
    let requestId;

    const tick = () => {
      const changed = watcher.lastXY.join() !== getScroll().join();

      if (changed) {
        const evtData = getScrollData();

        emitter.emit(EVENT_TYPE.SCROLLING, evtData);

        Object.keys(watcher.watching).forEach((key) => {
          evtData.target = watcher.watching[key].node;
          recalculate(watcher.watching[key]);
          fireEvents(watcher.watching[key], evtData);
        });
      }

      requestId = window.requestAnimationFrame(tick);
    };

    requestId = window.requestAnimationFrame(tick);

    return requestId;
  }

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to bottom
   */
  function windowAtBottom(offset = 0) {
    const scrolled = watcher.lastXY[1];
    const viewHeight = watcher.viewport.h;

    // eslint-disable-next-line no-param-reassign
    offset = Number.parseInt(offset, 10);

    return scrolled + viewHeight >= getDocumentHeight() - offset;
  }

  /**
   * @param {Number|undefined} offset How far to offset.
   * @return {Boolean} Whether window is scrolled to top
   */
  function windowAtTop(offset = 0) {
    // eslint-disable-next-line no-param-reassign
    offset = Number.parseInt(offset, 10);

    return watcher.lastXY[1] <= offset;
  }

  return { initialize, watch, emitter, windowAtBottom, windowAtTop };
}
