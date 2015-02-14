var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../style/ClassList', '../../ObservableEvented'], function (require, exports, ClassList, ObservableEvented) {
    var sid = String(new Date().getTime() + Math.random());
    var uid = 0;
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(kwArgs) {
            this._classList = new ClassList();
            _super.call(this, kwArgs);
            if (!this._id) {
                this._id = 'Widget' + sid + (++uid);
            }
            this._render();
        }
        Widget.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._isAttached = false;
        };
        Widget.prototype._classGetter = function () {
            return this._classList.valueOf();
        };
        Widget.prototype._classSetter = function (value) {
            this._classList.set(value);
        };
        Widget.prototype._indexGetter = function () {
            return this._parent && this._parent.getChildIndex ? this._parent.getChildIndex(this) : -1;
        };
        Widget.prototype.destroy = function () {
            this._parent && this._parent.remove && this._parent.remove(this);
            this._classList = null;
            _super.prototype.destroy.call(this);
        };
        Widget.prototype.detach = function () {
            this.set('isAttached', false);
        };
        Widget.prototype.emit = function (event) {
            event.currentTarget = this;
            ObservableEvented.prototype.emit.call(this, event);
            var parent = this.get('parent');
            if (event.bubbles && !event.propagationStopped && parent) {
                parent.emit(event);
            }
            return !event.defaultPrevented;
        };
        Widget.prototype._render = function () {
        };
        return Widget;
    })(ObservableEvented);
    return Widget;
});
//# sourceMappingURL=../../_debug/ui/common/Widget.js.map