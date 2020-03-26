var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StepNumText = (function () {
    function StepNumText(container) {
        this.container = container;
        // 剩余步数文本左右两边间隔
        var gap = 100 * GameData.stageW / 2024;
        // 设置文本属性
        var movesText = new egret.TextField();
        this.container.addChild(movesText);
        movesText.textColor = 0xFFFF00;
        movesText.fontFamily = "方正大黑简体";
        movesText.x = (GameData.stageW / 2) + gap * 2;
        movesText.y = gap;
        movesText.size = 140 * GameData.stageW / 2024;
        movesText.text = "Moves";
        // 设置剩余步数
        this.stepText = new egret.TextField();
        this.container.addChild(this.stepText);
        this.stepText.fontFamily = "方正大黑简体";
        this.stepText.size = 140 * GameData.stageW / 2024;
        this.stepText.x = movesText.x + movesText.width;
        this.stepText.y = gap;
        this.stepText.text = "×" + GameData.stepNum;
    }
    return StepNumText;
}());
__reflect(StepNumText.prototype, "StepNumText");
//# sourceMappingURL=StepNumText.js.map