var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ObjectTargetBinding', 'dojo/on'], function (require, exports, ObjectTargetBinding, on) {
    var DomInputBinding = (function (_super) {
        __extends(DomInputBinding, _super);
        function DomInputBinding(kwArgs) {
            _super.call(this, kwArgs);
            var object = kwArgs.object;
            var property = kwArgs.path;
            this._object = object;
            this._property = property;
            var self = this;
            this._handle = on(object, 'input, change, propertychange', function (event) {
                if (event.type !== 'propertychange' || event.propertyName === property) {
                    self.notify({ value: event.target[property] });
                }
            });
        }
        DomInputBinding.test = function (kwArgs) {
            var object = kwArgs.object;
            if (object == null) {
                return false;
            }
            if (object.nodeType === 1 && (kwArgs.path === 'value' || kwArgs.path === 'checked') && object.nodeName.toUpperCase() === 'INPUT') {
                return true;
            }
            return false;
        };
        DomInputBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._handle.remove();
            this._handle = null;
        };
        return DomInputBinding;
    })(ObjectTargetBinding);
    return DomInputBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/DomInputBinding.js.map