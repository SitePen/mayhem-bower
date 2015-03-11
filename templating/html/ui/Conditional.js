var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../ui/dom/MultiNodeWidget', '../../../util'], function (require, exports, MultiNodeWidget, util) {
    var Conditional = (function (_super) {
        __extends(Conditional, _super);
        function Conditional() {
            _super.apply(this, arguments);
        }
        Conditional.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._conditionBindings = [];
        };
        Conditional.prototype._bindConditions = function () {
            var binding;
            while ((binding = this._conditionBindings.pop())) {
                binding.destroy();
            }
            if (!this._modelObserver) {
                var self = this;
                this._modelObserver = this.observe('model', function () {
                    self._bindConditions();
                });
            }
            var model = this.get('model');
            if (!model) {
                return;
            }
            var binder = this.get('app').get('binder');
            for (var i = 0, condition; (condition = this._conditions[i]); ++i) {
                if (condition.condition.$bind !== undefined) {
                    this._conditionBindings[i] = binder.createBinding(model, condition.condition.$bind);
                }
                else {
                    this._conditionBindings[i] = binder.createBinding(condition, 'condition');
                }
            }
            this._evaluateConditions();
        };
        Conditional.prototype.destroy = function () {
            this._conditionObserveHandle && this._conditionObserveHandle.remove();
            this._conditionObserveHandle = null;
            _super.prototype.destroy.call(this);
        };
        Conditional.prototype._evaluateConditions = function () {
            this._conditionObserveHandle && this._conditionObserveHandle.remove();
            var self = this;
            function observeCondition(changes) {
                if (!('oldValue' in changes) || Boolean(changes.value) !== Boolean(changes.oldValue)) {
                    self._evaluateConditions();
                }
            }
            this._currentView && this._currentView.detach();
            this._currentView = null;
            var handles = [];
            for (var i = 0, binding; (binding = this._conditionBindings[i]); ++i) {
                handles.push(binding.observe(observeCondition));
                if (binding.get()) {
                    var view = this._currentView = this._conditions[i].consequent;
                    this._lastNode.parentNode.insertBefore(view.detach(), this._lastNode);
                    view.set({
                        isAttached: this.get('isAttached'),
                        parent: this
                    });
                    if (view.constructor.inheritsModel) {
                        view.set('model', this.get('model'));
                    }
                    break;
                }
            }
            this._conditionObserveHandle = util.createCompositeHandle.apply(undefined, handles);
        };
        Conditional.prototype._conditionsGetter = function () {
            return this._conditions;
        };
        Conditional.prototype._conditionsSetter = function (value) {
            this._conditions = value;
            if (this.get('isAttached')) {
                this._bindConditions();
            }
        };
        Conditional.prototype._isAttachedGetter = function () {
            return this._isAttached;
        };
        Conditional.prototype._isAttachedSetter = function (value) {
            this._isAttached = value;
            if (value) {
                this._bindConditions();
            }
            else {
                this._conditionObserveHandle && this._conditionObserveHandle.remove();
                this._modelObserver && this._modelObserver.remove();
                this._conditionObserveHandle = this._modelObserver = null;
            }
        };
        Conditional.inheritsModel = true;
        return Conditional;
    })(MultiNodeWidget);
    return Conditional;
});
//# sourceMappingURL=../../../_debug/templating/html/ui/Conditional.js.map