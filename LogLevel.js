define(["require", "exports"], function (require, exports) {
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
        LogLevel[LogLevel["WARN"] = 1] = "WARN";
        LogLevel[LogLevel["LOG"] = 2] = "LOG";
        LogLevel[LogLevel["INFO"] = 3] = "INFO";
        LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    })(LogLevel || (LogLevel = {}));
    return LogLevel;
});
//# sourceMappingURL=_debug/LogLevel.js.map