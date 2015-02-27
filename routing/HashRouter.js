var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/hash', 'dojo/io-query', 'dojo/_base/lang', './Request', './Router', 'dojo/topic'], function (require, exports, hash, ioQuery, lang, Request, Router, topic) {
    var HashRouter = (function (_super) {
        __extends(HashRouter, _super);
        function HashRouter() {
            _super.apply(this, arguments);
        }
        HashRouter.prototype.createUrl = function (routeId, kwArgs) {
            return '#' + this.get('prefix') + _super.prototype.createUrl.call(this, routeId, kwArgs);
        };
        HashRouter.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._handle && this._handle.remove();
            this._handle = null;
        };
        HashRouter.prototype.go = function (routeId, kwArgs) {
            var newHash = this.createUrl(routeId, kwArgs).slice(1);
            if (this._oldHash === newHash) {
                return;
            }
            this._handle.remove();
            hash(newHash);
            this._listen();
            return this._handleHashChange(newHash);
        };
        HashRouter.prototype._handleHashChange = function (newHash) {
            var prefix = this.get('prefix');
            if (this._oldHash === newHash || (newHash.length && newHash.slice(0, prefix.length) !== prefix)) {
                return;
            }
            if (!newHash && this.get('defaultRoute')) {
                var defaultRoute = this.get('defaultRoute');
                return this.go(defaultRoute.routeId, defaultRoute.kwArgs);
            }
            var self = this;
            var searchIndex = newHash.indexOf('?');
            var request = new Request({
                host: location.host,
                method: 'GET',
                path: newHash.slice(prefix.length, searchIndex > -1 ? searchIndex : Infinity),
                protocol: location.protocol,
                vars: searchIndex > -1 ? ioQuery.queryToObject(newHash.slice(searchIndex + 1)) : {}
            });
            return this._handleRequest(request).then(function () {
                self._oldHash = newHash;
            }, function (error) {
                self._oldHash && hash(self._oldHash, true);
                self.get('app').handleError(error);
            });
        };
        HashRouter.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._prefix = '!';
        };
        HashRouter.prototype._listen = function () {
            this._handle = topic.subscribe('/dojo/hashchange', lang.hitch(this, '_handleHashChange'));
        };
        HashRouter.prototype.run = function () {
            var self = this;
            this.get('app').run().then(function () {
                self._listen();
                self._handleHashChange(hash());
            });
        };
        return HashRouter;
    })(Router);
    return HashRouter;
});
//# sourceMappingURL=../_debug/routing/HashRouter.js.map