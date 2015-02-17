var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../AddPosition', '../common/Container', 'dijit/Dialog', './DijitWidget', '../../util'], function (require, exports, AddPosition, ContainerMixin, DijitDialog, DijitWidget, util) {
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        function Dialog(kwArgs) {
            util.deferSetters(this, ['title', 'children', 'isOpen'], '_render');
            _super.call(this, kwArgs);
            ContainerMixin.apply(this, arguments);
        }
        Dialog.prototype._childrenGetter = function () {
            return ContainerMixin.prototype._childrenGetter.apply(this, arguments);
        };
        Dialog.prototype._childrenSetter = function (children) {
            ContainerMixin.prototype._childrenSetter.apply(this, arguments);
        };
        Dialog.prototype._isAttachedGetter = function () {
            return ContainerMixin.prototype._isAttachedGetter.apply(this, arguments);
        };
        Dialog.prototype._isAttachedSetter = function (value) {
            ContainerMixin.prototype._isAttachedSetter.apply(this, arguments);
        };
        Dialog.prototype._isOpenGetter = function () {
            return this._isOpen;
        };
        Dialog.prototype._isOpenSetter = function (value) {
            var type = value ? 'show' : 'hide';
            this._isOpen = value;
            this._widget[type]();
        };
        Dialog.prototype._titleGetter = function () {
            return this._title;
        };
        Dialog.prototype._titleSetter = function (title) {
            this._title = title;
            this._widget.set('title', title);
        };
        Dialog.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            ContainerMixin.prototype._initialize.call(this);
        };
        Dialog.prototype._render = function () {
            _super.prototype._render.call(this);
            this._containerNode = this._widget.containerNode;
            var self = this;
            this._widget.watch('open', function (name, oldValue, newValue) {
                if (!newValue) {
                    self.set('isOpen', false);
                }
            });
        };
        Dialog.prototype.add = function (child, position) {
            if (position === void 0) { position = -1 /* LAST */; }
            var children = this._children;
            if (position === -1 /* LAST */) {
                position = children.length;
            }
            var nextWidget = children[position];
            var nextNode = nextWidget ? nextWidget.get('firstNode') : null;
            this._containerNode.insertBefore(child.detach(), nextNode);
            children.splice(position, 0, child);
            ContainerMixin.prototype.add.call(this, child);
            var self = this;
            return util.createHandle(function () {
                self.remove(child);
                self = child = null;
            });
        };
        Dialog.prototype.destroy = function () {
            ContainerMixin.prototype.destroy.call(this);
            _super.prototype.destroy.call(this);
        };
        Dialog.prototype.empty = function () {
            ContainerMixin.prototype.empty.apply(this, arguments);
        };
        Dialog.prototype.getChildIndex = function (child) {
            return ContainerMixin.prototype.getChildIndex.apply(this, arguments);
        };
        Dialog.prototype.remove = function (index) {
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
        Dialog.Ctor = DijitDialog;
        return Dialog;
    })(DijitWidget);
    return Dialog;
});
//# sourceMappingURL=../../_debug/ui/dom/Dialog.js.map