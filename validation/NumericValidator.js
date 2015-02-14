var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ValidationError', './Validator'], function (require, exports, ValidationError, Validator) {
    var i18n = {
        notANumber: 'Not a number',
        notAnInteger: 'Not an integer',
        numberTooSmall: 'Number too small',
        numberTooLarge: 'Number too large'
    };
    var NumericValidator = (function (_super) {
        __extends(NumericValidator, _super);
        function NumericValidator() {
            _super.apply(this, arguments);
        }
        NumericValidator.prototype.validate = function (model, key, value) {
            var options = this.options;
            value = Number(value);
            if (isNaN(value)) {
                model.addError(key, new ValidationError(i18n.notANumber));
                return;
            }
            if (options.integerOnly && Math.floor(value) !== value) {
                model.addError(key, new ValidationError(i18n.notAnInteger));
            }
            if (options.min != null && value < options.min) {
                model.addError(key, new ValidationError(i18n.numberTooSmall, { min: options.min }));
            }
            if (options.max != null && value > options.max) {
                model.addError(key, new ValidationError(i18n.numberTooLarge, { max: options.max }));
            }
        };
        return NumericValidator;
    })(Validator);
    return NumericValidator;
});
//# sourceMappingURL=../_debug/validation/NumericValidator.js.map