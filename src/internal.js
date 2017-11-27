import { getScroll, getViewportSize } from './helpers/dom';
import raf from 'raf';
import { EVENT_TYPE } from './constants';

/**
 * Internal class.
 * @class Internal
 */
export default class Internal {

  constructor(base) {
    this.Base = base;
    this.lastXY = [];
    this.watching = {};
    this.viewport = getViewportSize();
    this.loopBound = this.loop.bind(this);
    this.runLoop();
    this.setListeners();
    this.rafId = null;
  }

  loop() {
    if (this.lastXY.join() === getScroll().join()) {
      // Avoid calculations if not needed
      this.runLoop();
      return;
    } else {
      this.handleItems();
      this.runLoop();
    }
  }

  handleItems() {
    const evtData = this.getScrollData();
    this.Base.emit(EVENT_TYPE.SCROLLING, evtData);

    Object.keys(this.watching).forEach((k) => {
      evtData.target = this.watching[k].node;
      this.recalculate(this.watching[k]);
      this.fireEvents(this.watching[k], evtData);
    });
  }

  fireEvents(item, data) {
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
  }

  getScrollData() {
    const xy = getScroll();
    const scrollingDown = xy[1] > this.lastXY[1];
    this.lastXY = xy;
    return {
      scrollX: xy[0],
      scrollY: xy[1],
      scrollingDown: scrollingDown,
      scrollingUp: !scrollingDown
    };
  }

  stopLoop() {
    raf.cancel(this.rafId);
  }

  runLoop() {
    this.rafId = raf(this.loopBound);
  }

  recalculate(item) {
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
  }

  setListeners() {
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
  }
}
