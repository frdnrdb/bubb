/*

  TODO!

    * west-anchored css
    * added_one transition bug?


    * Alternative html elements (instead of sub, sup, etc) + update readme on styling;
    * Include bubb-menu-style?

    * border (including tip)?
    * TRY alternative tooltip layout (list-style) as option
    * TRY alternative theme (light, "material" box-shadow) as option

*/

(function(window, document) {

"use strict;"

const bubb = (config, callback) => {

  bubb.config = bubb.config || (typeof config === 'object' ? config : {});
  bubb.config._ = bubb.config._ || config._ || {};
  bubb.callback = bubb.callback || (typeof bubb.config._.callback === 'function' && bubb.config._.callback) || (typeof callback === 'function' && callback);

  let bubbs = Array.from( document.querySelectorAll('[data-bubb]:not(.bubb)') );

  if (!bubbs.length) return;

  !bubb.initialized && initBubb();

  bubbs.forEach(buildElement);

}

const buildElement = _trigger => {

  let key = _trigger.dataset.bubb.trim(),
      data = bubb.config[key],

      chck = typeof data === 'object',
      opts = chck && data._,
      menu = chck && !data.hasOwnProperty('text'),

      props = !menu ? opts ? ['text'] : [false] : Object.keys(data),
      bindMenu = typeof bubb.callback === 'function' || typeof bubb.config._.callback === 'function',
      triggerPosition = window.getComputedStyle(_trigger).position;

      _trigger._bubb = {
        key: key,
        config: setElementConfiguration(opts),
        type: menu ? 'menu' : opts ? 'opts' : 'string',
        markup: props.reduce( buildElementMarkup.bind(this, key), '' ),
        bind: (menu && bindMenu) || (opts && (typeof opts.callback === 'function' || typeof opts.callback === 'boolean'))
      };

      triggerPosition && !triggerPosition.match(/absolute|fixed|relative/) && (_trigger.style.position = 'relative');

      _trigger.classList.add('bubb');

      bindElement(_trigger);

};

const setElementConfiguration = opts => {

  return availableOptions.reduce( (config, option) => {
    opts && opts.hasOwnProperty(option) ? config[option] = opts[option]
      : bubb.config._.hasOwnProperty(option) ? config[option] = bubb.config._[option]
      : false;
    return config;
  }, {});

};

const buildElementMarkup = (key, markup, prop) => {

    if (prop === '_') return '';

    let content = prop ? bubb.config[key][prop] : bubb.config[key] || key,
        selector = key + (prop && prop !== 'text' ? '.' + prop : ''),
        attribute = ` data-bubb-value="${selector}"`;

    return markup += `<div ${attribute}>${content}</div>`;

};

const bindElement = (_trigger) => {

  let bubbEvents = isMobile ? ['touchstart', 'touchend'] : ['mouseenter', 'mouseleave'];

  if (!isMobile && _trigger._bubb.bind) bubbEvents.push('mousedown');

  bubbEvents.forEach( event => _trigger.addEventListener(event, eventHandler, false) );

};

const configureElement = (_trigger) => {

    let trigger = _trigger._bubb,
        bubble = bubb._element,
        config = bubble._config = trigger.config;

    bubble._elementContent.innerHTML = trigger.markup;

    bubble._bind = trigger.bind && (config.interactive !== false);

    bubble.className = config.class || '';

    setWidth(config.width, config.anchor, _trigger, bubble);

    trigger.type === 'menu' && _trigger.classList.add('bubb-menu');

    bubb.previousKey = trigger.key;

    appendStyles(bubb._element, '_bubblePreactive');

    _trigger.appendChild(bubble);

};

const eventHandler = function(e) {

    if (!this._bubb) return;

    window.clearTimeout(bubb._timeout);

    // ---> configure

    (bubb.previousKey !== this._bubb.key) && configureElement(this);

    // ---> reveal or hide

    e.type === 'mouseenter' || e.type === 'touchstart'
      ? bubb._timeout = window.setTimeout( () => appendStyles(bubb._element, '_bubbleActive'), (this._bubb.config.delay | 0) || 0)
      : e.type !== 'mousedown' && appendStyles(bubb._element, ['_bubbleInactive', '_bubblePreactive']);

    // ---> leave

    if (!this._bubb.bind || e.type === 'mouseleave') return;

    // ---> callback

    let hover = this._bubb.config.hoverCallback,
        bubbvalue = hover ? this.dataset.bubb : e.target.dataset.bubbValue || e.target.parentNode.dataset.bubbValue;

    console.log('--->', bubbvalue, e.target);

    if (!bubbvalue) return;

    let thiscallback = (typeof this._bubb.config.callback === 'function' && this._bubb.config.callback) || bubb.callback,
        item = this.querySelector(`[data-bubb-value="${this.dataset.bubb}"]`) || e.target;

    thiscallback(bubbvalue, item);

}

const update = () => {

      let key = arguments[0], contentOrConfig = arguments[1];

      if (typeof key !== 'string' || !contentOrConfig) return;

      let updateOptions = typeof contentOrConfig === 'object',
          menu = key.split('.').reduce( (obj, val, i) => {
            obj[['key','val'][i]] = val;
            return obj;
          }, {}),
          _trigger = document.querySelector(`[data-bubb="${menu.key || key}"]`);

      if (!_trigger && !updateOptions) return;

      bubb.previousKey = false;

      // update main config

      updateMainConfig(key, contentOrConfig, updateOptions, _trigger);

      // update element

      if (!updateOptions) {
        _trigger._bubb.markup = _trigger._bubb.markup.replace(new RegExp(`<div\\s+data-bubb-value="${key}">.*?</div>`), `<div data-bubb-value="${key}">${contentOrConfig}</div>`);
        return;
      }

      // update element config

      Object.keys(contentOrConfig).forEach( updatedKey => {
        if (!~availableOptions.indexOf(updatedKey)) return;
        if (_trigger) _trigger._bubb.config[updatedKey] = contentOrConfig[updatedKey];
        else bubb.config['_'][updatedKey] = contentOrConfig[updatedKey];
      });

      if (!_trigger) {
        Array.from( document.querySelectorAll('.bubb') ).forEach( instance => instance.classList.remove('bubb') );
        bubb();
        return;
      }

      let bindDefault = typeof contentOrConfig.callback === 'boolean' && !_trigger._bubb.bind,
          bindSelf = contentOrConfig.callback && !_trigger._bubb.config.hasOwnProperty('callback'),
          bindHover = contentOrConfig.hoverCallback && !_trigger._bubb.config.hoverCallback;

      if (bindDefault || bindSelf || bindHover) _trigger._bubb.bind = true;

      if (bindDefault) _trigger.addEventListener( 'mousedown', eventHandler, false);

};

const addOrRemove = () => {

  if (arguments.length === 0) {
    bubb();
    return;
  }

  let key = arguments[0], value = arguments[1],
      menu = key.split('.').reduce( (obj, val, i) => {
        obj[['key','val'][i]] = val;
        return obj;
      }, {});

  if (!menu.val || !bubb.config[menu.key]) return;

  // add menu item

  bubb.previousKey = false;

  if (value && typeof value === 'string' && !bubb.config[menu.key][menu.val]) {

    bubb.config[menu.key][menu.val] = value;

    document.querySelector(`[data-bubb="${menu.key}"]`)._bubb.markup += `<div data-bubb-value="${key}">${value}</div>`;
    return;

  }

  // remove menu item

  if (!value && bubb.config[menu.key][menu.val]) {

    delete bubb.config[menu.key][menu.val];

    let _trigger = document.querySelector(`[data-bubb="${menu.key}"]`);
    _trigger._bubb.markup = _trigger._bubb.markup.replace(new RegExp(`<div\\s+data-bubb-value="${key}">.*?</div>`), '');

  }

};

const setWidth = (input, anchor, _trigger, _bubble) => {

  // positive number or numberstring || query
  let width = (input | 0) || document.querySelector(input);

  if (!width) {
    _bubble.style.width = '100%';
    return;
  }

  let padding = 20,
      fill = typeof width === 'object',
      bodyw = document.body.offsetWidth,
      box = _trigger.getBoundingClientRect(),
      boxm = box.width/2,
      boxl = box.left,
      boxr = box.right,
      inputWidth = fill ? width.offsetWidth : (width === 100 ? bodyw - padding*2 : (width * bodyw) / 100);

  if (anchor) {

    let newWidth = anchor === 'left'
          ? bodyw - boxl - padding : anchor === 'right'
          ? bodyw - ( bodyw - boxr ) - padding
          : false;

    if (newWidth) {
      _bubble.style.width = Math.min(inputWidth, newWidth) + 'px';
      return;
    }

  }

  let newWidth = Math.min(inputWidth, ((boxl + boxm > bodyw/2 ? bodyw - boxr + boxm: boxl + boxm) - padding) * 2);

  _bubble.style.width = newWidth + 'px';
  _bubble.style.left = (boxm - newWidth/2) + 'px';
  _bubble._elementTip.style.left = newWidth/2 + 'px';

};

const updateMainConfig = (key, contentOrConfig, updateOptions, _trigger) => {

  let typeMenu = _trigger._bubb.type === 'menu',
      typeOptions = _trigger._bubb.type === 'opts',
      keyVal = ~key.indexOf('.') && key.split('.'),
      menu = keyVal ? keyVal.reduce( (obj, val, i) => {
        obj[['key','val'][i]] = val;
        return obj;
      }, {}) : {};

  if (!typeMenu && !typeOptions && !updateOptions) {
      bubb.config[key] = contentOrConfig;
      return;
  }

  let prop = menu.key || key;

  if (!updateOptions) {
    bubb.config[prop][menu.val || 'text'] = contentOrConfig;
    return;
  }

  if (!typeMenu && !typeOptions) {
    bubb.config[prop] = {
      text: bubb.config[prop],
      _: contentOrConfig
    };
    _trigger._bubb.type === 'opts';
    return;
  }

  bubb.config[prop]['_'] = bubb.config[prop]['_'] || contentOrConfig;
  Object.assign(bubb.config[prop]['_'], contentOrConfig);

};

const styleVariables = {
  'tip-size': '12px',
  'offset': '.15em',
  'distance': '20px',
  'easing': 'cubic-bezier(0,0,0,1)',
  'duration': '.3s',
  'background': '#444',
  'color': '#fff',
  'rounding': '4px',
  'font-size': '17px'
};

const styles = {
  _bubble: {
    position: 'absolute',
    zIndex: '99',
    display: 'block',
    padding: '.75em .9em .85em',
    lineHeight: '1.1',
    textAlign: 'center',
    cursor: 'default',
    minWidth: '150px',
    width: '100%',
    boxSizing: 'border-box',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    wordWrap: 'break-word',
    hyphens: 'auto',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none'
  },
  _bubbleInactive: {
    visibility: 'hidden',
    pointerEvents: 'none',
    opacity: '0',
  },
  _bubblePreactive: {
    background: styleVariables['background'],
    borderBottomColor: styleVariables['background'],
    color: styleVariables['color'],
    fontSize: styleVariables['font-size'],
  },
  _bubbleActive: {
    transitionProperty: 'opacity, transform',
    transitionDuration: styleVariables['duration'],
    transitionTimingFunction: styleVariables['easing'],
    pointerEvents: 'all',
    opacity: '1',
    visibility: 'visible'
  },
  _bubbleInteractive: {
    position: 'absolute',
    zIndex: '-1',
    display: 'none',
    width: `calc( 100% + ( ${styleVariables['tip-size']} + ${styleVariables['offset']} ) * 2 )`,
    height: `calc( 100% + ( ${styleVariables['tip-size']} + ${styleVariables['offset']} ) * 2 )`,
    top: `calc( -1 * ( ${styleVariables['tip-size']} + ${styleVariables['offset']} ) )`,
    left: `calc( -1 * ( ${styleVariables['tip-size']} + ${styleVariables['offset']} ) )`,
    pointerEvents: 'all',
    background: 'transparent'
  },
  _bubbleTip: {
    position: 'absolute',
    width: '0',
    height: '0',
    borderLeft: `${styleVariables['tip-size']} solid transparent`,
    borderRight: `${styleVariables['tip-size']} solid transparent`,
    borderBottomWidth: styleVariables['tip-size'],
    borderBottomStyle: 'solid',
    borderBottomColor: 'inherit'
  }
};

const styleTransforms = {
  positive: {
    active: `calc( 100% + ${styleVariables['tip-size']} + ${styleVariables['offset']} )`,
    inactive: `calc( 100% + ${styleVariables['tip-size']} + ${styleVariables['offset']} + ${styleVariables['distance']} )`
  },
  negative: {
    active: `calc( -100% - ${styleVariables['tip-size']} - ${styleVariables['offset']} )`,
    inactive: `calc( -100% - ${styleVariables['tip-size']} - ${styleVariables['offset']} - ${styleVariables['distance']} )`
  }
};

const styleDirections = {
    x: {
      east: styleTransforms.positive,
      west: styleTransforms.negative
    },
    y: {
      south: styleTransforms.positive,
      north: styleTransforms.negative,
    }
};

const styleRoundings = {
  south: {
    left: [0,1,1,1],
    right: [1,0,1,1]
  },
  north: {
    left: [1,1,0,1],
    right: [1,1,1,0]
  },
  east: {
    left: [0,1,1,1],
    right: [1,1,1,0]
  },
  west: {
    left: [1,0,1,1],
    right: [1,1,0,1]
  }
};

const evalAnchor = (left, anchor) => anchor ? ( (anchor === 'left' && left) || (anchor === 'right' && !left) ? 0 : 'auto' ) : left ? '50%' : 'auto';

const stylePositions = {
  south: {
    left: evalAnchor.bind(this, true),
    right: evalAnchor.bind(this, false),
    top: (anchor, tip) => tip ? `calc( 2px - ${styleVariables['tip-size']} )` : 'auto',
    bottom: (anchor, tip) => tip ? 'auto' : 0
  },
  north: {
    left: (anchor, tip) => evalAnchor(true, tip && anchor ? anchor === 'left' ? 'right' : 'left' : anchor),
    right: (anchor, tip) => evalAnchor(false, tip && anchor ? anchor === 'left' ? 'right' : 'left' : anchor),
    top: (anchor, tip) => tip ? 'auto' : 0,
    bottom: (anchor, tip) => tip ? `calc( 2px - ${styleVariables['tip-size']} )` : 'auto'
  },
  east: {
    left: (anchor, tip) => tip ? `calc( 2px - ${styleVariables['tip-size']} )` : 'auto',
    right: (anchor, tip) => tip ? 'auto' : 0,
    top: (anchor, tip) => tip ? evalAnchor(true, anchor) : !anchor || (anchor === 'left') ? '50%' : 'auto',
    bottom: (anchor, tip) => tip ? evalAnchor(false, anchor) : anchor === 'right' ? '50%' : 'auto'
  },
  west: {
    left: (anchor, tip) => tip ? 'auto' : 0,
    right: (anchor, tip) => tip ? `calc( 2px - ${styleVariables['tip-size']} )` : 'auto',
    top: (anchor, tip) => tip ? evalAnchor(true, anchor) : !anchor || (anchor === 'left') ? '50%' : 'auto',
    bottom: (anchor, tip) => tip ? evalAnchor(false, anchor) : anchor === 'right' ? '50%' : 'auto'
  }
};

const tipTransforms = {
  south: {
    center: 'translate(-50%, 0)',
    left: 'translate(-25%, 50%) rotate(90deg)',
    right: 'translate(25%, 50%) rotate(-90deg)'
  },
  north: {
    center: 'translate(-50%, 0) rotate(180deg)',
    left: 'translate(25%, -50%) rotate(-90deg)',
    right: 'translate(-25%, -50%) rotate(90deg)'
  },
  east: {
    center: 'translate(-25%, -50%) rotate(-90deg)',
    left: 'translate(0, 0) rotate(180deg)',
    right: 'translate(0, 0)'
  },
  west: {
    center: 'translate(25%, -50%) rotate(90deg)',
    left: 'translate(0, 0) rotate(180deg)',
    right: 'translate(0, 0)'
  }


};

const setDirectionSpecificStyles = (element, config, activeOrInactive) => {

  let direction = config.direction || 'south',
      anchor = config.anchor;

  const setBubbleTransform = xy => ( typeof styleDirections[xy][direction] === 'object' && styleDirections[xy][direction][activeOrInactive] ) || ( anchor ? '0' : '-50%' );

  element.style.transform = `translate(${setBubbleTransform('x')}, ${setBubbleTransform('y')})`;

  if (activeOrInactive === 'active') return;

  element._elementInteractive.style.display = element._bind ? 'block' : 'none';

  element._elementTip.style.transform = tipTransforms[direction][anchor || 'center'];

  ['left', 'right', 'top', 'bottom'].forEach( position => {
    element.style[position] = stylePositions[direction][position](anchor);
    element._elementTip.style[position] = stylePositions[direction][position](anchor, true);
  });

  element.style.borderRadius = (styleRoundings[direction][anchor] || [1]).reduce( (str, chk) => { return str += (chk ? config.borderRadius || styleVariables['rounding'] : 0) + ' '; }, '');

};

const appendStyles = (element, keys, init) => {

  let config = element._config || {};

  keys = typeof keys === 'string' ? [keys] : keys;

  for (let key of keys) {

      let active = key === '_bubbleActive',
          preactive = key === '_bubblePreactive',

          still = active && config.transitionOff,
          background = preactive && config.background,
          color = preactive && config.color,
          fontsize = preactive && config.fontSize;

      for (let style in styles[key]) {
        element.style[style] = init ? styles[key][style]
          : style === 'transitionDuration' && still ? '0s'
          : (style === 'background' || style === 'borderBottomColor') && background ? background
          : style === 'color' && color ? color
          : style === 'fontSize' && fontsize ? fontsize
          : styles[key][style];
      }

      if (!init && (active || preactive)) setDirectionSpecificStyles(element, config, active ? 'active' : 'inactive');

  }

};

const setMethodProxies = () => {

  bubb.update = () => update.apply(this, arguments);
  bubb.add = bubb.refresh = bubb.remove = () => addOrRemove.apply(this, arguments);

};

const createBubbElements = () => {

  bubb._element = document.createElement('bubb-bobb');

  let element = bubb._element,
      tagMap = {
        _elementInteractive: 'bubb-bridge',
        _elementTip: 'bubb-tip',
        _elementContent: 'bubb-content'
      };

  for (let tag in tagMap) {
    element[tag] = document.createElement(tagMap[tag]);
    element.appendChild(element[tag]);
  }

  appendStyles(element, ['_bubble', '_bubbleInactive'], true);
  appendStyles(element._elementTip, '_bubbleTip', true);
  appendStyles(element._elementInteractive, '_bubbleInteractive', true);

  // BAD method to NOT show the initially unassigned bubble.
  // visibility:hidden (display:none breaks transitions) renders white-space at end of document.body

  let hidden = document.createElement('bubb-crib');
      hidden.style.display = 'none';
      hidden.appendChild(element);
      document.body.appendChild(hidden);

};

const listenToBubbEvents = () => {

  const hideOrKeep = () => bubb._element._bind || appendStyles(bubb._element, '_bubbleInactive', true);
  bubb._element.addEventListener(isMobile ? 'touchstart' : 'mouseenter', hideOrKeep, false);

};

const initBubb = () => {

  bubb.initialized = true;

  setMethodProxies();
  createBubbElements();
  listenToBubbEvents();

};

const availableOptions = [
  'callback',
  'hoverCallback',
  'background',
  'color',
  'transitionOff',
  'interactive',
  'delay',
  'width',
  'fontSize',
  'class',
  'anchor',
  'direction',
  'borderRadius'
];

const isMobile = (typeof window.orientation !== "undefined") || ~window.navigator.userAgent.indexOf('IEMobile') ? true : false;

typeof module !== 'undefined' && module.exports ? module.exports = bubb : window.bubb = bubb;

})(window, document);
