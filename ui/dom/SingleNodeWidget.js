var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Widget'], function (require, exports, Widget) {
    var SingleNodeWidget = (function (_super) {
        __extends(SingleNodeWidget, _super);
        function SingleNodeWidget(kwArgs) {
            _super.call(this, kwArgs);
            this._node['widget'] = this;
        }
        SingleNodeWidget.prototype.destroy = function () {
            this._node['widget'] = null;
            _super.prototype.destroy.call(this);
        };
        SingleNodeWidget.prototype.detach = function () {
            this._node.parentNode && this._node.parentNode.removeChild(this._node);
            _super.prototype.detach.call(this);
            return this._node;
        };
        SingleNodeWidget.prototype._firstNodeGetter = function () {
            return this._node;
        };
        SingleNodeWidget.prototype._lastNodeGetter = function () {
            return this._node;
        };
        return SingleNodeWidget;
    })(Widget);
    return SingleNodeWidget;
});
//# sourceMappingURL=../../_debug/ui/dom/SingleNodeWidget.js.map