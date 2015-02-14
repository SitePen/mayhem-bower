var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dijit/form/DateTextBox', '../DijitWidget', '../../../util'], function (require, exports, DijitDateTextBox, DijitWidget, util) {
    var DatePicker = (function (_super) {
        __extends(DatePicker, _super);
        function DatePicker(kwArgs) {
            util.deferSetters(this, ['min', 'max'], '_render');
            _super.call(this, kwArgs);
        }
        DatePicker.prototype._maxGetter = function () {
            return this._max;
        };
        DatePicker.prototype._maxSetter = function (date) {
            this._max = date;
            var constraints = {
                max: this._max
            };
            if (this._min) {
                constraints.min = this._min;
            }
            this._widget.set('constraints', constraints);
        };
        DatePicker.prototype._minGetter = function () {
            return this._min;
        };
        DatePicker.prototype._minSetter = function (date) {
            this._min = date;
            var constraints = {
                min: this._min
            };
            if (this._max) {
                constraints.max = this._max;
            }
            this._widget.set('constraints', constraints);
        };
        DatePicker.Ctor = DijitDateTextBox;
        DatePicker.setupMap = util.deepCreate(DijitWidget.setupMap, {
            properties: {
                placeholder: 'placeHolder',
                readOnly: 'readOnly',
                value: 'value'
            }
        });
        return DatePicker;
    })(DijitWidget);
    return DatePicker;
});
//# sourceMappingURL=../../../_debug/ui/dom/form/DatePicker.js.map