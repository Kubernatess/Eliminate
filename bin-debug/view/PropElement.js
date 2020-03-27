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
 * 道具元素的样式与行为
 */
var PropElement = (function (_super) {
    __extends(PropElement, _super);
    function PropElement() {
        var _this = _super.call(this) || this;
        // 道具类型
        _this.type = "";
        _this.touchEnabled = true;
        _this.bitmap = new egret.Bitmap();
        _this.addChild(_this.bitmap);
        // 条件元素之间的距离为150像素
        var gap = 150 * GameData.ratio;
        var propWidth = (GameData.stageW - gap * 6) / 5;
        _this.bitmap.width = propWidth;
        _this.bitmap.height = propWidth;
        // 位图文本对象的锚点在左上角
        _this.numText = new egret.TextField();
        _this.addChild(_this.numText);
        _this.numText.fontFamily = "方正大黑简体";
        _this.numText.size = 120 * GameData.ratio;
        _this.numText.width = propWidth;
        _this.numText.textAlign = egret.HorizontalAlign.CENTER;
        // 使整个Sprite垂直居中对齐
        _this.width = propWidth;
        _this.height = _this.bitmap.height + _this.numText.height;
        _this.anchorOffsetY = _this.height / 2;
        _this.y = GameData.stageH - GameData.bottomHeight / 2 - 20;
        // 道具元素数量添加到底部
        _this.numText.y = _this.bitmap.height - 40;
        return _this;
    }
    Object.defineProperty(PropElement.prototype, "propType", {
        get: function () {
            return this.type;
        },
        enumerable: true,
        configurable: true
    });
    return PropElement;
}(egret.Sprite));
__reflect(PropElement.prototype, "PropElement");
//# sourceMappingURL=PropElement.js.map