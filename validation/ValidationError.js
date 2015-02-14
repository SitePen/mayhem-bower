define(["require", "exports", 'dojo/errors/create', 'dojo/_base/lang'], function (require, exports, createError, lang) {
    var i18n = {
        genericFieldName: 'Field'
    };
    var ValidationError;
    function Ctor(message, options) {
        this.options = options;
    }
    ValidationError = createError('ValidationError', Ctor, Error, {
        toString: function (options) {
            var dictionary = lang.mixin({ name: i18n.genericFieldName }, this.options, options);
            return lang.replace(this.message, dictionary);
        }
    });
    return ValidationError;
});
//# sourceMappingURL=../_debug/validation/ValidationError.js.map