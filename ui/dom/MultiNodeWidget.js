var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './util', './Widget'], function (require, exports, domUtil, Widget) {
    var MultiNodeWidget = (function (_super) {
        __extends(MultiNodeWidget, _super);
        function MultiNodeWidget(kwArgs) {
            _super.call(this, kwArgs);
            this._firstNode['widget'] = this._lastNode['widget'] = this;
        }
        MultiNodeWidget.prototype.destroy = function () {
            this._firstNode['widget'] = this._lastNode['widget'] = null;
            _super.prototype.destroy.call(this);
        };
        MultiNodeWidget.prototype.detach = function () {
            if (this._firstNode.parentNode !== this._fragment) {
                this._fragment = domUtil.extractContents(this._firstNode, this._lastNode);
            }
            _super.prototype.detach.call(this);
            return this._fragment;
        };
        MultiNodeWidget.prototype._render = function () {
            var commentId = this._id.replace(/--/g, '\u2010\u2010');
            this._firstNode = document.createComment(commentId);
            this._lastNode = document.createComment('/' + commentId);
            var fragment = this._fragment = document.createDocumentFragment();
            fragment.appendChild(this._firstNode);
            fragment.appendChild(this._lastNode);
        };
        return MultiNodeWidget;
    })(Widget);
    return MultiNodeWidget;
});
//# sourceMappingURL=../../_debug/ui/dom/MultiNodeWidget.js.map