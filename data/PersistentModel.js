var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Model'], function (require, exports, Model) {
    var PersistentModel = (function (_super) {
        __extends(PersistentModel, _super);
        function PersistentModel() {
            _super.apply(this, arguments);
        }
        PersistentModel.setDefaultStore = function (store) {
            store.Model = this;
            this.prototype._store = this.store = store;
        };
        PersistentModel.findAll = function (query) {
            return this.store.filter(query);
        };
        PersistentModel.get = function (id) {
            return this.store.get(id);
        };
        PersistentModel.prototype.remove = function () {
            var store = this._store;
            var self = this;
            return store.remove(store.getIdentity(this)).then(function (returnValue) {
                self.set('scenario', 'insert');
                return returnValue;
            });
        };
        PersistentModel.prototype._restore = function (Ctor) {
            return new Ctor(this);
        };
        PersistentModel.prototype.save = function (skipValidation) {
            var self = this;
            function save() {
                return self._store.put(self).then(function (model) {
                    self.commit();
                    self.set('scenario', 'update');
                });
            }
            if (skipValidation) {
                return save();
            }
            else {
                return this.validate().then(function (isValid) {
                    if (isValid) {
                        return save();
                    }
                    else {
                        throw new Error('Could not save model; validation failed');
                    }
                });
            }
        };
        return PersistentModel;
    })(Model);
    PersistentModel.prototype._scenario = 'insert';
    return PersistentModel;
});
//# sourceMappingURL=../_debug/data/PersistentModel.js.map