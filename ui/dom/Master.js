var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './events/EventManager', './MultiNodeWidget', '../../Promise', '../../util'], function (require, exports, EventManager, MultiNodeWidget, Promise, util) {
    var Master = (function (_super) {
        __extends(Master, _super);
        function Master(kwArgs) {
            util.deferSetters(this, ['root', 'view'], 'run', function (setter, value) {
                if (setter === 'view') {
                    this._view = value;
                }
            });
            _super.call(this, kwArgs);
        }
        Master.prototype.destroy = function () {
            this._eventManager && this._eventManager.destroy();
            this._view && this._view.destroy();
            this._view = this._root = null;
            _super.prototype.destroy.call(this);
        };
        Master.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this.set('root', document.body);
        };
        Master.prototype._initializeView = function () {
            this._root.appendChild(this._view.detach());
            this._view.set({
                isAttached: true,
                parent: this
            });
        };
        Master.prototype._rootGetter = function () {
            return this._root;
        };
        Master.prototype._rootSetter = function (root) {
            this._root = root;
            this._eventManager && this._eventManager.destroy();
            if (root) {
                this._view && typeof this._view === 'object' && this._initializeView();
                this._eventManager = new EventManager(this);
            }
        };
        Master.prototype.run = function () {
            var self = this;
            var promise;
            if (typeof this._view === 'string') {
                promise = util.getModule(this._view).then(function (view) {
                    return self._app.get('binder').run().then(function () {
                        if (typeof view === 'function') {
                            view = new view({ app: self._app });
                        }
                        self.set('view', view);
                    });
                }).otherwise(function (error) {
                    self._app.handleError(error);
                });
            }
            else {
                promise = Promise.resolve(undefined);
            }
            this.run = function () {
                return promise;
            };
            return promise;
        };
        Master.prototype._viewGetter = function () {
            return this._view;
        };
        Master.prototype._viewSetter = function (view) {
            if (this._view && this._view.detach) {
                this._view.detach();
            }
            this._view = view;
            if (view && typeof view === 'object') {
                if (!view.get('model')) {
                    view.set('model', this);
                }
                this._root && this._initializeView();
            }
        };
        return Master;
    })(MultiNodeWidget);
    return Master;
});
//# sourceMappingURL=../../_debug/ui/dom/Master.js.map