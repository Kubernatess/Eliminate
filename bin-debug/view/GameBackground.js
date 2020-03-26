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
 * 创建所有游戏相关的背景
 * 由于背景需要显示在显示列表当中,所以需要继承egret.Sprite类
 */
var GameBackground = (function (_super) {
    __extends(GameBackground, _super);
    function GameBackground() {
        var _this = _super.call(this) || this;
        // 创建游戏背景
        var gameBackground = new egret.Bitmap();
        _this.addChild(gameBackground);
        gameBackground.texture = RES.getRes("background_png");
        gameBackground.width = GameData.stageW;
        gameBackground.height = GameData.stageH;
        // 创建纯色层
        var pureColor = new egret.Bitmap();
        _this.addChild(pureColor);
        pureColor.texture = RES.getRes("PureColor_png");
        pureColor.width = GameData.stageW;
        pureColor.height = pureColor.height * GameData.ratio;
        // 地图左右两边间隔
        var gap = 200 * GameData.ratio;
        // 创建所有地图格子
        var len = GameData.maxRow * GameData.maxColumn;
        var gridwidth = (GameData.stageW - gap * 2) / GameData.maxColumn;
        var startY = (GameData.stageH - gridwidth * GameData.maxColumn) / 2;
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                var grid = new egret.Bitmap();
                _this.addChild(grid);
                // 设置格子图属性,格子图可以不对其设置锚点
                grid.width = gridwidth;
                grid.height = gridwidth;
                grid.x = gap + gridwidth * j;
                grid.y = startY + gridwidth * i;
                // 单数行和双数行分别设置不同的皮肤,类似于国际象棋的棋盘
                if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                    grid.texture = RES.getRes("DeepSkyBlue_png");
                }
                else {
                    grid.texture = RES.getRes("DarkTurquoise_png");
                }
            }
        }
        // 将所有的图片默认当成一张纹理来处理
        _this.cacheAsBitmap = true;
        return _this;
    }
    return GameBackground;
}(egret.Sprite));
__reflect(GameBackground.prototype, "GameBackground");
//# sourceMappingURL=GameBackground.js.map