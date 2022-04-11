const watcher = new ScrollWatcher();
const enter = ['enter', 'fully-enter'];
const exit = ['exit', 'partial-exit'];
const all = [...enter, ...exit];

const $ = (id) => document.getElementById(id);

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

let firstChild;

Array.prototype.forEach.call(document.querySelectorAll('.move'), (each) => {
    watcher
        .watch(each)
        .on('enter', (event_) => {
            firstChild = event_.target.firstElementChild;
            firstChild.lastElementChild.textContent = 'entered';
            event_.target.classList.remove(...all);
            event_.target.classList.add('enter');
            setCssClass(event_.target, 'enter');
        })
        .on('exit', (event_) => {
            event_.target.classList.remove(...all);
            event_.target.classList.add('exit');
            setCssClass(event_.target, 'exit');
        })
        .on('enter:full', (event_) => {
            firstChild = event_.target.firstElementChild;
            firstChild.lastElementChild.textContent = 'fully entered';
            event_.target.classList.remove(...all);
            event_.target.classList.add('fully-enter');
            setCssClass(event_.target, 'fully-enter');
        })
        .on('exit:partial', (event_) => {
            firstChild = event_.target.firstElementChild;
            firstChild.lastElementChild.textContent = 'partial exited';
            event_.target.classList.remove(...all);
            event_.target.classList.add('partial-exit');
            setCssClass(event_.target, 'partial-exit');
        });
});
