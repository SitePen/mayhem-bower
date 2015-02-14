var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../ui/dom/Container', 'dojo/_base/lang', '../../../data/Proxy', '../../../util'], function (require, exports, Container, lang, Proxy, util) {
    var Iterator = (function (_super) {
        __extends(Iterator, _super);
        function Iterator(kwArgs) {
            util.deferSetters(this, ['collection', 'isAttached'], '_render');
            _super.call(this, kwArgs);
        }
        Iterator.prototype._collectionGetter = function () {
            return this._collection;
        };
        Iterator.prototype._collectionSetter = function (collection) {
            this._collection = collection;
            if (this.get('isAttached')) {
                this._bind();
            }
        };
        Iterator.prototype._isAttachedGetter = function () {
            return this._isAttached;
        };
        Iterator.prototype._isAttachedSetter = function (value) {
            this._isAttached = value;
            if (value) {
                this._bind();
            }
            else {
                this._unbind();
            }
        };
        Iterator.prototype.destroy = function () {
            this._unbind();
            _super.prototype.destroy.call(this);
        };
        Iterator.prototype._bind = function () {
            var collection = this.get('collection');
            this._unbind();
            this._refresh();
            if (collection) {
                this._binding = this._app.get('binder').createBinding(collection, '*');
                this._binding.observe(lang.hitch(this, '_handleChange'));
            }
        };
        Iterator.prototype._unbind = function () {
            this._binding && this._binding.destroy();
            this._binding = null;
        };
        Iterator.prototype._refresh = function () {
            var _this = this;
            var collection = this.get('collection');
            this.empty();
            if (collection) {
                if (collection instanceof Array) {
                    this._handleChange({
                        index: 0,
                        added: collection,
                        removed: []
                    });
                }
                else {
                    collection.fetch().then(function (items) {
                        _this._handleChange({
                            index: 0,
                            added: items,
                            removed: []
                        });
                    });
                }
            }
        };
        Iterator.prototype._handleChange = function (change) {
            var _this = this;
            if (change.removed) {
                var numRemoved = change.removed.length;
                while (numRemoved--) {
                    this.remove(change.index);
                }
            }
            if (change.added) {
                var Ctor = this.get('itemConstructor');
                var as = this.get('as') || 'item';
                var app = this.get('app');
                var model = this.get('model');
                change.added.forEach(function (item, index) {
                    var widget = new Ctor({
                        app: _this._app,
                        model: new Proxy((function () {
                            var kwArgs = {
                                app: app,
                                target: model
                            };
                            kwArgs[as] = item;
                            return kwArgs;
                        }).call(_this))
                    });
                    _this.add(widget, change.index + index);
                });
            }
        };
        Iterator.inheritsModel = true;
        return Iterator;
    })(Container);
    return Iterator;
});
//# sourceMappingURL=../../../_debug/templating/html/ui/Iterator.js.map