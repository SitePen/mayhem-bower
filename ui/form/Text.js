define(["require", "exports", '../../has', "../dom/form/Text"], function (require, exports, has) {
    var Text;
    if (has('host-browser')) {
        Text = require('../dom/form/Text');
    }
    return Text;
});
//# sourceMappingURL=../../_debug/ui/form/Text.js.map