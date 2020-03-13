var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 关卡元素管理器制作
 */
var LevelRequireViewManagement = (function () {
    function LevelRequireViewManagement(layer) {
        this.layer = layer;
        this.init();
    }
    LevelRequireViewManagement.prototype.init = function () {
        this.levelRequireElements = new Array();
    };
    // 创建所有的过关条件元素
    LevelRequireViewManagement.prototype.createCurrentLevelReq = function () {
        // 获取过关条件元素的数量
        var len = GameData.levelRequireManagement.getLevelRequireNum();
        var el;
        for (var i = 0; i < len; i++) {
            // 循环创建过关条件元素
            if (this.levelRequireElements.length <= i) {
                el = new LevelRequireElementView();
                this.levelRequireElements.push(el);
            }
            else {
                el = this.levelRequireElements[i];
            }
            el.eltype = GameData.levelRequireManagement.levelRequiredElements[i].type;
            el.setTexture("e" + el.eltype + "_png");
            el.x = 43 + (5 + el.width) * i;
            el.y = 95;
            el.num = GameData.levelRequireManagement.levelRequiredElements[i].num;
            this.layer.addChild(el);
        }
        // 设置剩余步数
        if (!this.stepNumText) {
            this.stepNumText = new egret.BitmapText();
            this.stepNumText.font = RES.getRes("number_fnt");
            this.stepNumText.x = GameData.stageW - 95;
            this.stepNumText.y = 90;
            this.stepNumText.scaleX = 1.5;
            this.stepNumText.scaleY = 1.5;
            this.layer.addChild(this.stepNumText);
            this.stepNumText.text = GameData.remainingStep.toString();
        }
    };
    // 判断是否有指定类型
    LevelRequireViewManagement.prototype.haveRequiredType = function (type) {
        var l = GameData.elements.length;
        for (var i = 0; i < l; i++) {
            if (this.levelRequireElements[i].eltype == type) {
                return true;
            }
        }
        return false;
    };
    // 通过类型获取当前过关条件元素在视图中的位置信息
    LevelRequireViewManagement.prototype.getPointByType = function (type) {
        var p = new egret.Point();
        var l = GameData.elements.length;
        for (var i = 0; i < l; i++) {
            if (this.levelRequireElements[i].eltype == type) {
                p.x = this.levelRequireElements[i].x + this.levelRequireElements[i].width / 2;
                p.y = this.levelRequireElements[i].y + this.levelRequireElements[i].height / 2;
            }
        }
        return p;
    };
    // 更新数据
    LevelRequireViewManagement.prototype.update = function () {
        var len = GameData.levelRequireManagement.getLevelRequireNum();
        for (var i = 0; i < len; i++) {
            this.levelRequireElements[i].num = GameData.levelRequireManagement.levelRequiredElements[i].num;
        }
    };
    // 更新步数信息
    LevelRequireViewManagement.prototype.updateStep = function () {
        this.stepNumText.text = GameData.remainingStep.toString();
    };
    return LevelRequireViewManagement;
}());
__reflect(LevelRequireViewManagement.prototype, "LevelRequireViewManagement");
//# sourceMappingURL=LevelRequireViewManagement.js.map