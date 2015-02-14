var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding'], function (require, exports, Binding) {
    var CollectionLengthBinding = (function (_super) {
        __extends(CollectionLengthBinding, _super);
        function CollectionLengthBinding(kwArgs) {
            _super.call(this, kwArgs);
            var self = this;
            this._object = kwArgs.object;
            this._handle = this._object.on('add, update, delete', function (event) {
                if (event.totalLength != null) {
                    var oldValue = self._value;
                    self._value = event.totalLength;
                    self.notify({ oldValue: oldValue, value: event.totalLength });
                }
            });
            this._object.fetchRange({ start: 0, end: 0 }).totalLength.then(function (length) {
                self._value = length;
                self.notify({ value: length });
            });
        }
        CollectionLengthBinding.test = function (kwArgs) {
            return 'fetchRange' in kwArgs.object && 'on' in kwArgs.object && kwArgs.path === 'totalLength';
        };
        CollectionLengthBinding.prototype.get = function () {
            return this._value;
        };
        CollectionLengthBinding.prototype.getObject = function () {
            return this._object;
        };
        CollectionLengthBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._object.tracking.remove();
            this._handle.remove();
            this._handle = this._object = null;
        };
        return CollectionLengthBinding;
    })(Binding);
    return CollectionLengthBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/CollectionLengthBinding.js.map