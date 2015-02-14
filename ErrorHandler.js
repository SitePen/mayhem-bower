var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/aspect', './has', 'dojo/_base/lang', './Observable', './util', "./templating/html!./views/Error.html"], function (require, exports, aspect, has, lang, Observable, util) {
    var ErrorHandler = (function (_super) {
        __extends(ErrorHandler, _super);
        function ErrorHandler() {
            _super.apply(this, arguments);
        }
        ErrorHandler.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._handleGlobalErrors = true;
        };
        ErrorHandler.prototype.destroy = function () {
            this._handle && this._handle.remove();
            this._handle = null;
            _super.prototype.destroy.call(this);
        };
        ErrorHandler.prototype.handleError = function (error) {
            if (has('host-browser') && this._app.get('ui')) {
                var ErrorView = require('./templating/html!./views/Error.html');
                var view = new ErrorView({
                    app: this._app,
                    model: error
                });
                this._app.get('ui').set('view', view);
            }
            else {
                this._app.log(error.stack || String(error));
            }
        };
        ErrorHandler.prototype.run = function () {
            this.run = function () {
            };
            var self = this;
            if (this._handleGlobalErrors) {
                if (has('host-browser')) {
                    this._handle = aspect.before(window, 'onerror', function (message, url, lineNumber, columnNumber, error) {
                        if (!error) {
                            error = new Error(message);
                            error.stack = 'Error: ' + message + '\n    at window.onerror (' + url + ':' + lineNumber + ':' + (columnNumber || 0) + ')';
                        }
                        self.handleError(error);
                    });
                }
                else if (has('host-node')) {
                    var listener = lang.hitch(this, 'handleError');
                    process.on('uncaughtException', listener);
                    this._handle = util.createHandle(function () {
                        process.removeListener('uncaughtException', listener);
                    });
                }
            }
        };
        return ErrorHandler;
    })(Observable);
    return ErrorHandler;
});
//# sourceMappingURL=_debug/ErrorHandler.js.map