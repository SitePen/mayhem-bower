define(["require", "exports", './has'], function (require, exports, has) {
    var Ctor;
    if (has('es6-weak-map')) {
        Ctor = WeakMap;
    }
    else {
        var getSurrogate = function (key) {
            var owner = key.parentNode || key.ownerElement;
            if (!owner) {
                throw new Error('Cannot use key without leaking');
            }
            var nodes = owner.__bindingNodes;
            if (!nodes) {
                nodes = owner.__bindingNodes = [];
            }
            for (var i = 0, maybeKey; (maybeKey = nodes[i]); ++i) {
                if (maybeKey.node === key) {
                    return maybeKey.map;
                }
            }
            var map = {};
            nodes.push({ node: key, map: map });
            return map;
        };
        var mid = '__FakeWeakMap' + (new Date().getTime()) + String(Math.random()).slice(2);
        var oid = 0;
        var FakeWeakMap = function FakeWeakMap() {
            this._id = mid + (++oid);
        };
        FakeWeakMap.prototype = {
            constructor: FakeWeakMap,
            clear: function () {
            },
            'delete': function (key) {
                if (has('dom-bad-expandos') && (key.nodeType === 2 || key.nodeType === 3)) {
                    key = getSurrogate(key);
                }
                delete key[this._id];
            },
            get: function (key) {
                if (has('dom-bad-expandos') && (key.nodeType === 2 || key.nodeType === 3)) {
                    key = getSurrogate(key);
                }
                return key[this._id];
            },
            has: function (key) {
                if (has('dom-bad-expandos') && (key.nodeType === 2 || key.nodeType === 3)) {
                    key = getSurrogate(key);
                }
                return this._id in key;
            },
            set: function (key, value) {
                if (has('es5')) {
                    Object.defineProperty(key, this._id, {
                        enumerable: false,
                        configurable: true,
                        value: value,
                        writable: true
                    });
                }
                else {
                    if (has('dom-bad-expandos') && (key.nodeType === 2 || key.nodeType === 3)) {
                        key = getSurrogate(key);
                    }
                    key[this._id] = value;
                }
            }
        };
        Ctor = FakeWeakMap;
    }
    return Ctor;
});
//# sourceMappingURL=_debug/WeakMap.js.map