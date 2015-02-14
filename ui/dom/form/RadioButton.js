var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dijit/form/RadioButton', '../DijitWidget', 'dojo/dom-construct', '../util', '../MultiNodeWidget', '../../../util'], function (require, exports, DijitRadioButton, DijitWidget, domConstruct, domUtil, MultiNodeWidget, util) {
    var RadioButton = (function (_super) {
        __extends(RadioButton, _super);
        function RadioButton(kwArgs) {
            util.deferSetters(this, ['isChecked', 'formattedLabel', 'label', 'value'], '_render');
            _super.call(this, kwArgs);
        }
        RadioButton.prototype._isCheckedGetter = function () {
            return this._isChecked;
        };
        RadioButton.prototype._isCheckedSetter = function (isChecked) {
            this._isChecked = isChecked;
            if (isChecked) {
                this.set('value', this._checkedValue);
            }
        };
        RadioButton.prototype._formattedLabelGetter = function () {
            return this._formattedLabel;
        };
        RadioButton.prototype._formattedLabelSetter = function (value) {
            domUtil.extractContents(this._labelNode, this._labelNode, true);
            var content = domConstruct.toDom(value);
            var oldLabelValue = this._label;
            this._label = content.textContent || content.innerText;
            this._labelNode.appendChild(content);
            this._formattedLabel = value;
            this._notify('label', this._label, oldLabelValue);
        };
        RadioButton.prototype._isAttachedGetter = function () {
            return DijitWidget.prototype._isAttachedGetter.call(this);
        };
        RadioButton.prototype._isAttachedSetter = function (value) {
            DijitWidget.prototype._isAttachedSetter.call(this, value);
        };
        RadioButton.prototype._isFocusedGetter = function () {
            return DijitWidget.prototype._isFocusedGetter.call(this);
        };
        RadioButton.prototype._isFocusedSetter = function (value) {
            DijitWidget.prototype._isFocusedSetter.call(this);
        };
        RadioButton.prototype._labelGetter = function () {
            return this._label;
        };
        RadioButton.prototype._labelSetter = function (value) {
            this.set('formattedLabel', util.escapeXml(value));
        };
        RadioButton.prototype._valueGetter = function () {
            return this._value;
        };
        RadioButton.prototype._valueSetter = function (value) {
            this._value = value;
            var isChecked = value === this._checkedValue;
            if (this._isChecked !== isChecked) {
                this.set('isChecked', value === this._checkedValue);
            }
        };
        RadioButton.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._isChecked = false;
            this._value = null;
            this._isDisabled = false;
        };
        RadioButton.prototype._render = function () {
            _super.prototype._render.call(this);
            DijitWidget.prototype._render.call(this);
            this._node = null;
            this._fragment.insertBefore(this._widget.domNode, this._lastNode);
            var labelNode = document.createElement('label');
            labelNode.htmlFor = this._widget.id;
            this._fragment.insertBefore(labelNode, this._lastNode);
            this._labelNode = labelNode;
        };
        RadioButton.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            DijitWidget.prototype.destroy.call(this);
        };
        RadioButton.Ctor = DijitRadioButton;
        RadioButton.setupMap = util.deepCreate(DijitWidget.setupMap, {
            properties: {
                isChecked: 'checked'
            }
        });
        return RadioButton;
    })(MultiNodeWidget);
    return RadioButton;
});
//# sourceMappingURL=../../../_debug/ui/dom/form/RadioButton.js.map