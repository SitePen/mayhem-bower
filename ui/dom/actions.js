define(["require", "exports", '../../Event', '../../util', '../../WeakMap'], function (require, exports, Event, util, WeakMap) {
    function createExtensionEvent(symbol, register) {
        var registeredUis = new WeakMap();
        var extensionEvent = function (target, callback) {
            var ui = target.get('app').get('ui');
            var registration = registeredUis.get(ui);
            if (!registration) {
                registration = {
                    handle: register(ui),
                    numActivations: 0
                };
                registeredUis.set(ui, registration);
            }
            else if (registration.unregisterTimer) {
                registration.unregisterTimer.remove();
                registration.unregisterTimer = null;
            }
            ++registration.numActivations;
            var handle = target.on(symbol, callback);
            return util.createHandle(function () {
                if (--registration.numActivations === 0) {
                    registration.unregisterTimer = util.createTimer(function () {
                        registration.handle.remove();
                        registeredUis.delete(ui);
                        registration = null;
                    });
                }
                handle.remove();
                handle = null;
            });
        };
        extensionEvent.symbol = symbol;
        return extensionEvent;
    }
    exports.activate = (function () {
        var ACTIVATE_SYMBOL = 'mayhemActivate';
        function convertEvent(originalEvent) {
            var kwArgs = {
                bubbles: true,
                cancelable: true,
                target: originalEvent.target,
                type: ACTIVATE_SYMBOL,
                view: originalEvent.view
            };
            if ('clientX' in originalEvent) {
                kwArgs.clientX = originalEvent.clientX;
                kwArgs.clientY = originalEvent.clientY;
            }
            return new Event(kwArgs);
        }
        function register(ui) {
            return util.createCompositeHandle(exports.click(ui, function (event) {
                if (event.numClicks === 1 && event.buttons === 1) {
                    var newEvent = convertEvent(event);
                    try {
                        event.target.emit(newEvent);
                    }
                    finally {
                        if (newEvent.defaultPrevented) {
                            event.preventDefault();
                        }
                    }
                }
            }), ui.on('keyup', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    var newEvent = convertEvent(event);
                    try {
                        event.target.emit(newEvent);
                    }
                    finally {
                        if (newEvent.defaultPrevented) {
                            event.preventDefault();
                        }
                    }
                }
            }));
        }
        return createExtensionEvent(ACTIVATE_SYMBOL, register);
    })();
    exports.click = (function () {
        var CLICK_SYMBOL = 'mayhemClick';
        var CLICK_SPEED = 300;
        var MAX_DISTANCE = {
            pen: 15,
            mouse: 5,
            touch: 40
        };
        function register(ui) {
            var buttons = {};
            function resetButton(buttonId) {
                buttons[buttonId] = null;
            }
            return util.createCompositeHandle(ui.on('pointerdown', function (event) {
                if (!event.isPrimary) {
                    return;
                }
                var buttonState = buttons[event.button];
                if (!buttonState) {
                    buttonState = buttons[event.button] = {
                        resetAfterDelay: util.debounce(function () {
                            resetButton(event.button);
                        }, CLICK_SPEED)
                    };
                }
                var target = event.target;
                if (buttonState.lastTarget !== target) {
                    buttonState.numClicks = 0;
                    buttonState.lastTarget = target;
                }
                buttonState.lastTimestamp = event.timestamp;
                if (buttonState.numClicks === 0) {
                    buttonState.lastX = event.clientX;
                    buttonState.lastY = event.clientY;
                }
                buttonState.resetAfterDelay();
            }), ui.on('pointerup', function (event) {
                if (!event.isPrimary) {
                    return;
                }
                var buttonState = buttons[event.button];
                if (!buttonState) {
                    return;
                }
                if (event.timestamp - buttonState.lastTimestamp < CLICK_SPEED && Math.abs(event.clientX - buttonState.lastX) < MAX_DISTANCE[event.pointerType] && Math.abs(event.clientY - buttonState.lastY) < MAX_DISTANCE[event.pointerType]) {
                    ++buttonState.numClicks;
                    var newEvent = new Event(event);
                    newEvent.type = CLICK_SYMBOL;
                    newEvent.numClicks = buttonState.numClicks;
                    newEvent.buttons = event.buttons | event.button;
                    try {
                        event.target.emit(newEvent);
                    }
                    finally {
                        if (newEvent.defaultPrevented) {
                            event.preventDefault();
                        }
                        buttonState.resetAfterDelay();
                    }
                }
                buttonState.lastTimestamp = null;
            }));
        }
        return createExtensionEvent(CLICK_SYMBOL, register);
    })();
});
//# sourceMappingURL=../../_debug/ui/dom/actions.js.map