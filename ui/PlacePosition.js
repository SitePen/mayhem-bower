define(["require", "exports"], function (require, exports) {
    var PlacePosition;
    (function (PlacePosition) {
        PlacePosition[PlacePosition["FIRST"] = 0] = "FIRST";
        PlacePosition[PlacePosition["LAST"] = -1] = "LAST";
        PlacePosition[PlacePosition["BEFORE"] = -2] = "BEFORE";
        PlacePosition[PlacePosition["AFTER"] = -3] = "AFTER";
        PlacePosition[PlacePosition["ONLY"] = -4] = "ONLY";
        PlacePosition[PlacePosition["REPLACE"] = -5] = "REPLACE";
    })(PlacePosition || (PlacePosition = {}));
    return PlacePosition;
});
//# sourceMappingURL=../_debug/ui/PlacePosition.js.map