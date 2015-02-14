var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'dojo/currency', 'dojo/date/locale', './has', './i18n/IntlMessageFormat', 'dojo/number', './Observable', './Promise', './util'], function (require, exports, currencyFormatter, dateFormatter, has, IntlMessageFormat, numberFormatter, Observable, Promise, util) {
    function mergeBundle(locale, id, target, source) {
        for (var key in source) {
            if (key === '$locale') {
                continue;
            }
            var message = source[key];
            if (message && message.format) {
                message = message.format.bind(message);
            }
            else if (typeof message === 'string') {
                message = new IntlMessageFormat(message, locale);
                message = message.format.bind(message);
            }
            else if (typeof message !== 'function') {
                throw new Error("Dictionary key " + key + " in bundle " + id + " does not contain a valid message");
            }
            target[key] = message;
        }
    }
    var I18n = (function (_super) {
        __extends(I18n, _super);
        function I18n() {
            _super.apply(this, arguments);
        }
        I18n.prototype._initialize = function () {
            _super.prototype._initialize.call(this);
            this._loadedBundles = {};
            this._locale = this._getDefaultLocale();
            this._messages = {};
            this._preload = [];
        };
        I18n.prototype._formatCurrencyDependencies = function () {
            return ['locale'];
        };
        I18n.prototype.formatCurrency = function (amount, options) {
            if (options === void 0) { options = {}; }
            if (!options.locale) {
                options = Object.create(options);
                options.locale = this.get('locale');
            }
            return currencyFormatter.format(amount, options);
        };
        I18n.prototype._formatDateDependencies = function () {
            return ['locale'];
        };
        I18n.prototype.formatDate = function (date, options) {
            if (options === void 0) { options = {}; }
            if (!options.locale) {
                options = Object.create(options);
                options.locale = this.get('locale');
            }
            return dateFormatter.format(date, options);
        };
        I18n.prototype._formatNumberDependencies = function () {
            return ['locale'];
        };
        I18n.prototype.formatNumber = function (number, options) {
            if (options === void 0) { options = {}; }
            if (!options.locale) {
                options = Object.create(options);
                options.locale = this.get('locale');
            }
            return numberFormatter.format(number, options);
        };
        I18n.prototype._getDefaultLocale = function () {
            var locale = null;
            if (has('host-browser')) {
                locale = navigator.language;
            }
            else if (has('host-node') && process.env.LANG) {
                locale = process.env.LANG.split('.')[0];
            }
            if (!locale) {
                locale = 'en-us';
            }
            return locale;
        };
        I18n.prototype.loadBundle = function (id) {
            if (this._loadedBundles[id]) {
                return Promise.resolve(undefined);
            }
            this._loadedBundles[id] = true;
            var locale = this.get('locale');
            var bundleId = 'dojo/i18n!' + id.replace('/nls/', '/nls/' + locale + '/');
            var self = this;
            return util.getModule(bundleId).then(function (bundle) {
                mergeBundle(locale, bundleId, self._messages, bundle);
            });
        };
        I18n.prototype._parseCurrencyDependencies = function () {
            return ['locale'];
        };
        I18n.prototype.parseCurrency = function (amount, options) {
            if (options === void 0) { options = {}; }
            if (!options.locale) {
                options = Object.create(options);
                options.locale = this.get('locale');
            }
            return currencyFormatter.parse(amount, options);
        };
        I18n.prototype._parseDateDependencies = function () {
            return ['locale'];
        };
        I18n.prototype.parseDate = function (date, options) {
            if (options === void 0) { options = {}; }
            if (!options.locale) {
                options = Object.create(options);
                options.locale = this.get('locale');
            }
            return dateFormatter.parse(date, options);
        };
        I18n.prototype._parseNumberDependencies = function () {
            return ['locale'];
        };
        I18n.prototype.parseNumber = function (number, options) {
            if (options === void 0) { options = {}; }
            if (!options.locale) {
                options = Object.create(options);
                options.locale = this.get('locale');
            }
            return numberFormatter.parse(number, options);
        };
        I18n.prototype.run = function () {
            var preload = this.get('preload');
            for (var i = 0, j = preload.length; i < j; ++i) {
                this._loadedBundles[preload[i]] = true;
            }
            return this.switchToLocale(this.get('locale'));
        };
        I18n.prototype.switchToLocale = function (locale) {
            this.set('locale', null);
            var bundleIds = Object.keys(this._loadedBundles).map(function (bundleId) {
                return 'dojo/i18n!' + bundleId.replace('/nls/', '/nls/' + locale + '/');
            });
            var self = this;
            return util.getModules(bundleIds.concat([
                'dojo/i18n!dojo/cldr/nls/' + locale + '/gregorian',
                'dojo/i18n!dojo/cldr/nls/' + locale + '/currency',
                'dojo/i18n!dojo/cldr/nls/' + locale + '/number'
            ])).then(function (bundles) {
                var allMessages = {};
                for (var i = 0, j = bundles.length - 3; i < j; ++i) {
                    mergeBundle(locale, bundleIds[i], allMessages, bundles[i]);
                }
                self._messages = allMessages;
                self._notify('messages', allMessages, undefined);
                self.set('locale', locale);
            });
        };
        return I18n;
    })(Observable);
    var I18n;
    (function (I18n) {
    })(I18n || (I18n = {}));
    return I18n;
});
//# sourceMappingURL=_debug/I18n.js.map