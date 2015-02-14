define(["require", "exports"], function (require, exports) {
    var ContainerMixin = (function () {
        function ContainerMixin() {
        }
        ContainerMixin.prototype.add = function (child) {
            child.set({
                isAttached: this.get('isAttached'),
                parent: this
            });
        };
        ContainerMixin.prototype._childrenGetter = function () {
            return this._children.slice(0);
        };
        ContainerMixin.prototype._childrenSetter = function (children) {
            this.empty();
            for (var i = 0, child; (child = children[i]); ++i) {
                this.add(child);
            }
        };
        ContainerMixin.prototype.destroy = function () {
            this.empty();
            this._children = null;
        };
        ContainerMixin.prototype.empty = function () {
            var children = this._children;
            var child;
            while ((child = children[0])) {
                child.destroy();
            }
        };
        ContainerMixin.prototype.getChildIndex = function (child) {
            var children = this._children;
            for (var i = 0, maybeChild; (maybeChild = children[i]); ++i) {
                if (maybeChild === child) {
                    return i;
                }
            }
            return -1;
        };
        ContainerMixin.prototype._initialize = function () {
            this._children = [];
        };
        ContainerMixin.prototype._isAttachedGetter = function () {
            return this._isAttached;
        };
        ContainerMixin.prototype._isAttachedSetter = function (value) {
            var children = this._children;
            if (this._children) {
                for (var i = 0, child; (child = children[i]); ++i) {
                    child.set('isAttached', value);
                }
            }
            this._isAttached = value;
        };
        ContainerMixin.prototype.remove = function (child) {
            child.detach();
            child.set({
                isAttached: false,
                parent: null
            });
        };
        return ContainerMixin;
    })();
    return ContainerMixin;
});
//# sourceMappingURL=../../_debug/ui/common/Container.js.map