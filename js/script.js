/*

  TODO!
    * Context awareness (width vs content, tip/ direction, as option)
    * TRY alternative tooltip layout ('list', as option)
    * TRY alternative theme (light, material box-shadow, as option)

    * remove event listeners @ update

    keep it simple!

*/

"use strict";

(function() {

let bubb = (config, callback) => {

  if (!bubb.initialized) bubb.initialize(config, callback);
  else console.log('bubb already initialized. use bubb.add to process new DOM elements or bubb.update to modiy existing instances');
  bubb.initialized = true;

}

bubb.initialize = (config, callback) => {

  bubb.config = bubb.config || (typeof config === 'object' ? config : {});
  bubb.config._ = bubb.config._ || config._ || {};
  bubb.callback = bubb.callback || (typeof callback === 'function' ? callback : false);

  // Parse DOM for valid bubb elements - skip initialized elements
  let bubbs = Array.from( document.querySelectorAll('[data-bubb]:not(.bubb)') );

  if (!bubbs.length) return;

  bubbs.forEach(bubb.buildElement);

}

bubb.buildElement = infotip => {

  let key = infotip.dataset.bubb.trim(),
      data = bubb.config[key],

      chck = typeof data === 'object',
      opts = chck && data.hasOwnProperty('_') ? data._ : false,
      menu = chck && !data.hasOwnProperty('text');

      function setConfiguration(config) {
        if (opts || Object.keys(bubb.config._).length) {
          bubb.availableOptions.forEach( option => {
            config[option] = opts[option] || bubb.config._[option];
          });
        }
        return config;
      }

      let bindMenu = typeof bubb.callback === 'function' || typeof bubb.config._.callback === 'function';

      infotip.bubb = {
        config: setConfiguration({}),
        type: menu ? 'menu' : opts ? 'opts' : 'string',
        bind: (menu && bindMenu) || (opts && typeof opts.callback === 'function')
      };

      let props = !menu ? opts ? ['text'] : [false] : Object.keys(data);
      let html = props.reduce( buildConent.bind(this, key), '' );

      function buildConent(key, acc, prop) {

          if (prop === '_') return;

          let content = prop ? bubb.config[key][prop] : bubb.config[key] || key,
              selector = key + (prop && prop !== 'text' ? '.' + prop : ''),
              attribute = ` data-bubb-value="${selector}"`;

          return acc += `<div ${attribute}>${content}</div>`;

      }

      bubb.configureElement(infotip, null, html);

};

bubb.configureElement = (infotip, aside, html) => {

    aside = aside || document.createElement('aside'); // keep if update

    let config = infotip.bubb.config,
        update = !html;

    if (config.background) {
      aside.style.background = config.background;
      aside.style.borderBottomColor = config.background;
    }
    if (config.color) aside.style.color = config.color;

    infotip.classList.add('bubb');

    if (config.transitionOff) infotip.classList.add('bubb-still');
    else if (update) infotip.classList.remove('bubb-still');

    if (config.delay) infotip.classList.add('bubb-delayed');
    else if (update) infotip.classList.remove('bubb-delayed');

    // make the bubb hoverable
    if (infotip.bubb.type === 'menu' || config.callback) {
      infotip.classList.add('bubb-interactive');
    }
    if (config.interactive) infotip.classList.add('bubb-interactive');
    else if (update && config.hasOwnProperty('interactive')) infotip.classList.remove('bubb-interactive');

    if (infotip.bubb.type === 'menu') {
      infotip.classList.add('bubb-menu'); // convenience class for styling
    }

    if (!update) {
      aside.innerHTML = html;
      infotip.appendChild(aside);
    }

    if ( !infotip.bubb.bind ) return;

    bubb.bindElement(infotip);

};

bubb.bindElement = infotip => {

  infotip.bubb.bind = true;

  infotip.addEventListener(infotip.bubb.config.hoverCallback ? 'mouseenter' : 'click', callbackHandler, false);

  function callbackHandler(e) {

      let hover = infotip.bubb.config.hoverCallback,
          bubbvalue = hover ? this.dataset.bubb : e.target.dataset.bubbValue || e.target.parentNode.dataset.bubbValue;

      if (!bubbvalue) return;

      let thiscallback = (typeof this.bubb.config.callback === 'function' && this.bubb.config.callback) || bubb.callback,
          item = this.querySelector(`[data-bubb-value="${this.dataset.bubb}"]`) || e.target;

      thiscallback(bubbvalue, item);

  }

};

bubb.update = (key, contentOrConfig) => {

      if (typeof key !== 'string' || !contentOrConfig) return;

      let updateConfig = typeof contentOrConfig === 'object';

      let item = document.querySelector(`[data-bubb-value="${key}"]`),
          parent;

      if (!item && updateConfig) parent = document.querySelector(`[data-bubb="${key}"]`);

      if (!item && !parent) return;

      // update element

      if (!updateConfig) item.innerHTML = contentOrConfig;

      // update element config

      let infotip = parent || item.parentNode.parentNode; // .bubb < aside < div (item)

      if (updateConfig) {

        let bindDefault = typeof contentOrConfig.callback === 'boolean' && !infotip.bubb.bind,
            bindSelf = contentOrConfig.callback && !infotip.bubb.config.hasOwnProperty('callback'),
            bindHover = contentOrConfig.hoverCallback && !infotip.bubb.config.hoverCallback;

        Object.keys(contentOrConfig).forEach( updatedKey => {
          if (!~bubb.availableOptions.indexOf(updatedKey)) return;
          infotip.bubb.config[updatedKey] = contentOrConfig[updatedKey];
        });

        let aside = parent ? parent.children[0] : item.parentNode;

        bubb.configureElement(infotip, aside);

        if (bindDefault || bindSelf || bindHover) bubb.bindElement(infotip);

      }

      // update bubb config

      bubb.updateConfig(key, contentOrConfig, updateConfig, infotip);

};

bubb.add = () => {
  bubb.addOrRemove.apply(this, arguments);
}

bubb.remove = () => {
  bubb.addOrRemove.apply(this, arguments);
}

bubb.addOrRemove = () => {

  // parse DOM for new data-bubb elements

  if (arguments.length === 0) {
    bubb.initialize();
    return;
  }

  let key = arguments[0],
      value = arguments[1],
      keyVal = key.split('.');

  // add or remove menu items

  if (keyVal.length > 1 && bubb.config[keyVal[0]]) {

    let menu = keyVal[0],
        menuItem = keyVal[1];

    // add new menu item

    if (value && typeof value === 'string' && !bubb.config[menu][menuItem]) {

      bubb.config[menu][menuItem] = value;

      document.querySelector(`[data-bubb="${menu}"]`).children[0]
        .insertAdjacentHTML('beforeend', `<div data-bubb-value="${key}">${value}</div>`);

      return;

    }

    // remove menu item

    if (!value && bubb.config[menu][menuItem]) {

      delete bubb.config[menu][menuItem];

      let aside = document.querySelector(`[data-bubb="${menu}"]`).children[0];
      Array.from(aside.children).forEach( child => {
        if (child.dataset.bubbValue === key) aside.removeChild(child);
      });

    }

  }

};

bubb.updateConfig = (key, contentOrConfig, updateConfig, infotip) => {

  let menu = ~key.indexOf('.') ? key.split('.') : false,
      opts = infotip.bubb.type === 'opts';

  if (menu || opts || updateConfig) {
    let prop = menu ? menu[0] : key;
    if (!updateConfig) bubb.config[prop][menu ? menu[1] : 'text'] = contentOrConfig;
    else if (updateConfig) {
      if (menu) {
        bubb.config[prop]['_'] = contentOrConfig;
      }
      else if (!opts) {
        bubb.config[prop] = {
          text: bubb.config[prop],
          _: contentOrConfig
        };
        infotip.bubb.type === 'opts';
      }
      Object.assign(bubb.config[prop]['_'], contentOrConfig);
    }
  }
  else bubb.config[key] = contentOrConfig;

}

bubb.availableOptions = [
  'callback',
  'hoverCallback',
  'background',
  'color',
  'transitionOff',
  'interactive',
  'delay'
];

if (typeof exports !== 'undefined' && exports !== null) exports.bubb = bubb;
// todo! add support for amd/ requirejs
else window.bubb = bubb;

})(this);
