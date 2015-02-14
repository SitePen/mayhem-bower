define(["require", "exports", 'dojo/_base/array', 'dojo/aspect', 'dojo/Deferred', './has', 'dojo/request/util', 'dojo/promise/all'], function (require, exports, array, aspect, Deferred, has, requestUtil, whenAll) {
    function addUnloadCallback(callback) {
        if (has('host-node')) {
            process.on('exit', callback);
            return createHandle(function () {
                process.removeListener('exit', callback);
            });
        }
        else if (has('host-browser')) {
            return aspect.before(window, 'onbeforeunload', callback);
        }
        else {
            throw new Error('Not supported on this platform');
        }
    }
    exports.addUnloadCallback = addUnloadCallback;
    function createCompositeHandle() {
        var handles = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handles[_i - 0] = arguments[_i];
        }
        return createHandle(function () {
            for (var i = 0, handle; (handle = handles[i]); ++i) {
                handle.remove();
            }
        });
    }
    exports.createCompositeHandle = createCompositeHandle;
    function createHandle(destructor) {
        return {
            remove: function () {
                this.remove = function () {
                };
                destructor.call(this);
            }
        };
    }
    exports.createHandle = createHandle;
    function createTimer(callback, delay) {
        if (delay === void 0) { delay = 0; }
        var timerId;
        if (has('raf') && delay === 0) {
            timerId = requestAnimationFrame(callback);
            return createHandle(function () {
                cancelAnimationFrame(timerId);
                timerId = null;
            });
        }
        else {
            timerId = setTimeout(callback, delay);
            return createHandle(function () {
                clearTimeout(timerId);
                timerId = null;
            });
        }
    }
    exports.createTimer = createTimer;
    function debounce(callback, delay) {
        if (delay === void 0) { delay = 0; }
        var timer;
        return function () {
            timer && timer.remove();
            var self = this, args = arguments;
            timer = createTimer(function () {
                callback.apply(self, args);
                self = args = timer = null;
            }, delay);
        };
    }
    exports.debounce = debounce;
    exports.deepCopy = requestUtil.deepCopy;
    exports.deepCreate = requestUtil.deepCreate;
    function deferMethods(target, methods, untilMethod, instead) {
        var _target = target;
        var waiting = {};
        var untilHandle = aspect.after(target, untilMethod, function () {
            untilHandle.remove();
            untilHandle = null;
            for (var method in waiting) {
                var info = waiting[method];
                _target[method] = info.original;
                info.args && _target[method].apply(_target, info.args);
            }
            _target = waiting = null;
        }, true);
        array.forEach(methods, function (method) {
            var info = waiting[method] = {
                original: _target[method],
                args: null
            };
            _target[method] = function () {
                info.args = instead && instead.call(target, method, arguments) || arguments;
            };
        });
    }
    exports.deferMethods = deferMethods;
    function deferSetters(target, properties, untilMethod, instead) {
        deferMethods(target, array.map(properties, function (property) { return '_' + property + 'Setter'; }), untilMethod, instead ? function (method, args) {
            return instead.call(this, method.slice(1, -6), args[0]);
        } : undefined);
    }
    exports.deferSetters = deferSetters;
    function escapedIndexOf(source, searchString, position) {
        var index;
        if (source === '' || searchString === '' || position < 0) {
            return -1;
        }
        do {
            index = source.indexOf(searchString, position);
            if (source.charAt(index - 1) !== '\\' || source.slice(index - 2, index) === '\\\\') {
                break;
            }
            position = index + 1;
        } while (index > -1);
        return index;
    }
    exports.escapedIndexOf = escapedIndexOf;
    function escapedSplit(source, separator) {
        var result = [];
        var part = '';
        if (separator === '') {
            result.push(source);
            return result;
        }
        for (var i = 0, j = source.length; i < j; ++i) {
            if (source.charAt(i) === '\\') {
                if (source.slice(i + 1, i + separator.length + 1) === separator) {
                    part += separator;
                    i += separator.length;
                }
                else if (source.charAt(i + 1) === '\\') {
                    part += '\\';
                    i += 1;
                }
                else {
                    part += source.charAt(i);
                }
            }
            else if (source.slice(i, i + separator.length) === separator) {
                result.push(part);
                part = '';
                i += separator.length - 1;
            }
            else {
                part += source.charAt(i);
            }
        }
        result.push(part);
        return result;
    }
    exports.escapedSplit = escapedSplit;
    function escapeXml(text, forAttribute) {
        if (forAttribute === void 0) { forAttribute = true; }
        text = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;');
        if (forAttribute) {
            text = text.replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }
        return text;
    }
    exports.escapeXml = escapeXml;
    function getModule(moduleId) {
        return getModules([moduleId]).then(function (modules) {
            return modules[0];
        });
    }
    exports.getModule = getModule;
    function getModules(moduleIds) {
        var dfd = new Deferred();
        var handle;
        if (require.on) {
            var moduleUrls = {};
            for (var i = 0; i < moduleIds.length; i++) {
                moduleUrls[require.toUrl(moduleIds[i])] = moduleIds[i];
            }
            handle = require.on('error', function (error) {
                if (error.message === 'scriptError') {
                    var moduleUrl = error.info[0].slice(0, -3);
                    if (moduleUrl in moduleUrls) {
                        handle && handle.remove();
                        handle = null;
                        var reportedError = new Error('Couldn\'t load ' + moduleUrls[moduleUrl] + ' from ' + error.info[0]);
                        reportedError.url = error.info[0];
                        reportedError.originalError = error.info[1];
                        dfd.reject(reportedError);
                        if (require.undef) {
                            require.undef(moduleUrls[moduleUrl]);
                        }
                    }
                }
            });
        }
        require(moduleIds, function () {
            var modules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                modules[_i - 0] = arguments[_i];
            }
            handle && handle.remove();
            handle = null;
            array.every(modules, function (module, index, modules) {
                if (module === 'not-a-module') {
                    var reportedError = new Error('Couldn\'t load module ' + moduleIds[index]);
                    dfd.reject(reportedError);
                    return false;
                }
                return true;
            });
            dfd.resolve(modules);
        });
        return dfd.promise;
    }
    exports.getModules = getModules;
    exports.getObjectKeys = has('es5') ? Object.keys : function (object) {
        var keys = [], hasOwnProperty = Object.prototype.hasOwnProperty;
        for (var key in object) {
            hasOwnProperty.call(object, key) && keys.push(key);
        }
        return keys;
    };
    function isEqual(a, b) {
        return a === b || (a !== a && b !== b);
    }
    exports.isEqual = isEqual;
    function isObject(object) {
        var type = typeof object;
        return object != null && (type === 'object' || type === 'function');
    }
    exports.isObject = isObject;
    function spliceMatch(haystack, needle) {
        for (var i = 0; i < haystack.length; ++i) {
            if (haystack[i] === needle) {
                haystack.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    exports.spliceMatch = spliceMatch;
    function spread(values, resolved, rejected) {
        return whenAll(values).then(function (values) {
            return resolved.apply(undefined, values);
        }, rejected);
    }
    exports.spread = spread;
    function deepMixin(target, source) {
        if (typeof source === 'object' && source !== null) {
            if (source instanceof Array) {
                target.length = source.length;
            }
            for (var name in source) {
                var targetValue = target[name];
                var sourceValue = source[name];
                if (targetValue !== sourceValue) {
                    if (typeof sourceValue === 'object' && sourceValue !== null) {
                        if (targetValue === null || typeof targetValue !== 'object') {
                            target[name] = targetValue = (sourceValue instanceof Array) ? [] : {};
                        }
                        deepMixin(targetValue, sourceValue);
                    }
                    else {
                        target[name] = sourceValue;
                    }
                }
            }
        }
        return target;
    }
    exports.deepMixin = deepMixin;
    function unescapeXml(text) {
        var entityMap = {
            lt: '<',
            gt: '>',
            amp: '&',
            quot: '"',
            apos: '\''
        };
        return text.replace(/&([^;]+);/g, function (_, entity) {
            if (entityMap[entity]) {
                return entityMap[entity];
            }
            if (entity.charAt(0) === '#') {
                if (entity.charAt(1) === 'x') {
                    return String.fromCharCode(Number('0' + entity.slice(1)));
                }
                return String.fromCharCode(Number(entity.slice(1)));
            }
            else {
                return '&' + entity + ';';
            }
        });
    }
    exports.unescapeXml = unescapeXml;
});
//# sourceMappingURL=_debug/util.js.map