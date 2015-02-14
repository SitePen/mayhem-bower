define(["require", "exports", '../util'], function (require, exports, util) {
    var Binding = (function () {
        function Binding(kwArgs) {
            this._binder = kwArgs.binder;
            this._observers = [];
        }
        Binding.prototype.destroy = function () {
            this.destroy = function () {
            };
            this._observers = this._binder = null;
        };
        Binding.prototype.get = function () {
            return undefined;
        };
        Binding.prototype.getObject = function () {
            return undefined;
        };
        Binding.prototype.notify = function (change) {
            var observers = this._observers.slice(0);
            for (var i = 0, observer; (observer = observers[i]); ++i) {
                observer(change);
            }
        };
        Binding.prototype.observe = function (observer, invokeImmediately) {
            if (invokeImmediately === void 0) { invokeImmediately = false; }
            var observers = this._observers;
            observers.push(observer);
            invokeImmediately && observer({ value: this.get() });
            return util.createHandle(function () {
                util.spliceMatch(observers, observer);
                observers = observer = null;
            });
        };
        return Binding;
    })();
    return Binding;
});
//# sourceMappingURL=../_debug/binding/Binding.js.map