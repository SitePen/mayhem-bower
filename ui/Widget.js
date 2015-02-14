define(["require", "exports", '../has', "./dom/Widget"], function (require, exports, has) {
    var Widget;
    if (has('host-browser')) {
        Widget = require('./dom/Widget');
    }
    return Widget;
});
//# sourceMappingURL=../_debug/ui/Widget.js.map