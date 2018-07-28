const watcher = new ScrollWatcher();
const enter = ['enter', 'fully-enter'];
const exit = ['exit', 'partial-exit'];
const all = enter.concat(exit);

let firstChild;

[].forEach.call(document.getElementsByClassName('move'), each => {
  watcher
    .watch(each)
    .on('enter', function (evt) {
      firstChild = evt.target.firstElementChild;
      firstChild.lastElementChild.textContent = 'entered';
      evt.target.classList.remove(...all);
      evt.target.classList.add('enter');
      setCssClass(evt.target, 'enter');
    })
    .on('exit', function (evt) {
      evt.target.classList.remove(...all);
      evt.target.classList.add('exit');
      setCssClass(evt.target, 'exit');
    })
    .on('enter:full', function (evt) {
      firstChild = evt.target.firstElementChild;
      firstChild.lastElementChild.textContent = 'fully entered';
      evt.target.classList.remove(...all);
      evt.target.classList.add('fully-enter');
      setCssClass(evt.target, 'fully-enter');
    })
    .on('exit:partial', function (evt) {
      firstChild = evt.target.firstElementChild;
      firstChild.lastElementChild.textContent = 'partial exited';
      evt.target.classList.remove(...all);
      evt.target.classList.add('partial-exit');
      setCssClass(evt.target, 'partial-exit');
    });
});

function setCssClass(target, klass) {
  switch (target) {
    case $('rect1'):
      $('actual-class1').value = klass;
      break;
    case $('rect2'):
      $('actual-class2').value = klass;
      break;
    case $('rect3'):
      $('actual-class3').value = klass;
      break;
    case $('rect4'):
      $('actual-class4').value = klass;
      break;
    case $('rect5'):
      $('actual-class5').value = klass;
      break;
    case $('rect6'):
      $('actual-class6').value = klass;
      break;
    default:
  }
}

function $(id) {
  return document.getElementById(id);
}
