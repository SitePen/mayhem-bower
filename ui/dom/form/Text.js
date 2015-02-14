var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../DijitWidget', 'dijit/form/ValidationTextBox', 'dijit/form/SimpleTextarea', '../../../util'], function (require, exports, DijitWidget, DijitText, DijitTextarea, util) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text() {
            _super.apply(this, arguments);
        }
        Text.prototype._isMultiLineGetter = function () {
            return this._isMultiLine;
        };
        Text.prototype._isMultiLineSetter = function (value) {
            if (value === this._isMultiLine) {
                return;
            }
            this._isMultiLine = value;
            this._render();
        };
        Text.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._autoCommit = false;
            this._isMultiLine = false;
            this._placeholder = '';
            this._readOnly = false;
            this._value = '';
        };
        Text.prototype._render = function () {
            var Ctor = this.get('isMultiLine') ? DijitTextarea : DijitText;
            var widget = new Ctor();
            if (this._widget) {
                this._node.parentNode.replaceChild(widget.domNode, this._node);
                this._widget.destroyRecursive();
            }
            this._widget = widget;
            this._node = widget.domNode;
            this._node.widget = this;
            this._bindWidget();
            if (this.get('isAttached')) {
                widget.startup();
            }
        };
        Text.setupMap = util.deepCreate(DijitWidget.setupMap, {
            properties: {
                autoCommit: 'intermediateChanges',
                placeholder: 'placeHolder',
                readOnly: 'readOnly',
                value: 'value'
            }
        });
        return Text;
    })(DijitWidget);
    return Text;
});
//# sourceMappingURL=../../../_debug/ui/dom/form/Text.js.map