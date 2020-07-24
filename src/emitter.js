/**
 * Based on https://github.com/developit/mitt
 */

export default function (all = new Map()) {
  return {
    all,

    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     */
    on(type, handler) {
      const handlers = all.get(type);
      const added = handlers && handlers.push(handler);

      if (!added) {
        all.set(type, [handler]);
      }
    },

    /**
     * Remove an event handler for the given type.
     * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
     * @param {Function} handler Handler function to remove
     */
    off(type, handler) {
      const handlers = all.get(type);

      if (handlers) {
        handlers.splice(handlers.indexOf(handler), 1);
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
     */
    emit(type, evt) {
      (all.get(type) || []).slice().map((handler) => handler(evt));
      (all.get('*') || []).slice().map((handler) => handler(type, evt));
    },
  };
}
