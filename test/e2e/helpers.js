import { ClientFunction, Selector } from 'testcafe';

const rect1 = Selector('#rect1');

export function drag(top) {
    return ClientFunction(
        () =>
            new Promise((resolve) => {
                const button = document.querySelector('#btn-update');

                rect1().style.top = `${top}px`;
                button.click();
                window.setTimeout(resolve, 200);
            }),
        { dependencies: { top, rect1 } }
    );
}

export function scroll(total) {
    return ClientFunction(
        () =>
            new Promise((resolve) => {
                window.scrollBy(0, total);
                window.setTimeout(resolve, 300);
            }),
        { dependencies: { total } }
    );
}

export const getViewport = ClientFunction(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
}));

export const waitForWatcherEvent = ClientFunction(
    () =>
        new Promise((resolve) => {
            const input = document.querySelector('#actual-class');
            const intervalID = window.setInterval(() => {
                const { value } = input;

                if (value) {
                    input.value = '';
                    clearInterval(intervalID);
                    resolve(value);
                }
            }, 10);
        })
);

export function waitForRectEvent(id) {
    return ClientFunction(
        () =>
            new Promise((resolve) => {
                const input = document.getElementById(id);
                const intervalID = window.setInterval(() => {
                    const { value } = input;

                    if (value) {
                        clearInterval(intervalID);
                        resolve(value);
                    }
                }, 20);
            }),
        { dependencies: { id } }
    );
}

export const clearAllClasses = ClientFunction(
    () =>
        new Promise((resolve) => {
            [
                'actual-class1',
                'actual-class2',
                'actual-class3',
                'actual-class4',
                'actual-class5',
                'actual-class6',
            ].forEach((id) => {
                document.getElementById(id).value = '';
            });
            resolve();
        })
);

