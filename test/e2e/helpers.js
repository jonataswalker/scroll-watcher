import { ClientFunction, Selector } from 'testcafe';

const rect1 = Selector('#rect1');

export function drag(top) {
  return ClientFunction(() => {
    return new Promise(resolve => {
      const btn = document.getElementById('btn-update');
      rect1().style.top = `${top}px`;
      btn.click();
      window.setTimeout(resolve, 200);
    });
  }, { dependencies: { top, rect1 } });
}

export function scroll(total) {
  return ClientFunction(() => {
    return new Promise(resolve => {
      window.scrollBy(0, total);
      window.setTimeout(resolve, 300);
    });
  }, { dependencies: { total } });
}

export const getViewport = ClientFunction(() => ({
  w: window.innerWidth, h: window.innerHeight
}));

export const waitForWatcherEvent = ClientFunction(() => {
  return new Promise(resolve => {
    const input = document.getElementById('actual-class');
    const intervalID = window.setInterval(() => {
      const value = input.value;
      if (value) {
        input.value = '';
        clearInterval(intervalID);
        resolve(value);
      }
    }, 10);
  });
});

export function waitForRectEvent(id) {
  return ClientFunction(() => {
    return new Promise(resolve => {
      const input = document.getElementById(id);
      const intervalID = window.setInterval(() => {
        const value = input.value;
        if (value) {
          clearInterval(intervalID);
          resolve(input.value);
        }
      }, 20);
    });
  }, { dependencies: { id } });
}

export const clearAllClasses = ClientFunction(() => {
  return new Promise(resolve => {
    [
      'actual-class1',
      'actual-class2',
      'actual-class3',
      'actual-class4',
      'actual-class5',
      'actual-class6',
    ].forEach(id => { document.getElementById(id).value = '' });
    resolve();
  });
});

