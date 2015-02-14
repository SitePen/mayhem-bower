var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding', '../../has', '../../util'], function (require, exports, Binding, has, util) {
    function getAnyPropertyDescriptor(object, property) {
        var descriptor;
        do {
            descriptor = Object.getOwnPropertyDescriptor(object, property);
        } while (!descriptor && (object = Object.getPrototypeOf(object)));
        return descriptor;
    }
    var Es5Binding = (function (_super) {
        __extends(Es5Binding, _super);
        function Es5Binding(kwArgs) {
            _super.call(this, kwArgs);
            var self = this;
            var object = kwArgs.object;
            var property = kwArgs.path;
            this._object = object;
            this._property = property;
            var value = object[property];
            var descriptor = this._originalDescriptor = getAnyPropertyDescriptor(object, property);
            var newDescriptor = {
                enumerable: descriptor ? descriptor.enumerable : true,
                configurable: descriptor ? descriptor.configurable : true
            };
            if (descriptor && (descriptor.get || descriptor.set)) {
                newDescriptor.get = descriptor.get;
                newDescriptor.set = function (newValue) {
                    if (self.notify) {
                        var oldValue = descriptor.get ? descriptor.get.call(this) : value;
                        if (descriptor.set) {
                            descriptor.set.apply(this, arguments);
                        }
                        else {
                            value = newValue;
                        }
                        if (descriptor.get) {
                            newValue = descriptor.get.call(this);
                        }
                        if (!util.isEqual(oldValue, newValue)) {
                            self.notify({ oldValue: oldValue, value: newValue });
                        }
                    }
                    else if (descriptor.set) {
                        descriptor.set.apply(this, arguments);
                    }
                };
            }
            else {
                newDescriptor.get = function () {
                    return value;
                };
                newDescriptor.set = function (newValue) {
                    var oldValue = value;
                    value = newValue;
                    if (self.notify && !util.isEqual(oldValue, value)) {
                        self.notify({ oldValue: oldValue, value: value });
                    }
                };
            }
            Object.defineProperty(object, property, newDescriptor);
            this._ownDescriptor = newDescriptor;
        }
        Es5Binding.test = function (kwArgs) {
            if (!has('es5') || !util.isObject(kwArgs.object) || typeof kwArgs.path !== 'string' || (has('webidl-bad-descriptors') && typeof Node !== 'undefined' && kwArgs.object instanceof Node)) {
                return false;
            }
            var descriptor = Object.getOwnPropertyDescriptor(kwArgs.object, kwArgs.path);
            return descriptor ? descriptor.configurable && ('value' in descriptor || 'set' in descriptor) : Object.isExtensible(kwArgs.object);
        };
        Es5Binding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            var currentDescriptor = Object.getOwnPropertyDescriptor(this._object, this._property);
            if (currentDescriptor.get === this._ownDescriptor.get && currentDescriptor.set === this._ownDescriptor.set) {
                var descriptor = this._originalDescriptor || {
                    value: this._object[this._property],
                    writable: true,
                    enumerable: true,
                    configurable: true
                };
                Object.defineProperty(this._object, this._property, descriptor);
            }
            this._ownDescriptor = this._originalDescriptor = this._object = this._property = this.notify = null;
        };
        Es5Binding.prototype.get = function () {
            return this._object ? this._object[this._property] : undefined;
        };
        Es5Binding.prototype.getObject = function () {
            return this._object;
        };
        Es5Binding.prototype.set = function (value) {
            if (this._object) {
                this._object[this._property] = value;
            }
        };
        return Es5Binding;
    })(Binding);
    return Es5Binding;
});
//# sourceMappingURL=../../_debug/binding/bindings/Es5Binding.js.map