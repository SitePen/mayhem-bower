var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding', '../../util'], function (require, exports, Binding, util) {
    var ObjectTargetBinding = (function (_super) {
        __extends(ObjectTargetBinding, _super);
        function ObjectTargetBinding(kwArgs) {
            _super.call(this, kwArgs);
            this._object = kwArgs.object;
            this._property = kwArgs.path;
        }
        ObjectTargetBinding.test = function (kwArgs) {
            return util.isObject(kwArgs.object) && typeof kwArgs.path === 'string';
        };
        ObjectTargetBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._object = this._property = null;
        };
        ObjectTargetBinding.prototype.get = function () {
            return this._object ? this._object[this._property] : undefined;
        };
        ObjectTargetBinding.prototype.getObject = function () {
            return this._object;
        };
        ObjectTargetBinding.prototype.set = function (value) {
            if (this._object && !util.isEqual(this.get(), value)) {
                this._object[this._property] = value;
            }
        };
        return ObjectTargetBinding;
    })(Binding);
    return ObjectTargetBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/ObjectTargetBinding.js.map