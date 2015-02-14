define(["require", "exports"], function (require, exports) {
    var Event = (function () {
        function Event(kwArgs) {
            this.timestamp = +new Date();
            if (kwArgs) {
                for (var k in kwArgs) {
                    if (k === 'constructor') {
                        continue;
                    }
                    this[k] = kwArgs[k];
                }
            }
        }
        Event.prototype.preventDefault = function () {
            if (this.cancelable) {
                this.defaultPrevented = true;
            }
        };
        Event.prototype.stopImmediatePropagation = function () {
            if (this.bubbles) {
                this.immediatePropagationStopped = true;
            }
        };
        Event.prototype.stopPropagation = function () {
            if (this.bubbles) {
                this.propagationStopped = true;
            }
        };
        return Event;
    })();
    return Event;
});
//# sourceMappingURL=_debug/Event.js.map