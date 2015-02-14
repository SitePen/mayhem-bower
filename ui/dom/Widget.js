var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './actions', '../common/Widget'], function (require, exports, actions, CommonWidget) {
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget() {
            _super.apply(this, arguments);
        }
        Widget.prototype.detach = function () {
            return _super.prototype.detach.call(this);
        };
        return Widget;
    })(CommonWidget);
    Widget.prototype.on = function (type, listener) {
        var _actions = actions;
        if (typeof type === 'string' && _actions[type]) {
            var handle = _actions[type](this, listener);
            this._eventListeners.push(handle);
            return handle;
        }
        return CommonWidget.prototype.on.apply(this, arguments);
    };
    return Widget;
});
//# sourceMappingURL=../../_debug/ui/dom/Widget.js.map