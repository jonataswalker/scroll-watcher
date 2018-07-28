import { Selector } from 'testcafe';
import { dragClasses, dragPosition, dragSize } from './constants';
import { drag, waitForWatcherEvent, getViewport } from './helpers';

const rect1 = Selector('#rect1');

fixture`Dragging`.page`./pages/drag.html`;

test('Out of Viewport', async t => {
  const viewport = await getViewport();
  const outOfViewport = viewport.h + dragPosition.top + dragSize.h;

  await drag(outOfViewport)();
  await t
    .expect(waitForWatcherEvent())
    .eql(dragClasses.exit)
    .expect(rect1.hasClass(dragClasses.exit))
    .ok()
    .expect(rect1.hasClass(dragClasses.partialExit))
    .notOk()
    .expect(rect1.hasClass(dragClasses.enter))
    .notOk()
    .expect(rect1.hasClass(dragClasses.fullyEnter))
    .notOk();
});

test('Fully enter in Viewport', async t => {
  await drag(100)();
  await t
    .expect(waitForWatcherEvent())
    .eql(dragClasses.fullyEnter)
    .expect(rect1.hasClass(dragClasses.fullyEnter))
    .ok()
    .expect(rect1.hasClass(dragClasses.partialExit))
    .notOk()
    .expect(rect1.hasClass(dragClasses.exit))
    .notOk();
});

test('Partial exit', async t => {
  const viewport = await getViewport();
  const partialExit = viewport.h - dragSize.h / 2;

  await drag(partialExit)();
  await t
    .expect(waitForWatcherEvent())
    .eql(dragClasses.partialExit)
    .expect(rect1.hasClass(dragClasses.partialExit))
    .ok()
    .expect(rect1.hasClass(dragClasses.exit))
    .notOk()
    .expect(rect1.hasClass(dragClasses.fullyEnter))
    .notOk();
});

test('Partial enter in Viewport', async t => {
  const viewport = await getViewport();
  const outOfViewport = viewport.h + dragPosition.top + dragSize.h;
  const partialEnter = viewport.h - dragSize.h / 2;

  await drag(outOfViewport)();
  await drag(partialEnter)();
  await t
    .expect(waitForWatcherEvent())
    .eql(dragClasses.enter)
    .expect(rect1.hasClass(dragClasses.enter))
    .ok()
    .expect(rect1.hasClass(dragClasses.exit))
    .notOk()
    .expect(rect1.hasClass(dragClasses.fullyEnter))
    .notOk();
});
