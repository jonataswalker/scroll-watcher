# scroll-watcher

<p align="center">
  <a href="https://travis-ci.org/jonataswalker/scroll-watcher">
    <img src="https://travis-ci.org/jonataswalker/scroll-watcher.svg?branch=master" alt="build status">
  </a>
  <a href="https://www.npmjs.com/package/scroll-watcher">
    <img src="https://img.shields.io/npm/v/scroll-watcher.svg"
      alt="npm version">
  </a>
  <a href="https://github.com/jonataswalker/scroll-watcher/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/scroll-watcher.svg"
      alt="license">
  </a>
  <a href="https://david-dm.org/jonataswalker/scroll-watcher">
    <img src="https://david-dm.org/jonataswalker/scroll-watcher/status.svg"
      alt="dependency status">
  </a>
  <a href="https://david-dm.org/jonataswalker/scroll-watcher">
    <img src="https://david-dm.org/jonataswalker/scroll-watcher/dev-status.svg" alt="devDependency status">
  </a>
</p>

A lightweight, blazing fast, [rAF](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) based, scroll watcher.

A more up-to-date approach to this **_scrolling watchers_** stuff. Slightly inspired by [scrollMonitor](https://github.com/stutrek/scrollMonitor).

### Demos

&#8594; [Scrolling, Moving and Recalculating](https://jonataswalker.github.io/scroll-watcher/examples/example.html)

&#8594; [Static Website Menu](https://jonataswalker.github.io/scroll-watcher/examples/example2.html)

## How to use it?

##### &#8594; CDN Hosted - [jsDelivr](http://www.jsdelivr.com/projects/scroll-watcher)

```HTML
<script src="https://cdn.jsdelivr.net/npm/scroll-watcher@latest/dist/scroll-watcher.min.js"></script>
```

##### &#8594; Self hosted

Download [latest release](https://github.com/jonataswalker/scroll-watcher/releases/latest).

##### &#8594; [NPM](https://www.npmjs.com/package/scroll-watcher)

```shell
npm install scroll-watcher
```

##### Instantiate and watch for a specific (or a list) DOM element

```javascript
var scroll = new ScrollWatcher();
scroll
  .watch("my-element")
  .on("enter", function(evt) {
    console.log("I'm partially inside viewport");
  })
  .on("enter:full", function(evt) {
    console.log("I'm entirely within the viewport");
  })
  .on("exit:partial", function(evt) {
    console.log("I'm partially out of viewport");
  })
  .on("exit", function(evt) {
    console.log("I'm out of viewport");
  });
```

##### Make some decision when page is loaded (or reloaded)

```javascript
watcher.on("page:load", function(evt) {
  // maybe trigger a scroll?
  window.setTimeout(() => window.scrollBy(0, 1), 20);
});
```

## Instance Methods

### watch(target[, offset])

- `target` - `{String|Element}` String or DOM node.
- `offset` - `{Number|Object|undefined}` (optional) Element offset.

###### Returns:

- Methods
  - `on/once/off` - common events
  - `update` - updates the location of the element in relation to the document
- Properties
  - `target` - DOM node being watched

#### windowAtBottom([offset])

- `offset` - `{Number|undefined}` (optional) How far to offset.

#### windowAtTop([offset])

- `offset` - `{Number|undefined}` (optional) How far to offset.

## Instance Events - `on/once/off`

You can simply watch for scrolling action:

```javascript
var watcher = new ScrollWatcher();
watcher.on("scrolling", function(evt) {
  console.log(evt);
});

// or just once
watcher.once("scrolling", function(evt) {
  console.log(evt);
});

// and turn it off (later)
watcher.off("scrolling");
```

## Credits

Thanks to [@scottcorgan](https://github.com/scottcorgan) for his great [tiny-emitter](https://github.com/scottcorgan/tiny-emitter).

## License

[MIT](https://github.com/jonataswalker/scroll-watcher/blob/master/LICENSE.md)
