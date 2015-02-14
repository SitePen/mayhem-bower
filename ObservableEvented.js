var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/Evented', './Observable'], function (require, exports, Evented, Observable) {
    var ObservableEvented = (function (_super) {
        __extends(ObservableEvented, _super);
        function ObservableEvented(kwArgs) {
            this._eventListeners = [];
            _super.call(this, kwArgs);
            Evented.apply(this, arguments);
        }
        ObservableEvented.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            var handle;
            while ((handle = this._eventListeners.pop())) {
                handle.remove();
            }
        };
        ObservableEvented.prototype.emit = function (event) {
            return Evented.prototype.emit.call(this, event.type, event);
        };
        return ObservableEvented;
    })(Observable);
    ObservableEvented.prototype.on = function (type, listener) {
        var handle = Evented.prototype.on.call(this, type, listener);
        this._eventListeners.push(handle);
        return handle;
    };
    return ObservableEvented;
});
//# sourceMappingURL=_debug/ObservableEvented.js.map