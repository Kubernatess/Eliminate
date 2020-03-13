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
        return _super.call(this) || this;
    }
    // 每次关卡更新,重新创建背景
    GameBackground.prototype.updateBackground = function () {
        this.cacheAsBitmap = false;
        // 从DisplayObjectContainer实例的子级列表中删除所有child DisplayObject实例
        this.removeChildren();
        this.createBackgroundImage();
        this.createMapBackground();
        this.createLevelRequireBackground();
        this.createRemainingStepBackground();
        // 将所有的图片默认当成一张纹理来处理
        this.cacheAsBitmap = true;
    };
    // 创建背景图片方法
    GameBackground.prototype.createBackgroundImage = function () {
        // 先进行初始化操作
        if (!this.backgroundImage) {
            this.backgroundImage = new egret.Bitmap();
        }
        // 添加texture属性,GameData.levelBackgroundImageName是唯一标识
        this.backgroundImage.texture = RES.getRes(GameData.levelBackgroundImageName);
        this.backgroundImage.width = GameData.stageW;
        this.backgroundImage.height = GameData.stageH;
        // 添加到显示列表
        this.addChild(this.backgroundImage);
        // 道具也有一张背景图
        var propBackground = new egret.Bitmap();
        propBackground.texture = RES.getRes("propbg_png");
        propBackground.width = GameData.stageW;
        propBackground.height = GameData.stageW / 5 + 20;
        propBackground.y = GameData.stageH - propBackground.height;
        this.addChild(propBackground);
    };
    // 创建格子图
    GameBackground.prototype.createMapBackground = function () {
        if (!this.girdBackgrounds) {
            this.girdBackgrounds = new Array();
        }
        var girdBackground;
        // 网格宽度和高度的值一样
        var girdWidth = (GameData.stageW - 40) / GameData.maxColumn;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdWidth * GameData.maxColumn;
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                if (GameData.mapData[i][j] != -1) {
                    // 初始化格子图
                    if (this.girdBackgrounds.length < (i * GameData.maxRow + j + 1)) {
                        girdBackground = new egret.Bitmap();
                        this.girdBackgrounds.push(girdBackground);
                    }
                    else {
                        girdBackground = this.girdBackgrounds[i * GameData.maxRow + j];
                    }
                    // 设置格子图属性
                    girdBackground.width = girdWidth;
                    girdBackground.height = girdWidth;
                    girdBackground.x = 20 + girdWidth * j;
                    girdBackground.y = startY + girdWidth * i;
                    // 单数行和双数行分别设置不同的皮肤,类似于国际象棋的棋盘
                    if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                        girdBackground.texture = RES.getRes("elementbg1");
                    }
                    else {
                        girdBackground.texture = RES.getRes("elementbg2");
                    }
                    this.addChild(girdBackground);
                }
            }
        }
    };
    // 创建过关条件元素背景图
    GameBackground.prototype.createLevelRequireBackground = function () {
        var girdWidth = (GameData.stageW - 40) / GameData.maxColumn;
        var levelRequireBackground = new egret.Bitmap();
        levelRequireBackground.texture = RES.getRes("levelreqbg_png");
        levelRequireBackground.width = GameData.levelRequireManagement.getLevelRequireNum() * (10 + girdWidth) + 20;
        levelRequireBackground.height = girdWidth + 60;
        levelRequireBackground.x = 20;
        levelRequireBackground.y = 50;
        this.addChild(levelRequireBackground);
        // 添加文字图片
        var textImage = new egret.Bitmap();
        textImage.texture = RES.getRes("levelreqtitle_png");
        textImage.x = levelRequireBackground.x + (levelRequireBackground.width - textImage.width) / 2;
        textImage.y = levelRequireBackground.y - 18;
        this.addChild(textImage);
    };
    // 创建剩余步数背景
    GameBackground.prototype.createRemainingStepBackground = function () {
        var remainingStepBackground = new egret.Bitmap();
        remainingStepBackground.texture = RES.getRes("remainingStepBackground_png");
        remainingStepBackground.width = 100;
        remainingStepBackground.height = 100;
        remainingStepBackground.x = GameData.stageW - 110;
        remainingStepBackground.y = 50;
        this.addChild(remainingStepBackground);
        // 添加文字图片
        var textImage = new egret.Bitmap();
        textImage.texture = RES.getRes("sursteptitle_png");
        textImage.x = remainingStepBackground.x + (remainingStepBackground.width - textImage.width) / 2;
        textImage.y = remainingStepBackground.y + 10;
        this.addChild(textImage);
    };
    return GameBackground;
}(egret.Sprite));
__reflect(GameBackground.prototype, "GameBackground");
//# sourceMappingURL=GameBackground.js.map