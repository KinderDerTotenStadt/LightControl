/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../../.local/share/pnpm/global/5/.pnpm/events@3.3.0/node_modules/events/events.js":
/*!***********************************************************************************************!*\
  !*** ../../../../.local/share/pnpm/global/5/.pnpm/events@3.3.0/node_modules/events/events.js ***!
  \***********************************************************************************************/
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./RemoteProject.ts":
/*!**************************!*\
  !*** ./RemoteProject.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./Throttle */ "./Throttle.ts");
class RemoteProject {
    constructor() {
        this.devices = {};
        this.ws = new WebSocket(`wss://${window.location.host}/api/`);
        let send = ((data) => {
            this.ws.send(JSON.stringify(data));
        }).throttle(100);
        this.ready = new Promise((reoslve) => {
            this.ws.addEventListener('error', console.error);
            this.ws.addEventListener('open', () => {
                this.ws.addEventListener('message', ({ data }) => {
                    let json = JSON.parse(data);
                    Object.entries(json).forEach(([id, device]) => {
                        if (this.devices[id] == null) {
                            this.devices[id] = {};
                            Object.entries(device).forEach(([property, value]) => {
                                Object.defineProperty(this.devices[id], property, {
                                    get: () => value,
                                    set: (newValue) => {
                                        value = newValue;
                                        send({ [id]: { [property]: value } });
                                    }
                                });
                            });
                        }
                        else {
                        }
                    });
                    reoslve(this);
                });
            });
        });
    }
}
exports["default"] = RemoteProject;


/***/ }),

/***/ "./Throttle.ts":
/*!*********************!*\
  !*** ./Throttle.ts ***!
  \*********************/
