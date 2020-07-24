const watcher = new ScrollWatcher();
const enter = ['enter', 'fully-enter'];
const exit = ['exit', 'partial-exit'];
const all = enter.concat(exit);

const rect1 = document.getElementById('rect1');
const inputClass = document.getElementById('actual-class');
const buttonUpdate = document.getElementById('btn-update');

const rect = watcher
  .watch(rect1)
  .on('enter', () => {
    rect1.classList.remove(...all);
    rect1.classList.add(enter[0]);
    inputClass.value = enter[0];
  })
  .on('exit', () => {
    rect1.classList.remove(...all);
    rect1.classList.add(exit[0]);
    inputClass.value = exit[0];
  })
  .on('enter:full', () => {
    rect1.classList.remove(...all);
    rect1.classList.add(enter[1]);
    inputClass.value = enter[1];
  })
  .on('exit:partial', () => {
    rect1.classList.remove(...all);
    rect1.classList.add(exit[1]);
    inputClass.value = exit[1];
  });

buttonUpdate.addEventListener('click', () => {
  rect.update();
});
