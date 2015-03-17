var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../has', '../Observable', '../util', '../WeakMap'], function (require, exports, has, Observable, util, WeakMap) {
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(kwArgs) {
            var _kwArgs = kwArgs;
            if (_kwArgs.target && !_kwArgs.app) {
                this._app = _kwArgs.target.get ? _kwArgs.target.get('app') : _kwArgs.target.app;
            }
            this._initializing = true;
            _super.call(this, _kwArgs);
            this._initializing = false;
        }
        Proxy.forCollection = function (collection) {
            var Ctor = this;
            var proxies = new WeakMap();
            var models = new WeakMap();
            function createProxy(item) {
                var proxy = proxies.get(item);
                if (!proxy) {
                    proxy = new Ctor({ app: item.get('app'), target: item });
                    proxies.set(item, proxy);
                    models.set(proxy, item);
                }
                return proxy;
            }
            function wrapCollection(collection) {
                var wrapperCollection = Object.create(collection);
                ['add', 'addSync', 'put', 'putSync', 'remove', 'removeSync'].forEach(function (method) {
                    if (collection[method]) {
                        wrapperCollection[method] = function (object) {
                            object = models.get(object) || object;
                            return collection[method].apply(collection, arguments);
                        };
                    }
                });
                wrapperCollection.get = function () {
                    return collection.get.apply(collection, arguments).then(createProxy);
                };
                if (collection.getSync) {
                    wrapperCollection.getSync = function () {
                        return createProxy(collection.getSync.apply(collection, arguments));
                    };
                }
                wrapperCollection.sort = function () {
                    return wrapCollection(collection.sort.apply(collection, arguments));
                };
                wrapperCollection.filter = function () {
                    return wrapCollection(collection.filter.apply(collection, arguments));
                };
                ['fetch', 'fetchRange'].forEach(function (method) {
                    wrapperCollection[method] = function () {
                        var promise = collection[method].apply(collection, arguments);
                        var proxiedPromise = promise.then(function (items) {
                            return items.map(createProxy);
                        });
                        if (Object.isFrozen(proxiedPromise)) {
                            proxiedPromise = Object.create(proxiedPromise);
                        }
                        if ('totalLength' in promise) {
                            proxiedPromise.totalLength = promise.totalLength;
                        }
                        return proxiedPromise;
                    };
                });
                ['fetchSync', 'fetchRangeSync'].forEach(function (method) {
                    if (collection[method]) {
                        wrapperCollection[method] = function () {
                            var data = collection[method].apply(collection, arguments);
                            var proxiedData = data.map(createProxy);
                            if ('totalLength' in data) {
                                proxiedData.totalLength = data.totalLength;
                            }
                            return proxiedData;
                        };
                    }
                });
                if (collection.track) {
                    wrapperCollection.track = function () {
                        return wrapCollection(collection.track.apply(collection, arguments));
                    };
                }
                wrapperCollection._createSubCollection = function (kwArgs) {
                    var newCollection = collection._createSubCollection(kwArgs);
                    return wrapCollection(newCollection);
                };
                wrapperCollection.emit = function (eventName, event) {
                    var newEvent = Object.create(event);
                    newEvent.target = models.get(event.target) || event.target;
                    return collection.emit(eventName, newEvent);
                };
                wrapperCollection.on = function (eventName, listener) {
                    return collection.on(eventName, function (event) {
                        var newEvent = Object.create(event);
                        newEvent.target = createProxy(event.target);
                        return listener.call(wrapperCollection, newEvent);
                    });
                };
                return wrapperCollection;
            }
            return wrapCollection(collection);
        };
        Proxy.prototype._initialize = function () {
            this._targetHandles = has('es5') ? Object.create(null) : {};
        };
        Proxy.prototype._createTargetBinding = function (key) {
            var self = this;
            var binding = this._targetHandles[key] = this._app.get('binder').createBinding(this._target, key, { useScheduler: false });
            binding.observe(function (change) {
                self._notify(key, change.value, change.oldValue);
            });
        };
        Proxy.prototype.destroy = function () {
            var handles = this._targetHandles;
            for (var key in handles) {
                handles[key] && handles[key].destroy();
            }
            this._targetHandles = this._target = null;
            _super.prototype.destroy.call(this);
        };
        Proxy.prototype.observe = function (key, observer) {
            var privateKey = '_' + key;
            var getter = privateKey + 'Getter';
            var hasOwnKey = (privateKey in this) || typeof this[getter] === 'function';
            if (!this._targetHandles[key] && this._target && !hasOwnKey) {
                this._createTargetBinding(key);
            }
            return _super.prototype.observe.call(this, key, observer);
        };
        Proxy.prototype._targetGetter = function () {
            return this._target;
        };
        Proxy.prototype._targetSetter = function (target) {
            this._target = target;
            var handles = this._targetHandles;
            for (var key in handles) {
                handles[key] && handles[key].destroy();
                if (target) {
                    this._createTargetBinding(key);
                    this._notify(key, target.get ? target.get(key) : target[key], undefined);
                }
            }
        };
        return Proxy;
    })(Observable);
    Proxy.prototype.get = function (key) {
        var value = Observable.prototype.get.apply(this, arguments);
        var target = this._target;
        if (value === undefined && target) {
            value = target.get ? target.get(key) : target[key];
            if (typeof value === 'function') {
                var originalFn = value;
                var self = this;
                value = function () {
                    var thisArg = this === self ? target : this;
                    return originalFn.apply(thisArg, arguments);
                };
            }
        }
        return value;
    };
    Proxy.prototype.set = function (key, value) {
        if (util.isObject(key)) {
            Observable.prototype.set.apply(this, arguments);
            return;
        }
        var privateKey = '_' + key;
        var setter = privateKey + 'Setter';
        if (typeof this[setter] === 'function' || (privateKey in this) || this._initializing) {
            Observable.prototype.set.apply(this, arguments);
        }
        else if (this._target) {
            return this._target.set ? this._target.set(key, value) : (this._target[key] = value);
        }
        else {
            return undefined;
        }
    };
    return Proxy;
});
//# sourceMappingURL=../_debug/data/Proxy.js.map