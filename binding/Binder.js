define(["require", "exports", './BindDirection', './BindingError', '../has', 'dojo/_base/lang', '../Promise', '../util', '../WeakMap'], function (require, exports, BindDirection, BindingError, has, lang, Promise, util, WeakMap) {
    var Binder = (function () {
        function Binder(kwArgs) {
            this._bindingRegistry = new WeakMap();
            this._constructors = kwArgs.constructors || [];
            this._useScheduler = 'useScheduler' in kwArgs ? kwArgs.useScheduler : false;
        }
        Binder.prototype.add = function (Ctor, index) {
            if (index === void 0) { index = Infinity; }
            var constructors = this._constructors;
            constructors.splice(index, 0, Ctor);
            return util.createHandle(function () {
                for (var i = 0, MaybeCtor; (MaybeCtor = constructors[i]); ++i) {
                    if (Ctor === MaybeCtor) {
                        constructors.splice(i, 1);
                        break;
                    }
                }
                Ctor = constructors = null;
            });
        };
        Binder.prototype.bind = function (kwArgs) {
            var self = this;
            var direction = kwArgs.direction || 2 /* TWO_WAY */;
            var source;
            var target;
            var targetObserverHandle;
            source = this.createBinding(kwArgs.source, kwArgs.sourcePath);
            target = this.createBinding(kwArgs.target, kwArgs.targetPath);
            function setTargetValue(change) {
                if (!target) {
                    console.debug('BUG');
                    return;
                }
                target.set(change.value);
            }
            function setSourceValue(change) {
                source.set && source.set(change.value);
            }
            source.observe(setTargetValue);
            setTargetValue({ value: source.get() });
            if (direction === 2 /* TWO_WAY */) {
                targetObserverHandle = target.observe(setSourceValue);
            }
            var handle = {
                setSource: function (newSource, newSourcePath) {
                    if (newSourcePath === void 0) { newSourcePath = kwArgs.sourcePath; }
                    source.destroy();
                    source = self.createBinding(newSource, newSourcePath);
                    if (has('debug')) {
                        this._source = source;
                    }
                    source.observe(setTargetValue);
                    setTargetValue({ value: source.get() });
                },
                setTarget: function (newTarget, newTargetPath) {
                    if (newTargetPath === void 0) { newTargetPath = kwArgs.targetPath; }
                    target.destroy();
                    targetObserverHandle = null;
                    target = self.createBinding(newTarget, newTargetPath);
                    if (has('debug')) {
                        this._target = target;
                    }
                    if (direction === 2 /* TWO_WAY */) {
                        targetObserverHandle = target.observe(setSourceValue);
                    }
                    setTargetValue({ value: source.get() });
                },
                setDirection: function (newDirection) {
                    targetObserverHandle && targetObserverHandle.remove();
                    if (newDirection === 2 /* TWO_WAY */) {
                        targetObserverHandle = target.observe(setSourceValue);
                    }
                },
                remove: function () {
                    this.remove = function () {
                    };
                    source.destroy();
                    target.destroy();
                    self = source = target = targetObserverHandle = null;
                }
            };
            if (has('debug')) {
                handle._source = source;
                handle._target = target;
            }
            return handle;
        };
        Binder.prototype.createBinding = function (object, path, options) {
            if (options === void 0) { options = {}; }
            var map = this._bindingRegistry.get(object);
            if (!map) {
                map = {};
                this._bindingRegistry.set(object, map);
            }
            var binding;
            if (typeof path !== 'string' || !(binding = map[path])) {
                var constructors = this._constructors;
                for (var i = 0, Binding; (Binding = constructors[i]); ++i) {
                    if (Binding.test({ object: object, path: path, binder: this })) {
                        binding = new Binding({
                            object: object,
                            path: path,
                            binder: this
                        });
                        break;
                    }
                }
                if (!binding) {
                    throw new BindingError('No registered binding constructors understand the requested binding "{binding}" on {object}.', {
                        object: object,
                        path: path,
                        binder: this
                    });
                }
                if (typeof path !== 'string') {
                    return binding;
                }
                map[path] = binding;
            }
            return lang.delegate(binding, {
                _localObservers: [],
                destroy: function () {
                    this.destroy = function () {
                    };
                    var observers = this._observers;
                    var localObservers = this._localObservers;
                    for (var i = 0, observer; (observer = localObservers[i]); ++i) {
                        util.spliceMatch(observers, observer);
                    }
                    this._localObservers = null;
                    binding = map = null;
                },
                observe: function (observer) {
                    var handle = binding.observe.apply(binding, arguments);
                    var localObservers = this._localObservers;
                    localObservers.push(observer);
                    return util.createHandle(function () {
                        util.spliceMatch(localObservers, observer);
                        handle.remove();
                        handle = localObservers = observer = null;
                    });
                }
            });
        };
        Binder.prototype.notify = function (object, property, change) {
            var bindings = this._bindingRegistry.get(object);
            if (bindings && bindings[property]) {
                bindings[property].notify(change);
            }
        };
        Binder.prototype.observe = function (object, property, observer) {
            var binding = this.createBinding(object, property);
            binding.observe(observer);
            return util.createHandle(function () {
                binding.destroy();
                binding = null;
            });
        };
        Binder.prototype.run = function () {
            var constructors = this._constructors;
            function loadConstructor(index, moduleId) {
                return util.getModule(moduleId).then(function (Binding) {
                    constructors.splice(index, 1, Binding);
                });
            }
            var promises = [];
            for (var i = 0, Ctor; (Ctor = this._constructors[i]); ++i) {
                if (typeof Ctor === 'string') {
                    promises.push(loadConstructor(i, Ctor));
                }
            }
            var promise = Promise.all(promises).then(function () {
            });
            this.run = function () {
                return promise;
            };
            return promise;
        };
        Binder.prototype.test = function (kwArgs) {
            var sourceBindingValid = false;
            var targetBindingValid = false;
            for (var i = 0, Binding; (Binding = this._constructors[i]); ++i) {
                if (!sourceBindingValid && Binding.prototype.get && Binding.test({
                    object: kwArgs.source,
                    path: kwArgs.sourcePath,
                    binder: this
                })) {
                    sourceBindingValid = true;
                }
                if (!targetBindingValid && Binding.prototype.set && Binding.test({
                    object: kwArgs.target,
                    path: kwArgs.targetPath,
                    binder: this
                })) {
                    targetBindingValid = true;
                }
                if (sourceBindingValid && targetBindingValid) {
                    return true;
                }
            }
            return false;
        };
        return Binder;
    })();
    return Binder;
});
//# sourceMappingURL=../_debug/binding/Binder.js.map