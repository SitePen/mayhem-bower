var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../form/CheckboxValue', 'dijit/form/CheckBox', '../DijitWidget', '../../../util'], function (require, exports, CheckboxValue, DijitCheckbox, DijitWidget, util) {
    var Checkbox = (function (_super) {
        __extends(Checkbox, _super);
        function Checkbox() {
            _super.apply(this, arguments);
        }
        Checkbox.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        Checkbox.prototype._isCheckedGetter = function () {
            return this.get('value') === 1 /* TRUE */;
        };
        Checkbox.prototype._isCheckedSetter = function (value) {
            this.set('value', value ? 1 /* TRUE */ : 0 /* FALSE */);
        };
        Checkbox.prototype._render = function () {
            _super.prototype._render.call(this);
            this._widget._onClick = function (event) {
                event.preventDefault();
            };
            this.on('activate', function () {
                this.set('isChecked', !this.get('isChecked'));
            });
        };
        Checkbox.prototype._valueGetter = function () {
            return this._value;
        };
        Checkbox.prototype._valueSetter = function (value) {
            if (value === this._value) {
                return;
            }
            this._value = value;
            var oldChecked = this._isChecked;
            this._isChecked = value === 1 /* TRUE */ ? true : false;
            this._notify('isChecked', this._isChecked, oldChecked);
        };
        Checkbox.Ctor = DijitCheckbox;
        Checkbox.setupMap = util.deepCreate(DijitWidget.setupMap, {
            properties: {
                isChecked: 'checked'
            }
        });
        return Checkbox;
    })(DijitWidget);
    Checkbox.prototype._isChecked = false;
    Checkbox.prototype._value = 0 /* FALSE */;
    return Checkbox;
});
//# sourceMappingURL=../../../_debug/ui/dom/form/Checkbox.js.map