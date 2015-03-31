define(["require", "exports", '../util', '../../../has', 'dojo/_base/lang', '../../../util'], function (require, exports, domUtil, has, lang, util) {
    var Keys;
    (function (Keys) {
        Keys[Keys["ALT"] = 18] = "ALT";
        Keys[Keys["COMMAND_LEFT"] = 91] = "COMMAND_LEFT";
        Keys[Keys["COMMAND_RIGHT"] = 93] = "COMMAND_RIGHT";
        Keys[Keys["CONTROL"] = 17] = "CONTROL";
        Keys[Keys["META"] = 224] = "META";
        Keys[Keys["SHIFT"] = 16] = "SHIFT";
    })(Keys || (Keys = {}));
    function createModifierSetter(value) {
        return function (event) {
            var isMac = navigator.platform.indexOf('Mac') === 0;
            switch (event.keyCode) {
                case 18 /* ALT */:
                    keyboard.alt = value;
                    break;
                case 91 /* COMMAND_LEFT */:
                case 93 /* COMMAND_RIGHT */:
                case 224 /* META */:
                    keyboard.meta = value;
                    keyboard.shortcut = value && isMac;
                    break;
                case 17 /* CONTROL */:
                    keyboard.control = value;
                    keyboard.shortcut = value && !isMac;
                    break;
                case 16 /* SHIFT */:
                    keyboard.shift = value;
                    break;
            }
        };
    }
    function keyDiff(oldObject, newObject) {
        return {
            buttons: oldObject.buttons !== newObject.buttons,
            clientX: oldObject.clientX !== newObject.clientX,
            clientY: oldObject.clientY !== newObject.clientY,
            height: oldObject.height !== newObject.height,
            pressure: oldObject.pressure !== newObject.pressure,
            tiltX: oldObject.tiltX !== newObject.tiltX,
            tiltY: oldObject.tiltY !== newObject.tiltY,
            width: oldObject.width !== newObject.width
        };
    }
    function mixin(target, source) {
        var _target = target;
        var _source = source;
        for (var key in _source) {
            if (key === 'lastState' || key === 'lastChanged') {
                continue;
            }
            else if (key === 'modifiers') {
                _target[key] = lang.mixin({}, _source[key]);
            }
            else {
                _target[key] = _source[key];
            }
        }
        return _target;
    }
    var keyboard = {
        alt: false,
        control: false,
        meta: false,
        shift: false,
        shortcut: false
    };
    var nativeEventMap = {
        mousedown: 'change',
        mouseenter: 'add',
        mouseleave: 'remove',
        mousemove: 'change',
        mouseup: 'change',
        MSPointerCancel: 'cancel',
        MSPointerDown: 'change',
        MSPointerEnter: 'add',
        MSPointerHover: 'change',
        MSPointerLeave: 'remove',
        MSPointerMove: 'change',
        MSPointerUp: 'change',
        pointercancel: 'cancel',
        pointerdown: 'change',
        pointerenter: 'add',
        pointerleave: 'remove',
        pointermove: 'change',
        pointerup: 'change',
        touchcancel: 'cancel',
        touchend: 'remove',
        touchmove: 'change',
        touchstart: 'add'
    };
    var PointerManager = (function () {
        function PointerManager(root) {
            this._handles = [];
            var handles = this._handles = [];
            this._listeners = {};
            var pointers = this.pointers = { numActive: 0 };
            var self = this;
            function clearPointer(pointerId) {
                var pointer = pointers[pointerId];
                mixin(pointer.lastState, pointer);
                for (var key in pointer) {
                    if (key === 'lastState' || key === 'pointerId' || key === 'pointerType' || key === 'timestamp') {
                        continue;
                    }
                    pointer[key] = null;
                }
                pointer.isActive = false;
                --pointers.numActive;
                return pointer;
            }
            if (!PointerManager._keyboardActive) {
                domUtil.on(window, 'keydown', createModifierSetter(true));
                domUtil.on(window, 'keyup', createModifierSetter(false));
                PointerManager._keyboardActive = true;
            }
            if (has('dom-pointerevents') || has('dom-mspointerevents')) {
                var pointerChanged = function (event) {
                    if (event.type === (has('dom-pointerevents') ? 'pointerenter' : 'MSPointerEnter') && event.target !== root) {
                        return;
                    }
                    var pointer = pointers[event.pointerId];
                    if (!pointer) {
                        pointer = pointers[event.pointerId] = { lastChanged: [], lastState: {} };
                    }
                    if (!pointer.isActive) {
                        if (has('dom-pointerevents')) {
                            root.setPointerCapture(event.pointerId);
                        }
                        else {
                            root.msSetPointerCapture(event.pointerId);
                        }
                        pointer.isActive = true;
                        ++pointers.numActive;
                    }
                    pointer.lastState = mixin(pointer.lastState, pointer);
                    pointer.buttons = event.buttons;
                    pointer.clientX = event.clientX;
                    pointer.clientY = event.clientY;
                    pointer.height = event.height;
                    pointer.isPrimary = event.isPrimary;
                    pointer.modifiers = lang.mixin({}, keyboard), pointer.pointerId = event.pointerId;
                    pointer.pointerType = event.pointerType;
                    pointer.pressure = event.pressure;
                    pointer.tiltX = event.tiltX;
                    pointer.tiltY = event.tiltY;
                    pointer.timestamp = event.timeStamp;
                    pointer.width = event.width;
                    pointer.lastChanged = keyDiff(pointer.lastState, pointer);
                    self._emit(event, pointer);
                };
                var pointerRemoved = function (event) {
                    if (event.type === (has('dom-pointerevents') ? 'pointerleave' : 'MSPointerLeave') && event.target !== root) {
                        return;
                    }
                    var pointer = clearPointer(event.pointerId);
                    self._emit(event, pointer);
                };
                if (has('dom-pointerevents')) {
                    handles.push(domUtil.on(root, 'pointercancel', pointerRemoved), domUtil.on(root, 'pointerdown', pointerChanged), domUtil.on(root, 'pointerenter', pointerChanged), domUtil.on(root, 'pointerleave', pointerRemoved), domUtil.on(root, 'pointermove', pointerChanged), domUtil.on(root, 'pointerup', pointerChanged));
                }
                else {
                    handles.push(domUtil.on(root, 'MSPointerCancel', pointerRemoved), domUtil.on(root, 'MSPointerDown', pointerChanged), domUtil.on(root, 'MSPointerEnter', pointerChanged), domUtil.on(root, 'MSPointerHover', pointerChanged), domUtil.on(root, 'MSPointerLeave', pointerRemoved), domUtil.on(root, 'MSPointerMove', pointerChanged), domUtil.on(root, 'MSPointerUp', pointerChanged));
                }
            }
            else {
                if (has('dom-touch')) {
                    var primaryId;
                    var FINGER_SIZE = 22;
                    var touchChanged = function (event) {
                        if (pointers[NaN] && pointers[NaN].isActive) {
                            event.preventDefault();
                            return;
                        }
                        for (var i = 0, touch; (touch = event.changedTouches[i]); ++i) {
                            var pointer = pointers[touch.identifier];
                            if (!pointer) {
                                pointer = pointers[touch.identifier] = { lastChanged: [], lastState: {} };
                            }
                            if (!pointer.isActive) {
                                pointer.isActive = true;
                                ++pointers.numActive;
                            }
                            if (!primaryId) {
                                primaryId = touch.identifier;
                            }
                            pointer.lastState = mixin(pointer.lastState, pointer);
                            pointer.buttons = 1;
                            pointer.clientX = touch.clientX;
                            pointer.clientY = touch.clientY;
                            pointer.height = FINGER_SIZE;
                            pointer.isPrimary = touch.identifier === primaryId;
                            pointer.modifiers = lang.mixin({}, keyboard), pointer.pointerId = touch.identifier;
                            pointer.pointerType = 'touch';
                            pointer.pressure = 0.5;
                            pointer.tiltX = 0;
                            pointer.tiltY = 0;
                            pointer.timestamp = event.timeStamp;
                            pointer.width = FINGER_SIZE;
                            pointer.lastChanged = keyDiff(pointer.lastState, pointer);
                            self._emit(event, pointer);
                        }
                    };
                    var touchRemoved = function (event) {
                        event.preventDefault();
                        for (var i = 0, touch; (touch = event.changedTouches[i]); ++i) {
                            var pointer = clearPointer(touch.identifier);
                            if (!event.touches.length) {
                                primaryId = null;
                            }
                            self._emit(event, pointer);
                        }
                    };
                    handles.push(domUtil.on(root, 'touchcancel', touchRemoved), domUtil.on(root, 'touchend', touchRemoved), domUtil.on(root, 'touchmove', touchChanged), domUtil.on(root, 'touchstart', touchChanged));
                }
                if (has('dom-mouse')) {
                    if (!has('dom-mouse-buttons')) {
                        var isButtonPressed = false;
                    }
                    var mouseChanged = function (event) {
                        if (pointers.numActive > 0 && (!pointers[NaN] || !pointers[NaN].isActive)) {
                            event.preventDefault();
                            return;
                        }
                        if (!has('dom-mouse-buttons')) {
                            if (event.type === 'mousedown') {
                                isButtonPressed = true;
                            }
                            else if (event.type === 'mouseup') {
                                isButtonPressed = false;
                            }
                        }
                        var pointer = pointers[NaN];
                        if (!pointer) {
                            pointer = pointers[NaN] = { lastChanged: [], lastState: {} };
                        }
                        if (event.type === 'mouseenter' && pointer.isActive) {
                            return;
                        }
                        if (!pointer.isActive) {
                            pointer.isActive = true;
                            ++pointers.numActive;
                        }
                        pointer.lastState = mixin(pointer.lastState, pointer);
                        if (has('dom-mouse-buttons')) {
                            pointer.buttons = event.buttons;
                        }
                        else {
                            var buttonMap = {
                                1: 2,
                                2: 1
                            };
                            pointer.buttons = isButtonPressed ? Math.pow(2, buttonMap[event.button] || event.button) : 0;
                        }
                        pointer.clientX = event.clientX;
                        pointer.clientY = event.clientY;
                        pointer.height = 0;
                        pointer.isPrimary = true;
                        pointer.modifiers = lang.mixin({}, keyboard), pointer.pointerId = NaN;
                        pointer.pointerType = 'mouse';
                        pointer.pressure = pointer.buttons > 0 ? 0.5 : 0;
                        pointer.tiltX = 0;
                        pointer.tiltY = 0;
                        pointer.timestamp = event.timeStamp || +new Date();
                        pointer.width = 0;
                        pointer.lastChanged = keyDiff(pointer.lastState, pointer);
                        self._emit(event, pointer);
                    };
                    var mouseRemoved = function (event) {
                        if (event.type === 'mouseleave' && event.target !== root) {
                            return;
                        }
                        var pointer = clearPointer(NaN);
                        self._emit(event, pointer);
                    };
                    handles.push(domUtil.on(root, 'mousedown', mouseChanged), domUtil.on(root, 'mouseenter', mouseChanged), domUtil.on(root, 'mouseleave', mouseRemoved), domUtil.on(root, 'mousemove', mouseChanged), domUtil.on(root, 'mouseup', mouseChanged));
                    if (has('dom-dblclick-bug')) {
                        handles.push(domUtil.on(root, 'dblclick', function (event) {
                            var fakeEvent = {
                                button: 0,
                                clientX: event.clientX,
                                clientY: event.clientY,
                                target: event.target,
                                type: 'mousedown'
                            };
                            mouseChanged(fakeEvent);
                            fakeEvent.type = 'mouseup';
                            mouseChanged(fakeEvent);
                        }));
                    }
                    if (!has('dom-mouse-buttons')) {
                        handles.push(domUtil.on(window, 'mouseup', function (event) {
                            isButtonPressed = false;
                        }), domUtil.on(window, 'mouseleave', function (event) {
                            if (event.target === window) {
                                isButtonPressed = false;
                            }
                        }));
                    }
                }
            }
        }
        PointerManager.prototype.destroy = function () {
            this.destroy = function () {
            };
            var handle;
            while ((handle = this._handles.pop())) {
                handle.remove();
            }
            this._handles = this._listeners = null;
        };
        PointerManager.prototype._emit = function (event, pointer) {
            var type = nativeEventMap[event.type];
            var listeners = this._listeners[type];
            if (!listeners) {
                return;
            }
            for (var i = 0, listener; (listener = listeners[i]); ++i) {
                if (listener.call(this, pointer)) {
                    event.preventDefault();
                }
            }
        };
        PointerManager.prototype.on = function (type, listener) {
            var listeners = this._listeners[type];
            if (!listeners) {
                listeners = this._listeners[type] = [];
            }
            listeners.push(listener);
            return util.createHandle(function () {
                util.spliceMatch(listeners, listener);
                listeners = listener = null;
            });
        };
        PointerManager._keyboardActive = false;
        return PointerManager;
    })();
    return PointerManager;
});
//# sourceMappingURL=../../../_debug/ui/dom/events/PointerManager.js.map