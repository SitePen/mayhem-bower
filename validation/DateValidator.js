var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/date/locale', './ValidationError', './Validator'], function (require, exports, locale, ValidationError, Validator) {
    var i18n = {
        notADate: 'Not a date',
        dateTooSmall: 'Date too small',
        dateTooLarge: 'Date too large'
    };
    var DateValidator = (function (_super) {
        __extends(DateValidator, _super);
        function DateValidator() {
            _super.apply(this, arguments);
        }
        DateValidator.prototype.validate = function (model, key, value) {
            var options = this.options;
            if (!(value instanceof Date)) {
                value = new Date(Date.parse(value));
            }
            if (isNaN(value.valueOf())) {
                model.addError(key, new ValidationError(i18n.notADate));
                return;
            }
            model[key] = value;
            if (options.min && value < options.min) {
                model.addError(key, new ValidationError(i18n.dateTooSmall, { min: locale.format(options.min) }));
            }
            if (options.max && value > options.max) {
                model.addError(key, new ValidationError(i18n.dateTooLarge, { max: locale.format(options.max) }));
            }
        };
        return DateValidator;
    })(Validator);
    return DateValidator;
});
//# sourceMappingURL=../_debug/validation/DateValidator.js.map