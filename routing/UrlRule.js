var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/_base/array', 'dojo/io-query', '../Observable', './PathRegExp'], function (require, exports, arrayUtil, ioQuery, Observable, PathRegExp) {
    function mixWithClonedArrays(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        for (var i = 0, j = sources.length; i < j; ++i) {
            var source = sources[i];
            for (var key in source) {
                target[key] = source[key] instanceof Array ? source[key].slice(0) : source[key];
            }
        }
        return target;
    }
    function mixWithArrayConversion(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        var targetMap = target;
        for (var i = 0, j = sources.length; i < j; ++i) {
            var source = sources[i];
            for (var key in source) {
                var value = source[key];
                if (key in targetMap) {
                    if (!(targetMap[key] instanceof Array)) {
                        targetMap[key] = [targetMap[key]];
                    }
                    targetMap[key].push(value);
                }
                else {
                    targetMap[key] = value;
                }
            }
        }
        return targetMap;
    }
    var UrlRule = (function (_super) {
        __extends(UrlRule, _super);
        function UrlRule() {
            _super.apply(this, arguments);
        }
        UrlRule.prototype._defaultsGetter = function () {
            return this._defaults;
        };
        UrlRule.prototype._defaultsSetter = function (value) {
            this._defaults = value;
            this._hostSetter(this._host);
            this._pathSetter(this._path);
        };
        UrlRule.prototype._hostGetter = function () {
            return this._host;
        };
        UrlRule.prototype._hostSetter = function (value) {
            this._host = value;
            this._hostExpression = value ? this._parsePattern(value, '.', 1 /* RIGHT */, false, this.get('defaults')) : null;
        };
        UrlRule.prototype._isCaseSensitiveGetter = function () {
            return this._isCaseSensitive;
        };
        UrlRule.prototype._isCaseSensitiveSetter = function (value) {
            this._isCaseSensitive = value;
            this._hostSetter(this._host);
            this._pathSetter(this._path);
        };
        UrlRule.prototype._pathGetter = function () {
            return this._path;
        };
        UrlRule.prototype._pathSetter = function (value) {
            this._path = value;
            this._pathExpression = value ? this._parsePattern(value, '/', 0 /* LEFT */, this.get('isCaseSensitive'), this.get('defaults')) : null;
        };
        UrlRule.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this.set('mode', 1 /* PARSE */ | 2 /* SERIALIZE */);
        };
        UrlRule.prototype._parsePattern = function (pattern, separator, separatorDirection, isCaseSensitive, defaults) {
            return new PathRegExp(pattern, separator, separatorDirection, isCaseSensitive, defaults);
        };
        UrlRule.prototype.parse = function (request) {
            if (!(this.get('mode') & 1 /* PARSE */)) {
                return null;
            }
            if (this.get('protocol') && request.protocol !== this.get('protocol')) {
                return null;
            }
            if (this.get('methods') && arrayUtil.indexOf(this.get('methods'), request.method) === -1) {
                return null;
            }
            if (this._hostExpression && !this._hostExpression.test(request.host)) {
                return null;
            }
            var path = request.path && request.path.replace(/^\/*|\/*$/g, '');
            if (this._pathExpression && !this._pathExpression.test(path)) {
                return null;
            }
            var kwArgs = {};
            if (this._hostExpression) {
                mixWithArrayConversion(kwArgs, this._hostExpression.exec(request.host));
            }
            if (this._pathExpression) {
                mixWithArrayConversion(kwArgs, this._pathExpression.exec(path));
            }
            for (var _ in request.vars) {
                mixWithArrayConversion(kwArgs, request.vars);
                break;
            }
            var defaults = this.get('defaults');
            for (var key in defaults) {
                if (!(key in kwArgs)) {
                    kwArgs[key] = defaults[key];
                }
            }
            var routeInfo = {
                routeId: kwArgs.routeId || this.get('routeId'),
                kwArgs: kwArgs
            };
            if (!routeInfo.routeId) {
                return null;
            }
            delete kwArgs.routeId;
            return routeInfo;
        };
        UrlRule.prototype.serialize = function (routeId, kwArgs) {
            if (!(this.get('mode') & 2 /* SERIALIZE */)) {
                return null;
            }
            if (this.get('routeId') && this.get('routeId') !== routeId) {
                return null;
            }
            var routeInfo;
            if (this.get('routeId')) {
                routeInfo = {};
            }
            else {
                routeInfo = { routeId: routeId };
            }
            mixWithClonedArrays(routeInfo, this.get('defaults'), kwArgs);
            if (this._hostExpression && !this._hostExpression.testConsumability(routeInfo)) {
                return null;
            }
            if (this._pathExpression && !this._pathExpression.testConsumability(routeInfo)) {
                return null;
            }
            var serialization = '';
            if (this.get('protocol')) {
                if (!this._hostExpression) {
                    return null;
                }
                serialization += this.get('protocol');
            }
            if (this._hostExpression) {
                serialization += '//' + this._hostExpression.consume(routeInfo) + '/';
            }
            if (this._pathExpression) {
                if (!this._hostExpression) {
                    serialization += '/';
                }
                serialization += this._pathExpression.consume(routeInfo);
            }
            for (var key in routeInfo) {
                serialization += '?' + ioQuery.objectToQuery(routeInfo);
                break;
            }
            return serialization;
        };
        return UrlRule;
    })(Observable);
    var UrlRule;
    (function (UrlRule) {
        (function (Mode) {
            Mode[Mode["PARSE"] = 1] = "PARSE";
            Mode[Mode["SERIALIZE"] = 2] = "SERIALIZE";
        })(UrlRule.Mode || (UrlRule.Mode = {}));
        var Mode = UrlRule.Mode;
    })(UrlRule || (UrlRule = {}));
    return UrlRule;
});
//# sourceMappingURL=../_debug/routing/UrlRule.js.map