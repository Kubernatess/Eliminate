var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var StepNumText = (function () {
    function StepNumText(container) {
        this.container = container;
        // 设置文本属性
        var movesText = new egret.TextField();
        this.container.addChild(movesText);
        movesText.textColor = 0xFFFF00;
        movesText.fontFamily = "方正大黑简体";
        // 由于TextField设置不了锚点,但我们可以通过另一种办法使它垂直居中对齐
        movesText.height = GameBackground.topHeight;
        movesText.verticalAlign = egret.VerticalAlign.MIDDLE;
        movesText.size = 160 * GameData.stageW / 2024;
        movesText.text = "Moves";
        // 设置剩余步数
        this.stepText = new egret.TextField();
        this.container.addChild(this.stepText);
        this.stepText.fontFamily = "方正大黑简体";
        this.stepText.size = 160 * GameData.stageW / 2024;
        this.stepText.height = GameBackground.topHeight;
        this.stepText.verticalAlign = egret.VerticalAlign.MIDDLE;
        // 使其水平居中定位
        var gap = ((GameData.stageW / 2 - movesText.width) / 4) * GameData.ratio;
        movesText.x = (GameData.stageW / 2) + gap;
        this.stepText.x = movesText.x + movesText.width;
    }
    StepNumText.prototype.getNum = function () {
        return this.stepNum;
    };
    StepNumText.prototype.setNum = function (num) {
        this.stepNum = num;
        this.stepText.text = "×" + this.stepNum;
    };
    return StepNumText;
}());
__reflect(StepNumText.prototype, "StepNumText");
//# sourceMappingURL=StepNumText.js.map