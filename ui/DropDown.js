define(["require", "exports", '../has', "./dom/DropDown"], function (require, exports, has) {
    var DropDown;
    if (has('host-browser')) {
        DropDown = require('./dom/DropDown');
    }
    return DropDown;
});
//# sourceMappingURL=../_debug/ui/DropDown.js.map