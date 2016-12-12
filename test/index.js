const pkg = require('../package.json');
const test = require('tape');
const jsdom = require('jsdom');
const ScrollWatcher = require('../' + pkg.build.dest);
const doc = jsdom.jsdom();
const body = doc.body;
const window = doc.defaultView;
global.window = window;
global.document = doc;

const event = {
  name: 'foo',
  count: 2,
  data: { value: 99 }
};

test('#on listener', assert => {
  emitAndListen(event.count)
    .then(res => {
      assert.equal(res, event.count);
      assert.end();
    })
    .catch(err => console.log(err));
});

test('#once listener', assert => {
  const watcher = new ScrollWatcher();
  watcher.once(event.name, () => {
    assert.notOk(watcher.e[event.name], 'removed event from list');
    assert.end();
  });
  watcher.emit(event.name, event.data);
});

test.onFinish(() => process.exit(0));

function emitAndListen(total) {
  return myPromise(2000, (resolve, reject) => {
    const watcher = new ScrollWatcher();
    let count = 0;
    watcher.on(event.name, () => {
      count++;
      if (count === total) {
        resolve(count);
      }
    });
    for (let i = 1; i <= total; i++) {
      watcher.emit(event.name, event.data);
    }
  });
}

// http://stackoverflow.com/a/32461436/4640499
function myPromise(ms, callback) {
  return new Promise((resolve, reject) => {
      // Set up the real work
    callback(resolve, reject);
      // Set up the timeout
    setTimeout(() => reject('Promise timed out after ' + ms + ' ms'), ms);
  });
}
