# bubb

non-dependent, non-fancy javascripted _infotip_.

[![dependencies Status](https://david-dm.org/frdnrdb/bubb/status.svg)](https://david-dm.org/frdnrdb/bubb)
[![npm version](https://badge.fury.io/js/bubb.svg)](https://badge.fury.io/js/bubb)

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

callback: function(){} || true
  // overrides initial (or global) callback.
  // boolean true adds click listener and reports to default callback

transitionOff: false
  // default

interactive: false
  // default true for menus and added callbacks

hoverCallback: false
  // default

delay: false
  // true yields .5s reveal delay
  // configurable via bubb.scss

background: '#444'
  // default

color: '#fff'
  // default

class: false
  // add classname to .bubb

anchor: false
  // 'left' or 'right' if centered tip is boring

maximize: false
  // true calculates and applies maximal bubb width

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
