var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/_base/array', '../Observable', '../Promise', './RoutingError', './UrlRule', '../util'], function (require, exports, arrayUtil, Observable, Promise, RoutingError, UrlRule, util) {
    var Router = (function (_super) {
        __extends(Router, _super);
        function Router() {
            _super.apply(this, arguments);
        }
        Router.prototype._rulesGetter = function () {
            return this._rules;
        };
        Router.prototype._rulesSetter = function (value) {
            this._rules = arrayUtil.map(value, function (rule) {
                if (rule.constructor === Object) {
                    return new UrlRule(rule);
                }
                return rule;
            });
            this._rules.push(new UrlRule());
        };
        Router.prototype.createUrl = function (routeId, kwArgs) {
            var rules = this.get('rules');
            var serialized;
            if (this.get('routes')[routeId]) {
                for (var i = 0, rule; (rule = rules[i]); ++i) {
                    serialized = rule.serialize(routeId, kwArgs);
                    if (serialized) {
                        return serialized;
                    }
                }
            }
            throw new Error('Invalid route');
        };
        Router.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            var currentRoute = this.get('currentRoute');
            if (currentRoute) {
                currentRoute.destroy();
            }
        };
        Router.prototype.go = function (routeId, kwArgs) {
            return this._goToRoute({
                routeId: routeId,
                kwArgs: kwArgs
            });
        };
        Router.prototype._goToRoute = function (routeInfo) {
            var self = this;
            var oldRoute = this.get('currentRoute');
            this._routeInProgress && this._routeInProgress.cancel();
            var promise = this._loadRoute(routeInfo.routeId).then(function (newRoute) {
                if (newRoute === oldRoute) {
                    return newRoute.update && newRoute.update(routeInfo.kwArgs);
                }
                return Promise.resolve(oldRoute && oldRoute.beforeExit && oldRoute.beforeExit(routeInfo.kwArgs)).then(function () {
                    return newRoute.beforeEnter && newRoute.beforeEnter(routeInfo.kwArgs);
                }).then(function () {
                    return oldRoute && oldRoute.exit && oldRoute.exit(routeInfo.kwArgs);
                }).then(function () {
                    self.set('currentRoute', null);
                    return newRoute.enter(routeInfo.kwArgs);
                }).then(function () {
                    self._routeInProgress = null;
                    self.set('currentRoute', newRoute);
                });
            }).otherwise(function (error) {
                self._routeInProgress = null;
                if (error.name !== 'CancelError') {
                    throw error;
                }
            });
            this._routeInProgress = promise;
            return promise;
        };
        Router.prototype._handleRequest = function (request) {
            var self = this;
            return new Promise(function (resolve) {
                var routeInfo = self._parseRequest(request);
                resolve(self._goToRoute(routeInfo));
            });
        };
        Router.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._rules = [new UrlRule()];
        };
        Router.prototype._loadRoute = function (routeId) {
            var self = this;
            var routes = this.get('routes');
            var route = routes[routeId];
            if (!route) {
                throw new Error('Invalid route ID "' + routeId + '"');
            }
            if (typeof route === 'string') {
                return util.getModule(route).then(function (Ctor) {
                    routes[routeId] = new Ctor({
                        app: self.get('app')
                    });
                    return routes[routeId];
                });
            }
            return Promise.resolve(route);
        };
        Router.prototype._parseRequest = function (request) {
            var rules = this.get('rules');
            var routeInfo;
            for (var i = 0, rule; (rule = rules[i]); ++i) {
                routeInfo = rule.parse(request);
                if (routeInfo) {
                    return routeInfo;
                }
            }
            throw new RoutingError('Request did not match any known URL', request);
        };
        return Router;
    })(Observable);
    return Router;
});
//# sourceMappingURL=../_debug/routing/Router.js.map