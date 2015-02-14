define(["require", "exports"], function (require, exports) {
    var PathRegExp = (function () {
        function PathRegExp(path, partSeparator, separatorDirection, isCaseSensitive, defaults) {
            if (separatorDirection === void 0) { separatorDirection = 0 /* LEFT */; }
            if (isCaseSensitive === void 0) { isCaseSensitive = true; }
            if (defaults === void 0) { defaults = {}; }
            function checkForSeparatorAt(index, length) {
                if (separatorDirection === 0 /* LEFT */ && index < partSeparator.length) {
                    return false;
                }
                if (separatorDirection === 1 /* RIGHT */ && index + partSeparator.length > path.length) {
                    return false;
                }
                var separatorIndex = index;
                if (separatorDirection === 0 /* LEFT */) {
                    separatorIndex -= partSeparator.length;
                }
                else {
                    separatorIndex += length;
                }
                return path.slice(separatorIndex, separatorIndex + partSeparator.length) === partSeparator;
            }
            function convertCaptureGroups(expression) {
                var lastIndex;
                var index;
                var nonCapturingGroups = {
                    '?:': true,
                    '?=': true,
                    '?!': true
                };
                while ((index = expression.indexOf('(', lastIndex)) > -1) {
                    lastIndex = index;
                    var numEscapeChars = 0;
                    while (expression.charAt(index - 1) === '\\') {
                        ++numEscapeChars;
                        --index;
                    }
                    if ((numEscapeChars % 2) === 0 && !nonCapturingGroups[expression.slice(lastIndex + 1, lastIndex + 3)]) {
                        expression = expression.slice(0, lastIndex + 1) + '?:' + expression.slice(lastIndex + 1);
                    }
                    ++lastIndex;
                }
                return expression;
            }
            var parameterPattern = /<([^:]+):([^>]+)>/g;
            var expression = '^';
            var keys = [];
            var parts = [];
            var lastIndex = 0;
            var match;
            var partIsOptional;
            var regExpFlags = isCaseSensitive ? '' : 'i';
            var staticPart;
            var valueExpression;
            while ((match = parameterPattern.exec(path))) {
                keys.push(match[1]);
                valueExpression = '(' + convertCaptureGroups(match[2]) + ')';
                staticPart = path.slice(lastIndex, match.index);
                parts.push(staticPart);
                if (partSeparator && match[1] in defaults && checkForSeparatorAt(match.index, match[0].length)) {
                    if (separatorDirection === 0 /* LEFT */) {
                        expression += PathRegExp.escape(staticPart.slice(0, -partSeparator.length));
                        expression += '(?:' + PathRegExp.escape(partSeparator) + valueExpression + ')?';
                    }
                    else {
                        expression += PathRegExp.escape(staticPart);
                        expression += '(?:' + valueExpression + PathRegExp.escape(partSeparator) + ')?';
                    }
                    partIsOptional = true;
                }
                else {
                    expression += PathRegExp.escape(staticPart) + valueExpression;
                    partIsOptional = false;
                }
                parts.push({ key: match[1], expression: new RegExp(match[2], regExpFlags), isOptional: partIsOptional });
                lastIndex = match.index + match[0].length;
                if (1 /* RIGHT */ && partIsOptional) {
                    parts.push(path.slice(lastIndex, lastIndex + partSeparator.length));
                    lastIndex += partSeparator.length;
                }
            }
            staticPart = path.slice(lastIndex);
            parts.push(staticPart);
            expression += PathRegExp.escape(staticPart) + '$';
            this._expression = new RegExp(expression, regExpFlags);
            this._keys = keys;
            this._parts = parts;
        }
        PathRegExp.escape = function (string) {
            return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        };
        PathRegExp.prototype.consume = function (kwArgs) {
            var serialization = '';
            var key;
            for (var i = 0, j = this._parts.length; i < j; ++i) {
                var part = this._parts[i];
                if (typeof part === 'string') {
                    serialization += part;
                }
                else {
                    key = part.key;
                    if (!(key in kwArgs)) {
                        if (!part.isOptional) {
                            throw new Error('Missing required key "' + key + '"');
                        }
                        else {
                            continue;
                        }
                    }
                    var value = kwArgs[key];
                    var expression = part.expression;
                    if (value instanceof Array) {
                        value = value.shift();
                    }
                    if (!expression.test(value)) {
                        throw new Error('Key "' + key + '" does not match expected pattern ' + expression);
                    }
                    serialization += value;
                    if (!(kwArgs[key] instanceof Array) || kwArgs[key].length === 0) {
                        delete kwArgs[key];
                    }
                }
            }
            return serialization;
        };
        PathRegExp.prototype.exec = function (string, options) {
            if (options === void 0) { options = {}; }
            var key;
            var match;
            if ((match = this._expression.exec(string))) {
                var kwArgs = {};
                for (var i = 0, j = this._keys.length; i < j; ++i) {
                    key = this._keys[i];
                    var value = match[i + 1];
                    if (value === undefined) {
                        continue;
                    }
                    if (options.coerce !== false && !isNaN(value)) {
                        value = Number(value);
                    }
                    if (key in kwArgs) {
                        if (!(kwArgs[key] instanceof Array)) {
                            kwArgs[key] = [kwArgs[key]];
                        }
                        kwArgs[key].push(value);
                    }
                    else {
                        kwArgs[key] = value;
                    }
                }
                return kwArgs;
            }
            return null;
        };
        PathRegExp.prototype.test = function (value) {
            return this._expression.test(value);
        };
        PathRegExp.prototype.testConsumability = function (kwArgs) {
            for (var i = 0, j = this._parts.length; i < j; ++i) {
                var part = this._parts[i];
                if (typeof part !== 'string') {
                    var key = part.key;
                    if (!(key in kwArgs) && !part.isOptional) {
                        return false;
                    }
                    if (!part.expression.test(kwArgs[key])) {
                        return false;
                    }
                }
            }
            return true;
        };
        return PathRegExp;
    })();
    var PathRegExp;
    (function (PathRegExp) {
        (function (Direction) {
            Direction[Direction["LEFT"] = 0] = "LEFT";
            Direction[Direction["RIGHT"] = 1] = "RIGHT";
        })(PathRegExp.Direction || (PathRegExp.Direction = {}));
        var Direction = PathRegExp.Direction;
    })(PathRegExp || (PathRegExp = {}));
    return PathRegExp;
});
//# sourceMappingURL=../_debug/routing/PathRegExp.js.map