define(["require", "exports", './has', 'dojo/_base/lang', './util'], function (require, exports, has, lang, util) {
    var Scheduler = (function () {
        function Scheduler() {
            this._callbacks = {};
            this._postCallbacks = [];
            this._dispatch = lang.hitch(this, 'dispatch');
        }
        Scheduler.prototype.afterNext = function (callback) {
            var callbacks = this._postCallbacks;
            callbacks.push(callback);
            return util.createHandle(function () {
                util.spliceMatch(callbacks, callback);
                callbacks = callback = null;
            });
        };
        Scheduler.prototype.dispatch = function () {
            this._timer.remove();
            this._timer = null;
            var callbacks = this._callbacks, postCallbacks = this._postCallbacks, callback;
            this._callbacks = {};
            this._postCallbacks = [];
            for (var k in callbacks) {
                callback = callbacks[k];
                callback && callback();
            }
            for (var i = 0; (callback = postCallbacks[i]); ++i) {
                callback();
            }
        };
        Scheduler.prototype.schedule = function (id, callback) {
            if (has('debug') && !id) {
                throw new Error('Cannot schedule without an identifier');
            }
            var callbacks = this._callbacks;
            callbacks[id] = callback;
            if (!this._timer) {
                this._timer = util.createTimer(this._dispatch);
            }
            return util.createHandle(function () {
                callbacks = id = callbacks[id] = null;
            });
        };
        return Scheduler;
    })();
    return Scheduler;
});
//# sourceMappingURL=_debug/Scheduler.js.map