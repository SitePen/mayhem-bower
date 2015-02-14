var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './has', 'dojo/_base/lang', './LogLevel', './ObservableEvented', './Promise', './util'], function (require, exports, has, lang, LogLevel, ObservableEvented, Promise, util) {
    var resolve = require.toAbsMid || require.resolve;
    var defaultBindings = [
        resolve('./binding/bindings/CompositeBinding'),
        resolve('./binding/bindings/ObjectMethodBinding'),
        resolve('./binding/bindings/NestedBinding'),
        resolve('./binding/bindings/ObservableBinding'),
        resolve('./binding/bindings/StatefulBinding'),
        resolve('./binding/bindings/CollectionLengthBinding'),
        resolve('./binding/bindings/CollectionBinding'),
        resolve('./binding/bindings/ArrayBinding'),
        resolve('./binding/bindings/DomInputBinding')
    ];
    if (has('es7-object-observe')) {
        defaultBindings.push(resolve('./binding/bindings/Es7Binding'));
    }
    else {
        defaultBindings.push(resolve('./binding/bindings/Es5Binding'), resolve('./binding/bindings/ObjectTargetBinding'));
    }
    var Application = (function (_super) {
        __extends(Application, _super);
        function Application(kwArgs) {
            kwArgs = util.deepCreate(this.constructor._defaultConfig, kwArgs);
            _super.call(this, kwArgs);
        }
        Application.prototype.destroy = function () {
            for (var key in this) {
                var component = this[key];
                component.destroy && component.destroy();
            }
            _super.prototype.destroy.call(this);
        };
        Application.prototype.handleError = function (error) {
            var errorHandler = this.get('errorHandler');
            if (errorHandler) {
                errorHandler.handleError(error);
            }
            else {
                this.log(error.stack || error.message, 0 /* ERROR */, 'error/' + error.name);
            }
        };
        Application.prototype.log = function (message, level, category) {
            if (level === void 0) { level = 2 /* LOG */; }
            if (category === void 0) { category = null; }
            var logger = this.get('logger');
            if (logger) {
                logger.log(message, level, category);
            }
            else {
                console[LogLevel[level].toLowerCase()]((category ? category + ': ' : '') + message);
            }
        };
        Application.prototype.run = function () {
            var self = this;
            var components = this._components;
            function getConstructors() {
                var ctors = {};
                for (var key in components) {
                    if (!components[key]) {
                        continue;
                    }
                    ctors[key] = new Promise(function (resolve, reject) {
                        var ctor = components[key].constructor;
                        if (typeof ctor === 'string') {
                            util.getModule(ctor).then(resolve, reject);
                        }
                        else if (typeof ctor === 'function') {
                            resolve(ctor);
                        }
                        else {
                            reject(new Error('Constructor for ' + key + ' must be a string or function'));
                        }
                    });
                }
                return Promise.all(ctors);
            }
            function instantiateComponents(ctors) {
                var instance;
                var instances = [];
                var startups = [];
                for (var key in ctors) {
                    instance = new ctors[key](lang.mixin({ app: self }, components[key], { constructor: undefined }));
                    self.set(key, instance);
                    instances.push(instance);
                }
                while ((instance = instances.shift())) {
                    instance.run && startups.push(instance.run());
                }
                return Promise.all(startups);
            }
            if (has('debug')) {
                this.on('error', function (event) {
                    console.error(event.message);
                });
            }
            var promise = getConstructors().then(instantiateComponents).then(function () {
                return self;
            });
            this.run = function () {
                return promise;
            };
            return promise;
        };
        Application._defaultConfig = {
            components: {
                binder: {
                    constructor: resolve('./binding/Binder'),
                    constructors: defaultBindings
                },
                errorHandler: {
                    constructor: resolve('./ErrorHandler')
                },
                i18n: {
                    constructor: resolve('./I18n')
                },
                scheduler: {
                    constructor: resolve('./Scheduler')
                }
            }
        };
        return Application;
    })(ObservableEvented);
    return Application;
});
//# sourceMappingURL=_debug/Application.js.map