define(["require", "exports", 'dojo/errors/create', 'dojo/_base/lang'], function (require, exports, createError, lang) {
    var BindingError;
    function Ctor(message, kwArgs) {
        if (!message) {
            message = 'Could not create Binding object for "{path}" on {object}.';
        }
        this.message = lang.replace(message, kwArgs);
        this.kwArgs = kwArgs;
    }
    BindingError = createError('BindingError', Ctor, Error, {});
    return BindingError;
});
//# sourceMappingURL=../_debug/binding/BindingError.js.map