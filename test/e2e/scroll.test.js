import { scroll, waitForRectEvent, clearAllClasses } from './helpers.js';
import { dragClasses, dragPosition, dragSize, betweenRect } from './constants.js';

// eslint-disable-next-line no-unused-expressions
fixture`Scrolling`.page`./pages/scroll.html`;

let amountScrolled = dragPosition.top + dragSize.h / 2;
let actualClass;

test('#rect1', async (t) => {
    await clearAllClasses();
    await scroll(amountScrolled)();

    actualClass = await waitForRectEvent('actual-class1')();
    await t.expect(actualClass).eql(dragClasses.partialExit);

    await clearAllClasses();
    await scroll(amountScrolled * -1)();

    actualClass = await waitForRectEvent('actual-class1')();
    await t.expect(actualClass).eql(dragClasses.fullyEnter);
});

test('#rect2', async (t) => {
    amountScrolled += betweenRect + dragSize.h / 4;

    await clearAllClasses();
    await scroll(amountScrolled)();

    actualClass = await waitForRectEvent('actual-class2')();
    // await t.debug();
    await t.expect(actualClass).eql(dragClasses.partialExit);

    actualClass = await waitForRectEvent('actual-class1')();
    await t.expect(actualClass).eql(dragClasses.exit);

    await clearAllClasses();
    await scroll(amountScrolled * -1)();

    actualClass = await waitForRectEvent('actual-class2')();
    await t.expect(actualClass).eql(dragClasses.fullyEnter);
});
