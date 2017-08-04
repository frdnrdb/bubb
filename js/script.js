/*

  TODO!

    * TRY alternative tooltip layout (list-style) as option
    * TRY alternative theme (light, "material" box-shadow) as option

    * MAYBE:
    * MAYBE: Context awareness ((smart) width vs content, tip/ direction) as option

*/

(function() {

"use strict";

const bubb = (config, callback) => {

  bubb.config = bubb.config || (typeof config === 'object' ? config : {});
  bubb.config._ = bubb.config._ || config._ || {};
  bubb.callback = bubb.callback || (typeof callback === 'function' ? callback : false);

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
      menu = chck && !data.hasOwnProperty('text');

      function setConfiguration() {
        return availableOptions.reduce( (config, option) => {
          let valid = opts && opts.hasOwnProperty(option) ? opts[option] : bubb.config.hasOwnProperty(option) ? bubb.config._[option] : false;
          if (valid) config[option] = valid;
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

    if (config.maximize) maximizeWidth(true, _bubbParent, _bubbLe);
    else if (config.hasOwnProperty('maximize')) maximizeWidth(false, _bubbParent, _bubbLe);

    if (config.transitionOff) _bubbParent.classList.add('bubb-still');
    else if (config.hasOwnProperty('transitionOff')) _bubbParent.classList.remove('bubb-still');

    if (config.delay) _bubbParent.classList.add('bubb-delayed');
    else if (config.hasOwnProperty('delay')) _bubbParent.classList.remove('bubb-delayed');

    if (_bubbParent.bubb.type === 'menu' || config.callback) _bubbParent.classList.add('bubb-interactive');

    if (config.interactive) _bubbParent.classList.add('bubb-interactive');
    else if (config.hasOwnProperty('interactive')) _bubbParent.classList.remove('bubb-interactive');

    if (config.class) _bubbParent.classList.add(config.class);

    if (config.anchor) _bubbParent.classList.add('bubb-' + config.anchor);

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

  // add menu item

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

const maximizeWidth = (check, _bubbParent, _bubbLe) => {

  if (!check) {
    _bubbLe.style.width = '100%';
    _bubbParent.className = _bubbParent.className.replace(/bubb-(left|right)/,'').trim();
    return;
  }

  let padding = 20,
      bodyw = document.body.offsetWidth,
      box = _bubbParent.getBoundingClientRect(),
      boxm = box.width/2,
      boxl = box.left,
      boxr = box.right,
      pos = (boxl + boxm) * 100 / bodyw,
      lrm = pos < 33 ? 1 : pos > 66 ? 2 : 0,
      cls = ['', 'left', 'right'],
      width = lrm === 1
        ? bodyw - boxl - padding : lrm === 2
        ? bodyw - ( bodyw - boxr ) - padding
        : Math.min(boxl + boxm - padding, bodyw - ( boxr - boxm ) - padding) * 2;

      _bubbLe.style.width = width + 'px';
      if (lrm) _bubbParent.classList.add('bubb-' + cls[lrm]);

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
  'delay',
  'maximize',
  'class',
  'anchor'
];

const isMobile = (typeof window.orientation !== "undefined") || ~navigator.userAgent.indexOf('IEMobile') ? true : false;

typeof module !== 'undefined' && module.exports ? module.exports = bubb : window.bubb = bubb;

})();
