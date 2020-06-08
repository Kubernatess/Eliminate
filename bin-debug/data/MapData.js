var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MapData = (function () {
    function MapData() {
    }
    // 最大行数
    MapData.maxRow = 8;
    // 最大列数
    MapData.maxCol = 8;
    // 地图左右两边间隔
    MapData.gap = 200;
    return MapData;
}());
__reflect(MapData.prototype, "MapData");
