define(["require", "exports", '../has', "./dom/Label"], function (require, exports, has) {
    var Label;
    if (has('host-browser')) {
        Label = require('./dom/Label');
    }
    return Label;
});
//# sourceMappingURL=../_debug/ui/Label.js.map