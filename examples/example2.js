/* global smoothScroll, ScrollWatcher */
const watcher = new ScrollWatcher();
const watchingElements = document.querySelectorAll('#about, #portfolio, #contact');
const menu = {
    about: document.getElementById('li-about'),
    portfolio: document.getElementById('li-portfolio'),
    contact: document.getElementById('li-contact'),
};

let lastActive = menu.about;

smoothScroll.init({
    selectorHeader: '[data-scroll-header]',
});

watcher.on('scrolling', (evt) => {
    // console.log('scrolling', evt);
});

watcher.on('page:load', (evt) => {
    window.setTimeout(() => {
        if (watcher.windowAtBottom()) window.scrollBy(0, -1);
        else window.scrollBy(0, 1);
    }, 30);
});

Array.prototype.forEach.call(watchingElements, (each) => {
    watcher
        .watch(each, { top: 100, bottom: 0 })
        .on('enter', (evt) => {
            if (evt.scrollingDown) {
                lastActive.classList.remove('active');
                menu[evt.target.id].classList.add('active');
                lastActive = menu[evt.target.id];
            }
        })
        .on('exit', (evt) => {
            // console.info('exited', evt.target.id);
        })
        .on('exit:partial', (evt) => {
            // console.info('partial exited', evt.target.id);
        })
        .on('enter:full', (evt) => {
            // console.info('full entered', evt.target.id);
            if (evt.scrollingUp) {
                lastActive.classList.remove('active');
                menu[evt.target.id].classList.add('active');
                lastActive = menu[evt.target.id];
            }
        });
});
