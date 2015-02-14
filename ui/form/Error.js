define(["require", "exports", '../../has', "../dom/form/Error"], function (require, exports, has) {
    var ErrorWidget;
    if (has('host-browser')) {
        ErrorWidget = require('../dom/form/Error');
    }
    return ErrorWidget;
});
//# sourceMappingURL=../../_debug/ui/form/Error.js.map