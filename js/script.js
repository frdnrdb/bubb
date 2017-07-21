"use strict";

(function() {

function bubb(config, callback) {

    config = typeof config === 'object' ? config : {};
    callback = typeof callback === 'function' ? callback : false;

    if (!testconfig(config)) return;

    let bubbs = [].slice.call( document.querySelectorAll('[data-bubb], [data-bubb-menu]') );

    if (!bubbs.length) return;

    bubbs.forEach(build);

    function build(el) {

      let info = el.dataset.bubb,
          menu = el.dataset.bubbMenu,
          keys = menu ? menu.indexOf(',') > -1 ? menu.split(',') : [menu] : [info],
          html = '',

          option_background,
          option_color,
          option_callback,
          option_hover,
          option_transition;

          keys.forEach( key => {

              let trimmed = key.trim(),
                  current = config[trimmed] || trimmed,
                  options = Array.isArray(current) ? current[1] : false,
                  content = options ? current[0] : current,
                  trigger = (menu && callback) || (options && options.callback) ? ' data-bubb-value="'+trimmed+'"' : '';

              html += '<div'+trigger+'>'+content+'</div>';

              if (options) {
                option_callback = option_callback || options.callback;
                option_hover = option_hover || options.hoverCallback;
                option_background = option_background || options.background;
                option_color = option_color || options.color,
                option_transition = option_transition || options.transitionOff;
              }

          });

          let bubb = document.createElement('aside');

          if (option_background) {
            bubb.style.background = option_background;
            bubb.style.borderBottomColor = option_background;
          }

          if (option_color) bubb.style.color = option_color;

          if (option_transition) el.classList.add('bubb-still');

          bubb.innerHTML = html;

          el.appendChild(bubb);
          el.classList.add('bubb');
          if (menu) el.classList.add('bubb-menu');

          if ( !( (menu && callback) || option_callback ) ) return;

          el.classList.add('bubb-interact'); // make the bubb hoverable

          el.addEventListener(option_hover ? 'mouseover' : 'click', e => {

            let hover = option_callback && option_callback !== 'click',
                bubbvalue = hover ? e.target.dataset.bubb : e.target.dataset.bubbValue || e.target.parentNode.dataset.bubbValue;

            if (bubbvalue) {

              let options = Array.isArray(config[bubbvalue]) ? config[bubbvalue][1] : {},
                  thiscallback = options.callback || callback;

              thiscallback(bubbvalue, hover ? el.querySelector('aside') : e.target.dataset.bubbValue ? e.target : e.target.parentNode);

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

if (typeof exports !== "undefined" && exports !== null) exports.bubb = bubb;
// todo! add support for amd/ requirejs
else window.bubb = bubb;

})(this);
