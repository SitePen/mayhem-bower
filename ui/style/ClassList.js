define(["require", "exports", '../../util'], function (require, exports, util) {
    var ClassList = (function () {
        function ClassList() {
            this._value = {};
        }
        ClassList.prototype.add = function (className) {
            var classes = className.split(/\s+/);
            for (var i = 0, j = classes.length; i < j; ++i) {
                if (className) {
                    this._value[className] = true;
                }
            }
        };
        ClassList.prototype.has = function (className) {
            return this._value[className] || false;
        };
        ClassList.prototype.remove = function (className) {
            var classes = className.split(/\s+/);
            for (var i = 0, j = classes.length; i < j; ++i) {
                className = classes[i];
                if (className) {
                    delete this._value[className];
                }
            }
        };
        ClassList.prototype.set = function (className) {
            this._value = {};
            this.add(className);
        };
        ClassList.prototype.toggle = function (className, forceState) {
            if (forceState != null) {
                this[forceState ? 'add' : 'remove'](className);
            }
            else {
                var classes = className.split(/\s+/);
                for (var i = 0, j = classes.length; i < j; ++i) {
                    className = classes[i];
                    if (this._value[className]) {
                        delete this._value[className];
                    }
                    else {
                        this._value[className] = true;
                    }
                }
            }
        };
        ClassList.prototype.valueOf = function () {
            return util.getObjectKeys(this._value).join(' ');
        };
        return ClassList;
    })();
    return ClassList;
});
//# sourceMappingURL=../../_debug/ui/style/ClassList.js.map