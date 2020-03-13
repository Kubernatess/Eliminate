var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏基础数据封装,而且要保证这些数据是全局的
 * 相当于MVC设计模式中Model层
 */
var GameData = (function () {
    function GameData() {
    }
    // 初始化方法
    GameData.initData = function () {
        // 填充地图数据
        GameData.mapData = [];
        for (var i = 0; i < GameData.maxRow; i++) {
            var arr = [];
            for (var j = 0; j < GameData.maxColumn; j++) {
                // 对于一个地图上的元素,-1表示当前地图块无法使用
                // -2表示当前地图块是空的,可以使用,但是没有放置任何元素id
                GameData.mapData[i].push(-2);
            }
        }
        // 初始化过关条件管理和操作类
        GameData.levelRequireManagement = new LevelRequireManagement();
        // 循环填充元素
        GameData.elements = [];
        GameData.unusedElements = [];
        var len = GameData.maxRow * GameData.maxColumn;
        for (var k = 0; k < len; k++) {
            var ele = new GameElement();
            ele.id = k;
            GameData.elements.push(ele);
            // 当前游戏未开始的时候,所有的卡片元素都没有使用
            GameData.unusedElements.push(k);
        }
        // 初始化Egret舞台宽高
        GameData.stageW = egret.MainContext.instance.stage.stageWidth;
        GameData.stageH = egret.MainContext.instance.stage.stageHeight;
    };
    // 空白地图块的数量
    GameData.unmapnum = 0;
    // 当前玩家剩余的步数
    GameData.remainingStep = 0;
    // 当前关卡要求的步数
    GameData.levelRequiredStep = 0;
    // 当前关卡背景图,图片名称是一个唯一标识
    GameData.levelBackgroundImageName = "";
    // 最大行数
    GameData.maxRow = 8;
    // 最大列数
    GameData.maxColumn = 8;
    // 当前可用的卡片元素数量,这个数量取决于可用地图块的数量
    GameData.currentElementNum = 0;
    // 获取Egret舞台宽度
    GameData.stageW = 0;
    // 获取Egret舞台高度
    GameData.stageH = 0;
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map