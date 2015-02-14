var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../ui/dom/util', 'dojo/io-query', './Request', './Router', '../util'], function (require, exports, domUtil, ioQuery, Request, Router, util) {
    var parser = document.createElement('a');
    function createLocation(link) {
        return {
            host: link.host,
            href: link.href,
            pathname: link.pathname,
            protocol: link.protocol,
            search: link.search
        };
    }
    function matchesCurrentOrigin(target) {
        return target.protocol + '//' + target.host === location.protocol + '//' + location.host;
    }
    var HtmlHistoryRouter = (function (_super) {
        __extends(HtmlHistoryRouter, _super);
        function HtmlHistoryRouter() {
            _super.apply(this, arguments);
        }
        HtmlHistoryRouter.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._handle && this._handle.remove();
            this._uiHandle && this._uiHandle.remove();
            this._handle = this._uiHandle = null;
        };
        HtmlHistoryRouter.prototype.go = function (routeId, kwArgs) {
            var newUrl = this.createUrl(routeId, kwArgs);
            if (this._oldLocation && this._oldLocation.href === newUrl) {
                return;
            }
            parser.href = newUrl;
            var newLocation = createLocation(parser);
            history.pushState(newLocation, null, newUrl);
            return this._handleHistoryChange(newLocation);
        };
        HtmlHistoryRouter.prototype._handleHistoryChange = function (newLocation) {
            if (this._oldLocation && this._oldLocation.href === newLocation.href) {
                return;
            }
            var self = this;
            var request = new Request({
                host: newLocation.host,
                method: 'GET',
                path: newLocation.pathname,
                protocol: newLocation.protocol,
                vars: ioQuery.queryToObject(newLocation.search.slice(1))
            });
            return this._handleRequest(request).then(function () {
                self._oldLocation = newLocation;
            }, function (error) {
                self._oldLocation && history.replaceState(self._oldLocation, null, self._oldLocation.href);
                self.get('app').handleError(error);
            });
        };
        HtmlHistoryRouter.prototype._retargetLinkCapture = function (root) {
            var self = this;
            this._uiHandle && this._uiHandle.remove();
            this._uiHandle = domUtil.on(root, 'click', function (event) {
                var target = event.target;
                do {
                    if (target.nodeName.toUpperCase() === 'A' && target.href && matchesCurrentOrigin(target)) {
                        event.preventDefault();
                        self._handleHistoryChange(createLocation(target));
                        return;
                    }
                } while ((target = target.parentNode));
            });
        };
        HtmlHistoryRouter.prototype.run = function () {
            var self = this;
            var ui = this.get('app').get('ui');
            this._handle = util.createCompositeHandle(domUtil.on(window, 'popstate', function (event) {
                self._handleHistoryChange(event.state);
            }), ui.observe('root', function (change) {
                self._retargetLinkCapture(change.value);
            }));
            this._retargetLinkCapture(ui.get('root'));
            this.get('app').run().then(function () {
                self._handleHistoryChange(history.state || location);
            });
        };
        return HtmlHistoryRouter;
    })(Router);
    return Router;
});
//# sourceMappingURL=../_debug/routing/HtmlHistoryRouter.js.map