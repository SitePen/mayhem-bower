define(["require", "exports", '../../has', "../dom/form/DatePicker"], function (require, exports, has) {
    var DatePicker;
    if (has('host-browser')) {
        DatePicker = require('../dom/form/DatePicker');
    }
    return DatePicker;
});
//# sourceMappingURL=../../_debug/ui/form/DatePicker.js.map