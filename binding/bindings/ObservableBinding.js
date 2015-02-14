var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding'], function (require, exports, Binding) {
    var ObservableBinding = (function (_super) {
        __extends(ObservableBinding, _super);
        function ObservableBinding(kwArgs) {
            _super.call(this, kwArgs);
            var object = this._object = kwArgs.object;
            this._property = kwArgs.path;
            var self = this;
            this._handle = object.observe(kwArgs.path, function (newValue, oldValue) {
                self.notify({ oldValue: oldValue, value: newValue });
            });
        }
        ObservableBinding.test = function (kwArgs) {
            var object = kwArgs.object;
            return object != null && typeof object.get === 'function' && typeof object.set === 'function' && typeof object.observe === 'function' && typeof kwArgs.path === 'string';
        };
        ObservableBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._handle.remove();
            this._handle = this._object = null;
        };
        ObservableBinding.prototype.get = function () {
            return this._object ? this._object.get(this._property) : undefined;
        };
        ObservableBinding.prototype.getObject = function () {
            return this._object;
        };
        ObservableBinding.prototype.set = function (value) {
            this._object && this._object.set(this._property, value);
        };
        return ObservableBinding;
    })(Binding);
    return ObservableBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/ObservableBinding.js.map