var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../ui/dom/MultiNodeWidget', '../../../Promise', '../../../data/Proxy', '../../../util'], function (require, exports, MultiNodeWidget, Promise, Proxy, util) {
    function createSetter(property) {
        return function (value) {
            if (this[property] && this[property].get('isAttached')) {
                this.remove(this[property]);
                value.set('model', this[property].get('model'));
                this.add(value);
            }
            this[property] = value;
        };
    }
    var PromiseWidget = (function (_super) {
        __extends(PromiseWidget, _super);
        function PromiseWidget(kwArgs) {
            util.deferSetters(this, ['value'], '_render');
            _super.call(this, kwArgs);
        }
        PromiseWidget.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._as = 'value';
            this._pendingAs = 'progress';
            this._rejectedAs = 'error';
        };
        PromiseWidget.prototype._valueGetter = function () {
            return this._value;
        };
        PromiseWidget.prototype._valueSetter = function (value) {
            this._value = Promise.resolve(value);
            var self = this;
            function setModel(view, as, value) {
                if (!view.constructor.inheritsModel) {
                    return;
                }
                var kwArgs = {
                    app: self._app,
                    target: self.get('model')
                };
                kwArgs[as] = value;
                var proxy = new Proxy(kwArgs);
                view.set('model', proxy);
            }
            function attach(view) {
                self._lastNode.parentNode.insertBefore(view.detach(), self._lastNode);
                view.set({
                    isAttached: self.get('isAttached'),
                    parent: self
                });
            }
            if (!this._value.isResolved()) {
                this._fulfilled.detach();
            }
            if (this._rejected && !this._value.isRejected()) {
                this._rejected.detach();
            }
            if (!this._value.isFulfilled() && this._pending) {
                attach(this._pending);
            }
            this._value.always(function (value) {
                if (self._pending) {
                    self._pending.detach();
                }
                if (value instanceof Error) {
                    throw value;
                }
                else {
                    return value;
                }
            }).then(function (value) {
                if (self._fulfilled) {
                    setModel(self._fulfilled, self._as, value);
                    attach(self._fulfilled);
                }
            }, function (error) {
                if (self._rejected) {
                    setModel(self._rejected, self._rejectedAs, error);
                    attach(self._rejected);
                }
            }, this._value.isFulfilled() ? null : function (progress) {
                if (self._pending) {
                    setModel(self._pending, self._pendingAs, progress);
                }
            });
        };
        PromiseWidget.prototype._pendingGetter = function () {
            return this._pending;
        };
        PromiseWidget.prototype._rejectedGetter = function () {
            return this._rejected;
        };
        PromiseWidget.prototype._fulfilledGetter = function () {
            return this._fulfilled;
        };
        PromiseWidget.prototype.destroy = function () {
            this._fulfilled && this._fulfilled.destroy();
            this._pending && this._pending.destroy();
            this._rejected && this._rejected.destroy();
            this._fulfilled = this._pending = this._rejected = null;
            _super.prototype.destroy.call(this);
        };
        PromiseWidget.inheritsModel = true;
        return PromiseWidget;
    })(MultiNodeWidget);
    PromiseWidget.prototype._pendingSetter = createSetter('_pending');
    PromiseWidget.prototype._rejectedSetter = createSetter('_rejected');
    PromiseWidget.prototype._fulfilledSetter = createSetter('_fulfilled');
    return PromiseWidget;
});
//# sourceMappingURL=../../../_debug/templating/html/ui/Promise.js.map