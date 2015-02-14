define(["require", "exports", '../../has', "../dom/form/RadioButton"], function (require, exports, has) {
    var RadioButton;
    if (has('host-browser')) {
        RadioButton = require('../dom/form/RadioButton');
    }
    return RadioButton;
});
//# sourceMappingURL=../../_debug/ui/form/RadioButton.js.map