var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/_base/array', '../Binding', '../../util'], function (require, exports, arrayUtil, Binding, util) {
    var CompositeBinding = (function (_super) {
        __extends(CompositeBinding, _super);
        function CompositeBinding(kwArgs) {
            _super.call(this, kwArgs);
            var parts = this._parts = [];
            var self = this;
            arrayUtil.forEach(kwArgs.path, function (path) {
                if (path.path) {
                    var binding = kwArgs.binder.createBinding(path.object || kwArgs.object, path.path, { useScheduler: false });
                    binding.observe(function () {
                        self.notify({ value: self.get() });
                    });
                    parts.push(binding);
                }
                else {
                    parts.push({
                        get: function () {
                            return path;
                        }
                    });
                }
            });
        }
        CompositeBinding.test = function (kwArgs) {
            return util.isObject(kwArgs.object) && kwArgs.path instanceof Array;
        };
        CompositeBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            var part;
            while ((part = this._parts.pop())) {
                part.destroy && part.destroy();
            }
            this._parts = null;
        };
        CompositeBinding.prototype.get = function () {
            var result = [];
            for (var i = 0, part; (part = this._parts[i]); ++i) {
                result.push(part.get());
            }
            return result.join('');
        };
        return CompositeBinding;
    })(Binding);
    return CompositeBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/CompositeBinding.js.map