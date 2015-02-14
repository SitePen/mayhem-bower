var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding', '../../util'], function (require, exports, Binding, util) {
    var StatefulBinding = (function (_super) {
        __extends(StatefulBinding, _super);
        function StatefulBinding(kwArgs) {
            _super.call(this, kwArgs);
            var object = this._object = kwArgs.object;
            this._property = kwArgs.path;
            var self = this;
            this._handle = object.watch(kwArgs.path, function (key, oldValue, newValue) {
                if (!util.isEqual(newValue, oldValue)) {
                    self.notify({ value: newValue, oldValue: oldValue });
                }
            });
        }
        StatefulBinding.test = function (kwArgs) {
            var object = kwArgs.object;
            return object != null && typeof object.get === 'function' && typeof object.set === 'function' && typeof object.watch === 'function' && typeof kwArgs.path === 'string';
        };
        StatefulBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._handle.remove();
            this._handle = this._object = this._property = null;
        };
        StatefulBinding.prototype.get = function () {
            return this._object ? this._object.get(this._property) : undefined;
        };
        StatefulBinding.prototype.getObject = function () {
            return this._object;
        };
        StatefulBinding.prototype.set = function (value) {
            if (this._object) {
                if (util.isEqual(this.get(), value)) {
                    return;
                }
                this._object.set(this._property, value);
            }
        };
        return StatefulBinding;
    })(Binding);
    return StatefulBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/StatefulBinding.js.map