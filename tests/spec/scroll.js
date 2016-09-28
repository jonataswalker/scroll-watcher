/* global config, ScrollWatcher */

var event = {
  name: 'foo',
  count: 2,
  data: {
    value: 99
  }
};

casper.test.setUp(function () {
  casper.start(config.url, function () {
    casper.viewport(1024, 768);
  });
});

casper.test.tearDown(function (done) {
  casper.run(done);
});

casper.on('remote.message', function (message) {
  this.echo('###################');
  this.echo(message);
});

casper.test.begin('#on listener', 1, function (test) {
  casper.thenEvaluate(function (event__) {
    var watcher = new ScrollWatcher(),
        i = 1;
    window.listening = { count: 0 };
    watcher.on(event__.name, function (evt) {
      window.listening.value = evt.value;
      window.listening.count++;
    });

    for (; i <= event__.count; i++) {
      watcher.emit(event__.name, event__.data);
    }
  }, event);

  casper.waitFor(function () {
    return this.evaluate(function (ev) {
      return +window.listening.value === +ev.data.value &&
          +window.listening.count === +ev.count;
    }, event);
  }, function then() {
    test.pass('Ok, #on listener');
  }, function timeout() {
    test.fail('Failed #on listener');
  });

  test.done();
});

casper.test.begin('#once listener', 1, function (test) {
  casper.thenEvaluate(function (event__) {
    var watcher = new ScrollWatcher(),
        i = 1;
    window.listening = { count: 0 };
    watcher.once(event__.name, function (evt) {
      window.listening.value = evt.value;
      window.listening.count++;
    });

    for (; i <= event__.count; i++) {
      watcher.emit(event__.name, event__.data);
    }
  }, event);

  casper.waitFor(function () {
    return this.evaluate(function (ev) {
      return +window.listening.value === +ev.data.value &&
          +window.listening.count === 1;
    }, event);
  }, function then() {
    test.pass('Ok, #once listener');
  }, function timeout() {
    test.fail('Failed #once listener');
  });

  test.done();
});

casper.test.begin('#off listener', 1, function (test) {
  casper.thenEvaluate(function (event__) {
    var watcher = new ScrollWatcher(),
        i = 1;
    window.listening = { count: 0 };
    watcher.on(event__.name, function (evt) {
      window.listening.value = evt.value;
      window.listening.count++;
    });

    for (; i <= event__.count + 1; i++) {
      watcher.emit(event__.name, event__.data);
      if (i === event__.count) watcher.off(event__.name);
    }
  }, event);

  casper.waitFor(function () {
    return this.evaluate(function (ev) {
      return +window.listening.value === +ev.data.value &&
          +window.listening.count === ev.count;
    }, event);
  }, function then() {
    test.pass('Ok, #off listener');
  }, function timeout() {
    test.fail('Failed #off listener');
  });

  test.done();
});
