define(["require", "exports", 'dojo/Deferred', 'dojo/promise/Promise', 'dojo/_base/lang', 'dojo/promise/all'], function (require, exports, Deferred, DojoPromise, lang, whenAll) {
    var Promise = (function () {
        function Promise(initializer) {
            var canceler;
            var dfd = new Deferred(function (reason) {
                return canceler && canceler(reason);
            });
            try {
                initializer(lang.hitch(dfd, 'resolve'), lang.hitch(dfd, 'reject'), lang.hitch(dfd, 'progress'), function (_canceler) {
                    canceler = _canceler;
                });
            }
            catch (error) {
                dfd.reject(error);
            }
            return dfd.promise;
        }
        Promise.reject = function (error) {
            var dfd = new Deferred();
            dfd.reject(error);
            return dfd.promise;
        };
        Promise.resolve = function (value) {
            if (value instanceof DojoPromise) {
                return value;
            }
            if (value instanceof Deferred) {
                return value.promise;
            }
            var dfd = new Deferred();
            dfd.resolve(value);
            return dfd.promise;
        };
        Promise.all = whenAll;
        Promise.Deferred = Deferred;
        return Promise;
    })();
    return Promise;
});
//# sourceMappingURL=_debug/Promise.js.map