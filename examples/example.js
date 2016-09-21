hljs.configure({
  tabReplace: '  ',
})
hljs.initHighlightingOnLoad();

var watcher = new ScrollWatcher();

watcher.on('scrolling', function(evt) {
//   console.info(evt);

});


watcher.watch('code', 100)
  .on('enter', function (evt) {
    console.info('entered');
  })
  .on('enter:full', function (evt) {
    console.info('fully entered');
  })
  .on('exit:partial', function (evt) {
    console.info('partial exit');
  })
  .on('exit', function () {
    console.info('exited');
  });