/***/ (() => {


Function.prototype.throttle = function (minimumDistance) {
    let timeout, lastCalled = 0, throttledFunction = this;
    function throttleCore() {
        let context = this;
        function callThrottledFunction(args) {
            lastCalled = Date.now();
            throttledFunction.apply(context, args);
        }
        // Wartezeit bis zum nächsten Aufruf bestimmen
        let timeToNextCall = minimumDistance - (Date.now() - lastCalled);
        // Egal was kommt, einen noch offenen alten Call löschen
        cancelTimer();
        // Aufruf direkt durchführen oder um offene Wartezeit verzögern
        if (timeToNextCall < 0) {
            callThrottledFunction(arguments);
        }
        else {
            timeout = setTimeout(callThrottledFunction, timeToNextCall, arguments);
        }
    }
    function cancelTimer() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    }
    // Aufsperre aufheben und gepeicherte Rest-Aufrufe löschen
    throttleCore.reset = function () {
        cancelTimer();
        lastCalled = 0;
    };
    return throttleCore;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!******************!*\
  !*** ./index.ts ***!
  \******************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const events_1 = __webpack_require__(/*! events */ "../../../../.local/share/pnpm/global/5/.pnpm/events@3.3.0/node_modules/events/events.js");
const RemoteProject_1 = __webpack_require__(/*! ./RemoteProject */ "./RemoteProject.ts");
async function connect() {
    const device = (await navigator.hid.requestDevice({ filters: [{ productId: 4613, vendorId: 10462 }] }))[0];
    if (device == null)
        return;
    await setup(device);
}
document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('#controller-status > button')?.addEventListener('click', connect);
    const device = (await navigator.hid.getDevices()).find(device => device.productId == 4613 && device.vendorId == 10462);
    if (device == null)
        return;
    await setup(device);
});
async function setup(device) {
    let steamdeck = await new Steamdeck(device).ready;
    let project = await new RemoteProject_1.default().ready;
    let controllerStatusButton = document.querySelector('#controller-status > button');
    if (controllerStatusButton != null)
        controllerStatusButton.outerHTML = "Connected";
    window.project = project;
    let movingheadLeft = project.devices['Movinghead/Left'];
    let movingheadRight = project.devices['Movinghead/Right'];
    let parZugLeft = project.devices['Zug/Left'];
    let parZugRight = project.devices['Zug/Right'];
    setupSpot(steamdeck, "left", movingheadLeft);
    setupSpot(steamdeck, "right", movingheadRight);
    steamdeck.on(`button:y:pressed`, () => {
        movingheadLeft.color = 6;
        movingheadRight.color = 6;
        parZugLeft.color.r = 0;
        parZugLeft.color.g = 0;
        parZugLeft.color.b = 255;
        parZugRight.color.r = 0;
        parZugRight.color.g = 0;
        parZugRight.color.b = 255;
    });
    steamdeck.on(`button:b:pressed`, () => {
        movingheadLeft.color = 2;
        movingheadRight.color = 2;
        parZugLeft.color.r = 0;
        parZugLeft.color.g = 255;
        parZugLeft.color.b = 0;
        parZugRight.color.r = 0;
        parZugRight.color.g = 255;
        parZugRight.color.b = 0;
    });
    steamdeck.on(`button:x:pressed`, () => {
        movingheadLeft.color = 0;
        movingheadRight.color = 0;
        parZugLeft.color.r = 0;
        parZugLeft.color.g = 0;
        parZugLeft.color.b = 0;
        parZugRight.color.r = 0;
        parZugRight.color.g = 0;
        parZugRight.color.b = 0;
    });
    steamdeck.on(`button:a:pressed`, () => {
        movingheadLeft.color = 4;
        movingheadRight.color = 4;
        parZugLeft.color.r = 255;
        parZugLeft.color.g = 255;
        parZugLeft.color.b = 0;
        parZugRight.color.r = 255;
        parZugRight.color.g = 255;
        parZugRight.color.b = 0;
    });
}
function setupSpot(steamdeck, side, movinghead) {
    steamdeck.on(`joystick:${side}:position:changed`, (position) => {
        movinghead.pan = Math.max(0, Math.min(540, movinghead.pan + position.x / 32767 * 4));
        movinghead.tilt = Math.max(0, Math.min(280, movinghead.tilt - position.y / 32767 * 4));
    });
    steamdeck.on(`button:${side.substring(0, 1)}1:pressed`, () => movinghead.strobe = movinghead.strobe == 8 ? 0 : 8);
}
class Steamdeck extends events_1.EventEmitter {
    constructor(device) {
        super();
        this.state = new SteamdeckInputPacket(new DataView(new ArrayBuffer(64)));
        this.oldState = new SteamdeckInputPacket(new DataView(new ArrayBuffer(64)));
        this.ready = new Promise(async (resolve) => {
            if (!device.opened)
                await device.open();
            device.addEventListener('inputreport', ({ data }) => this.emit('data', new SteamdeckInputPacket(data)));
            this.on('data', (data) => {
                this.state = data;
                Object.entries(data.buttons).forEach(([button, state]) => {
                    if (this.oldState.buttons[button] == state)
                        return;
                    this.emit(`button:${button}:changed`, state);
                    if (state)
                        this.emit(`button:${button}:pressed`);
                    else
                        this.emit(`button:${button}:released`);
                });
                Object.entries(data.dpad).forEach(([button, state]) => {
                    if (this.oldState.dpad[button] == state)
                        return;
                    this.emit(`dpad:${button}:changed`, state);
                    if (state)
                        this.emit(`dpad:${button}:pressed`);
                    else
                        this.emit(`dpad:${button}:released`);
                });
                Object.entries(data.trigger).forEach(([trigger, state]) => {
                    if (this.oldState.trigger[trigger] == state)
                        return;
                    this.emit(`trigger:${trigger}:changed`, state);
                });
                Object.entries(data.joystick).forEach(([joystick, state]) => {
                    let oldJoystick = this.oldState.joystick[joystick];
                    if (oldJoystick.click != state.click) {
                        this.emit(`joystick:${joystick}:click:changed`, state.click);
                        if (state.click)
                            this.emit(`joystick:${joystick}:click:pressed`);
                        else
                            this.emit(`joystick:${joystick}:click:released`);
                    }
                    ;
                    if (oldJoystick.touch != state.touch) {
                        this.emit(`joystick:${joystick}:touch:changed`, state.touch);
                        if (state.touch)
                            this.emit(`joystick:${joystick}:touch:pressed`);
                        else
                            this.emit(`joystick:${joystick}:touch:released`);
                    }
                    ;
                    if (Math.abs(state.position.x) > 5000 || Math.abs(state.position.y) > 5000) {
                        this.emit(`joystick:${joystick}:position:changed`, state.position);
                    }
                });
                Object.entries(data.touchpad).forEach(([touchpad, state]) => {
                    let oldTouchpad = this.oldState.touchpad[touchpad];
                    if (oldTouchpad.click != state.click) {
                        this.emit(`touchpad:${touchpad}:click:changed`, state.click);
                        if (state.click)
                            this.emit(`touchpad:${touchpad}:click:pressed`);
                        else
                            this.emit(`touchpad:${touchpad}:click:released`);
                    }
                    ;
                    if (oldTouchpad.touch != state.touch) {
                        this.emit(`touchpad:${touchpad}:touch:changed`, state.touch);
                        if (state.touch)
                            this.emit(`touchpad:${touchpad}:touch:pressed`);
                        else
                            this.emit(`touchpad:${touchpad}:touch:released`);
                    }
                    ;
                    if (oldTouchpad.pressure != state.pressure) {
                        this.emit(`touchpad:${touchpad}:pressure:changed`, state.position);
                    }
                    if (oldTouchpad.position.x != state.position.x || oldTouchpad.position.y != state.position.y) {
                        this.emit(`touchpad:${touchpad}:position:changed`, state.position);
                    }
                });
                this.oldState = data;
            });
            resolve(this);
        });
    }
    onMany(events, callback) {
        events.forEach((ev) => this.on(ev, (...args) => callback(ev, ...args)));
    }
}
;
;
class SteamdeckInputPacket {
    constructor(data) {
        let buttonBytes = [];
        for (let i = 0; i < 8; i++)
            buttonBytes[i] = data.getUint8(i + 8);
        this.buttons = {
            l1: ((buttonBytes[0] >> 3) & 0x1) == 1,
            r1: ((buttonBytes[0] >> 2) & 0x1) == 1,
            l2: ((buttonBytes[0] >> 1) & 0x1) == 1,
            r2: ((buttonBytes[0] >> 0) & 0x1) == 1,
            l3: ((buttonBytes[2] >> 6) & 0x1) == 1,
            r3: ((buttonBytes[3] >> 2) & 0x1) == 1,
            l4: ((buttonBytes[5] >> 1) & 0x1) == 1,
            r4: ((buttonBytes[5] >> 2) & 0x1) == 1,
            l5: ((buttonBytes[1] >> 7) & 0x1) == 1,
            r5: ((buttonBytes[2] >> 0) & 0x1) == 1,
            a: ((buttonBytes[0] >> 7) & 0x1) == 1,
            b: ((buttonBytes[0] >> 5) & 0x1) == 1,
            x: ((buttonBytes[0] >> 6) & 0x1) == 1,
            y: ((buttonBytes[0] >> 4) & 0x1) == 1,
            menu: ((buttonBytes[1] >> 4) & 0x1) == 1,
            view: ((buttonBytes[1] >> 6) & 0x1) == 1,
            steam: ((buttonBytes[1] >> 5) & 0x1) == 1,
            quickAcces: ((buttonBytes[6] >> 2) & 0x1) == 1,
        };
        this.dpad = {
            up: ((buttonBytes[1] >> 0) & 0x1) == 1,
            right: ((buttonBytes[1] >> 1) & 0x1) == 1,
            left: ((buttonBytes[1] >> 2) & 0x1) == 1,
            down: ((buttonBytes[1] >> 3) & 0x1) == 1,
        };
        this.trigger = {
            left: data.getInt16(44, true),
            right: data.getInt16(46, true)
        };
        this.touchpad = {
            left: this.readTouchpad(data, [10, 3, 10, 1, 56, 16]),
            right: this.readTouchpad(data, [10, 4, 10, 2, 58, 20]),
        };
        this.joystick = {
            left: this.readJoystick(data, [13, 6, 10, 6, 48]),
            right: this.readJoystick(data, [13, 7, 11, 2, 52]),
        };
        this.gyroscope = [];
    }
    readTouchpad(data, addresses) {
        return {
            touch: ((data.getUint8(addresses[0]) >> addresses[1]) & 0x1) == 1,
            click: ((data.getUint8(addresses[2]) >> addresses[3]) & 0x1) == 1,
            pressure: data.getInt16(addresses[4], true),
            position: {
                x: data.getInt16(addresses[5], true),
                y: data.getInt16(addresses[5] + 2, true)
            }
        };
    }
    readJoystick(data, addresses) {
        return {
            touch: ((data.getUint8(addresses[0]) >> addresses[1]) & 0x1) == 1,
            click: ((data.getUint8(addresses[2]) >> addresses[3]) & 0x1) == 1,
            position: {
                x: data.getInt16(addresses[4], true),
                y: data.getInt16(addresses[4] + 2, true)
            }
        };
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUEsa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixpQkFBaUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7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QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsT0FBTztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vLi4vLmxvY2FsL3NoYXJlL3BucG0vZ2xvYmFsLzUvLnBucG0vZXZlbnRzQDMuMy4wL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovLy8uL1JlbW90ZVByb2plY3QudHMiLCJ3ZWJwYWNrOi8vLy4vVGhyb3R0bGUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSID0gdHlwZW9mIFJlZmxlY3QgPT09ICdvYmplY3QnID8gUmVmbGVjdCA6IG51bGxcbnZhciBSZWZsZWN0QXBwbHkgPSBSICYmIHR5cGVvZiBSLmFwcGx5ID09PSAnZnVuY3Rpb24nXG4gID8gUi5hcHBseVxuICA6IGZ1bmN0aW9uIFJlZmxlY3RBcHBseSh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpO1xuICB9XG5cbnZhciBSZWZsZWN0T3duS2V5c1xuaWYgKFIgJiYgdHlwZW9mIFIub3duS2V5cyA9PT0gJ2Z1bmN0aW9uJykge1xuICBSZWZsZWN0T3duS2V5cyA9IFIub3duS2V5c1xufSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gZnVuY3Rpb24gUmVmbGVjdE93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldClcbiAgICAgIC5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKTtcbiAgfTtcbn0gZWxzZSB7XG4gIFJlZmxlY3RPd25LZXlzID0gZnVuY3Rpb24gUmVmbGVjdE93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIFByb2Nlc3NFbWl0V2FybmluZyh3YXJuaW5nKSB7XG4gIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2FybikgY29uc29sZS53YXJuKHdhcm5pbmcpO1xufVxuXG52YXIgTnVtYmVySXNOYU4gPSBOdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gTnVtYmVySXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICBFdmVudEVtaXR0ZXIuaW5pdC5jYWxsKHRoaXMpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5tb2R1bGUuZXhwb3J0cy5vbmNlID0gb25jZTtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHNDb3VudCA9IDA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbmZ1bmN0aW9uIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgbGlzdGVuZXIpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIsICdkZWZhdWx0TWF4TGlzdGVuZXJzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyB8fCBhcmcgPCAwIHx8IE51bWJlcklzTmFOKGFyZykpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJkZWZhdWx0TWF4TGlzdGVuZXJzXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIGFyZyArICcuJyk7XG4gICAgfVxuICAgIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSBhcmc7XG4gIH1cbn0pO1xuXG5FdmVudEVtaXR0ZXIuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gIGlmICh0aGlzLl9ldmVudHMgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5fZXZlbnRzID09PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuX2V2ZW50cykge1xuICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn07XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycyhuKSB7XG4gIGlmICh0eXBlb2YgbiAhPT0gJ251bWJlcicgfHwgbiA8IDAgfHwgTnVtYmVySXNOYU4obikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiblwiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBuICsgJy4nKTtcbiAgfVxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIF9nZXRNYXhMaXN0ZW5lcnModGhhdCkge1xuICBpZiAodGhhdC5fbWF4TGlzdGVuZXJzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICByZXR1cm4gdGhhdC5fbWF4TGlzdGVuZXJzO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmdldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuIF9nZXRNYXhMaXN0ZW5lcnModGhpcyk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUpIHtcbiAgdmFyIGFyZ3MgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICB2YXIgZG9FcnJvciA9ICh0eXBlID09PSAnZXJyb3InKTtcblxuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpXG4gICAgZG9FcnJvciA9IChkb0Vycm9yICYmIGV2ZW50cy5lcnJvciA9PT0gdW5kZWZpbmVkKTtcbiAgZWxzZSBpZiAoIWRvRXJyb3IpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKGRvRXJyb3IpIHtcbiAgICB2YXIgZXI7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMClcbiAgICAgIGVyID0gYXJnc1swXTtcbiAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgLy8gTm90ZTogVGhlIGNvbW1lbnRzIG9uIHRoZSBgdGhyb3dgIGxpbmVzIGFyZSBpbnRlbnRpb25hbCwgdGhleSBzaG93XG4gICAgICAvLyB1cCBpbiBOb2RlJ3Mgb3V0cHV0IGlmIHRoaXMgcmVzdWx0cyBpbiBhbiB1bmhhbmRsZWQgZXhjZXB0aW9uLlxuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgfVxuICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmhhbmRsZWQgZXJyb3IuJyArIChlciA/ICcgKCcgKyBlci5tZXNzYWdlICsgJyknIDogJycpKTtcbiAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgIHRocm93IGVycjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgfVxuXG4gIHZhciBoYW5kbGVyID0gZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChoYW5kbGVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFJlZmxlY3RBcHBseShoYW5kbGVyLCB0aGlzLCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgdmFyIGxpc3RlbmVycyA9IGFycmF5Q2xvbmUoaGFuZGxlciwgbGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgUmVmbGVjdEFwcGx5KGxpc3RlbmVyc1tpXSwgdGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBwcmVwZW5kKSB7XG4gIHZhciBtO1xuICB2YXIgZXZlbnRzO1xuICB2YXIgZXhpc3Rpbmc7XG5cbiAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0YXJnZXQuX2V2ZW50c0NvdW50ID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAgIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgICBpZiAoZXZlbnRzLm5ld0xpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRhcmdldC5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA/IGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gICAgICAvLyBSZS1hc3NpZ24gYGV2ZW50c2AgYmVjYXVzZSBhIG5ld0xpc3RlbmVyIGhhbmRsZXIgY291bGQgaGF2ZSBjYXVzZWQgdGhlXG4gICAgICAvLyB0aGlzLl9ldmVudHMgdG8gYmUgYXNzaWduZWQgdG8gYSBuZXcgb2JqZWN0XG4gICAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgICB9XG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV07XG4gIH1cblxuICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gICAgKyt0YXJnZXQuX2V2ZW50c0NvdW50O1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPVxuICAgICAgICBwcmVwZW5kID8gW2xpc3RlbmVyLCBleGlzdGluZ10gOiBbZXhpc3RpbmcsIGxpc3RlbmVyXTtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB9IGVsc2UgaWYgKHByZXBlbmQpIHtcbiAgICAgIGV4aXN0aW5nLnVuc2hpZnQobGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGlzdGluZy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIG0gPSBfZ2V0TWF4TGlzdGVuZXJzKHRhcmdldCk7XG4gICAgaWYgKG0gPiAwICYmIGV4aXN0aW5nLmxlbmd0aCA+IG0gJiYgIWV4aXN0aW5nLndhcm5lZCkge1xuICAgICAgZXhpc3Rpbmcud2FybmVkID0gdHJ1ZTtcbiAgICAgIC8vIE5vIGVycm9yIGNvZGUgZm9yIHRoaXMgc2luY2UgaXQgaXMgYSBXYXJuaW5nXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgIHZhciB3ID0gbmV3IEVycm9yKCdQb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5IGxlYWsgZGV0ZWN0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZy5sZW5ndGggKyAnICcgKyBTdHJpbmcodHlwZSkgKyAnIGxpc3RlbmVycyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2luY3JlYXNlIGxpbWl0Jyk7XG4gICAgICB3Lm5hbWUgPSAnTWF4TGlzdGVuZXJzRXhjZWVkZWRXYXJuaW5nJztcbiAgICAgIHcuZW1pdHRlciA9IHRhcmdldDtcbiAgICAgIHcudHlwZSA9IHR5cGU7XG4gICAgICB3LmNvdW50ID0gZXhpc3RpbmcubGVuZ3RoO1xuICAgICAgUHJvY2Vzc0VtaXRXYXJuaW5nKHcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfTtcblxuZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gIGlmICghdGhpcy5maXJlZCkge1xuICAgIHRoaXMudGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy53cmFwRm4pO1xuICAgIHRoaXMuZmlyZWQgPSB0cnVlO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCk7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuYXBwbHkodGhpcy50YXJnZXQsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX29uY2VXcmFwKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHN0YXRlID0geyBmaXJlZDogZmFsc2UsIHdyYXBGbjogdW5kZWZpbmVkLCB0YXJnZXQ6IHRhcmdldCwgdHlwZTogdHlwZSwgbGlzdGVuZXI6IGxpc3RlbmVyIH07XG4gIHZhciB3cmFwcGVkID0gb25jZVdyYXBwZXIuYmluZChzdGF0ZSk7XG4gIHdyYXBwZWQubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgc3RhdGUud3JhcEZuID0gd3JhcHBlZDtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UodHlwZSwgbGlzdGVuZXIpIHtcbiAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIHRoaXMub24odHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kT25jZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kT25jZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgIHRoaXMucHJlcGVuZExpc3RlbmVyKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuLy8gRW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmIGFuZCBvbmx5IGlmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgbGlzdCwgZXZlbnRzLCBwb3NpdGlvbiwgaSwgb3JpZ2luYWxMaXN0ZW5lcjtcblxuICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGxpc3QgPSBldmVudHNbdHlwZV07XG4gICAgICBpZiAobGlzdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8IGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0Lmxpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGlzdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwb3NpdGlvbiA9IC0xO1xuXG4gICAgICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHwgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsTGlzdGVuZXIgPSBsaXN0W2ldLmxpc3RlbmVyO1xuICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAocG9zaXRpb24gPT09IDApXG4gICAgICAgICAgbGlzdC5zaGlmdCgpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzcGxpY2VPbmUobGlzdCwgcG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKVxuICAgICAgICAgIGV2ZW50c1t0eXBlXSA9IGxpc3RbMF07XG5cbiAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBvcmlnaW5hbExpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMsIGV2ZW50cywgaTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRzW3R5cGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV2ZW50cyk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV07XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTElGTyBvcmRlclxuICAgICAgICBmb3IgKGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuZnVuY3Rpb24gX2xpc3RlbmVycyh0YXJnZXQsIHR5cGUsIHVud3JhcCkge1xuICB2YXIgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcbiAgaWYgKGV2bGlzdGVuZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB1bndyYXAgPyBbZXZsaXN0ZW5lci5saXN0ZW5lciB8fCBldmxpc3RlbmVyXSA6IFtldmxpc3RlbmVyXTtcblxuICByZXR1cm4gdW53cmFwID9cbiAgICB1bndyYXBMaXN0ZW5lcnMoZXZsaXN0ZW5lcikgOiBhcnJheUNsb25lKGV2bGlzdGVuZXIsIGV2bGlzdGVuZXIubGVuZ3RoKTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCB0cnVlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmF3TGlzdGVuZXJzID0gZnVuY3Rpb24gcmF3TGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsIHR5cGUpO1xuICB9XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBsaXN0ZW5lckNvdW50O1xuZnVuY3Rpb24gbGlzdGVuZXJDb3VudCh0eXBlKSB7XG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG5cbiAgICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoZXZsaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHJldHVybiB0aGlzLl9ldmVudHNDb3VudCA+IDAgPyBSZWZsZWN0T3duS2V5cyh0aGlzLl9ldmVudHMpIDogW107XG59O1xuXG5mdW5jdGlvbiBhcnJheUNsb25lKGFyciwgbikge1xuICB2YXIgY29weSA9IG5ldyBBcnJheShuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpXG4gICAgY29weVtpXSA9IGFycltpXTtcbiAgcmV0dXJuIGNvcHk7XG59XG5cbmZ1bmN0aW9uIHNwbGljZU9uZShsaXN0LCBpbmRleCkge1xuICBmb3IgKDsgaW5kZXggKyAxIDwgbGlzdC5sZW5ndGg7IGluZGV4KyspXG4gICAgbGlzdFtpbmRleF0gPSBsaXN0W2luZGV4ICsgMV07XG4gIGxpc3QucG9wKCk7XG59XG5cbmZ1bmN0aW9uIHVud3JhcExpc3RlbmVycyhhcnIpIHtcbiAgdmFyIHJldCA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXQubGVuZ3RoOyArK2kpIHtcbiAgICByZXRbaV0gPSBhcnJbaV0ubGlzdGVuZXIgfHwgYXJyW2ldO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIG9uY2UoZW1pdHRlciwgbmFtZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGZ1bmN0aW9uIGVycm9yTGlzdGVuZXIoZXJyKSB7XG4gICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKG5hbWUsIHJlc29sdmVyKTtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVyKCkge1xuICAgICAgaWYgKHR5cGVvZiBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICByZXNvbHZlKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfTtcblxuICAgIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCByZXNvbHZlciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIGlmIChuYW1lICE9PSAnZXJyb3InKSB7XG4gICAgICBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBlcnJvckxpc3RlbmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgaGFuZGxlciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsICdlcnJvcicsIGhhbmRsZXIsIGZsYWdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgbGlzdGVuZXIsIGZsYWdzKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChmbGFncy5vbmNlKSB7XG4gICAgICBlbWl0dGVyLm9uY2UobmFtZSwgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbWl0dGVyLm9uKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIEV2ZW50VGFyZ2V0IGRvZXMgbm90IGhhdmUgYGVycm9yYCBldmVudCBzZW1hbnRpY3MgbGlrZSBOb2RlXG4gICAgLy8gRXZlbnRFbWl0dGVycywgd2UgZG8gbm90IGxpc3RlbiBmb3IgYGVycm9yYCBldmVudHMgaGVyZS5cbiAgICBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZnVuY3Rpb24gd3JhcExpc3RlbmVyKGFyZykge1xuICAgICAgLy8gSUUgZG9lcyBub3QgaGF2ZSBidWlsdGluIGB7IG9uY2U6IHRydWUgfWAgc3VwcG9ydCBzbyB3ZVxuICAgICAgLy8gaGF2ZSB0byBkbyBpdCBtYW51YWxseS5cbiAgICAgIGlmIChmbGFncy5vbmNlKSB7XG4gICAgICAgIGVtaXR0ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCB3cmFwTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgbGlzdGVuZXIoYXJnKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJlbWl0dGVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEV2ZW50RW1pdHRlci4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGVtaXR0ZXIpO1xuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnJlcXVpcmUoXCIuL1Rocm90dGxlXCIpO1xuY2xhc3MgUmVtb3RlUHJvamVjdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGV2aWNlcyA9IHt9O1xuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChgd3NzOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0vYXBpL2ApO1xuICAgICAgICBsZXQgc2VuZCA9ICgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSkudGhyb3R0bGUoMTAwKTtcbiAgICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZW9zbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgY29uc29sZS5lcnJvcik7XG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKHsgZGF0YSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBqc29uID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoanNvbikuZm9yRWFjaCgoW2lkLCBkZXZpY2VdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXZpY2VzW2lkXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXZpY2VzW2lkXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRldmljZSkuZm9yRWFjaCgoW3Byb3BlcnR5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZGV2aWNlc1tpZF0sIHByb3BlcnR5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0OiAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmQoeyBbaWRdOiB7IFtwcm9wZXJ0eV06IHZhbHVlIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZW9zbHZlKHRoaXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFJlbW90ZVByb2plY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbkZ1bmN0aW9uLnByb3RvdHlwZS50aHJvdHRsZSA9IGZ1bmN0aW9uIChtaW5pbXVtRGlzdGFuY2UpIHtcbiAgICBsZXQgdGltZW91dCwgbGFzdENhbGxlZCA9IDAsIHRocm90dGxlZEZ1bmN0aW9uID0gdGhpcztcbiAgICBmdW5jdGlvbiB0aHJvdHRsZUNvcmUoKSB7XG4gICAgICAgIGxldCBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgZnVuY3Rpb24gY2FsbFRocm90dGxlZEZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgIGxhc3RDYWxsZWQgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGhyb3R0bGVkRnVuY3Rpb24uYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2FydGV6ZWl0IGJpcyB6dW0gbsOkY2hzdGVuIEF1ZnJ1ZiBiZXN0aW1tZW5cbiAgICAgICAgbGV0IHRpbWVUb05leHRDYWxsID0gbWluaW11bURpc3RhbmNlIC0gKERhdGUubm93KCkgLSBsYXN0Q2FsbGVkKTtcbiAgICAgICAgLy8gRWdhbCB3YXMga29tbXQsIGVpbmVuIG5vY2ggb2ZmZW5lbiBhbHRlbiBDYWxsIGzDtnNjaGVuXG4gICAgICAgIGNhbmNlbFRpbWVyKCk7XG4gICAgICAgIC8vIEF1ZnJ1ZiBkaXJla3QgZHVyY2hmw7xocmVuIG9kZXIgdW0gb2ZmZW5lIFdhcnRlemVpdCB2ZXJ6w7ZnZXJuXG4gICAgICAgIGlmICh0aW1lVG9OZXh0Q2FsbCA8IDApIHtcbiAgICAgICAgICAgIGNhbGxUaHJvdHRsZWRGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoY2FsbFRocm90dGxlZEZ1bmN0aW9uLCB0aW1lVG9OZXh0Q2FsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBjYW5jZWxUaW1lcigpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEF1ZnNwZXJyZSBhdWZoZWJlbiB1bmQgZ2VwZWljaGVydGUgUmVzdC1BdWZydWZlIGzDtnNjaGVuXG4gICAgdGhyb3R0bGVDb3JlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYW5jZWxUaW1lcigpO1xuICAgICAgICBsYXN0Q2FsbGVkID0gMDtcbiAgICB9O1xuICAgIHJldHVybiB0aHJvdHRsZUNvcmU7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuY29uc3QgUmVtb3RlUHJvamVjdF8xID0gcmVxdWlyZShcIi4vUmVtb3RlUHJvamVjdFwiKTtcbmFzeW5jIGZ1bmN0aW9uIGNvbm5lY3QoKSB7XG4gICAgY29uc3QgZGV2aWNlID0gKGF3YWl0IG5hdmlnYXRvci5oaWQucmVxdWVzdERldmljZSh7IGZpbHRlcnM6IFt7IHByb2R1Y3RJZDogNDYxMywgdmVuZG9ySWQ6IDEwNDYyIH1dIH0pKVswXTtcbiAgICBpZiAoZGV2aWNlID09IG51bGwpXG4gICAgICAgIHJldHVybjtcbiAgICBhd2FpdCBzZXR1cChkZXZpY2UpO1xufVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udHJvbGxlci1zdGF0dXMgPiBidXR0b24nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb25uZWN0KTtcbiAgICBjb25zdCBkZXZpY2UgPSAoYXdhaXQgbmF2aWdhdG9yLmhpZC5nZXREZXZpY2VzKCkpLmZpbmQoZGV2aWNlID0+IGRldmljZS5wcm9kdWN0SWQgPT0gNDYxMyAmJiBkZXZpY2UudmVuZG9ySWQgPT0gMTA0NjIpO1xuICAgIGlmIChkZXZpY2UgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuO1xuICAgIGF3YWl0IHNldHVwKGRldmljZSk7XG59KTtcbmFzeW5jIGZ1bmN0aW9uIHNldHVwKGRldmljZSkge1xuICAgIGxldCBzdGVhbWRlY2sgPSBhd2FpdCBuZXcgU3RlYW1kZWNrKGRldmljZSkucmVhZHk7XG4gICAgbGV0IHByb2plY3QgPSBhd2FpdCBuZXcgUmVtb3RlUHJvamVjdF8xLmRlZmF1bHQoKS5yZWFkeTtcbiAgICBsZXQgY29udHJvbGxlclN0YXR1c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250cm9sbGVyLXN0YXR1cyA+IGJ1dHRvbicpO1xuICAgIGlmIChjb250cm9sbGVyU3RhdHVzQnV0dG9uICE9IG51bGwpXG4gICAgICAgIGNvbnRyb2xsZXJTdGF0dXNCdXR0b24ub3V0ZXJIVE1MID0gXCJDb25uZWN0ZWRcIjtcbiAgICB3aW5kb3cucHJvamVjdCA9IHByb2plY3Q7XG4gICAgbGV0IG1vdmluZ2hlYWRMZWZ0ID0gcHJvamVjdC5kZXZpY2VzWydNb3ZpbmdoZWFkL0xlZnQnXTtcbiAgICBsZXQgbW92aW5naGVhZFJpZ2h0ID0gcHJvamVjdC5kZXZpY2VzWydNb3ZpbmdoZWFkL1JpZ2h0J107XG4gICAgbGV0IHBhclp1Z0xlZnQgPSBwcm9qZWN0LmRldmljZXNbJ1p1Zy9MZWZ0J107XG4gICAgbGV0IHBhclp1Z1JpZ2h0ID0gcHJvamVjdC5kZXZpY2VzWydadWcvUmlnaHQnXTtcbiAgICBzZXR1cFNwb3Qoc3RlYW1kZWNrLCBcImxlZnRcIiwgbW92aW5naGVhZExlZnQpO1xuICAgIHNldHVwU3BvdChzdGVhbWRlY2ssIFwicmlnaHRcIiwgbW92aW5naGVhZFJpZ2h0KTtcbiAgICBzdGVhbWRlY2sub24oYGJ1dHRvbjp5OnByZXNzZWRgLCAoKSA9PiB7XG4gICAgICAgIG1vdmluZ2hlYWRMZWZ0LmNvbG9yID0gNjtcbiAgICAgICAgbW92aW5naGVhZFJpZ2h0LmNvbG9yID0gNjtcbiAgICAgICAgcGFyWnVnTGVmdC5jb2xvci5yID0gMDtcbiAgICAgICAgcGFyWnVnTGVmdC5jb2xvci5nID0gMDtcbiAgICAgICAgcGFyWnVnTGVmdC5jb2xvci5iID0gMjU1O1xuICAgICAgICBwYXJadWdSaWdodC5jb2xvci5yID0gMDtcbiAgICAgICAgcGFyWnVnUmlnaHQuY29sb3IuZyA9IDA7XG4gICAgICAgIHBhclp1Z1JpZ2h0LmNvbG9yLmIgPSAyNTU7XG4gICAgfSk7XG4gICAgc3RlYW1kZWNrLm9uKGBidXR0b246YjpwcmVzc2VkYCwgKCkgPT4ge1xuICAgICAgICBtb3ZpbmdoZWFkTGVmdC5jb2xvciA9IDI7XG4gICAgICAgIG1vdmluZ2hlYWRSaWdodC5jb2xvciA9IDI7XG4gICAgICAgIHBhclp1Z0xlZnQuY29sb3IuciA9IDA7XG4gICAgICAgIHBhclp1Z0xlZnQuY29sb3IuZyA9IDI1NTtcbiAgICAgICAgcGFyWnVnTGVmdC5jb2xvci5iID0gMDtcbiAgICAgICAgcGFyWnVnUmlnaHQuY29sb3IuciA9IDA7XG4gICAgICAgIHBhclp1Z1JpZ2h0LmNvbG9yLmcgPSAyNTU7XG4gICAgICAgIHBhclp1Z1JpZ2h0LmNvbG9yLmIgPSAwO1xuICAgIH0pO1xuICAgIHN0ZWFtZGVjay5vbihgYnV0dG9uOng6cHJlc3NlZGAsICgpID0+IHtcbiAgICAgICAgbW92aW5naGVhZExlZnQuY29sb3IgPSAwO1xuICAgICAgICBtb3ZpbmdoZWFkUmlnaHQuY29sb3IgPSAwO1xuICAgICAgICBwYXJadWdMZWZ0LmNvbG9yLnIgPSAwO1xuICAgICAgICBwYXJadWdMZWZ0LmNvbG9yLmcgPSAwO1xuICAgICAgICBwYXJadWdMZWZ0LmNvbG9yLmIgPSAwO1xuICAgICAgICBwYXJadWdSaWdodC5jb2xvci5yID0gMDtcbiAgICAgICAgcGFyWnVnUmlnaHQuY29sb3IuZyA9IDA7XG4gICAgICAgIHBhclp1Z1JpZ2h0LmNvbG9yLmIgPSAwO1xuICAgIH0pO1xuICAgIHN0ZWFtZGVjay5vbihgYnV0dG9uOmE6cHJlc3NlZGAsICgpID0+IHtcbiAgICAgICAgbW92aW5naGVhZExlZnQuY29sb3IgPSA0O1xuICAgICAgICBtb3ZpbmdoZWFkUmlnaHQuY29sb3IgPSA0O1xuICAgICAgICBwYXJadWdMZWZ0LmNvbG9yLnIgPSAyNTU7XG4gICAgICAgIHBhclp1Z0xlZnQuY29sb3IuZyA9IDI1NTtcbiAgICAgICAgcGFyWnVnTGVmdC5jb2xvci5iID0gMDtcbiAgICAgICAgcGFyWnVnUmlnaHQuY29sb3IuciA9IDI1NTtcbiAgICAgICAgcGFyWnVnUmlnaHQuY29sb3IuZyA9IDI1NTtcbiAgICAgICAgcGFyWnVnUmlnaHQuY29sb3IuYiA9IDA7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBzZXR1cFNwb3Qoc3RlYW1kZWNrLCBzaWRlLCBtb3ZpbmdoZWFkKSB7XG4gICAgc3RlYW1kZWNrLm9uKGBqb3lzdGljazoke3NpZGV9OnBvc2l0aW9uOmNoYW5nZWRgLCAocG9zaXRpb24pID0+IHtcbiAgICAgICAgbW92aW5naGVhZC5wYW4gPSBNYXRoLm1heCgwLCBNYXRoLm1pbig1NDAsIG1vdmluZ2hlYWQucGFuICsgcG9zaXRpb24ueCAvIDMyNzY3ICogNCkpO1xuICAgICAgICBtb3ZpbmdoZWFkLnRpbHQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyODAsIG1vdmluZ2hlYWQudGlsdCAtIHBvc2l0aW9uLnkgLyAzMjc2NyAqIDQpKTtcbiAgICB9KTtcbiAgICBzdGVhbWRlY2sub24oYGJ1dHRvbjoke3NpZGUuc3Vic3RyaW5nKDAsIDEpfTE6cHJlc3NlZGAsICgpID0+IG1vdmluZ2hlYWQuc3Ryb2JlID0gbW92aW5naGVhZC5zdHJvYmUgPT0gOCA/IDAgOiA4KTtcbn1cbmNsYXNzIFN0ZWFtZGVjayBleHRlbmRzIGV2ZW50c18xLkV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoZGV2aWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgU3RlYW1kZWNrSW5wdXRQYWNrZXQobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcig2NCkpKTtcbiAgICAgICAgdGhpcy5vbGRTdGF0ZSA9IG5ldyBTdGVhbWRlY2tJbnB1dFBhY2tldChuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDY0KSkpO1xuICAgICAgICB0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGlmICghZGV2aWNlLm9wZW5lZClcbiAgICAgICAgICAgICAgICBhd2FpdCBkZXZpY2Uub3BlbigpO1xuICAgICAgICAgICAgZGV2aWNlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0cmVwb3J0JywgKHsgZGF0YSB9KSA9PiB0aGlzLmVtaXQoJ2RhdGEnLCBuZXcgU3RlYW1kZWNrSW5wdXRQYWNrZXQoZGF0YSkpKTtcbiAgICAgICAgICAgIHRoaXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEuYnV0dG9ucykuZm9yRWFjaCgoW2J1dHRvbiwgc3RhdGVdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9sZFN0YXRlLmJ1dHRvbnNbYnV0dG9uXSA9PSBzdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KGBidXR0b246JHtidXR0b259OmNoYW5nZWRgLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgYnV0dG9uOiR7YnV0dG9ufTpwcmVzc2VkYCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgYnV0dG9uOiR7YnV0dG9ufTpyZWxlYXNlZGApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEuZHBhZCkuZm9yRWFjaCgoW2J1dHRvbiwgc3RhdGVdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9sZFN0YXRlLmRwYWRbYnV0dG9uXSA9PSBzdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KGBkcGFkOiR7YnV0dG9ufTpjaGFuZ2VkYCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoYGRwYWQ6JHtidXR0b259OnByZXNzZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KGBkcGFkOiR7YnV0dG9ufTpyZWxlYXNlZGApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEudHJpZ2dlcikuZm9yRWFjaCgoW3RyaWdnZXIsIHN0YXRlXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vbGRTdGF0ZS50cmlnZ2VyW3RyaWdnZXJdID09IHN0YXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoYHRyaWdnZXI6JHt0cmlnZ2VyfTpjaGFuZ2VkYCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEuam95c3RpY2spLmZvckVhY2goKFtqb3lzdGljaywgc3RhdGVdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRKb3lzdGljayA9IHRoaXMub2xkU3RhdGUuam95c3RpY2tbam95c3RpY2tdO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkSm95c3RpY2suY2xpY2sgIT0gc3RhdGUuY2xpY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgam95c3RpY2s6JHtqb3lzdGlja306Y2xpY2s6Y2hhbmdlZGAsIHN0YXRlLmNsaWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5jbGljaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoYGpveXN0aWNrOiR7am95c3RpY2t9OmNsaWNrOnByZXNzZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoYGpveXN0aWNrOiR7am95c3RpY2t9OmNsaWNrOnJlbGVhc2VkYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkSm95c3RpY2sudG91Y2ggIT0gc3RhdGUudG91Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgam95c3RpY2s6JHtqb3lzdGlja306dG91Y2g6Y2hhbmdlZGAsIHN0YXRlLnRvdWNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS50b3VjaClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoYGpveXN0aWNrOiR7am95c3RpY2t9OnRvdWNoOnByZXNzZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoYGpveXN0aWNrOiR7am95c3RpY2t9OnRvdWNoOnJlbGVhc2VkYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc3RhdGUucG9zaXRpb24ueCkgPiA1MDAwIHx8IE1hdGguYWJzKHN0YXRlLnBvc2l0aW9uLnkpID4gNTAwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KGBqb3lzdGljazoke2pveXN0aWNrfTpwb3NpdGlvbjpjaGFuZ2VkYCwgc3RhdGUucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YS50b3VjaHBhZCkuZm9yRWFjaCgoW3RvdWNocGFkLCBzdGF0ZV0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFRvdWNocGFkID0gdGhpcy5vbGRTdGF0ZS50b3VjaHBhZFt0b3VjaHBhZF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRUb3VjaHBhZC5jbGljayAhPSBzdGF0ZS5jbGljaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KGB0b3VjaHBhZDoke3RvdWNocGFkfTpjbGljazpjaGFuZ2VkYCwgc3RhdGUuY2xpY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmNsaWNrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgdG91Y2hwYWQ6JHt0b3VjaHBhZH06Y2xpY2s6cHJlc3NlZGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgdG91Y2hwYWQ6JHt0b3VjaHBhZH06Y2xpY2s6cmVsZWFzZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRUb3VjaHBhZC50b3VjaCAhPSBzdGF0ZS50b3VjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KGB0b3VjaHBhZDoke3RvdWNocGFkfTp0b3VjaDpjaGFuZ2VkYCwgc3RhdGUudG91Y2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLnRvdWNoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgdG91Y2hwYWQ6JHt0b3VjaHBhZH06dG91Y2g6cHJlc3NlZGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChgdG91Y2hwYWQ6JHt0b3VjaHBhZH06dG91Y2g6cmVsZWFzZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRUb3VjaHBhZC5wcmVzc3VyZSAhPSBzdGF0ZS5wcmVzc3VyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KGB0b3VjaHBhZDoke3RvdWNocGFkfTpwcmVzc3VyZTpjaGFuZ2VkYCwgc3RhdGUucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRUb3VjaHBhZC5wb3NpdGlvbi54ICE9IHN0YXRlLnBvc2l0aW9uLnggfHwgb2xkVG91Y2hwYWQucG9zaXRpb24ueSAhPSBzdGF0ZS5wb3NpdGlvbi55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoYHRvdWNocGFkOiR7dG91Y2hwYWR9OnBvc2l0aW9uOmNoYW5nZWRgLCBzdGF0ZS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9sZFN0YXRlID0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uTWFueShldmVudHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGV2ZW50cy5mb3JFYWNoKChldikgPT4gdGhpcy5vbihldiwgKC4uLmFyZ3MpID0+IGNhbGxiYWNrKGV2LCAuLi5hcmdzKSkpO1xuICAgIH1cbn1cbjtcbjtcbmNsYXNzIFN0ZWFtZGVja0lucHV0UGFja2V0IHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgICAgIGxldCBidXR0b25CeXRlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKylcbiAgICAgICAgICAgIGJ1dHRvbkJ5dGVzW2ldID0gZGF0YS5nZXRVaW50OChpICsgOCk7XG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IHtcbiAgICAgICAgICAgIGwxOiAoKGJ1dHRvbkJ5dGVzWzBdID4+IDMpICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgcjE6ICgoYnV0dG9uQnl0ZXNbMF0gPj4gMikgJiAweDEpID09IDEsXG4gICAgICAgICAgICBsMjogKChidXR0b25CeXRlc1swXSA+PiAxKSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIHIyOiAoKGJ1dHRvbkJ5dGVzWzBdID4+IDApICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgbDM6ICgoYnV0dG9uQnl0ZXNbMl0gPj4gNikgJiAweDEpID09IDEsXG4gICAgICAgICAgICByMzogKChidXR0b25CeXRlc1szXSA+PiAyKSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIGw0OiAoKGJ1dHRvbkJ5dGVzWzVdID4+IDEpICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgcjQ6ICgoYnV0dG9uQnl0ZXNbNV0gPj4gMikgJiAweDEpID09IDEsXG4gICAgICAgICAgICBsNTogKChidXR0b25CeXRlc1sxXSA+PiA3KSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIHI1OiAoKGJ1dHRvbkJ5dGVzWzJdID4+IDApICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgYTogKChidXR0b25CeXRlc1swXSA+PiA3KSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIGI6ICgoYnV0dG9uQnl0ZXNbMF0gPj4gNSkgJiAweDEpID09IDEsXG4gICAgICAgICAgICB4OiAoKGJ1dHRvbkJ5dGVzWzBdID4+IDYpICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgeTogKChidXR0b25CeXRlc1swXSA+PiA0KSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIG1lbnU6ICgoYnV0dG9uQnl0ZXNbMV0gPj4gNCkgJiAweDEpID09IDEsXG4gICAgICAgICAgICB2aWV3OiAoKGJ1dHRvbkJ5dGVzWzFdID4+IDYpICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgc3RlYW06ICgoYnV0dG9uQnl0ZXNbMV0gPj4gNSkgJiAweDEpID09IDEsXG4gICAgICAgICAgICBxdWlja0FjY2VzOiAoKGJ1dHRvbkJ5dGVzWzZdID4+IDIpICYgMHgxKSA9PSAxLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRwYWQgPSB7XG4gICAgICAgICAgICB1cDogKChidXR0b25CeXRlc1sxXSA+PiAwKSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIHJpZ2h0OiAoKGJ1dHRvbkJ5dGVzWzFdID4+IDEpICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgbGVmdDogKChidXR0b25CeXRlc1sxXSA+PiAyKSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIGRvd246ICgoYnV0dG9uQnl0ZXNbMV0gPj4gMykgJiAweDEpID09IDEsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHJpZ2dlciA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGRhdGEuZ2V0SW50MTYoNDQsIHRydWUpLFxuICAgICAgICAgICAgcmlnaHQ6IGRhdGEuZ2V0SW50MTYoNDYsIHRydWUpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudG91Y2hwYWQgPSB7XG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnJlYWRUb3VjaHBhZChkYXRhLCBbMTAsIDMsIDEwLCAxLCA1NiwgMTZdKSxcbiAgICAgICAgICAgIHJpZ2h0OiB0aGlzLnJlYWRUb3VjaHBhZChkYXRhLCBbMTAsIDQsIDEwLCAyLCA1OCwgMjBdKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5qb3lzdGljayA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMucmVhZEpveXN0aWNrKGRhdGEsIFsxMywgNiwgMTAsIDYsIDQ4XSksXG4gICAgICAgICAgICByaWdodDogdGhpcy5yZWFkSm95c3RpY2soZGF0YSwgWzEzLCA3LCAxMSwgMiwgNTJdKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5neXJvc2NvcGUgPSBbXTtcbiAgICB9XG4gICAgcmVhZFRvdWNocGFkKGRhdGEsIGFkZHJlc3Nlcykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG91Y2g6ICgoZGF0YS5nZXRVaW50OChhZGRyZXNzZXNbMF0pID4+IGFkZHJlc3Nlc1sxXSkgJiAweDEpID09IDEsXG4gICAgICAgICAgICBjbGljazogKChkYXRhLmdldFVpbnQ4KGFkZHJlc3Nlc1syXSkgPj4gYWRkcmVzc2VzWzNdKSAmIDB4MSkgPT0gMSxcbiAgICAgICAgICAgIHByZXNzdXJlOiBkYXRhLmdldEludDE2KGFkZHJlc3Nlc1s0XSwgdHJ1ZSksXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IGRhdGEuZ2V0SW50MTYoYWRkcmVzc2VzWzVdLCB0cnVlKSxcbiAgICAgICAgICAgICAgICB5OiBkYXRhLmdldEludDE2KGFkZHJlc3Nlc1s1XSArIDIsIHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJlYWRKb3lzdGljayhkYXRhLCBhZGRyZXNzZXMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvdWNoOiAoKGRhdGEuZ2V0VWludDgoYWRkcmVzc2VzWzBdKSA+PiBhZGRyZXNzZXNbMV0pICYgMHgxKSA9PSAxLFxuICAgICAgICAgICAgY2xpY2s6ICgoZGF0YS5nZXRVaW50OChhZGRyZXNzZXNbMl0pID4+IGFkZHJlc3Nlc1szXSkgJiAweDEpID09IDEsXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHg6IGRhdGEuZ2V0SW50MTYoYWRkcmVzc2VzWzRdLCB0cnVlKSxcbiAgICAgICAgICAgICAgICB5OiBkYXRhLmdldEludDE2KGFkZHJlc3Nlc1s0XSArIDIsIHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9