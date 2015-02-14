var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Application', './util'], function (require, exports, Application, util) {
    var WebApplication = (function (_super) {
        __extends(WebApplication, _super);
        function WebApplication() {
            _super.apply(this, arguments);
        }
        WebApplication._defaultConfig = util.deepCreate(Application._defaultConfig, {
            components: {
                router: {
                    constructor: require.toAbsMid('./routing/HashRouter')
                },
                ui: {
                    constructor: require.toAbsMid('./ui/Master'),
                    view: require.toAbsMid('./templating/html') + '!app/views/Application.html'
                }
            }
        });
        return WebApplication;
    })(Application);
    return WebApplication;
});
//# sourceMappingURL=_debug/WebApplication.js.map