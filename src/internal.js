import utils from './utils';
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
    this.viewport = utils.getViewportSize();
    this.loopBound = this.loop.bind(this);
    this.loopBound();
  }

  loop() {
    if (this.lastXY.join() === utils.getScroll().join()) {
      // Avoid calculations if not needed
      utils.raf.call(window, this.loopBound);
      return false;
    } else {
      let xy = utils.getScroll();
      let scrolling_down = xy[1] > this.lastXY[1];
      this.lastXY = xy;
      let evt_data = {
        scrollX: this.lastXY[0],
        scrollY: this.lastXY[1],
        scrollingDown: scrolling_down,
        scrollingUp: !scrolling_down
      };
      this.Base.emit(EVENT_TYPE.SCROLLING, evt_data);

      Object.keys(this.watching).forEach((k) => {
        let item = this.watching[k];
        this.recalculate(item);
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
  }

  recalculate(item) {
    const node = {
      top: item.dimensions.top + item.offset.top,
      bottom: item.dimensions.top + item.offset.bottom + item.dimensions.height
    };
    const viewport = {
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
  }
}
