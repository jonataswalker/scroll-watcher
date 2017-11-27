var watcher = new ScrollWatcher();
var targets = document.getElementsByClassName('move');
var firstChild;

[].forEach.call(targets, function (each) {
  var rect = watcher.watch(each)
    .on('enter', function (evt) {
      firstChild = evt.target.firstElementChild;
      evt.target.classList.add('enter');
      evt.target.classList.remove('partial-exit');
      firstChild.lastElementChild.textContent = 'entered';
    })
    .on('exit', function (evt) {

    })
    .on('enter:full', function (evt) {
      firstChild = evt.target.firstElementChild;
      evt.target.classList.add('fully-enter');
      firstChild.lastElementChild.textContent = 'fully entered';
    })
    .on('exit:partial', function (evt) {
      firstChild = evt.target.firstElementChild;
      evt.target.classList.add('partial-exit');
      evt.target.classList.remove('fully-enter');
      firstChild.lastElementChild.textContent = 'partial exited';
    });

  interact(each)
    .draggable({
      inertia: true,
      onmove: function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      onend: function (event) {
        rect.target.firstElementChild.lastElementChild.textContent = '';
        rect.target.classList.remove('enter', 'fully-enter', 'partial-exit');
        rect.update();
      }
    });
});
