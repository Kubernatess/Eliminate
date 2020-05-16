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
        var gameBackground = new egret.Bitmap(RES.getRes("background_png"));
        _this.addChild(gameBackground);
        gameBackground.width = GameData.stageW;
        gameBackground.height = GameData.stageH;
        // 创建顶部纯色层
        var topcolor = new egret.Bitmap(RES.getRes("DodgerBlue_png"));
        _this.addChild(topcolor);
        topcolor.width = GameData.stageW;
        topcolor.height *= GameData.ratio;
        GameBackground.topHeight = topcolor.height;
        // 创建底部纯色层
        var bottomColor = new egret.Bitmap(RES.getRes("LimeGreen_png"));
        _this.addChild(bottomColor);
        bottomColor.width = GameData.stageW;
        bottomColor.height *= GameData.ratio;
        // 设置锚点,并添加到底部
        bottomColor.anchorOffsetY = bottomColor.height;
        bottomColor.y = GameData.stageH;
        // 多个显示对象可以使用相同的 texture 对象
        var DeepSkyBlue = RES.getRes("DeepSkyBlue_png");
        var DarkTurquoise = RES.getRes("DarkTurquoise_png");
        // 创建所有地图格子
        for (var i = 0; i < MapData.maxRow; i++) {
            for (var j = 0; j < MapData.maxCol; j++) {
                var grid = new egret.Bitmap();
                _this.addChild(grid);
                // 设置格子图属性,格子图可以不对其设置锚点
                grid.width = MapData.gridwidth;
                grid.height = MapData.gridwidth;
                grid.x = MapData.gap + MapData.gridwidth * j;
                grid.y = MapData.startY + MapData.gridwidth * i;
                // 单数行和双数行分别设置不同的皮肤,类似于国际象棋的棋盘
                if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                    grid.texture = DeepSkyBlue;
                }
                else {
                    grid.texture = DarkTurquoise;
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