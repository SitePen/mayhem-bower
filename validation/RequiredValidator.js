var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ValidationError', './Validator'], function (require, exports, ValidationError, Validator) {
    var i18n = {
        required: function (kwArgs) {
            return 'Field is required';
        }
    };
    var RequiredValidator = (function (_super) {
        __extends(RequiredValidator, _super);
        function RequiredValidator() {
            _super.apply(this, arguments);
        }
        RequiredValidator.prototype.validate = function (model, key, value) {
            if (value == null || value === '' || value !== value) {
                var labels = model.get('labels') || {};
                model.addError(key, new ValidationError(i18n.required({ field: labels[key] || key })));
            }
        };
        return RequiredValidator;
    })(Validator);
    return RequiredValidator;
});
//# sourceMappingURL=../_debug/validation/RequiredValidator.js.map