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
 * 条件元素的样式与行为
 */
var RequiredElement = (function (_super) {
    __extends(RequiredElement, _super);
    function RequiredElement() {
        var _this = _super.call(this) || this;
        // 条件元素类型
        _this.type = "";
        _this.touchChildren = false;
        _this.bitmap = new egret.Bitmap();
        _this.addChild(_this.bitmap);
        // 条件元素左右两边间隔
        var gap = 80 * GameData.ratio;
        // 条件元素之间的距离为80像素
        var bitmapWidth = ((GameData.stageW / 2) - gap * 5) / 4;
        _this.bitmap.width = bitmapWidth;
        _this.bitmap.height = bitmapWidth;
        // 这里bittext相对该Sprite定位
        _this.textInfo = new egret.TextField();
        _this.addChild(_this.textInfo);
        _this.textInfo.size = 64 * GameData.ratio;
        _this.textInfo.width = bitmapWidth;
        _this.textInfo.textAlign = egret.HorizontalAlign.CENTER;
        _this.textInfo.y = bitmapWidth - 20;
        _this.textInfo.textColor = 0xFFFFFF;
        _this.textInfo.fontFamily = "方正大黑简体";
        // 最后设置Sprite对象的宽高
        _this.width = _this.bitmap.width;
        _this.height = _this.bitmap.height + _this.textInfo.textHeight / 2;
        return _this;
    }
    return RequiredElement;
}(egret.Sprite));
__reflect(RequiredElement.prototype, "RequiredElement");
//# sourceMappingURL=RequiredElement.js.map