import { EVENT_TYPE } from '../constants.js';

export function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        if (typeof Error !== 'undefined') throw new Error(message);

        throw message;
    }
}

export function emptyArray(array) {
    while (array.length > 0) array.pop();
}

export function resetProperties(item) {
    item.isInViewport = false;
    item.wasInViewport = false;
    item.isAboveViewport = false;
    item.wasAboveViewport = false;
    item.isBelowViewport = false;
    item.wasBelowViewport = false;
    item.isPartialOut = false;
    item.wasPartialOut = false;
    item.isFullyOut = false;
    item.wasFullyOut = false;
    item.isFullyInViewport = false;
    item.wasFullyInViewport = false;
}

export function resetPartialProperties(item) {
    item.isInViewport = false;
    item.isAboveViewport = false;
    item.isBelowViewport = false;
    item.isPartialOut = false;
    item.isFullyOut = false;
    item.isFullyInViewport = false;
}

export function getProperties(item) {
    return {
        isInViewport: item.isInViewport,
        isFullyInViewport: item.isFullyInViewport,
        isAboveViewport: item.isAboveViewport,
        isBelowViewport: item.isBelowViewport,
        isPartialOut: item.isPartialOut,
        isFullyOut: item.isFullyOut,
    };
}

export function fireEvents(item, data) {
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
