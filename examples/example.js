/*hljs.configure({
  tabReplace: '  ',
})
hljs.initHighlightingOnLoad();*/

var watcher = new ScrollWatcher();

watcher.on('scrolling', function(evt) {
//   console.info(evt);

});

[].forEach.call(document.getElementsByClassName('move'), function (each) {

  var rect = watcher.watch(each)
    .on('enter', function (evt) {
      evt.target.classList.add('enter');
      evt.target.classList.remove('partial-exit');
      evt.target.firstElementChild.lastElementChild.textContent = 'entered';
    })
    .on('enter:full', function (evt) {
      evt.target.classList.add('fully-enter');
      evt.target.firstElementChild.lastElementChild.textContent =
        'fully entered';
    })
    .on('exit:partial', function (evt) {
      evt.target.classList.add('partial-exit');
      evt.target.classList.remove('fully-enter');
      evt.target.firstElementChild.lastElementChild.textContent =
        'partial exited';
    });


  interact(each)
    .draggable({
      inertia: true,
      onmove: function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      onend: function (event) {
        rect.target.classList.remove('enter', 'fully-enter', 'partial-exit');
        rect.update();
      }
    });
});

