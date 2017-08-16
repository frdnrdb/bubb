# bubb

non-dependent, non-fancy javascripted _infotip_.

[![dependencies Status](https://david-dm.org/frdnrdb/bubb/status.svg)](https://david-dm.org/frdnrdb/bubb)
[![dev dependencies](https://david-dm.org/frdnrdb/bubb/dev-status.svg)](https://badge.fury.io/js/bubb)
[![npm version](https://img.shields.io/badge/stomach-empty-red.svg)](http://bubb.surge.sh)

---

#### Usage

```html

<link rel="stylesheet" href="bubb.min.css">
<script src="bubb.min.js"></script>

<this data-bubb="bubble">info</this>
<that data-bubb="bobble">menu</that>

<script>

  let config = {
    bubble: 'simple bubb with <i>html</i> or text content',
    bobble: {
      jimi: 'hendrix',
      noel: 'redding',
      mitch: 'mitchell'
    }
  }

  const callback = (key, el) => {
    console.log(key); // menu click -> eg. 'bobble.mitch'
  }

  bubb(config, callback)

</script>
```
```js

// yarn add bubb | npm i --save bubb
let bubb = require('bubb');
```
[→ See some examples](http://bubb.surge.sh)

#### Options setup

```js

let config = {
  bubble: {
    text: 'content',
    _: {
      // ... bubble options
    }
  },
  bobble: {
    menu_item_1: 'content',
    menu_item_2: 'content',
    _: {
      // ... bobble options
    }
  },
  _: {
    // ... global options
  }
}

```

#### options

```js

callback: false
  // function(){} overrides initial (or global) callback
  // boolean true adds click listener and reports to default callback

transitionOff: false
  // boolean

interactive: false
  // boolean, default true for menus and option callback

hoverCallback: false
  // boolean

delay: false
  // int value, microseconds reveal delay

anchor: false
  // string 'left' or 'right' if centered tip is boring

width: false
  // int value <= 100 (document width percentage)

fontSize: '17px'
  // css string with units

background: '#444'
  // css color string

color: '#fff'
  // css color string

class: false
  // string, add classname to bubb

```

#### Methods

```js

bubb.refresh();
  // initialize new data-bubb elements added to DOM

bubb.update(reference, content | options);

bubb.update(menu_reference, options);
bubb.update(menu_reference.menu_item, content);

bubb.add(menu_reference.menu_item, content);
bubb.remove(menu_reference.menu_item);
  // these methods adds and removes DOM elements

```


#### Style
Override the initial element __.bubb__ _(.bubb-menu)_, the bubble __.bubb > aside__ or the content __.bubb > aside > div__. Or: Modify some global variables in the __SCSS__ file to change overall look/ behaviour.

---

#### Browser Support et cetera

Missed that train. Feel free to contribute if you're on board.
