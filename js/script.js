/*

  TODO!

    * TRY alternative tooltip layout ('list', as option)
    * TRY alternative theme (light, "material" box-shadow, as option)

    * MAYBE: Context awareness (width vs content, tip/ direction, as option)

*/

"use strict";

(function() {

const bubb = (config, callback) => {

  bubb.config = bubb.config || (typeof config === 'object' ? config : {});
  bubb.config._ = bubb.config._ || config._ || {};
  bubb.callback = bubb.callback || (typeof callback === 'function' ? callback : false);

  /*

  const checkConfig = (self, input, validinput, fallback) =>
  self && validinput ? Object.assign(self, input) : self || input || fallback;

  bubb.config = checkConfig(bubb.config, config, typeof config === 'object', {});
  bubb.config._ = checkConfig(bubb.config._, config && config._, config && config.hasOwnProperty('_'), {});
  bubb.callback = checkConfig(bubb.callback, callback, typeof callback === 'function', false);

  */

  let bubbs = Array.from( document.querySelectorAll('[data-bubb]:not(.bubb)') );

  if (!bubbs.length) return;

  bubbs.forEach(buildElement);

}

bubb.update = (key, contentOrConfig) => update(key, contentOrConfig);
bubb.add = bubb.refresh = () => addOrRemove.apply(this, arguments);
bubb.remove = () => addOrRemove.apply(this, arguments);

const buildElement = _bubbParent => {

  let key = _bubbParent.dataset.bubb.trim(),
      data = bubb.config[key],

      chck = typeof data === 'object',
      opts = chck && data._,
      menu = chck && !data.hasOwnProperty('text'),

      validOpts;

      function setConfiguration() {
        return availableOptions.reduce( (config, option) => {
          if (validOpts = (opts && opts[option]) || bubb.config._[option]) config[option] = validOpts;
          return config;
        }, {});
      }

      let bindMenu = typeof bubb.callback === 'function' || typeof bubb.config._.callback === 'function';

      _bubbParent.bubb = {
        config: setConfiguration(),
        type: menu ? 'menu' : opts ? 'opts' : 'string',
        bind: (menu && bindMenu) || (opts && typeof opts.callback === 'function')
      };

      let props = !menu ? opts ? ['text'] : [false] : Object.keys(data);
      let html = props.reduce( buildConent.bind(this, key), '' );

      function buildConent(key, markup, prop) {

          if (prop === '_') return;

          let content = prop ? bubb.config[key][prop] : bubb.config[key] || key,
              selector = key + (prop && prop !== 'text' ? '.' + prop : ''),
              attribute = ` data-bubb-value="${selector}"`;

          return markup += `<div ${attribute}>${content}</div>`;

      }

      configureElement(_bubbParent, null, html);

};

const configureElement = (_bubbParent, _bubbLe, html) => {

    _bubbLe = _bubbLe || document.createElement('aside');

    let config = _bubbParent.bubb.config,
        update = !html;

    if (config.background) {
      _bubbLe.style.background = config.background;
      _bubbLe.style.borderBottomColor = config.background;
    }
    if (config.color) _bubbLe.style.color = config.color;

    _bubbParent.classList.add('bubb');

    if (config.transitionOff) _bubbParent.classList.add('bubb-still');
    else if (update) _bubbParent.classList.remove('bubb-still');

    if (config.delay) _bubbParent.classList.add('bubb-delayed');
    else if (update) _bubbParent.classList.remove('bubb-delayed');

    // make the bubb hoverable
    (_bubbParent.bubb.type === 'menu' || config.callback) && _bubbParent.classList.add('bubb-interactive');

    if (config.interactive) _bubbParent.classList.add('bubb-interactive');
    else if (update && config.hasOwnProperty('interactive')) _bubbParent.classList.remove('bubb-interactive');

    // add convenience class for styling
    _bubbParent.bubb.type === 'menu' && _bubbParent.classList.add('bubb-menu');

    if (!update) {
      _bubbLe.innerHTML = html;
      _bubbParent.appendChild(_bubbLe);
    }

    if (!_bubbParent.bubb.bind) return;

    bindElement(_bubbParent);

};

const bindElement = _bubbParent => {

  _bubbParent.bubb.bind = true;

  _bubbParent.addEventListener(isMobile ? 'touchstart' : _bubbParent.bubb.config.hoverCallback ? 'mouseenter' : 'click', callbackHandler, false);

  function callbackHandler(e) {

      let hover = _bubbParent.bubb.config.hoverCallback,
          bubbvalue = hover ? this.dataset.bubb : e.target.dataset.bubbValue || e.target.parentNode.dataset.bubbValue;

      if (!bubbvalue) return;

      let thiscallback = (typeof this.bubb.config.callback === 'function' && this.bubb.config.callback) || bubb.callback,
          item = this.querySelector(`[data-bubb-value="${this.dataset.bubb}"]`) || e.target;

      thiscallback(bubbvalue, item);

  }

};

const update = (key, contentOrConfig) => {

      if (typeof key !== 'string' || !contentOrConfig) return;

      let updateConfig = typeof contentOrConfig === 'object',
          item = document.querySelector(`[data-bubb-value="${key}"]`),
          parent;

      if (!item && updateConfig) parent = document.querySelector(`[data-bubb="${key}"]`);

      if (!item && !parent) return;

      // update element

      if (!updateConfig) item.innerHTML = contentOrConfig;

      // update element config

      let _bubbParent = parent || item.parentNode.parentNode; // .bubb < aside < div (item)

      if (updateConfig) {

        let bindDefault = typeof contentOrConfig.callback === 'boolean' && !_bubbParent.bubb.bind,
            bindSelf = contentOrConfig.callback && !_bubbParent.bubb.config.hasOwnProperty('callback'),
            bindHover = contentOrConfig.hoverCallback && !_bubbParent.bubb.config.hoverCallback;

        Object.keys(contentOrConfig).forEach( updatedKey => {
          if (!~availableOptions.indexOf(updatedKey)) return;
          _bubbParent.bubb.config[updatedKey] = contentOrConfig[updatedKey];
        });

        let _bubbLe = parent ? parent.children[0] : item.parentNode;

        configureElement(_bubbParent, _bubbLe);

        (bindDefault || bindSelf || bindHover) && bindElement(_bubbParent);

      }

      // update bubb config

      updateMainConfig(key, contentOrConfig, updateConfig, _bubbParent);

};

const addOrRemove = () => {

  if (arguments.length === 0) {
    bubb();
    return;
  }

  let key = arguments[0],
      value = arguments[1],

      menu = key.split('.').reduce( (obj, val, i) => {
        obj[['key','val'][i]] = val;
        return obj;
      }, {});

  if (!menu.val || !bubb.config[menu.key]) return;

  // add new menu item

  if (value && typeof value === 'string' && !bubb.config[menu.key][menu.val]) {

    bubb.config[menu.key][menu.val] = value;

    document.querySelector(`[data-bubb="${menu.key}"]`).children[0]
      .insertAdjacentHTML('beforeend', `<div data-bubb-value="${key}">${value}</div>`);

    return;

  }

  // remove menu item

  if (!value && bubb.config[menu.key][menu.val]) {

    delete bubb.config[menu.key][menu.val];

    let _bubbLe = document.querySelector(`[data-bubb="${menu.key}"]`).children[0];
    Array.from(_bubbLe.children).forEach( child => {
      if (child.dataset.bubbValue === key) _bubbLe.removeChild(child);
    });

  }

};

const updateMainConfig = (key, contentOrConfig, updateConfig, _bubbParent) => {

  let typeMenu = _bubbParent.bubb.type === 'menu',
      typeOptions = _bubbParent.bubb.type === 'opts',

      keyVal = ~key.indexOf('.') && key.split('.'),

      menu = keyVal ? keyVal.reduce( (obj, val, i) => {
        obj[['key','val'][i]] = val;
        return obj;
      }, {}) : {};

  if (!typeMenu && !typeOptions && !updateConfig) {
      bubb.config[key] = contentOrConfig;
      return;
  }

  let prop = menu.key || key;

  if (!updateConfig) {
    bubb.config[prop][menu.val || 'text'] = contentOrConfig;
    return;
  }

  if (!typeMenu && !typeOptions) {
    bubb.config[prop] = {
      text: bubb.config[prop],
      _: contentOrConfig
    };
    _bubbParent.bubb.type === 'opts';
    return;
  }

  bubb.config[prop]['_'] = bubb.config[prop]['_'] || contentOrConfig;
  Object.assign(bubb.config[prop]['_'], contentOrConfig);

}

const availableOptions = [
  'callback',
  'hoverCallback',
  'background',
  'color',
  'transitionOff',
  'interactive',
  'delay'
];

const isMobile = (typeof window.orientation !== "undefined") || ~navigator.userAgent.indexOf('IEMobile') ? true : false;

if (typeof exports !== 'undefined' && exports !== null) exports.bubb = bubb;
// todo! add support for amd/ requirejs
else window.bubb = bubb;

})(this);
