/* global interact, ScrollWatcher */
const watcher = new ScrollWatcher();
const targets = document.getElementsByClassName('move');

let firstChild;

Array.prototype.forEach.call(targets, (each) => {
    const rect = watcher
        .watch(each)
        .on('enter', (evt) => {
            firstChild = evt.target.firstElementChild;
            evt.target.classList.add('enter');
            evt.target.classList.remove('partial-exit');
            firstChild.lastElementChild.textContent = 'entered';
        })
        .on('exit', () => {})
        .on('enter:full', (evt) => {
            firstChild = evt.target.firstElementChild;
            evt.target.classList.add('fully-enter');
            firstChild.lastElementChild.textContent = 'fully entered';
        })
        .on('exit:partial', (evt) => {
            firstChild = evt.target.firstElementChild;
            evt.target.classList.add('partial-exit');
            evt.target.classList.remove('fully-enter');
            firstChild.lastElementChild.textContent = 'partial exited';
        });

    interact(each).draggable({
        inertia: true,

        onmove(event) {
            const { target, dx, dy } = event;
            const x = (Number.parseFloat(target.dataset.x) || 0) + dx;
            const y = (Number.parseFloat(target.dataset.y) || 0) + dy;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.dataset.x = x;
            target.dataset.y = y;
        },

        onend() {
            rect.target.firstElementChild.lastElementChild.textContent = '';
            rect.target.classList.remove('enter', 'fully-enter', 'partial-exit');
            rect.update();
        },
    });
});
