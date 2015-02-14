var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/dom-class', 'dojo/dom-construct', 'dojo/_base/lang', './SingleNodeWidget', '../../util'], function (require, exports, domClass, domConstruct, lang, SingleNodeWidget, util) {
    function proxyAttachmentState(widget, properties, value) {
        for (var i = 0, j = properties.length; i < j; ++i) {
            var child = widget.get(properties[i]);
            if (child) {
                child.set('isAttached', value);
            }
        }
    }
    function contains(maybeParent, candidate) {
        do {
            if (maybeParent === candidate) {
                return true;
            }
        } while ((candidate = candidate.get('parent')));
        return false;
    }
    var DropDown = (function (_super) {
        __extends(DropDown, _super);
        function DropDown(kwArgs) {
            util.deferSetters(this, ['label', 'dropDown'], '_render');
            _super.call(this, kwArgs);
        }
        DropDown.prototype._childrenGetter = function () {
            return [this.get('label'), this.get('dropDown')];
        };
        DropDown.prototype._childrenSetter = function (children) {
            if (children) {
                this.set('label', children[0]);
                this.set('dropDown', children[1]);
            }
            else {
                this.set('label', null);
                this.set('dropDown', null);
            }
        };
        DropDown.prototype._dropDownGetter = function () {
            return this._dropDown;
        };
        DropDown.prototype._dropDownSetter = function (value) {
            if (this._dropDown) {
                this._dropDown.detach();
                this._dropDown.set({ isAttached: false, parent: null });
            }
            this._dropDown = value;
            if (value) {
                this._dropDownNode.appendChild(value.detach());
                value.set({ isAttached: this.get('isAttached'), parent: this });
            }
        };
        DropDown.prototype._isAttachedGetter = function () {
            return this._isAttached;
        };
        DropDown.prototype._isAttachedSetter = function (value) {
            proxyAttachmentState(this, ['label', 'dropDown'], value);
            this._isAttached = value;
        };
        DropDown.prototype._isOpenGetter = function () {
            return this._isOpen;
        };
        DropDown.prototype._isOpenSetter = function (value) {
            this._isOpen = value;
            domClass.toggle(this._node, 'open', value);
        };
        DropDown.prototype._labelGetter = function () {
            return this._label;
        };
        DropDown.prototype._labelSetter = function (value) {
            this._labelHandle && this._labelHandle.remove();
            if (this._label) {
                this._label.detach();
                this._label.set({ isAttached: false, parent: null });
            }
            this._label = value;
            if (value) {
                var self = this;
                this._labelHandle = util.createCompositeHandle(value.on('activate', lang.hitch(this, '_toggle')), value.observe('parent', function (newParent) {
                    if (newParent !== self) {
                        self.set('label', null);
                    }
                }));
                this._labelNode.appendChild(value.detach());
                value.set({ isAttached: this.get('isAttached'), parent: this });
            }
        };
        DropDown.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._label && this._label.destroy();
            this._dropDown && this._dropDown.destroy();
            this._globalHandle.remove();
        };
        DropDown.prototype._render = function () {
            this._node = domConstruct.create('div', { className: 'DropDown' });
            this._labelNode = domConstruct.create('div', { className: 'LabelContainer' }, this._node);
            this._dropDownNode = domConstruct.create('div', { className: 'DropDownContainer' }, this._node);
            var self = this;
            this._globalHandle = this.get('app').get('ui').on('pointerdown', function (event) {
                if (self.get('isOpen') && !contains(self.get('dropDown'), event.target)) {
                    self.set('isOpen', false);
                    event.stopPropagation();
                    event.preventDefault();
                }
            });
        };
        DropDown.prototype._toggle = function (event) {
            if (!this.get('isOpen')) {
                this.set('isOpen', true);
                event.stopPropagation();
                event.preventDefault();
            }
        };
        return DropDown;
    })(SingleNodeWidget);
    return DropDown;
});
//# sourceMappingURL=../../_debug/ui/dom/DropDown.js.map