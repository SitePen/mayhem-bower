define(["require", "exports", 'dojo/aspect', '../../Event', '../../util'], function (require, exports, aspect, Event, util) {
    function activate(target, callback) {
        return util.createCompositeHandle(exports.click(target, function (event) {
            if (event.numClicks === 1 && event.buttons === 1) {
                callback.call(this, event);
            }
        }), target.on('keyup', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                callback.call(this, event);
            }
        }));
    }
    exports.activate = activate;
    exports.click = (function () {
        var CLICK_SPEED = 300;
        var MAX_DISTANCE = {
            pen: 15,
            mouse: 5,
            touch: 40
        };
        return function (target, callback) {
            var buttons = {};
            function resetButton(buttonId) {
                buttons[buttonId] = null;
            }
            return util.createCompositeHandle(target.on('pointerdown', function (event) {
                if (!event.isPrimary || event.defaultPrevented) {
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
                aspect.after(event, 'preventDefault', function () {
                    buttonState.defaultPrevented = true;
                });
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
            }), target.on('pointerup', function (event) {
                if (!event.isPrimary || event.defaultPrevented) {
                    return;
                }
                var buttonState = buttons[event.button];
                if (!buttonState) {
                    return;
                }
                if (buttonState.defaultPrevented) {
                    buttonState.defaultPrevented = false;
                    return;
                }
                if (event.timestamp - buttonState.lastTimestamp < CLICK_SPEED && event.clientX - buttonState.lastX < MAX_DISTANCE[event.pointerType] && event.clientY - buttonState.lastY < MAX_DISTANCE[event.pointerType]) {
                    ++buttonState.numClicks;
                    var newEvent = new Event(event);
                    newEvent.type = 'click';
                    newEvent.numClicks = buttonState.numClicks;
                    newEvent.buttons = event.buttons | event.button;
                    try {
                        callback.call(this, newEvent);
                    }
                    finally {
                        buttonState.resetAfterDelay();
                    }
                }
                buttonState.lastTimestamp = null;
            }));
        };
    })();
});
//# sourceMappingURL=../../_debug/ui/dom/actions.js.map