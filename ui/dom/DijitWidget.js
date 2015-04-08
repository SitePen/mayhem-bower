var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../binding/BindDirection', 'dojo/_base/lang', './SingleNodeWidget'], function (require, exports, BindDirection, lang, SingleNodeWidget) {
    var DijitWidget = (function (_super) {
        __extends(DijitWidget, _super);
        function DijitWidget() {
            _super.apply(this, arguments);
        }
        DijitWidget.prototype._isAttachedGetter = function () {
            return this._isAttached;
        };
        DijitWidget.prototype._isAttachedSetter = function (value) {
            value && this._widget.startup();
            this._isAttached = value;
        };
        DijitWidget.prototype._isFocusedGetter = function () {
            return this._isFocused;
        };
        DijitWidget.prototype._isFocusedSetter = function (value) {
            value && (this._widget.focusNode || this._widget.domNode).focus();
            this._isFocused = value;
        };
        DijitWidget.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._bindingHandles = [];
            this._isDisabled = false;
            this._isFocused = false;
        };
        DijitWidget.prototype._bindWidget = function () {
            var widget = this._widget;
            this._clearInternalBindings();
            var dijitName;
            var mayhemName;
            var setupMap = this.constructor.setupMap;
            for (mayhemName in setupMap.properties) {
                dijitName = setupMap.properties[mayhemName];
                this._bindingHandles.push(this._app.get('binder').bind({
                    source: this,
                    sourcePath: mayhemName,
                    target: widget,
                    targetPath: dijitName,
                    direction: 2 /* TWO_WAY */
                }));
            }
            var eventName;
            for (eventName in setupMap.events) {
                this._bindingHandles.push(widget.on(eventName, lang.hitch(this, function (eventName) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    setupMap.events[eventName].apply(this, args);
                }, eventName)));
            }
        };
        DijitWidget.prototype._clearInternalBindings = function () {
            var oldHandle;
            while ((oldHandle = this._bindingHandles.pop())) {
                oldHandle.remove();
            }
        };
        DijitWidget.prototype._render = function () {
            var widget = new this.constructor.Ctor();
            this._widget = widget;
            this._node = widget.domNode;
            this._bindWidget();
        };
        DijitWidget.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._clearInternalBindings();
            var widget = this._widget;
            if (widget._setStateClass) {
                widget._setStateClass = function () {
                };
            }
            widget.destroyRecursive();
            this._widget = this._node = null;
        };
        DijitWidget.setupMap = {
            properties: {
                isDisabled: 'disabled'
            },
            events: {
                blur: function () {
                    this.set('isFocused', false);
                },
                focus: function () {
                    this.set('isFocused', true);
                }
            }
        };
        return DijitWidget;
    })(SingleNodeWidget);
    return DijitWidget;
});
//# sourceMappingURL=../../_debug/ui/dom/DijitWidget.js.map