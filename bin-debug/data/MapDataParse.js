var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 解析地图数据
 */
var MapDataParse = (function () {
    function MapDataParse() {
    }
    MapDataParse.createMapData = function (val) {
        var len = val.length;
        GameData.unmapnum = len;
        var index = 0;
        for (var i = 0; i < len; i++) {
            index = val[i];
            var row = Math.floor(index / GameData.MaxColumn);
            var col = index % GameData.MaxRow;
            GameData.mapData[row][col] = -1;
        }
        GameData.currentElementNum = GameData.MaxRow * GameData.MaxColumn - len;
    };
    return MapDataParse;
}());
__reflect(MapDataParse.prototype, "MapDataParse");
//# sourceMappingURL=MapDataParse.js.map