# bubb
## infotip

### configuration object. options are optional.

    var config = {

          // standard
          reference: 'Referenced content maintained in a <b>separate configuration object</b>',

          // menu with callback
          pj: {
            vedder: 'vocals',
            mccready: 'guitar',
            gossard: 'guitar',
            ament: 'bass'
          },

          // standard with options
          abbruzzese: {
            text: '',
            _: {
              callback: function(key, item) {
                item.innerHTML = 'Loading...';
                var url = 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1';
                fetch(url).then(function(res){ return res.json(); }).then(function(quotes){
                  item.innerHTML = quotes[0].content;
                });
              },
              hoverCallback: true,
              interactive: false, // true by default if a callback is registered
              transitionOff: true
            }
          }

        };

### initialize with bubb(config) or bubb(config, callback)

    bubb(config, function(key, item) {

      console.log('clicked ' + key);

    });

### update bubbs post initialization

    bubb.update('pj.mccready', 'lead guitar');
    bubb.update('abbruzzese', { background:'#fad', color:'#444', delay: true });

    bubb.add('pj.irons', 'drums');
    bubb.remove('pj.vedder');


### add new bubbs post dom update

    /*
      <div data-bubb="addedOne">Added One</div>
      <div data-bubb="addedTwo">Added Two</div>
    */

    config.addedOne = 'Content updated before adding new elements';

    bubb.add(); // finds and adds new bubbs (here: addedOne + addedTwo)

    bubb.update('addedTwo', 'Content updated after adding new elements');
    bubb.update('addedTwo', {
      background: 'gold',
      color: '#444',
      callback: true // default callback on click
    });


### optionally add globals to override initial (overall) behaviour

    config._ = {
      callback: function(), // overrides/ replaces main callback
      transitionOff: false, // default
      interactive: false, // default, true for bubb menus
      hoverCallback: false, // default
      delay: false, // default, true yields .5s reveal delay. configurable via bubb.scss
      background: '#444', // default
      color: '#fff', // default
    };
