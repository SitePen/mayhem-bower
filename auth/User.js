var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../has', '../Observable'], function (require, exports, has, Observable) {
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            _super.apply(this, arguments);
        }
        User.prototype.login = function (kwArgs) {
            var _this = this;
            return this.authenticate.apply(this, arguments).then(function (userData) {
                _this.set({
                    isAuthenticated: true,
                    state: userData
                });
                return userData;
            });
        };
        User.prototype.authenticate = function (kwArgs) {
            if (has('debug')) {
                throw new Error('Abstract method "authenticate" not implemented');
            }
            return null;
        };
        User.prototype.logout = function () {
            this.set({
                isAuthenticated: false,
                state: null
            });
        };
        User.prototype.checkAccess = function (operation, kwArgs) {
            return true;
        };
        return User;
    })(Observable);
    User.prototype._isAuthenticated = false;
    return User;
});
//# sourceMappingURL=../_debug/auth/User.js.map