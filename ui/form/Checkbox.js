define(["require", "exports", '../../has', "../dom/form/Checkbox"], function (require, exports, has) {
    var Checkbox;
    if (has('host-browser')) {
        Checkbox = require('../dom/form/Checkbox');
    }
    return Checkbox;
});
//# sourceMappingURL=../../_debug/ui/form/Checkbox.js.map