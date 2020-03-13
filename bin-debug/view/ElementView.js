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
 * 卡片元素的样式与动画行为
 */
var ElementView = (function (_super) {
    __extends(ElementView, _super);
    // 游戏中的元素
    function ElementView(tparent) {
        var _this = _super.call(this) || this;
        // 这个location属性用于位置移动,作动画使用
        _this.location = 0;
        // 与GameData.elements[]数组下标相同,用于界面与数据进行绑定
        _this.id = -1;
        // 当前元素是否被用户点击过了
        _this.focus = false;
        // 用作动画的时间,单位为毫秒
        _this.duration = 700;
        _this.thisparent = tparent;
        _this.init();
        return _this;
    }
    ElementView.prototype.getId = function () {
        return this.id;
    };
    ElementView.prototype.setId = function (val) {
        this.id = val;
    };
    // 初始化所有数据
    ElementView.prototype.init = function () {
        // 由于所有的元素都可以被点击,所以开启touchEnabled
        this.touchEnabled = true;
        // 为了节约性能,关闭全部的touchChildren属性,只有当前这个对象看作一个对象被点击
        this.touchChildren = false;
        // 创建位图
        this.bitmap = new egret.Bitmap();
        var bitwidth = (GameData.stageW - 40) / GameData.maxColumn;
        this.bitmap.width = bitwidth - 10;
        this.bitmap.height = bitwidth - 10;
        this.bitmap.x = -1 * bitwidth / 2;
        this.bitmap.y = -1 * bitwidth / 2;
        // 将bitmap添加到ElementView显示列表中,但是还没有贴图纹理
        this.addChild(this.bitmap);
    };
    // 根据类型设置贴图纹理
    ElementView.prototype.setTexture = function (val) {
        this.bitmap.texture = RES.getRes(val);
    };
    ElementView.prototype.getFocus = function () {
        return this.focus;
    };
    // 设置选中状态的焦点样式
    ElementView.prototype.setFocus = function (val) {
        // 先对传递过来的参数与目前的状态进行比对
        if (val != this.focus) {
            this.focus = val;
            // 如果这个MovieClip还没有被创建
            if (!this.focusMovieClip) {
                var texture = RES.getRes("focusmc_png");
                var data = RES.getRes("focusmc_json");
                var mcf = new egret.MovieClipDataFactory(data, texture);
                this.focusMovieClip = new egret.MovieClip(mcf.generateMovieClipData("focusmc"));
                this.focusMovieClip.x = this.focusMovieClip.width / -2;
                this.focusMovieClip.y = this.focusMovieClip.height / -2;
                this.focusMovieClip.width = this.bitmap.width;
                this.focusMovieClip.height = this.bitmap.height;
            }
            // 如果value值为true,则显示焦点MovieClip,并播放这个焦点MovieClip
            if (val) {
                this.addChild(this.focusMovieClip);
                this.focusMovieClip.play(-1);
            }
            else {
                if (this.focusMovieClip.parent) {
                    this.focusMovieClip.stop();
                    this.removeChild(this.focusMovieClip);
                }
            }
        }
    };
    // 当元素被消除,或者其他周围的元素被消除,它需要向下移动
    ElementView.prototype.moveDown = function () {
        var tw = egret.Tween.get(this);
        // 移动到新位置,使用cubicInOut算法移动,直线运动
        tw.to({ x: this.currentX(), y: this.currentY() }, this.duration, egret.Ease.cubicInOut);
    };
    // 当前卡片元素的x值
    ElementView.prototype.currentX = function () {
        var girdwidth = (GameData.stageW - 40) / GameData.maxColumn;
        var X = 20 + girdwidth * (this.location % GameData.maxColumn) + girdwidth / 2 + 5;
        return X;
    };
    // 当前卡片元素的y值
    ElementView.prototype.currentY = function () {
        var girdwidth = (GameData.stageW - 40) / GameData.maxColumn;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.maxColumn;
        var Y = startY + girdwidth * (Math.floor(this.location / GameData.maxColumn)) + girdwidth / 2 + 5;
        return Y;
    };
    // 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
    ElementView.prototype.show = function (wait) {
        var tw = egret.Tween.get(this);
        tw.wait(wait, false);
        tw.call(this.addThisToParent, this);
        tw.to({ x: this.currentX(), y: this.currentY() }, this.duration, egret.Ease.bounceOut);
    };
    // 添加到父级显示对象
    ElementView.prototype.addThisToParent = function () {
        if (!this.parent) {
            this.thisparent.addChild(this);
        }
    };
    // 当用户尝试交换两个元素后,但未能形成连线消除时,将两个元素的位置互换回来
    ElementView.prototype.moveAndBack = function (targetLocation, isscale) {
        if (isscale === void 0) { isscale = false; }
        var girdwidth = (GameData.stageW - 40) / GameData.maxColumn;
        var targetX = 20 + girdwidth * (targetLocation % GameData.maxColumn) + girdwidth / 2 + 5;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.maxColumn;
        var targetY = startY + girdwidth * (Math.floor(targetLocation / GameData.maxColumn)) + girdwidth / 2 + 5;
        // 移动的时候,不仅会移动位置,还会放大或者缩小,移动回来时,scale都设置为1
        var tw = egret.Tween.get(this);
        if (isscale) {
            tw.to({ x: targetX, y: targetY, scaleX: 1.2, scaleY: 1.2 }, 300, egret.Ease.cubicInOut).call(this.back, this);
        }
        else {
            tw.to({ x: targetX, y: targetY, scaleX: 0.8, scaleY: 0.8 }, 300, egret.Ease.cubicInOut).call(this.back, this);
        }
    };
    ElementView.prototype.back = function () {
        var tw = egret.Tween.get(this);
        // 此时回到了原来的(x,y)位置
        tw.to({ x: this.currentX(), y: this.currentY(), scaleX: 1, scaleY: 1 }, 300, egret.Ease.cubicInOut);
    };
    // 当用户尝试交换两个元素后,经过计算后,如果能形成连线消除,那么这两个元素执行互换操作. 注意这里只是成功执行交换元素,但还没有执行消除操作
    // 与上面moveAndBack方法很类似,区别在于最后的(x,y)位置
    ElementView.prototype.moveAndScale = function (targetLocation, isscale) {
        if (isscale === void 0) { isscale = false; }
        var girdwidth = (GameData.stageW - 40) / GameData.maxColumn;
        var targetX = 20 + girdwidth * (targetLocation % GameData.maxColumn) + girdwidth / 2 + 5;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.maxColumn;
        var targetY = startY + girdwidth * (Math.floor(targetLocation / GameData.maxColumn)) + girdwidth / 2 + 5;
        var tw = egret.Tween.get(this);
        if (isscale) {
            tw.to({ x: targetX, y: targetY, scaleX: 1.4, scaleY: 1.4 }, 300, egret.Ease.cubicInOut).call(this.backScale, this);
        }
        else {
            tw.to({ x: targetX, y: targetY, scaleX: 0.6, scaleY: 0.6 }, 300, egret.Ease.cubicInOut).call(this.backScale, this);
        }
    };
    ElementView.prototype.backScale = function () {
        var tw = egret.Tween.get(this);
        // 此时卡片元素在另一个元素的位置上,并没有返回到原来的位置
        tw.to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut).call(this.canEliminate, this);
    };
    // 派发消除动画事件,从显示列表中消除该卡片元素
    ElementView.prototype.canEliminate = function () {
        var evt = new ElementViewManagementEvent(ElementViewManagementEvent.REMOVE_ANIMATION_OVER);
        this.dispatchEvent(evt);
    };
    // 当消除的元素为过关条件元素时才会执行这个动画,消除元素会移动到过关条件位置,然后再从显示列表移除
    // 如果消除的不是过关条件元素,则播放另一个消除动画
    ElementView.prototype.LevelRequireEliminateAnimation = function (tx, ty) {
        var tw = egret.Tween.get(this);
        tw.to({ x: tx, y: ty }, 700, egret.Ease.quadOut).call(this.LevelRequireEliminateAnimationCall, this);
    };
    ElementView.prototype.LevelRequireEliminateAnimationCall = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        var evt = new ElementViewManagementEvent(ElementViewManagementEvent.UPDATE_MAP);
        this.dispatchEvent(evt);
    };
    // 消除元素,当元素不属于关卡条件时,执行此动画. 消除元素先缩放一下,然后再从显示列表移除
    // 这个优势卡片元素消除效果的动画,但是与playCurveMove使用场景不一样,而且playCurveMove消除元素时没有缩放效果
    ElementView.prototype.EliminateAnimation = function () {
        var tw = egret.Tween.get(this);
        tw.to({ scaleX: 1.4, scaleY: 1.4 }, 300, egret.Ease.cubicInOut).to({ scaleX: 0.1, scaleY: 0.1 }, 300, egret.Ease.cubicInOut).call(this.eliminateAnimationCall, this);
    };
    ElementView.prototype.eliminateAnimationCall = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        var evt = new ElementViewManagementEvent(ElementViewManagementEvent.UPDATE_MAP);
        this.dispatchEvent(evt);
    };
    // 移动到新位置,方块被消除后重新生成下落使用
    // 根据列编号,重新计算元素X轴位置,从其Y轴开始播放下落动画
    ElementView.prototype.moveNewLocation = function () {
        if (!this.parent) {
            var girdwidth = (GameData.stageW - 40) / GameData.maxColumn;
            var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.maxColumn;
            this.y = startY - this.width;
            this.scaleX = 1;
            this.scaleY = 1;
            this.x = this.currentX();
            this.thisparent.addChild(this);
        }
        var tw = egret.Tween.get(this);
        tw.to({ x: this.currentX(), y: this.currentY() }, this.duration, egret.Ease.bounceOut).call(this.moveNewLocationOver, this);
    };
    ElementView.prototype.moveNewLocationOver = function () {
        var evt = new ElementViewManagementEvent(ElementViewManagementEvent.UPDATE_VIEW_OVER);
        this.dispatchEvent(evt);
    };
    return ElementView;
}(egret.Sprite));
__reflect(ElementView.prototype, "ElementView");
//# sourceMappingURL=ElementView.js.map