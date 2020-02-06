var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏运行时必要的数据
 */
var GameData = (function () {
    function GameData() {
    }
    // 初始化方法
    GameData.initData = function () {
        // 填充地图数据
        GameData.mapData = [];
        for (var i = 0; i < GameData.MaxRow; i++) {
            var arr = [];
            for (var j = 0; j < GameData.MaxColumn; j++) {
                // 对于一个地图上的元素,-1表示当前这块格子无法使用
                // -2表示当前这块格子是空的,可以使用,但是没有放置任何元素id
                GameData.mapData[j].push(-2);
            }
        }
        // 初始化关卡管理和操作类
        GameData.levelreq = new LevelRequire();
        // 循环填充元素
        GameData.elements = [];
        GameData.unusedElements = [];
        var len = GameData.MaxRow * GameData.MaxColumn;
        for (var k = 0; k < len; k++) {
            var ele = new GameElement();
            ele.id = k;
            GameData.elements.push(ele);
            GameData.unusedElements.push(k);
        }
        // 初始化Egret舞台宽高
        GameData.stageW = egret.MainContext.instance.stage.stageWidth;
        GameData.stageH = egret.MainContext.instance.stage.stageHeight;
    };
    // 空白地图块的数量
    GameData.unmapnum = 0;
    // 当前玩家剩余的步数
    GameData.stepNum = 0;
    // 当前关卡要求的步数
    GameData.levelStepNum = 0;
    // 当前关卡背景图
    GameData.levelBackgroundImageName = "";
    // 最大行数
    GameData.MaxRow = 8;
    // 最大列数
    GameData.MaxColumn = 8;
    // 当前地图可用格子元素的数量
    GameData.currentElementNum = 0;
    // 获取Egret舞台宽度
    GameData.stageW = 0;
    // 获取Egret舞台高度
    GameData.stageH = 0;
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map