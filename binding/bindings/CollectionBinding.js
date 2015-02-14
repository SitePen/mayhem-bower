var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../Binding', '../../util'], function (require, exports, Binding, util) {
    var CollectionBinding = (function (_super) {
        __extends(CollectionBinding, _super);
        function CollectionBinding(kwArgs) {
            _super.call(this, kwArgs);
            var collection = this._object = kwArgs.object.track();
            var self = this;
            collection.fetchRange({ start: 0, length: 0 });
            this._handle = util.createCompositeHandle(collection.on('add', function (event) {
                if (event.index !== undefined) {
                    self.notify({ index: event.index, added: [event.target] });
                }
            }), collection.on('update', function (event) {
                if (event.index !== event.previousIndex) {
                    if (event.previousIndex !== undefined) {
                        self.notify({ index: event.previousIndex, removed: [event.target] });
                    }
                    if (event.index !== undefined) {
                        self.notify({ index: event.index, added: [event.target] });
                    }
                }
            }), collection.on('delete', function (event) {
                if (event.previousIndex !== undefined) {
                    self.notify({ index: event.previousIndex, removed: [event.target] });
                }
            }), this._object.tracking);
        }
        CollectionBinding.test = function (kwArgs) {
            var collection = kwArgs.object;
            return collection && typeof collection.fetch === 'function' && typeof collection.track === 'function' && typeof collection.filter === 'function' && kwArgs.path === '*';
        };
        CollectionBinding.prototype.getObject = function () {
            return this._object;
        };
        CollectionBinding.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._handle.remove();
            this._handle = this._object = null;
        };
        return CollectionBinding;
    })(Binding);
    return CollectionBinding;
});
//# sourceMappingURL=../../_debug/binding/bindings/CollectionBinding.js.map