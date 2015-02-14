var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../binding/Binding', 'dojo/_base/lang'], function (require, exports, Binding, lang) {
    var ProxyBinding = (function (_super) {
        __extends(ProxyBinding, _super);
        function ProxyBinding(kwArgs) {
            _super.call(this, kwArgs);
            this._object = kwArgs.object;
            this._path = kwArgs.path;
            this._switchSource();
        }
        ProxyBinding.test = function (kwArgs) {
            return false;
        };
        ProxyBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._source && this._source.destroy();
            this._source = this._object = this._path = null;
        };
        ProxyBinding.prototype.get = function () {
            return this._source ? this._source.get() : undefined;
        };
        ProxyBinding.prototype.getObject = function () {
            return this._source ? this._source.getObject() : undefined;
        };
        ProxyBinding.prototype.remove = function () {
            this.destroy();
        };
        ProxyBinding.prototype.set = function (value) {
            this._source && this._source.set(value);
        };
        ProxyBinding.prototype.setDirection = function (direction) {
        };
        ProxyBinding.prototype.setObject = function (value) {
            this._object = value;
            this._switchSource();
        };
        ProxyBinding.prototype.setPath = function (value) {
            this._path = value;
            this._switchSource();
        };
        ProxyBinding.prototype.setSource = function (object, path) {
            this.setObject(object);
            path && this.setPath(path);
        };
        ProxyBinding.prototype.setTarget = function (object, path) {
        };
        ProxyBinding.prototype._switchSource = function () {
            var oldValue;
            if (this._source) {
                oldValue = this._source.get();
                this._source.destroy();
            }
            this._source = this._binder.createBinding(this._object, this._path, { useScheduler: false });
            this._source.observe(lang.hitch(this, 'notify'));
            this.notify({ oldValue: oldValue, value: this._source.get() });
        };
        return ProxyBinding;
    })(Binding);
    return ProxyBinding;
});
//# sourceMappingURL=../../../_debug/templating/html/binding/ProxyBinding.js.map