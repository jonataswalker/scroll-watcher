const ScrollWatcher = require('../../dist/scroll-watcher.js');

const event = {
    name: 'foo',
    count: 2,
    data: { value: 99 },
};

// http://stackoverflow.com/a/32461436/4640499
function myPromise(ms, callback) {
    return new Promise((resolve, reject) => {
        // Set up the real work
        callback(resolve, reject);
        // Set up the timeout
        // eslint-disable-next-line prefer-promise-reject-errors
        setTimeout(() => reject(`Promise timed out after ${ms} ms`), ms);
    });
}

module.exports = {
    event,

    emitAndListen: (total) =>
        myPromise(2000, (resolve) => {
            const watcher = new ScrollWatcher();

            let count = 0;

            watcher.on(event.name, () => {
                count += 1;

                if (count === total) resolve(count);
            });

            for (let i = 1; i <= total; i += 1) {
                watcher.emit(event.name, event.data);
            }
        }),
};
