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
      this.lastXY = utils.getScroll();
      this.Base.emit(EVENT_TYPE.SCROLLING, {
        scrollX: this.lastXY[0],
        scrollY: this.lastXY[1]
      });

      Object.keys(this.watching).forEach((k) => {
        let item = this.watching[k];
        let in_ = utils.isInside({
          scroll: this.lastXY,
          viewport: this.viewport,
          node: item.dimensions,
          full: false,
          offset: item.offset
        });
        let full = utils.isInside({
          scroll: this.lastXY,
          viewport: this.viewport,
          node: item.dimensions,
          full: true,
          offset: item.offset
        });

        if (in_ && !item.entered) {
          item.entered = true;
          item.exited = false;
          item.emitter.emit(EVENT_TYPE.ENTER);
        } else if (!in_ && item.entered && !item.exited) {
          item.exited = true;
          item.entered = false;
          item.emitter.emit(EVENT_TYPE.EXIT);
        }

        if (full && !item.full_entered) {
          item.full_entered = true;
          item.exited_partial = false;
          item.emitter.emit(EVENT_TYPE.FULL_ENTER);
        } else if (!full && item.full_entered && !item.exited_partial) {
          item.exited_partial = true;
          item.full_entered = false;
          item.emitter.emit(EVENT_TYPE.EXIT_PARTIAL);
        }
      });
    }
    utils.raf.call(window, this.loopBound);
  }
}
