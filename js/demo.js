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

  document.addEventListener('click', e => {
    if (e.target.id === 'eventsDisplay') return;
    clearTimeout(eventsDisplay.hideTimeout);
    eventsDisplay.hideTimeout = setTimeout(function() {
      eventsDisplay.innerHTML = '';
    }, 1500);
  });

}

function addElementsToDOM() {

    Array.from(arguments).forEach( markup => {
      document.querySelector('#added').insertAdjacentHTML('beforeend', markup + '<i></i><br>');
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
        },
        "Interstellar hootchie kootchie": {
          text: '<img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTEuOTk5IDUxMS45OTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMS45OTkgNTExLjk5OTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zNzYuNzMsMjAzLjgyOFYzOS4zMzVDMzc2LjczLDE3LjY0NiwzNTkuMDg0LDAsMzM3LjM5NiwwYy0yMS42ODksMC0zOS4zMzQsMTcuNjQ2LTM5LjMzNCwzOS4zMzV2OTcuMDA1ICAgIGMtNS43MTUtMy4yNC0xMi4zMS01LjEwMS0xOS4zMzUtNS4xMDFjLTExLjY0OSwwLTIyLjEyNiw1LjA5NC0yOS4zMzUsMTMuMTY2Yy03LjIwOS04LjA3MS0xNy42ODgtMTMuMTY1LTI5LjMzNi0xMy4xNjUgICAgYy03LjAyMywwLTEzLjYxOCwxLjg1OS0xOS4zMzIsNS4wOTlWODQuMDVjMC0yMS42ODktMTcuNjQ1LTM5LjMzNS0zOS4zMzUtMzkuMzM1Yy0yMS42ODgsMC0zOS4zMzQsMTcuNjQ2LTM5LjMzNCwzOS4zMzV2MTIwLjc4OSAgICB2OTguOGMwLDM4LjA4MSwxNi40MTgsNzMuNjUxLDQzLjUyMSw5OC41ODh2OTkuNzcyYzAsNS41MjMsNC40NzcsMTAsMTAsMTBoMTM5LjkwMmM1LjUyMywwLDEwLTQuNDc3LDEwLTEwVjQxOC4wMyAgICBjMzkuOTA4LTI0LjI2MSw2NC40NjYtNjcuNTQ0LDY0LjQ2Ni0xMTQuMzkydi03MC40MzdDMzg5Ljk0NCwyMjEuNTMxLDM4NC44MjksMjExLjAzNywzNzYuNzMsMjAzLjgyOHogTTMxOC4wNjIsMzkuMzM1ICAgIGMwLTEwLjY2MSw4LjY3NC0xOS4zMzUsMTkuMzM0LTE5LjMzNWMxMC42NiwwLDE5LjMzNCw4LjY3NCwxOS4zMzQsMTkuMzM1djE1NS4wMTNjLTEuOTk1LTAuMzEzLTQuMDM4LTAuNDc5LTYuMTE5LTAuNDc5aC0zMi41NDkgICAgVjM5LjMzNXogTTI1OS4zOTIsMTcwLjYxMmMwLTAuMDEzLDAuMDAyLTAuMDI1LDAuMDAyLTAuMDM4YzAtMC4wMDktMC4wMDEtMC4wMTctMC4wMDEtMC4wMjUgICAgYzAuMDE1LTEwLjY0OSw4LjY4MS0xOS4zMDksMTkuMzM0LTE5LjMwOWMxMC42NjEsMCwxOS4zMzUsOC42NzMsMTkuMzM1LDE5LjMzNHYyMy4yOTZoLTE5LjMzN2MtNy4wMjUsMC0xMy42MTksMS44Ni0xOS4zMzMsNS4xICAgIFYxNzAuNjEyeiBNMjAwLjcyNCwyMDkuNjk3di0zOS4xMjNjMC0xMC42Niw4LjY3NC0xOS4zMzIsMTkuMzM0LTE5LjMzMmMxMC42NTIsMCwxOS4zMiw4LjY1OSwxOS4zMzQsMTkuMzA3ICAgIGMwLDAuMDA4LDAsMC4wMTcsMCwwLjAyNXY2Mi42M2MwLDAuMDI2LDAuMDAyLDAuMDUxLDAuMDAyLDAuMDc3djI5Ljg4N2MwLDEwLjY2MS04LjY3NiwxOS4zMzMtMTkuMzM4LDE5LjMzMyAgICBjLTEwLjY2LDAtMTkuMzMyLTguNjczLTE5LjMzMi0xOS4zMzNWMjA5LjY5N3ogTTM2OS45NDQsMzAzLjYzN2MwLDQxLjUyNS0yMi42ODksNzkuNzc1LTU5LjIxNSw5OS44NDIgICAgYy0wLjAyLDAuMDExLTAuMDM4LDAuMDIzLTAuMDU4LDAuMDMzYy0wLjAwMSwwLjAwMS0wLjAwMiwwLjAwMS0wLjAwMiwwLjAwMWMtMC4wMDQsMC4wMDItMC4wMDYsMC4wMDQtMC4wMDksMC4wMDUgICAgYy0wLjI4MywwLjE1Ni0wLjU1OCwwLjMyNi0wLjgyMywwLjUwN2MtMC4xMTksMC4wODEtMC4yMjgsMC4xNzEtMC4zNDQsMC4yNTdjLTAuMTQyLDAuMTA2LTAuMjg2LDAuMjA5LTAuNDIyLDAuMzIzICAgIGMtMC4xNDgsMC4xMjQtMC4yODYsMC4yNTYtMC40MjYsMC4zODdjLTAuMDk0LDAuMDg4LTAuMTkxLDAuMTcyLTAuMjgxLDAuMjY0Yy0wLjE0MywwLjE0NC0wLjI3MywwLjI5NS0wLjQwNiwwLjQ0NiAgICBjLTAuMDgsMC4wOTItMC4xNjQsMC4xODEtMC4yNDEsMC4yNzdjLTAuMTE5LDAuMTQ2LTAuMjI4LDAuMjk5LTAuMzM3LDAuNDUxYy0wLjA4MiwwLjExMy0wLjE2NiwwLjIyNC0wLjI0NCwwLjM0ICAgIGMtMC4wODksMC4xMzYtMC4xNjksMC4yNzUtMC4yNTIsMC40MTVjLTAuMDg1LDAuMTQ0LTAuMTcyLDAuMjg3LTAuMjUsMC40MzVjLTAuMDYzLDAuMTE5LTAuMTE3LDAuMjQtMC4xNzQsMC4zNjEgICAgYy0wLjA4NCwwLjE3NS0wLjE2OCwwLjM0OS0wLjI0LDAuNTI5Yy0wLjA0NSwwLjEwNy0wLjA4LDAuMjE4LTAuMTIsMC4zMjdjLTAuMDcxLDAuMTk1LTAuMTQ0LDAuMzg5LTAuMjAyLDAuNTg4ICAgIGMtMC4wMzUsMC4xMTctMC4wNjEsMC4yMzYtMC4wOTIsMC4zNTRjLTAuMDQ5LDAuMTkyLTAuMTAxLDAuMzgzLTAuMTM5LDAuNTc5Yy0wLjAzMiwwLjE2NS0wLjA1MiwwLjMzMy0wLjA3NiwwLjUgICAgYy0wLjAyMSwwLjE1LTAuMDQ5LDAuMjk4LTAuMDY0LDAuNDUxYy0wLjAzLDAuMjk4LTAuMDQ0LDAuNTk5LTAuMDQ2LDAuOWMwLDAuMDI0LTAuMDA0LDAuMDQ3LTAuMDA0LDAuMDcxdjAuMDExICAgIGMwLDAuMDI0LDAsMC4wNDgsMCwwLjA3M3Y3OS42MzRIMTg1LjU3NXYtMTcuNTczaDQxLjAzNWM1LjUyMywwLDEwLTQuNDc3LDEwLTEwcy00LjQ3Ny0xMC0xMC0xMGgtNDEuMDM1di0zNi45ODkgICAgYzcuNzEzLDQuNzk5LDE1Ljk3MSw4Ljg3MywyNC43MTcsMTIuMDcxYzEuMTMzLDAuNDE1LDIuMjkzLDAuNjExLDMuNDM0LDAuNjExYzQuMDc4LDAsNy45MS0yLjUxNSw5LjM5My02LjU2OCAgICBjMS44OTYtNS4xODctMC43NzEtMTAuOTI5LTUuOTU3LTEyLjgyNmMtNDQuOTI0LTE2LjQyOC03NS4xMDctNTkuNDYzLTc1LjEwNy0xMDcuMDg2di05OC44Vjg0LjA1ICAgIGMwLTEwLjY2Miw4LjY3NC0xOS4zMzUsMTkuMzM2LTE5LjMzNWMxMC42NjEsMCwxOS4zMzMsOC42NzQsMTkuMzMzLDE5LjMzNXY4Ni41MjR2MzkuMTIzdjUzLjQ3MSAgICBjMCwyMS4xNDksMTYuNzgxLDM4LjQ0NiwzNy43MjcsMzkuMjkzYy0xLjYxOCwyLjU2LTMuMTUsNS4xOTQtNC41NjYsNy45MTVjLTIuNTQ5LDQuOS0wLjY0MywxMC45MzgsNC4yNTcsMTMuNDg2ICAgIGMxLjQ3NSwwLjc2NywzLjA1MiwxLjEzLDQuNjA2LDEuMTNjMy42MTEsMCw3LjA5OC0xLjk2Miw4Ljg4LTUuMzg3YzE1LjEwMi0yOS4wMzMsNDQuODEzLTQ3LjA2OCw3Ny41NDItNDcuMDY4aDEyLjEwOSAgICBjNS41MjMsMCwxMC00LjQ3NywxMC0xMHMtNC40NzctMTAtMTAtMTBoLTQyLjU1NGMtMTAuNjQ4LDAtMTkuMzExLTguNjUzLTE5LjMzMS0xOS4yOTd2LTAuMDM3YzAtMC4wMDctMC4wMDItMC4wMTQtMC4wMDItMC4wMjEgICAgYzAuMDExLTEwLjY1MSw4LjY3OS0xOS4zMTMsMTkuMzMzLTE5LjMxM2g3MS44ODZjMy44NSwwLDcuNDMxLDEuMTQ0LDEwLjQ0NywzLjA5YzAuMTQxLDAuMDk3LDAuMjg3LDAuMTg1LDAuNDM0LDAuMjc0ICAgIGM1LjA5OCwzLjQ4NCw4LjQ1Miw5LjM0LDguNDUyLDE1Ljk2N1YzMDMuNjM3eiIgZmlsbD0iIzQ3OTdiMSIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIxNS4zOTQsMzMyLjA5Yy01LjQyMy0xLjA3My0xMC42OCwyLjQ0NS0xMS43NTUsNy44NjJsLTAuMDQ5LDAuMjU3Yy0xLjAzNCw1LjQyNSwyLjUyNiwxMC42NjEsNy45NTIsMTEuNjk0ICAgIGMwLjYzMywwLjEyMSwxLjI2MiwwLjE3OSwxLjg4MywwLjE3OWM0LjcwNSwwLDguODk4LTMuMzM4LDkuODExLTguMTMxYzAuMDA0LTAuMDE5LDAuMDE3LTAuMDg4LDAuMDItMC4xMDYgICAgQzIyNC4zMzEsMzM4LjQyOCwyMjAuODExLDMzMy4xNjUsMjE1LjM5NCwzMzIuMDl6IiBmaWxsPSIjNDc5N2IxIi8+Cgk8L2c+CjwvZz4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMjU1LjU3OCw0NTQuNDI3aC0wLjIzOGMtNS41MjIsMC0xMCw0LjQ3Ny0xMCwxMHM0LjQ3OCwxMCwxMCwxMGgwLjIzOGM1LjUyMiwwLDEwLTQuNDc3LDEwLTEwICAgIFMyNjEuMTAxLDQ1NC40MjcsMjU1LjU3OCw0NTQuNDI3eiIgZmlsbD0iIzQ3OTdiMSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />interstellar hootchie kootchie',
          _: {
            background: '#F7F3CE',
            color: '#4797B1'
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

  addElementsToDOM( '<div data-bubb="added_one">Insert method 1</div>' );

  config.added_one = {
    text: 'config[reference] edited before refreshing bubb',
    _: {
      background: '#4797B1',
      color: '#fff',
      borderRadius: '14px',
      direction: 'north',
      anchor: 'left'
    }
  };

  bubb.refresh(); // finds and adds new bubbs

  addElementsToDOM( '<div data-bubb="added_two">Insert method 2</div>' );

  bubb.update('added_two', 'bubb.update(reference, content) called after adding bubb to DOM');
  bubb.update('added_two', {
    width: 'section',
    anchor: 'left',
    fontSize: '23px',
    color: '#444',
    delay: 500,
    callback: true,
    class: 'tipcolor',
    background: 'repeating-linear-gradient(45deg, #FFDEDE, #FFDEDE 25%, #F7F3CE 25%, #F7F3CE 50%, #C5ECBE 50%, #C5ECBE 75%, #4797B1 75%, #4797B1 100%)'
  });

  document.body.insertAdjacentHTML('beforeend', '<span data-bubb="bubble_bobble" class="bubble-bobble wait"></span>');
  //bubb.refresh();

  bubb.update('bubble_bobble',`
    <div>Share Bubb</div>
    <ul class="share-buttons">
      <li><a href="https://twitter.com/intent/tweet?source=http%3A%2F%2Fbubb.surge.sh&text=bubb:%20http%3A%2F%2Fbubb.surge.sh&via=frdnrdb" target="_blank" title="Tweet"><img alt="Tweet" src="/assets/images/icons/twitter.svg" /></a></li>
      <li><a href="http://www.reddit.com/submit?url=http%3A%2F%2Fbubb.surge.sh&title=bubb" target="_blank" title="Submit to Reddit"><img alt="Submit to Reddit" src="/assets/images/icons/reddit.svg" /></a></li>
      <li><a href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fbubb.surge.sh&t=bubb" title="Share on Facebook" target="_blank"><img alt="Share on Facebook" src="/assets/images/icons/facebook.svg" /></a></li>
    </ul>`);
  bubb.update('bubble_bobble', {
    direction: 'west',
    anchor: 'right',
    width: '200px',
    class: 'share-bubb',
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
  // css string with units (eg. '300px')
  // querySelector string (eg. 'section:first-of-type')

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

bubb.update('abbruzzese', { background: '#fad', color: '#444' });`

}

const display_added = {

target: '#added',
code: `// #method 1: update main config then refresh bubb

addElementToDOM( '<div data-bubb="added_one">Insert method 1</div>' ); // demo function

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



// method 2: use bubb update api

addElementToDOM( '<div data-bubb="added_two">Insert method 2</div>' ); // demo function

bubb.update('added_two', 'bubb.update(reference, content) called after adding bubb to DOM');
bubb.update('added_two', {
  width: 'section',
  anchor: 'left',
  fontSize: '23px',
  color: '#444',
  delay: 500,
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
