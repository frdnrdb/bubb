(function(bubb, hljs){

"use strict";

function render_code_blocks() {

  // render <xmp> code blocks

  Array.from( document.getElementsByTagName('div') ).forEach( div => {

    let temp = document.createElement('temp');
        temp.appendChild(div.cloneNode(true));
    let pre = document.createElement('pre'),
        code = document.createElement('code');
        pre.appendChild(code);
        code.innerHTML = temp.innerHTML.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\=""/g,'');

        div.parentNode.insertBefore(pre, div.nextSibling.nextSibling);

  });

  // timeout then hide menu event info

  let eventsDisplay = document.getElementById('eventsDisplay');

  document.addEventListener('click', () => {
    clearTimeout(eventsDisplay.hideTimeout);
    eventsDisplay.hideTimeout = setTimeout(function() {
      eventsDisplay.innerHTML = '';
    }, 1500);
  });

}

function addElementsToDOM() {

    let query = arguments[0],
        pos = arguments[1];

    Array.from(arguments).slice(2).forEach( markup => {
      document.querySelector(query).insertAdjacentHTML(pos, markup + '<i></i><br>');
    });
}

function demo() {

  let config = {
        reference: 'Referenced content maintained in a <b>separate configuration object</b>',
        pj: {
          vedder: 'vocals',
          mccready: 'guitar',
          gossard: 'guitar',
          ament: 'bass'
        },
        abbruzzese: {
          text: '',
          _: {
            callback: (key, item) => {
              item.innerHTML = 'Loading...';
              setTimeout(function(){
                item.innerHTML = designQuotes[Math.floor(Math.random() * designQuotes.length)];
              }, 750);
            },
            hoverCallback: true,
            interactive: false,
            transitionOff: true
          }
        }
      };

  bubb(config, (key, item) => {

    let eventsDisplay = document.getElementById('eventsDisplay');
    eventsDisplay.innerHTML = 'clicked ' + key;
    eventsDisplay.setAttribute('color', Array.from(item.parentNode.children).indexOf(item));

    console.log('clicked ' + key);

  });

  bubb.update('pj.mccready', 'lead guitar');
  bubb.add('pj.irons', 'drums');
  bubb.update('abbruzzese', { background: '#FFDEDE', color: '#444' });

  addElementsToDOM(
    '#added',
    'beforeend',
    '<div data-bubb="added_one">Insert method 1</div>',
    '<div data-bubb="added_two">Insert method 2</div>'
  );

  config.added_one = {
    text: 'config[reference] edited before adding bubb to DOM',
    _: {
      background: '#4797B1',
      color: '#fff',
      borderRadius: '14px',
      direction: 'north',
      anchor: 'left'
    }
  };

  bubb.refresh();

  bubb.update('added_two', 'bubb.update(reference, content) called after adding bubb to DOM');
  bubb.update('added_two', {
    width: '40',
    anchor: 'left',
    fontSize: '23px',
    color: '#444',
    callback: true,
    class: 'tipcolor',
    background: 'repeating-linear-gradient(45deg, #FFDEDE, #FFDEDE 25%, #F7F3CE 25%, #F7F3CE 50%, #C5ECBE 50%, #C5ECBE 75%, #4797B1 75%, #4797B1 100%)'
  });

  document.body.insertAdjacentHTML('beforeend', '<span data-bubb="bubble_bobble" class="bubble-bobble wait"></span>');
  bubb.refresh();

  bubb.update('bubble_bobble', 'Share?');
  bubb.update('bubble_bobble', {
    direction: 'west',
    anchor: 'right',
    fontSize: '23px',
    callback: function(){
      console.log('----');
    }
  });

}

const display_methods = {

target: '#methods',
code:`// --> available methods

bubb.refresh();
  // initialize new data-bubb elements added to DOM

bubb.update(reference, content | options);

bubb.update(menu-reference, options);
bubb.update(menu-reference.menu-item, content);

bubb.add(menu-reference.menu-item, content);
bubb.remove(menu-reference.menu-item);
  // these methods adds and removes DOM elements

`};

const display_options_setup = {

target: '#options_setup',
code:`// --> options setup

let config = {
  one: {
    text: 'content',
    _: {
      // ... one options
    }
  },
  two: {
    menu_item_1: 'content',
    menu_item_2: 'content',
    _: {
      // ... two options
    }
  },
  _: {
    // ... global options
  }
}`};

const display_options = {

target: '#options',
code:`// --> available options

callback: false
  // function(){} overrides initial (or global) callback
  // boolean true adds click listener and reports to default callback

transitionOff: false
  // boolean

interactive: false
  // boolean, default true for menus and option callback

hoverCallback: false
  // boolean, trigger callback on element:hover

delay: false
  // int value, microseconds reveal delay

direction: false
  // string 'north', 'west' or 'east' (default false = 'south')

anchor: false
  // string 'left' or 'right' (default false = 'centered')

width: false
  // int value <= 100 (document width percentage)
  // or a querySelector string (eg. 'section:first-of-type')

borderRadius: '4px'
  // css string with units

fontSize: '17px'
  // css string with units

background: '#444'
  // css color string

color: '#fff'
  // css color string

class: false
  // string, className to target current bubb specifically

`};

const display_basic = {

target: '#basic',
code: `let config = {
  reference: 'Referenced content maintained in a <b>separate configuration object</b>'
};

bubb(config);`

}

const display_menu = {

target: '#menu',
code: `let config = {
  pj: {
    vedder: 'vocals',
    mccready: 'guitar',
    gossard: 'guitar',
    ament: 'bass'
};

bubb(config, (key, item) => {
  console.log('clicked ' + key);
});

bubb.update('pj.mccready', 'lead guitar');
bubb.add('pj.irons', 'drums');
// bubb.remove('pj.vedder');`

}

const display_opts = {

target: '#opts',
code: `let config = {
  abbruzzese: {
    text: '',
    _: {
      callback: function(key, item) {
        item.innerHTML = 'Loading...';
        setTimeout(function(){ // simulate async ajax
          item.innerHTML = designQuotes[Math.floor(Math.random() * designQuotes.length)];
        }, 1000);
      },
      hoverCallback: true,
      interactive: false,
      transitionOff: true
    }
  }
};

bubb(config);

bubb.update('abbruzzese', { background: '#fad', color: '#444', delay: true });`

}

const display_added = {

target: '#added',
code: `// --> refresh bubb post DOM update

addElementsToDOM(
  '<div data-bubb="added_one">Insert method 1</div>',
  '<div data-bubb="added_two">Insert method 2</div>'
); // bubb-independent demo function

config.added_one = {
  text: 'config[reference] edited before adding bubb to DOM',
  _: {
    background: '#4797B1',
    color: '#fff',
    borderRadius: '14px',
    direction: 'north',
    anchor: 'left'
  }
};

bubb.refresh();
  // finds and adds new bubbs
  // right now added_two text content will just be 'added_two'

  bubb.update('added_two', 'bubb.update(reference, content) called after adding bubb to DOM');
  bubb.update('added_two', {
    width: '40',
    anchor: 'left',
    fontSize: '23px',
    color: '#444',
    callback: true,
    class: 'tipcolor',
    background: 'repeating-linear-gradient(45deg, #FFDEDE, #FFDEDE 25%, #F7F3CE 25%, #F7F3CE 50%, #C5ECBE 50%, #C5ECBE 75%, #4797B1 75%, #4797B1 100%)'
  });`

}

const designQuotes = [
  "<p>There are no bad ideas, just bad decisions.</p>",
  "<p>It&#8217;s not in the vulgar, it&#8217;s not in the shock that one finds art. And it&#8217;s not in the excessively beautiful. It&#8217;s in between; it&#8217;s in nuance.   </p>",
  "<p>Don&#8217;t design for everyone. It&#8217;s impossible. All you end up doing is designing something that makes everyone unhappy.  </p>",
  "<p>Designers deal in ideas. They give shape to ideas that shape our world, enrich everyday experiences, and improve our lives. Where there’s confusion, designers fashion clarity; where there’s chaos, designers construct order; where there’s entropy, designers promote vitality; where there’s indifference, designers swell passion; where there’s mediocrity, designers imbue excellence; and where there’s silence, designers lend voice. </p>",
  "<p>Stop downloading. Start uploading </p>",
  "<p>Good design is partially creativity and innovation, but primarily knowledge and awareness.</p>",
  "<p>Web design is responsive design. Responsive web design is web design, done right.</p>",
  "<p>As long as there are people, there will be user experience, and user interface designers.</p>",
  "<p>Well established hierarchies are not easily uprooted</p>",
  "<p>Everything is possible, that&#8217;s what science is all about. No, that&#8217;s what&#8217;s being a Magical Elf is all about.  </p>",
  "<p>The designer is not always right. The researcher is not always wrong. Profit is not always the motive; market research, whatever its outcome, should never be used as a good excuse for bad design &#8211; in the same sense that good design should never be used to promote a bad product.</p>",
  "<p>You get up early in the morning and you work all day. That’s the only secret.</p>",
  "<p>[Designers&#8217;] primary competence lies not in the technicalities of a craft but in the mastery of a process.</p>",
  "<p>You have to finish things — that’s what you learn from, you learn by finishing things.</p>",
  "<p>A person tends to critique a design in one of several ways. The most common, and usually least valuable, is by gut reaction.  </p>",
  "<p>You do a disservice to your clients when you <strong>don&#8217;t</strong> fire the bad ones because you eventually provide poor service to those you don&#8217;t want to serve.  </p>",
  "<p>Think more, design less.</p>",
  "<p>Design is how you treat your customers. If you treat them well from an environmental, emotional, and aesthetic standpoint, you&#8217;re probably doing good design.  </p>",
  "<p>Take a walk. Dance a jig. Get some sun. Don&#8217;t take yourself to serious. Cook something ethnic. Play the 3 chords you know on guitar. Go get coffee. Tell a bad joke, to yourself, and laugh. Look at the way a leaf is made. Overhear someone else&#8217;s conversation. Write it down. Remember it later. Get some sleep.  </p>",
  "<p>Innovation is seldom hindered by platform.</p>"
];

function render_display_functions() {

  // display bubb js demo code

  function buildCodeBlock(from) {

    let pre = document.createElement('pre'),
        code = document.createElement('code');
        pre.appendChild(code);
        code.innerHTML = from.toString().replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\/\*\*\/[\s\S]*\/\*\*\//igm,'');

    return pre;

  }

  [display_basic, display_menu, display_opts, display_added, display_methods, display_options, display_options_setup].forEach( obj => {
      let block = buildCodeBlock(obj.code);
      document.querySelector(obj.target).appendChild(block);
  });

  // colorful code

  hljs.initHighlightingOnLoad();
  document.body.classList.add('done');

}

render_code_blocks();
demo();
render_display_functions();

})(window.bubb, window.hljs);
