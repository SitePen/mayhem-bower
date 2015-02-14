define(["require", "exports", 'dojo/_base/declare', 'dstore/Memory', '../../util'], function (require, exports, declare, Memory, util) {
    var DomStorage = declare(Memory, {
        key: 'dstore',
        target: null,
        constructor: function (kwArgs) {
            if (!this.target && typeof localStorage === 'undefined') {
                throw new Error('No storage is available in the current environment');
            }
            this.setTarget(this.key, this.target || localStorage);
            var self = this;
            this._unloadHandle = util.addUnloadCallback(function () {
                self._persist();
            });
        },
        destroy: function () {
            this.destroy = function () {
            };
            this._persist();
            this._unloadHandle.remove();
        },
        fetchSync: function () {
            this.storage._loaded || this._load();
            return this.inherited(arguments);
        },
        _load: function () {
            this.storage._loaded = true;
            Memory.prototype.setData.call(this, JSON.parse(this.target.getItem(this.key)) || []);
        },
        _bouncePersist: util.debounce(function () {
            this._persist();
        }, 1000),
        _persist: function () {
            this.target.setItem(this.key, JSON.stringify(this.storage.fullData));
        },
        getSync: function (id) {
            this.storage._loaded || this._load();
            return this.inherited(arguments);
        },
        putSync: function (object) {
            this.storage._loaded || this._load();
            var putObject = this.inherited(arguments);
            this._bouncePersist();
            return putObject;
        },
        removeSync: function () {
            this.storage._loaded || this._load();
            var isRemoved = this.inherited(arguments);
            this._bouncePersist();
            return isRemoved;
        },
        setData: function () {
            this.inherited(arguments);
            this._bouncePersist();
        },
        setTarget: function (key, target) {
            if (target === void 0) { target = this.target; }
            this.target = target;
            this.key = key;
            this.storage._loaded && this._load();
        }
    });
    return DomStorage;
});
//# sourceMappingURL=../../_debug/data/stores/DomStorage.js.map