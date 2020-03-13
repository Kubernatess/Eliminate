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
var PropView = (function (_super) {
    __extends(PropView, _super);
    function PropView(type) {
        var _this = _super.call(this) || this;
        // 道具类型
        _this._type = -1;
        _this.id = -1;
        // 数量
        _this._num = 0;
        _this._type = type;
        _this.init();
        return _this;
    }
    Object.defineProperty(PropView.prototype, "proptype", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    PropView.prototype.init = function () {
        this.createView();
        this.createNumText();
        this.addChild(this._view_activate);
        this.addChild(this._view_box);
        this.addChild(this._numText);
        this.setActivateState(true);
    };
    PropView.prototype.createNumText = function () {
        this._numText = new egret.BitmapText();
        this._numText.font = RES.getRes("number_fnt");
        this._numText.x = this._view_activate.width - 31;
    };
    PropView.prototype.createView = function () {
        var _interval = 15;
        var _width = (GameData.stageW - _interval * 6) / 5;
        if (!this._view_activate) {
            this._view_activate = new egret.Bitmap();
            this._view_activate.texture = RES.getRes(this.getActivateTexture(this._type));
            this._view_activate.width = _width;
            this._view_activate.height = _width;
        }
        // 类似于小盒,可以把道具元素放在里面
        if (!this._view_box) {
            this._view_box = new egret.Bitmap();
            this._view_box.texture = RES.getRes("propbox_png");
            this._view_box.width = this._view_activate.width + 10;
            this._view_box.height = this._view_activate.height + 10;
            this._view_box.x = -5;
            this._view_box.y = -5;
        }
    };
    Object.defineProperty(PropView.prototype, "num", {
        get: function () {
            return this._num;
        },
        set: function (val) {
            this._num = val;
            this._numText.text = val.toString();
            if (val <= 0) {
                this.setActivateState(false);
            }
            else {
                this.setActivateState(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    PropView.prototype.setActivateState = function (val) {
        this.touchEnabled = val;
        if (val) {
            this._view_activate.texture = RES.getRes(this.getActivateTexture(this._type));
            this._view_box.texture = RES.getRes("propbox_png");
            this._numText.font = RES.getRes("number_fnt");
        }
        else {
            this._view_activate.texture = RES.getRes(this.getDisableTexture(this._type));
            this._view_box.texture = RES.getRes("propboxdisable_png");
            this._numText.font = RES.getRes("numberdisable_fnt");
        }
    };
    // 获取道具元素激活状态的纹理
    PropView.prototype.getActivateTexture = function (type) {
        var texturename = "";
        switch (type) {
            case 0:
                texturename = "tongse_png";
                break;
            case 1:
                texturename = "zhadan_png";
                break;
            case 2:
                texturename = "zhenghang_png";
                break;
            case 3:
                texturename = "zhenglie_png";
                break;
            case 4:
                texturename = "danzhi_png";
                break;
        }
        return texturename;
    };
    // 获取道具元素禁用状态的纹理
    PropView.prototype.getDisableTexture = function (type) {
        var texturename = "";
        switch (type) {
            case 0:
                texturename = "tongsedisable_png";
                break;
            case 1:
                texturename = "zhadandisable_png";
                break;
            case 2:
                texturename = "zhenghangdisable_png";
                break;
            case 3:
                texturename = "zhengliedisable_png";
                break;
            case 4:
                texturename = "danzhidisable_png";
                break;
        }
        return texturename;
    };
    // 设置焦点状态的纹理
    PropView.prototype.setFocus = function (val) {
        if (val) {
            this._view_box.texture = RES.getRes("propboxactive_png");
        }
        else {
            this._view_box.texture = RES.getRes("propbox_png");
        }
    };
    return PropView;
}(egret.Sprite));
__reflect(PropView.prototype, "PropView");
//# sourceMappingURL=PropView.js.map