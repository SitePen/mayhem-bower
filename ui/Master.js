define(["require", "exports", '../has', "./dom/Master"], function (require, exports, has) {
    var Master;
    if (has('host-browser')) {
        Master = require('./dom/Master');
    }
    return Master;
});
//# sourceMappingURL=../_debug/ui/Master.js.map