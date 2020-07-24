/* global interact, ScrollWatcher */
/* eslint-disable import/unambiguous */
const watcher = new ScrollWatcher();
const targets = document.getElementsByClassName('move');

let firstChild;

[].forEach.call(targets, function (each) {
  const rect = watcher
    .watch(each)
    .on('enter', function (evt) {
      firstChild = evt.target.firstElementChild;
      evt.target.classList.add('enter');
      evt.target.classList.remove('partial-exit');
      firstChild.lastElementChild.textContent = 'entered';
    })
    .on('exit', function (evt) {})
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

  interact(each).draggable({
    inertia: true,

    onmove(event) {
      const target = event.target;
      const x = (Number.parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (Number.parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.dataset.x = x;
      target.dataset.y = y;
    },

    onend(event) {
      rect.target.firstElementChild.lastElementChild.textContent = '';
      rect.target.classList.remove('enter', 'fully-enter', 'partial-exit');
      rect.update();
    },
  });
});
