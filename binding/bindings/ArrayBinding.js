var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding'], function (require, exports, Binding) {
    var ArrayBinding = (function (_super) {
        __extends(ArrayBinding, _super);
        function ArrayBinding(kwArgs) {
            _super.call(this, kwArgs);
            var array = this._object = kwArgs.object;
            var self = this;
            var pop = array.pop;
            array.pop = function () {
                if (this.length) {
                    var oldValue = pop.apply(this, arguments);
                    self.notify && self.notify({ index: this.length, removed: [oldValue] });
                    return oldValue;
                }
            };
            var push = array.push;
            array.push = function () {
                var newValues = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    newValues[_i - 0] = arguments[_i];
                }
                var newLength = push.apply(this, arguments);
                self.notify && self.notify({ index: newLength - newValues.length, added: newValues });
                return newLength;
            };
            var reverse = array.reverse;
            array.reverse = function () {
                var oldValues = this.slice(0);
                var returnValue = reverse.apply(this, arguments);
                self.notify && self.notify({ index: 0, removed: oldValues, added: this });
                return returnValue;
            };
            var shift = array.shift;
            array.shift = function () {
                if (this.length) {
                    var oldValue = shift.apply(this, arguments);
                    self.notify && self.notify({ index: 0, removed: [oldValue] });
                    return oldValue;
                }
            };
            var sort = array.sort;
            array.sort = function () {
                var oldValues = this.slice(0);
                var returnValue = sort.apply(this, arguments);
                self.notify && self.notify({ index: 0, removed: oldValues, added: this });
                return returnValue;
            };
            var splice = array.splice;
            array.splice = function (index, numToRemove) {
                if (numToRemove === void 0) { numToRemove = 0; }
                var newValues = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    newValues[_i - 2] = arguments[_i];
                }
                var oldValues = splice.apply(this, arguments);
                self.notify && self.notify({ index: index, removed: oldValues, added: newValues });
                return oldValues;
            };
            var unshift = array.unshift;
            array.unshift = function () {
                var newValues = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    newValues[_i - 0] = arguments[_i];
                }
                var newLength = unshift.apply(this, arguments);
                self.notify && self.notify({ index: 0, added: newValues });
                return newLength;
            };
        }
        ArrayBinding.test = function (kwArgs) {
            return kwArgs.object instanceof Array && kwArgs.path === '*';
        };
        ArrayBinding.prototype.getObject = function () {
            return this._object;
        };
        ArrayBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._object = this.notify = null;
        };
        return ArrayBinding;
    })(Binding);
    return ArrayBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/ArrayBinding.js.map