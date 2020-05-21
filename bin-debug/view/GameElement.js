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
 * 地图元素的样式与动画行为
 */
var GameElement = (function (_super) {
    __extends(GameElement, _super);
    function GameElement() {
        var _this = _super.call(this) || this;
        _this.type = "";
        // 游戏元素之间的间隔
        var gap = 12 * GameData.ratio;
        _this.touchEnabled = false;
        // 为了节约性能,关闭全部的touchChildren属性
        _this.touchChildren = false;
        _this.bitmap = new egret.Bitmap();
        _this.addChild(_this.bitmap);
        /* 游戏元素之间的间隔为12像素 */
        _this.width = MapData.gridwidth - gap * 2;
        _this.height = MapData.gridwidth - gap * 2;
        // 为了方便计算,必须要设置一下锚点
        _this.anchorOffsetX = _this.width / 2;
        _this.anchorOffsetY = _this.height / 2;
        // bitmap也设置相同的大小
        _this.bitmap.width = _this.width;
        _this.bitmap.height = _this.height;
        var texture = RES.getRes("newParticle_png");
        var config = RES.getRes("newParticle_json");
        _this.system = new particle.GravityParticleSystem(texture, config);
        return _this;
    }
    GameElement.prototype.getType = function () {
        return this.type;
    };
    GameElement.prototype.setType = function (type) {
        this.type = type;
        this.bitmap.texture = RES.getRes(type + "_png");
    };
    // 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
    GameElement.prototype.show = function (target) {
        // 游戏元素下落的起点
        this.x = MapData.gap + MapData.gridwidth * (target % MapData.maxRow) + MapData.gridwidth / 2;
        this.y = MapData.startY - this.width;
        var tw = egret.Tween.get(this);
        tw.wait(50 * (MapData.maxRow * MapData.maxCol - target), false);
        var gridY = MapData.startY + MapData.gridwidth * (Math.floor(target / MapData.maxCol)) + MapData.gridwidth / 2;
        tw.to({ y: gridY }, 700, egret.Ease.bounceOut);
    };
    GameElement.prototype.focusEffect = function (val) {
        // 如果value值为true,则显示焦点粒子动画,并播放这个焦点粒子动画
        if (val) {
            this.addChild(this.system);
            this.system.emitterX = this.width / 2;
            this.system.emitterY = this.height;
            this.system.start();
        }
        else {
            if (this.contains(this.system)) {
                this.system.stop();
                this.removeChild(this.system);
            }
        }
    };
    GameElement.prototype.moveTo = function (target) {
        var targetX = MapData.gap + MapData.gridwidth * (target % MapData.maxRow) + MapData.gridwidth / 2;
        var targetY = MapData.startY + MapData.gridwidth * (Math.floor(target / MapData.maxCol)) + MapData.gridwidth / 2;
        var tw = egret.Tween.get(this);
        tw.to({ x: targetX, y: targetY }, 300, egret.Ease.cubicInOut).call(this.moveToAniOver, this);
    };
    GameElement.prototype.moveToAniOver = function () {
        var event = new CustomizedEvent(CustomizedEvent.SWAP_ELEMENT);
        this.dispatchEvent(event);
    };
    // 当消除的元素为条件元素时才会执行这个动画,消除元素会移动到过关条件位置,然后再从显示列表移除
    // 如果消除的不是条件元素,则播放另一个消除动画
    GameElement.prototype.moveToRequiredElement = function (p) {
        var tw = egret.Tween.get(this);
        tw.to({ x: p.x, y: p.y }, 700, egret.Ease.quadOut).call(this.eliminateOver, this);
    };
    GameElement.prototype.eliminateOver = function () {
        // 并没有真正的删除游戏元素,只是隐藏了它的贴图纹理
        if (this.parent.contains(this)) {
            this.setType("");
        }
        var evt = new CustomizedEvent(CustomizedEvent.ELIMINATE_OVER);
        this.dispatchEvent(evt);
    };
    // 消除元素,当元素不属于关卡条件时,执行此动画. 消除元素先缩放一下,然后再从显示列表移除
    // 这个优势卡片元素消除效果的动画,但是与playCurveMove使用场景不一样,而且playCurveMove消除元素时没有缩放效果
    GameElement.prototype.scaleAndRemove = function () {
        var tw = egret.Tween.get(this);
        tw.to({ scaleX: 1.4, scaleY: 1.4 }, 300, egret.Ease.cubicInOut).to({ scaleX: 0.1, scaleY: 0.1 }, 300, egret.Ease.cubicInOut).call(this.eliminateOver, this);
    };
    // 当元素被消除,或者其他周围的元素被消除,它需要向下移动
    GameElement.prototype.moveDown = function (target) {
        var targetY = MapData.startY + MapData.gridwidth * (Math.floor(target / MapData.maxCol)) + MapData.gridwidth / 2;
        var tw = egret.Tween.get(this);
        tw.to({ y: targetY }, 300, egret.Ease.cubicInOut).call(this.dropDownOver, this);
    };
    // 游戏元素被消除后,重新生成从地图上方掉落
    GameElement.prototype.dropDown = function (target) {
        // 只有当游戏元素还没添加到地图上,才能执行新添加的操作
        var targetX = MapData.gap + MapData.gridwidth * (target % MapData.maxRow) + MapData.gridwidth / 2;
        var targetY = MapData.startY + MapData.gridwidth * (Math.floor(target / MapData.maxCol)) + MapData.gridwidth / 2;
        this.x = targetX;
        this.y = MapData.startY - this.width;
        this.scaleX = 1;
        this.scaleY = 1;
        var tw = egret.Tween.get(this);
        tw.to({ y: targetY }, 700, egret.Ease.bounceOut).call(this.dropDownOver, this);
    };
    GameElement.prototype.dropDownOver = function () {
        var event = new CustomizedEvent(CustomizedEvent.AUTO_ELIMINATE);
        this.dispatchEvent(event);
    };
    return GameElement;
}(egret.Sprite));
__reflect(GameElement.prototype, "GameElement");
//# sourceMappingURL=GameElement.js.map