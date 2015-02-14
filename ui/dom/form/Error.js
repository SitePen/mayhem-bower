var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../MultiNodeWidget', 'dojo/_base/lang', 'dojo/dom-construct'], function (require, exports, MultiNodeWidget, lang, domConstruct) {
    var ErrorWidget = (function (_super) {
        __extends(ErrorWidget, _super);
        function ErrorWidget() {
            _super.apply(this, arguments);
        }
        ErrorWidget.prototype.destroy = function () {
            this._unbindErrors();
            _super.prototype.destroy.call(this);
        };
        ErrorWidget.prototype._errorsGetter = function () {
            return this._errors;
        };
        ErrorWidget.prototype._errorsSetter = function (errors) {
            this._errors = errors;
            if (this.get('isAttached')) {
                this._bindErrors();
            }
        };
        ErrorWidget.prototype._prefixGetter = function () {
            return this._prefix;
        };
        ErrorWidget.prototype._prefixSetter = function (prefix) {
            this._prefix = prefix;
            if (this._prefixNode) {
                this._prefixNode.innerHTML = prefix;
            }
        };
        ErrorWidget.prototype._isAttachedGetter = function () {
            return this._isAttached;
        };
        ErrorWidget.prototype._isAttachedSetter = function (value) {
            this._isAttached = value;
            if (value) {
                this._bindErrors();
            }
            else {
                this._unbindErrors();
            }
        };
        ErrorWidget.prototype._bindErrors = function () {
            var errors = this.get('errors');
            this._unbindErrors();
            this._updateUi();
            if (errors) {
                this._binding = this._app.get('binder').createBinding(errors, '*');
                this._binding.observe(lang.hitch(this, '_onChangeErrors'));
            }
        };
        ErrorWidget.prototype._unbindErrors = function () {
            this._binding && this._binding.destroy();
        };
        ErrorWidget.prototype._render = function () {
            _super.prototype._render.call(this);
            this._prefixNode = domConstruct.create('p', {
                innerHTML: this._prefix || ''
            }, this._lastNode, 'before');
            this._errorsNode = domConstruct.create('ul', {
                className: 'errorList'
            }, this._prefixNode, 'after');
        };
        ErrorWidget.prototype._updateUi = function () {
            var prefix = this.get('prefix');
            var errors = this.get('errors');
            var fragment;
            this._prefixNode.innerHTML = prefix || '';
            this._errorsNode.innerHTML = '';
            if (errors && errors.length) {
                this._onChangeErrors({
                    index: 0,
                    added: errors,
                    removed: []
                });
            }
        };
        ErrorWidget.prototype._onChangeErrors = function (change) {
            var listNode = this._errorsNode;
            if (change.removed) {
                var numRemoved = change.removed.length;
                while (numRemoved--) {
                    listNode.removeChild(listNode.children[change.index]);
                }
            }
            if (change.added) {
                var fragment = document.createDocumentFragment();
                var error;
                for (var i = 0; i < change.added.length; ++i) {
                    error = change.added[i];
                    domConstruct.create('li', {
                        innerHTML: error.toString()
                    }, fragment);
                }
                listNode.insertBefore(fragment, listNode.children[change.index]);
            }
        };
        return ErrorWidget;
    })(MultiNodeWidget);
    return ErrorWidget;
});
//# sourceMappingURL=../../../_debug/ui/dom/form/Error.js.map