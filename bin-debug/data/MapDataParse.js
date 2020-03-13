var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 解析地图数据
 */
var MapDataParse = (function () {
    function MapDataParse() {
    }
    // 参数为level.json文件传进来的map属性
    MapDataParse.createMapData = function (map) {
        var len = map.length;
        GameData.unmapnum = len;
        var index = 0;
        for (var i = 0; i < len; i++) {
            index = map[i];
            var row = Math.floor(index / GameData.maxColumn);
            var col = index % GameData.maxRow;
            // 对于一个地图上的元素,-1表示当前地图块无法使用
            // -2表示当前地图块是空的,可以使用,但是没有放置任何元素id
            GameData.mapData[row][col] = -1;
        }
        // 根据空白地图块数量,反过来求当前可用卡片元素数量
        GameData.currentElementNum = GameData.maxRow * GameData.maxColumn - len;
    };
    return MapDataParse;
}());
__reflect(MapDataParse.prototype, "MapDataParse");
//# sourceMappingURL=MapDataParse.js.map