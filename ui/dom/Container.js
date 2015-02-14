var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../AddPosition', '../common/Container', './MultiNodeWidget', '../../util'], function (require, exports, AddPosition, ContainerMixin, MultiNodeWidget, util) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container(kwArgs) {
            _super.call(this, kwArgs);
            ContainerMixin.apply(this, arguments);
        }
        Container.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            ContainerMixin.prototype._initialize.call(this);
        };
        Container.prototype.add = function (child, position) {
            if (position === void 0) { position = -1 /* LAST */; }
            var children = this._children;
            if (position === -1 /* LAST */) {
                position = children.length;
            }
            var nextWidget = this._children[position];
            var nextNode = nextWidget ? nextWidget.get('firstNode') : this._lastNode;
            nextNode.parentNode.insertBefore(child.detach(), nextNode);
            ContainerMixin.prototype.add.call(this, child);
            children.splice(position, 0, child);
            var self = this;
            return util.createHandle(function () {
                self.remove(child);
                self = child = null;
            });
        };
        Container.prototype._childrenGetter = function () {
            return ContainerMixin.prototype._childrenGetter.apply(this, arguments);
        };
        Container.prototype._childrenSetter = function (children) {
            ContainerMixin.prototype._childrenSetter.apply(this, arguments);
        };
        Container.prototype.destroy = function () {
            ContainerMixin.prototype.destroy.call(this);
            _super.prototype.destroy.call(this);
        };
        Container.prototype.empty = function () {
            ContainerMixin.prototype.empty.apply(this, arguments);
        };
        Container.prototype.getChildIndex = function (child) {
            return ContainerMixin.prototype.getChildIndex.apply(this, arguments);
        };
        Container.prototype._isAttachedGetter = function () {
            return ContainerMixin.prototype._isAttachedGetter.apply(this, arguments);
        };
        Container.prototype._isAttachedSetter = function (value) {
            ContainerMixin.prototype._isAttachedSetter.apply(this, arguments);
        };
        Container.prototype.remove = function (index) {
            var children = this._children;
            var widget;
            if (typeof index !== 'number') {
                widget = index;
                index = widget.get('index');
                if (widget !== children[index]) {
                    throw new Error('Attempt to remove widget ' + widget.get('id') + ' from non-parent ' + this._id);
                }
            }
            else {
                widget = children[index];
                if (!widget) {
                    throw new Error('No widget exists in container ' + this._id + ' at index ' + index);
                }
            }
            ContainerMixin.prototype.remove.call(this, children.splice(index, 1)[0]);
        };
        return Container;
    })(MultiNodeWidget);
    return Container;
});
//# sourceMappingURL=../../_debug/ui/dom/Container.js.map