define(["require", "exports", 'dojo/io-query'], function (require, exports, ioQuery) {
    var Request = (function () {
        function Request(kwArgs) {
            for (var key in kwArgs) {
                this[key] = kwArgs[key];
            }
        }
        Request.prototype.toString = function () {
            var serialization = '';
            if (this.method) {
                serialization += this.method + ' ';
            }
            if (this.protocol) {
                serialization += this.protocol;
            }
            if (this.host) {
                serialization += '//' + this.host;
            }
            if (this.path) {
                serialization += this.path;
            }
            for (var _ in this.vars) {
                serialization += '?' + ioQuery.objectToQuery(this.vars);
                break;
            }
            return '[Request ' + serialization + ']';
        };
        return Request;
    })();
    return Request;
});
//# sourceMappingURL=../_debug/routing/Request.js.map