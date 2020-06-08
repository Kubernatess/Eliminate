var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 封装游戏结束画面板的样式与行为
 */
var GameOverPanel = (function (_super) {
    __extends(GameOverPanel, _super);
    function GameOverPanel() {
        var _this = _super.call(this) || this;
        // 设置贴图纹理
        var bitmap = new egret.Bitmap();
        _this.addChild(bitmap);
        bitmap.texture = RES.getRes("game_over_panel_png");
        var ratio = bitmap.width / bitmap.height;
        bitmap.width = GameData.stageW / 2;
        bitmap.height = bitmap.width / ratio;
        // 设置GameOver面板属性
        _this.anchorOffsetX = _this.width / 2;
        _this.anchorOffsetY = _this.height / 2;
        _this.x = GameData.stageW / 2;
        _this.y = -GameData.stageH / 2;
        _this.touchEnabled = true;
        return _this;
    }
    GameOverPanel.prototype.show = function () {
        var tw = egret.Tween.get(this);
        tw.to({ y: GameData.stageH / 2 }, 700, egret.Ease.bounceOut);
    };
    return GameOverPanel;
}(egret.Sprite));
__reflect(GameOverPanel.prototype, "GameOverPanel");
