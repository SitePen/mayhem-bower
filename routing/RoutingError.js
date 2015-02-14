define(["require", "exports", 'dojo/errors/create'], function (require, exports, createError) {
    var RoutingError;
    function Ctor(message, request) {
        this.request = request;
    }
    RoutingError = createError('RoutingError', Ctor, Error, {});
    return RoutingError;
});
//# sourceMappingURL=../_debug/routing/RoutingError.js.map