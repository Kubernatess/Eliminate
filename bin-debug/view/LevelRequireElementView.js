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
 * 过关条件元素的样式与行为
 */
var LevelRequireElementView = (function (_super) {
    __extends(LevelRequireElementView, _super);
    function LevelRequireElementView() {
        var _this = _super.call(this) || this;
        // 过关条件元素类型
        _this.eltype = "";
        _this.init();
        return _this;
    }
    Object.defineProperty(LevelRequireElementView.prototype, "num", {
        get: function () {
            return Number(this.bittext.text);
        },
        // num指的是元素上面所显示的数字
        set: function (val) {
            // 已经过关条件元素消除完了,则显示对号
            if (val <= 0) {
                if (!this.checkmarkbit) {
                    this.checkmarkbit = new egret.Bitmap();
                    this.checkmarkbit.texture = RES.getRes("checkmark_png");
                    this.checkmarkbit.x = (this.bitmap.width - this.checkmarkbit.width) / 2;
                    this.checkmarkbit.y = this.bitmap.height + this.bitmap.y - this.checkmarkbit.height;
                    this.addChild(this.checkmarkbit);
                    this.removeChild(this.bittext);
                }
            }
            else {
                this.bittext.text = val.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    LevelRequireElementView.prototype.init = function () {
        this.touchChildren = false;
        if (!this.bitmap) {
            this.bitmap = new egret.Bitmap();
        }
        var bitwidth = (GameData.stageW - 40) / GameData.maxColumn;
        this.bitmap.width = bitwidth;
        this.bitmap.height = bitwidth;
        this.addChild(this.bitmap);
        this.bittext = new egret.BitmapText();
        this.bittext.font = RES.getRes("number_fnt");
        this.bittext.text = "0";
        this.bittext.x = (bitwidth - this.bittext.width) / 2;
        this.bittext.y = this.bitmap.height + this.bitmap.y - this.bittext.height / 2;
        this.addChild(this.bittext);
    };
    // 根据过关条件元素类型设置纹理贴图
    LevelRequireElementView.prototype.setTexture = function (val) {
        this.bitmap.texture = RES.getRes(val);
    };
    return LevelRequireElementView;
}(egret.Sprite));
__reflect(LevelRequireElementView.prototype, "LevelRequireElementView");
//# sourceMappingURL=LevelRequireElementView.js.map