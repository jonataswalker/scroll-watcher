smoothScroll.init({
  selectorHeader: '[data-scroll-header]'
});

var watcher = new ScrollWatcher();
var watching_els = document.querySelectorAll('#about, #portfolio, #contact');
var menu = {
  about: document.getElementById('li-about'),
  portfolio: document.getElementById('li-portfolio'),
  contact: document.getElementById('li-contact')
};
var lastActive = menu.about;

[].forEach.call(watching_els, function (each) {
  watcher.watch(each, { top: 50, bottom: 0 })
    .on('enter', function (evt) {
      // console.info('entered', evt.target.id);

      if (evt.scrollingDown) {
        lastActive.classList.remove('active');
        menu[evt.target.id].classList.add('active');

        lastActive = menu[evt.target.id];
      }
    })
    .on('exit', function (evt) {
      // console.info('exited', evt.target.id);
    })
    .on('exit:partial', function (evt) {
      // console.info('partial exited', evt.target.id);
    })
    .on('enter:full', function (evt) {
      // console.info('full entered', evt.target.id);

      if (evt.scrollingUp) {
        lastActive.classList.remove('active');
        menu[evt.target.id].classList.add('active');

        lastActive = menu[evt.target.id];
      }
    });
});


