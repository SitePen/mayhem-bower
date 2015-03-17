var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/_base/array', '../has', '../Observable', '../Promise', '../util'], function (require, exports, array, has, Observable, Promise, util) {
    var NON_DATA_KEYS = {
        app: true,
        autoSave: true,
        autoValidate: true,
        currentScenarioKeys: true,
        dirtyProperties: true,
        errors: true,
        initializing: true,
        isExtensible: true,
        observers: true,
        scenario: true,
        store: true,
        validatorInProgress: true
    };
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(kwArgs) {
            if (kwArgs && kwArgs['app'] !== undefined) {
                this._app = kwArgs['app'];
            }
            else {
                var app = this.constructor._app;
                var type = typeof app;
                if (type === 'object') {
                    this._app = app;
                }
                else if (type === 'string') {
                    this._app = require(app);
                }
                else if (type === 'function') {
                    this._app = app(this);
                }
            }
            this._initializing = true;
            _super.call(this, kwArgs);
            this._initializing = false;
            this.commit();
        }
        Model.setDefaultApp = function (app) {
            this._app = app;
        };
        Model.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._autoSave = false;
            this._autoValidate = false;
            this._dirtyProperties = {};
            this._errors = {};
            this._isExtensible = false;
            this._scenario = 'default';
        };
        Model.prototype.addError = function (key, error) {
            var wasValid = this.get('isValid');
            var errors = this._errors[key] || (this._errors[key] = []);
            errors.push(error);
            this._notify('isValid', false, wasValid);
        };
        Model.prototype.clearErrors = function (key) {
            var wasValid = this.get('isValid');
            if (key) {
                this._errors[key] && this._errors[key].splice(0, Infinity);
            }
            else {
                var errors = this._errors;
                for (key in errors) {
                    errors[key] && errors[key].splice(0, Infinity);
                }
            }
            this._notify('isValid', this.get('isValid'), wasValid);
        };
        Model.prototype.commit = function () {
            var wasDirty = this.get('isDirty');
            this._dirtyProperties = {};
            wasDirty && this._notify('isDirty', false, wasDirty);
        };
        Model.prototype.destroy = function () {
            this._validatorInProgress && this._validatorInProgress.cancel(new Error('Model is being destroyed'));
            this._errors = this._dirtyProperties = this._validatorInProgress = null;
            _super.prototype.destroy.call(this);
        };
        Model.prototype._isDirtyGetter = function () {
            var properties = this._dirtyProperties;
            for (var key in properties) {
                return true;
            }
            return false;
        };
        Model.prototype._isValidGetter = function () {
            if (this._validatorInProgress) {
                return false;
            }
            var errors = this._errors;
            for (var key in errors) {
                if (errors[key] && errors[key].length) {
                    return false;
                }
            }
            return true;
        };
        Model.prototype.revert = function (keysToRevert) {
            var isDirty = false;
            var wasDirty = this.get('isDirty');
            var properties = this._dirtyProperties;
            if (keysToRevert) {
                for (var i = 0, j = keysToRevert.length; i < j; ++i) {
                    if (key in properties) {
                        this.set(key, properties[key]);
                        delete properties[key];
                    }
                }
                isDirty = this.get('isDirty');
            }
            else {
                for (var key in properties) {
                    this.set(key, properties[key]);
                }
                this._dirtyProperties = {};
            }
            this._notify('isDirty', isDirty, wasDirty);
        };
        Model.prototype._scenarioGetter = function () {
            return this._scenario;
        };
        Model.prototype._scenarioSetter = function (value) {
            var scenarios = this.get('scenarios');
            if (scenarios && !scenarios[value]) {
                throw new Error('Invalid scenario "' + value + '"');
            }
            this._scenario = value;
            if (scenarios) {
                var scenario = scenarios[value];
                var keys = this._currentScenarioKeys = {};
                for (var i = 0, j = scenario.length; i < j; ++i) {
                    keys[scenario[i]] = true;
                }
            }
            else {
                this._currentScenarioKeys = null;
            }
        };
        Model.prototype.toJSON = function () {
            var object = {};
            for (var selfKey in this) {
                if (!Object.prototype.hasOwnProperty.call(this, selfKey) || selfKey.charAt(0) !== '_') {
                    continue;
                }
                var key = selfKey.slice(1);
                if (key in NON_DATA_KEYS) {
                    continue;
                }
                object[key] = this[selfKey];
            }
            return object;
        };
        Model.prototype.validate = function (keysToValidate) {
            if (this._validatorInProgress) {
                this._validatorInProgress.cancel(new Error('Validation restarted'));
                this._validatorInProgress = null;
            }
            this.clearErrors();
            var self = this;
            var promise = this._validatorInProgress = new Promise(function (resolve, reject, progress, setCanceler) {
                var validators = self.get('validators');
                if (!validators) {
                    resolve(self.get('isValid'));
                    return;
                }
                var propertiesKeys = util.getObjectKeys(validators);
                var i = 0;
                var currentValidator;
                setCanceler(function (reason) {
                    currentValidator && currentValidator.cancel(reason);
                    i = Infinity;
                    throw reason;
                });
                (function validateNextField() {
                    var key = propertiesKeys[i++];
                    if (!key) {
                        self._validatorInProgress = currentValidator = null;
                        resolve(self.get('isValid'));
                    }
                    else if (keysToValidate && array.indexOf(keysToValidate, key) === -1) {
                        validateNextField();
                    }
                    else {
                        var j = 0;
                        var fieldValidators = validators[key];
                        (function runNextValidator() {
                            var validator = fieldValidators[j++];
                            if (validator) {
                                currentValidator = Promise.resolve(validator.validate(self, key, self.get(key))).then(runNextValidator, reject);
                            }
                            else {
                                validateNextField();
                            }
                        })();
                    }
                })();
            });
            return promise;
        };
        return Model;
    })(Observable);
    Model.prototype.set = function (key, value) {
        if (util.isObject(key)) {
            Observable.prototype.set.apply(this, arguments);
            return;
        }
        if (!this._initializing && !NON_DATA_KEYS[key] && this._currentScenarioKeys && !this._currentScenarioKeys[key] && !this._isExtensible) {
            has('debug') && console.warn('Not setting key "' + key + '" because it is not defined in the current scenario and the model is not extensible');
            return;
        }
        var oldValue = this.get(key);
        Observable.prototype.set.call(this, key, value);
        var newValue = this.get(key);
        if (!NON_DATA_KEYS[key] && !this._initializing && !util.isEqual(oldValue, newValue)) {
            var wasDirty = this.get('isDirty');
            this._dirtyProperties[key] = oldValue;
            wasDirty || this._notify('isDirty', true, wasDirty);
            if (this._autoSave) {
                this.save();
            }
            else if (this._autoValidate) {
                this.validate();
            }
        }
    };
    Model.prototype._app = null;
    return Model;
});
//# sourceMappingURL=../_debug/data/Model.js.map