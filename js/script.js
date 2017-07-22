"use strict";

(function() {

function bubb(config, callback) {

    config = typeof config === 'object' ? config : {};
    callback = typeof callback === 'function' ? callback : false;

    if (!testconfig(config)) return;

    config.globals = config.globals || {};

    let bubbs = Array.from( document.querySelectorAll('[data-bubb], [data-bubb-menu]') );

    if (!bubbs.length) return;

    bubbs.forEach(build);

    function build(infotip) {

      let info = infotip.dataset.bubb,
          menu = infotip.dataset.bubbMenu,
          keys = menu ? menu.indexOf(',') > -1 ? menu.split(',') : [menu] : [info],
          html = '',

          option_background,
          option_color,
          option_callback,
          option_hover,
          option_transition,
          option_delay;

          keys.forEach( key => {

              let trimmed = key.trim(),
                  current = config[trimmed] || trimmed,
                  options = Array.isArray(current) ? current[1] : false,
                  content = options ? current[0] : current,
                  trigger = (menu && callback) || (options && options.callback) ? ' data-bubb-value="'+trimmed+'"' : '';

              html += '<div' + trigger + '>' + content + '</div>';

              if (options || Object.keys(config.globals).length) {
                option_callback = option_callback || options.callback || config.globals.callback;
                option_hover = option_hover || options.hoverCallback || config.globals.hoverCallback;
                option_background = option_background || options.background || config.globals.background;
                option_color = option_color || options.color || config.globals.color;
                option_transition = option_transition || options.transitionOff || config.globals.transitionOff;
                option_delay = option_delay || options.delay || config.globals.delay;
              }

          });

          let aside = document.createElement('aside');

          if (option_background) {
            aside.style.background = option_background;
            aside.style.borderBottomColor = option_background;
          }
          if (option_color) aside.style.color = option_color;
          if (option_transition) infotip.classList.add('bubb-still');
          if (option_delay) infotip.classList.add('bubb-delayed');

          if (menu) infotip.classList.add('bubb-menu'); // convenience class for styling

          infotip.classList.add('bubb');

          aside.innerHTML = html;
          infotip.appendChild(aside);

          if ( !( (menu && callback) || option_callback ) ) return;

          infotip.classList.add('bubb-interactive'); // make the bubb hoverable

          infotip.addEventListener(option_hover ? 'mouseover' : 'click', e => {

            let hover = option_hover;
            let bubbvalue = hover ? e.target.dataset.bubb : e.target.dataset.bubbValue || e.target.parentNode.dataset.bubbValue;

            if (bubbvalue) {

              let options = Array.isArray(config[bubbvalue]) ? config[bubbvalue][1] : {},
                  thiscallback = options.callback || callback;

              thiscallback(bubbvalue, hover ? aside : e.target.dataset.bubbValue ? e.target : e.target.parentNode);

            }

          });

    }

}

function testconfig(config) {

  let check = true;

  Object.keys(config).forEach( key => {

    let current = config[key],
        normal = typeof current === 'string',
        options = Array.isArray(current);

    if (key === 'globals' && typeof current === 'object') return;

    if (!normal && !options) {
      console.log('bubb aborted: config value should be string or array');
      check = false;
      return;
    }

    if (options && current.length === 1) {
      config[key] = current[0]; // convert config array without options to string
      return;
    }

    if (options && typeof current[1] !== 'object') {
      console.log('bubb aborted: second parameter of config array should be an object');
      check = false;
      return;
    }

  });

  return check;

}

if (typeof exports !== 'undefined' && exports !== null) exports.bubb = bubb;
// todo! add support for amd/ requirejs
else window.bubb = bubb;

})(this);
