const ScrollWatcher = require('../../dist/scroll-watcher');

const event = {
  name: 'foo',
  count: 2,
  data: { value: 99 }
};

module.exports = {
  event,
  emitAndListen: (total) => {
    return myPromise(2000, (resolve, reject) => {
      const watcher = new ScrollWatcher();
      let count = 0;
      watcher.on(event.name, () => {
        console.log(watcher);
        count++;
        if (count === total) resolve(count);
      });
      for (let i = 1; i <= total; i++) {
        watcher.emit(event.name, event.data);
      }
    });
  }
};

// http://stackoverflow.com/a/32461436/4640499
function myPromise(ms, callback) {
  return new Promise((resolve, reject) => {
    // Set up the real work
    callback(resolve, reject);
    // Set up the timeout
    setTimeout(() => reject('Promise timed out after ' + ms + ' ms'), ms);
  });
}
