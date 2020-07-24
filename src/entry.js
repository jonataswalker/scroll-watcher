import base from './base.js';

export default function () {
  const { initialize, watch, windowAtBottom, windowAtTop, emitter } = base();

  initialize();

  return { watch, on: emitter.on, emit: emitter.emit, windowAtBottom, windowAtTop };
}
