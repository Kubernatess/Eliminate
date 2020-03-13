var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 关卡数据解析
 */
var LevelGameDataParse = (function () {
    function LevelGameDataParse() {
    }
    // 解析独立数据,当引擎加载完成level.json,引擎会把它转换为一个Object
    LevelGameDataParse.parseLevelGameData = function (obj) {
        GameData.remainingStep = obj.levelRequiredStep;
        GameData.levelRequiredStep = obj.levelRequiredStep;
        GameData.elementTypes = obj.element;
        GameData.levelBackgroundImageName = obj.levelBackgroundImage;
        LevelGameDataParse.parseLevelReq(obj.levelRequiredElement);
    };
    // 解析过关条件元素
    LevelGameDataParse.parseLevelReq = function (levelRequiredElement) {
        // 首先清空过关条件元素对象池
        GameData.levelRequireManagement.openChange();
        // 循环添加过关条件元素
        var len = levelRequiredElement.length;
        for (var i = 0; i < len; i++) {
            GameData.levelRequireManagement.addElement(levelRequiredElement[i].type, levelRequiredElement[i].num);
        }
    };
    return LevelGameDataParse;
}());
__reflect(LevelGameDataParse.prototype, "LevelGameDataParse");
//# sourceMappingURL=LevelGameDataParse.js.map