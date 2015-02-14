var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding', '../../util'], function (require, exports, Binding, util) {
    var Es7Binding = (function (_super) {
        __extends(Es7Binding, _super);
        function Es7Binding(kwArgs) {
            _super.call(this, kwArgs);
            var self = this;
            this._object = kwArgs.object;
            this._property = kwArgs.path;
            this._observer = function (changes) {
                var change;
                for (var i = changes.length - 1; (change = changes[i]); --i) {
                    if (change.name === kwArgs.path) {
                        self.notify({
                            oldValue: change.oldValue,
                            value: self.get()
                        });
                        break;
                    }
                }
            };
            Object.observe(kwArgs.object, this._observer, ['add', 'update', 'delete']);
        }
        Es7Binding.test = function (kwArgs) {
            return util.isObject(kwArgs.object) && typeof kwArgs.path === 'string';
        };
        Es7Binding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            Object.unobserve(this._object, this._observer);
            this._observer = this._object = this._property = null;
        };
        Es7Binding.prototype.get = function () {
            return this._object ? this._object[this._property] : undefined;
        };
        Es7Binding.prototype.set = function (value) {
            if (this._object && !util.isEqual(this.get(), value)) {
                this._object[this._property] = value;
            }
        };
        return Es7Binding;
    })(Binding);
    return Es7Binding;
});
//# sourceMappingURL=../../_debug/binding/bindings/Es7Binding.js.map