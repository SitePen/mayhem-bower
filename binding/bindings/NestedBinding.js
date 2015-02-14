var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/_base/array', '../Binding', 'dojo/_base/lang', '../../util'], function (require, exports, array, Binding, lang, util) {
    var SEPARATOR = '.';
    var NestedBinding = (function (_super) {
        __extends(NestedBinding, _super);
        function NestedBinding(kwArgs) {
            _super.call(this, kwArgs);
            this._bindings = [];
            this._binder = kwArgs.binder;
            this._path = util.escapedSplit(kwArgs.path, SEPARATOR);
            this._rebind(kwArgs.object, 0);
        }
        NestedBinding.test = function (kwArgs) {
            return kwArgs.object != null && kwArgs.path && util.escapedIndexOf(kwArgs.path, SEPARATOR) > -1;
        };
        NestedBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            var bindings = this._bindings;
            for (var i = 0, binding; (binding = bindings[i]); ++i) {
                binding.destroy();
            }
            this._source = this._bindings = this._path = null;
        };
        NestedBinding.prototype.get = function () {
            return this._source && this._source.get ? this._source.get() : undefined;
        };
        NestedBinding.prototype.getObject = function () {
            return this._source ? this._source.getObject() : undefined;
        };
        NestedBinding.prototype._rebind = function (fromObject, fromIndex) {
            var bindings = this._bindings;
            array.forEach(bindings.splice(fromIndex), function (binding) {
                binding.destroy();
            });
            var self = this;
            var path;
            var index = fromIndex;
            var object = fromObject;
            var binding;
            var length = this._path.length;
            for (; index < length - 1 && object; ++index) {
                path = this._path[index];
                binding = this._binder.createBinding(object, path, { useScheduler: false });
                binding.observe(lang.partial(function (index, change) {
                    self._rebind(change.value, index + 1);
                }, index));
                bindings.push(binding);
                if ((object = binding.get()) == null) {
                    break;
                }
                if (typeof object.then === 'function') {
                    object.then(function (value) {
                        self._rebind(value, index + 1);
                    });
                    return;
                }
            }
            var value;
            if (object) {
                binding = this._binder.createBinding(object, this._path[index], { useScheduler: false });
                binding.observe(function (change) {
                    self.notify(change);
                });
                bindings.push(binding);
                value = binding.get();
            }
            else {
                binding = null;
            }
            this._source = binding;
            this.notify({ value: value });
        };
        NestedBinding.prototype.set = function (value) {
            this._source && this._source.set && this._source.set(value);
        };
        return NestedBinding;
    })(Binding);
    return NestedBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/NestedBinding.js.map