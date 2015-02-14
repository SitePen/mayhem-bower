define(["require", "exports", 'dojo/_base/array', './has', './util'], function (require, exports, arrayUtil, has, util) {
    var Observable = (function () {
        function Observable(kwArgs) {
            if (kwArgs === void 0) { kwArgs = {}; }
            this._dependencies = has('es5') ? Object.create(null) : {};
            this._observers = has('es5') ? Object.create(null) : {};
            this._initialize();
            this.set(kwArgs);
        }
        Observable.prototype.destroy = function () {
            this.destroy = function () {
            };
            for (var key in this._dependencies) {
                this._dependencies[key].remove();
            }
            this._notify = function () {
                console.debug('BUG');
            };
            this._dependencies = this._observers = null;
        };
        Observable.prototype._initialize = function () {
        };
        Observable.prototype._notify = function (key, newValue, oldValue) {
            var observers = has('es5') ? this._observers[key] : (this._observers.hasOwnProperty(key) && this._observers[key]);
            if (observers) {
                observers = observers.slice(0);
                var observer;
                for (var i = 0; (observer = observers[i]); ++i) {
                    observer.call(this, newValue, oldValue, key);
                }
            }
        };
        Observable.prototype.observe = function (key, observer) {
            if (has('es5') ? !this._observers[key] : !this._observers.hasOwnProperty(key)) {
                this._observers[key] = [];
            }
            var observers = this._observers[key];
            observers.push(observer);
            var dependencyFactory = this['_' + key + 'Dependencies'];
            if (dependencyFactory && !this._dependencies[key]) {
                var self = this;
                var dependencies = dependencyFactory.call(this);
                var handles = [];
                var notify = function () {
                    self._notify(key, self.get(key), undefined);
                };
                var register;
                var app = this.get('app');
                if (app) {
                    register = function (dependency) {
                        handles.push(app.get('binder').observe(self, dependency, notify));
                    };
                }
                else {
                    register = function (dependency) {
                        handles.push(self.observe(dependency, notify));
                    };
                }
                arrayUtil.forEach(dependencies, register);
                this._dependencies[key] = util.createCompositeHandle.apply(util, handles);
            }
            return util.createHandle(function () {
                util.spliceMatch(observers, observer);
                observers = observer = null;
            });
        };
        return Observable;
    })();
    Observable.prototype.get = function (key) {
        var privateKey = '_' + key;
        var getter = privateKey + 'Getter';
        var setter = privateKey + 'Setter';
        if (this[getter]) {
            return this[getter]();
        }
        if (this[setter]) {
            return undefined;
        }
        var value = this[privateKey];
        if (value === undefined && typeof this[key] === 'function') {
            value = this[key];
        }
        return value;
    };
    Observable.prototype.set = function (key, value) {
        if (util.isObject(key)) {
            var kwArgs = key;
            for (key in kwArgs) {
                if (key === 'constructor') {
                    continue;
                }
                this.set(key, kwArgs[key]);
            }
            return;
        }
        var oldValue = this.get(key);
        var privateKey = '_' + key;
        var getter = privateKey + 'Getter';
        var setter = privateKey + 'Setter';
        if (this[setter]) {
            this[setter](value);
        }
        else if (this[getter]) {
            throw new TypeError('Cannot set read-only property "' + key + '"');
        }
        else {
            this[privateKey] = value;
        }
        var newValue = this.get(key);
        if (!util.isEqual(oldValue, newValue)) {
            this._notify(key, newValue, oldValue);
        }
    };
    return Observable;
});
//# sourceMappingURL=_debug/Observable.js.map