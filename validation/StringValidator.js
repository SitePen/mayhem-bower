var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ValidationError', './Validator'], function (require, exports, ValidationError, Validator) {
    var i18n = {
        stringTooShort: 'String too short',
        stringTooLong: 'String too long',
        stringNotMatchingRegExp: 'String does not match pattern'
    };
    var StringValidator = (function (_super) {
        __extends(StringValidator, _super);
        function StringValidator() {
            _super.apply(this, arguments);
        }
        StringValidator.prototype.validate = function (model, key, value) {
            var options = this.options;
            value = String(value);
            if (options.minLength != null && value.length < options.minLength) {
                model.addError(key, new ValidationError(i18n.stringTooShort, { minLength: options.minLength }));
            }
            if (options.maxLength != null && value.length > options.maxLength) {
                model.addError(key, new ValidationError(i18n.stringTooLong, { maxLength: options.maxLength }));
            }
            if (options.regExp && !options.regExp.test(value)) {
                model.addError(key, new ValidationError(options.regExpFailureMessage || i18n.stringNotMatchingRegExp, { regExp: options.regExp.toString() }));
            }
        };
        return StringValidator;
    })(Validator);
    return StringValidator;
});
//# sourceMappingURL=../_debug/validation/StringValidator.js.map