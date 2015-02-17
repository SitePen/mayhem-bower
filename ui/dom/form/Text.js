var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../DijitWidget', 'dijit/form/ValidationTextBox', 'dijit/form/SimpleTextarea', '../../form/KeyboardType', '../../../util'], function (require, exports, DijitWidget, DijitText, DijitTextarea, KeyboardType, util) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(kwArgs) {
            util.deferSetters(this, ['isSecureEntry', 'keyboardType'], '_render');
            util.deferSetters(this, ['isMultiLine'], '_render', function (_, value) {
                this._isMultiLine = value;
            });
            _super.call(this, kwArgs);
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
        Text.prototype._isSecureEntryGetter = function () {
            return this._isSecureEntry;
        };
        Text.prototype._isSecureEntrySetter = function (value) {
            if (value === this._isSecureEntry || this._isMultiLine) {
                return;
            }
            var htmlType = value ? 'password' : 'text';
            this._isSecureEntry = value;
            this._widget.textbox.type = htmlType;
        };
        Text.prototype._keyboardTypeGetter = function () {
            return this._keyboardType;
        };
        Text.prototype._keyboardTypeSetter = function (value) {
            if (this._keyboardType === value || this._isMultiLine) {
                return;
            }
            this._keyboardType = value;
            var htmlInput = this._widget.textbox;
            var useInputMode = 'inputMode' in htmlInput;
            var htmlType;
            switch (value) {
                case 0 /* DEFAULT */:
                    htmlType = useInputMode ? null : (this._isSecureEntry ? 'password' : 'text');
                    break;
                case 1 /* URL */:
                    htmlType = 'url';
                    break;
                case 2 /* NUMBER */:
                    htmlType = useInputMode ? 'numeric' : 'number';
                    break;
                case 3 /* TELEPHONE */:
                    htmlType = 'tel';
                    break;
                case 4 /* EMAIL */:
                    htmlType = 'email';
                    break;
            }
            if (useInputMode) {
                htmlInput.inputMode = htmlType;
            }
            else {
                htmlInput.type = htmlType;
            }
        };
        Text.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._autoCommit = false;
            this._keyboardType = 0 /* DEFAULT */;
            this._isMultiLine = false;
            this._isSecureEntry = false;
            this._placeholder = '';
            this._readOnly = false;
            this._value = '';
        };
        Text.prototype._render = function () {
            var isMultiLine = this.get('isMultiLine');
            var Ctor = isMultiLine ? DijitTextarea : DijitText;
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