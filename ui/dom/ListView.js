var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../common/Container', 'dstore/legacy/DstoreAdapter', '../../has', 'dgrid/OnDemandList', './SingleNodeWidget', '../../util'], function (require, exports, ContainerMixin, DstoreAdapter, has, OnDemandList, SingleNodeWidget, util) {
    var Node;
    if (has('dom-addeventlistener')) {
        Node = window.Node;
    }
    else {
        Node = {
            ELEMENT_NODE: 1,
            ATTRIBUTE_NODE: 2,
            TEXT_NODE: 3,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9,
            DOCUMENT_FRAGMENT_NODE: 11
        };
    }
    var oidKey = '__ListViewOid' + String(Math.random()).slice(2);
    var IteratorList = (function (_super) {
        __extends(IteratorList, _super);
        function IteratorList(kwArgs) {
            _super.call(this, kwArgs);
            this._setApp(kwArgs['app']);
            this._setItemConstructor(kwArgs['itemConstructor']);
            this._setParent(kwArgs['parent']);
        }
        IteratorList.prototype._setApp = function (value) {
            this._app = value;
        };
        IteratorList.prototype._setItemConstructor = function (value) {
            this._itemConstructor = value;
            this.refresh();
        };
        IteratorList.prototype._setParent = function (value) {
            this._parent = value;
        };
        IteratorList.prototype._setIsAttached = function (value) {
            for (var id in this._rowIdToObject) {
                var rowElement = document.getElementById(id);
                rowElement && rowElement[oidKey].set('isAttached', value);
            }
            if (value) {
                this._started ? this.resize() : this.startup();
            }
        };
        IteratorList.prototype.insertRow = function () {
            var row = _super.prototype.insertRow.apply(this, arguments);
            ContainerMixin.prototype.add.call(this._parent, row[oidKey]);
            return row;
        };
        IteratorList.prototype.renderRow = function (model, options) {
            var Ctor = this._itemConstructor;
            var widget = new Ctor({
                app: this._app,
                model: model
            });
            var rowNode = widget.detach();
            if (rowNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                var surrogate = document.createElement('div');
                surrogate.appendChild(rowNode);
                rowNode = surrogate;
            }
            if (has('es5')) {
                Object.defineProperty(rowNode, oidKey, {
                    value: widget,
                    configurable: true
                });
            }
            else {
                rowNode[oidKey] = widget;
            }
            return rowNode;
        };
        IteratorList.prototype.removeRow = function (row, justCleanup) {
            _super.prototype.removeRow.call(this, row, true);
            var widget = row[oidKey];
            widget.destroy();
            if (row.parentNode) {
                row.parentNode.removeChild(row);
            }
            if (!has('es5')) {
                row[oidKey] = null;
            }
        };
        return IteratorList;
    })(OnDemandList);
    var ListView = (function (_super) {
        __extends(ListView, _super);
        function ListView(kwArgs) {
            util.deferSetters(this, ['collection'], '_render');
            _super.call(this, kwArgs);
        }
        ListView.prototype._collectionGetter = function () {
            return this._collection;
        };
        ListView.prototype._collectionSetter = function (value) {
            if (value) {
                var store = new DstoreAdapter(value);
                var oldQuery = store.query;
                store.query = function () {
                    var queryResults = oldQuery.apply(this, arguments);
                    var oldObserve = queryResults.observe;
                    queryResults.observe = function (callback) {
                        return oldObserve.call(this, callback, false);
                    };
                    return queryResults;
                };
            }
            this._widget.set('store', store);
            this._collection = value;
        };
        ListView.prototype._isAttachedGetter = function () {
            return this._isAttached;
        };
        ListView.prototype._isAttachedSetter = function (value) {
            if (this._isAttached === value) {
                return;
            }
            this._isAttached = value;
            this._widget.set('isAttached', value);
        };
        ListView.prototype.remove = function (child) {
            child.detach();
            ContainerMixin.prototype.remove.call(this, child);
        };
        ListView.prototype._render = function () {
            this._widget = new IteratorList({
                app: this._app,
                itemConstructor: this._itemConstructor,
                parent: this
            });
            this._node = this._widget.domNode;
        };
        return ListView;
    })(SingleNodeWidget);
    return ListView;
});
//# sourceMappingURL=../../_debug/ui/dom/ListView.js.map