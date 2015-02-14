var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/_base/declare', '../has', 'dojo/_base/lang', 'dstore/Memory', '../Observable', 'dstore/Trackable', '../util'], function (require, exports, declare, has, lang, MemoryStore, Observable, TrackableStore, util) {
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
            var Store = declare([MemoryStore, TrackableStore], {
                Model: null
            });
            var wrapperCollection = new Store();
            var Ctor = this;
            collection = collection.track();
            collection.fetch().then(function (initialData) {
                var wrappedData = new Array(initialData.length);
                for (var i = 0; i < initialData.length; ++i) {
                    wrappedData[i] = new Ctor({ target: initialData[i] });
                }
                wrapperCollection.setData(wrappedData);
            });
            wrapperCollection.fetch();
            function wrapSetter(method) {
                return function (object, options) {
                    if (object.setTarget) {
                        object = object.get('target');
                    }
                    return collection[method](object, options);
                };
            }
            var put = wrapperCollection.putSync;
            var remove = wrapperCollection.removeSync;
            wrapperCollection.add = wrapSetter('add');
            wrapperCollection.addSync = wrapSetter('addSync');
            wrapperCollection.put = wrapSetter('put');
            wrapperCollection.putSync = wrapSetter('putSync');
            wrapperCollection.remove = lang.hitch(collection, 'remove');
            wrapperCollection.removeSync = lang.hitch(collection, 'removeSync');
            collection.on('add', function (event) {
                if (event.index !== undefined) {
                    put.call(wrapperCollection, new Ctor({
                        app: event.target.get('app'),
                        target: event.target
                    }), { index: event.index });
                }
            });
            collection.on('update', function (event) {
                var id = collection.getIdentity(event.target);
                if (event.index === undefined) {
                    remove.call(wrapperCollection, id);
                }
                else if (event.previousIndex === undefined) {
                    put.call(wrapperCollection, new Ctor({
                        app: event.target.get('app'),
                        target: event.target
                    }), { index: event.index });
                }
                else {
                    put.call(wrapperCollection, wrapperCollection.getSync(id), { index: event.index });
                }
            });
            collection.on('delete', function (event) {
                remove.call(wrapperCollection, event.id);
            });
            return wrapperCollection;
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