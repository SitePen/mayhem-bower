var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dijit/form/Button', '../DijitWidget', '../../../util'], function (require, exports, DijitButton, DijitWidget, util) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            _super.apply(this, arguments);
        }
        Button.prototype._formattedLabelGetter = function () {
            return this._formattedLabel;
        };
        Button.prototype._formattedLabelSetter = function (value) {
            var oldFormattedLabel = this._formattedLabel;
            this._formattedLabel = value;
            this._notify('label', util.unescapeXml(value), util.unescapeXml(oldFormattedLabel));
        };
        Button.prototype._labelGetter = function () {
            return util.unescapeXml(this._formattedLabel);
        };
        Button.prototype._labelSetter = function (value) {
            this.set('formattedLabel', util.escapeXml(value));
        };
        Button.Ctor = DijitButton;
        Button.setupMap = util.deepCreate(DijitWidget.setupMap, {
            properties: {
                formattedLabel: 'label',
                icon: 'iconClass'
            }
        });
        return Button;
    })(DijitWidget);
    Button.prototype._formattedLabel = '';
    return Button;
});
//# sourceMappingURL=../../../_debug/ui/dom/form/Button.js.map