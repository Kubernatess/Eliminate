var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏主逻辑
 */
var GameLogic = (function () {
    function GameLogic(container) {
        this.container = container;
        // 添加游戏背景,同时包括了地图格子图和纯色层
        var background = new GameBackground();
        this.container.addChild(background);
        // 初始化条件元素控制器,并创建条件元素
        var requiredElementContainer = new egret.DisplayObjectContainer();
        this.container.addChild(requiredElementContainer);
        this.requiredElementManagement = new RequiredElementManagement(requiredElementContainer);
        // 添加移动步数文本
        this.stepNumText = new StepNumText(this.container);
        // 创建所有游戏元素
        var GameElementContainer = new egret.DisplayObjectContainer();
        this.container.addChild(GameElementContainer);
        this.gameElementManagement = new GameElementManagement(GameElementContainer);
        this.gameElementManagement.createElements();
    }
    return GameLogic;
}());
__reflect(GameLogic.prototype, "GameLogic");
//# sourceMappingURL=GameLogic.js.map