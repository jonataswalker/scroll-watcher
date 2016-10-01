# scroll-watcher
A lightweight, blazing fast, [rAF](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) based, scroll watcher.

A more up-to-date approach to this **_scrolling watchers_** stuff. Slightly inspired by [scrollMonitor](https://github.com/stutrek/scrollMonitor).

### Demos
&#8594; [Scrolling, Moving and Recalculating](https://jonataswalker.github.io/scroll-watcher/examples/example.html)

&#8594; [Static Website Menu](https://jonataswalker.github.io/scroll-watcher/examples/example2.html)

## How to use it?
##### &#8594; CDN Hosted - [jsDelivr](http://www.jsdelivr.com/projects/scroll-watcher)
```HTML
<script src="//cdn.jsdelivr.net/scroll-watcher/latest/scroll-watcher.min.js"></script>
```
##### &#8594; Self hosted
Download [latest release](https://github.com/jonataswalker/scroll-watcher/releases/latest).

##### &#8594; [NPM](https://www.npmjs.com/package/scroll-watcher)
```
npm install scroll-watcher
```

##### Instantiate and watch for a specific (or a list) DOM element
```javascript
var scroll = new ScrollWatcher();
scroll.watch('my-element')
  .on('enter', function (evt) {
    console.log('I'm partially inside viewport');
  })
  .on('exit', function (evt) {
    console.log('I'm out of viewport');
  })
  .on('enter:full', function (evt) {
    console.log('I'm entirely within the viewport');
  })
  .on('exit:partial', function (evt) {
    console.log('I'm partially out of viewport');
  });
```

## Events `on/once/off`
You can simply watch for scrolling action:
```javascript
var watcher = new ScrollWatcher();
watcher.on('scrolling', function(evt) {
  console.log(evt);
});

// or just once
watcher.once('scrolling', function(evt) {
  console.log(evt);
});

// and turn it off (later)
watcher.off('scrolling');
```

## Credits
Thanks to [@scottcorgan](https://github.com/scottcorgan) for his great [tiny-emitter](https://github.com/scottcorgan/tiny-emitter).


## License
[Unlicense](https://github.com/jonataswalker/scroll-watcher/blob/master/LICENSE)
