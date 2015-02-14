var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/dom-construct', './util', './MultiNodeWidget', '../../util'], function (require, exports, domConstruct, domUtil, MultiNodeWidget, util) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(kwArgs) {
            util.deferSetters(this, ['formattedText'], '_render');
            _super.call(this, kwArgs);
        }
        Label.prototype._formattedTextGetter = function () {
            return this._formattedText;
        };
        Label.prototype._formattedTextSetter = function (value) {
            domUtil.extractContents(this._firstNode, this._lastNode, true);
            var content = domConstruct.toDom(value);
            var oldTextValue = this._text;
            this._text = content.textContent || content.innerText;
            this._lastNode.parentNode.insertBefore(content, this._lastNode);
            this._formattedText = value;
            this._notify('text', this._text, oldTextValue);
        };
        Label.prototype._textGetter = function () {
            return this._text;
        };
        Label.prototype._textSetter = function (value) {
            this.set('formattedText', util.escapeXml(value));
        };
        return Label;
    })(MultiNodeWidget);
    return Label;
});
//# sourceMappingURL=../../_debug/ui/dom/Label.js.map