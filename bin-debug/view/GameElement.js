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
        // 游戏元素类型
        _this.type = "";
        // 注意游戏元素本身也有x,y坐标. 而location只是地图上的一个位置
        _this.location = 0;
        // 地图格子的宽度
        _this.gridwidth = 0;
        _this.startY = 0;
        // 地图左右两边间隔
        _this.gap = 200 * GameData.ratio;
        // 当前元素是否被用户点击过了
        _this.isfocus = false;
        // 用作动画的时间,单位为毫秒
        _this.duration = 700;
        _this.touchEnabled = false;
        // 为了节约性能,关闭全部的touchChildren属性
        _this.touchChildren = false;
        _this.bitmap = new egret.Bitmap();
        _this.addChild(_this.bitmap);
        // 格子宽度和高度一样
        _this.gridwidth = (GameData.stageW - _this.gap * 2) / GameData.maxColumn;
        // Y轴坐标从最上向下
        // 整个地图区域定位在正中心
        _this.startY = (GameData.stageH - _this.gridwidth * GameData.maxColumn) / 2;
        /* 游戏元素之间的间隔为12像素 */
        _this.width = _this.gridwidth - 12 * GameData.ratio * 2;
        _this.height = _this.gridwidth - 12 * GameData.ratio * 2;
        // 为了方便计算,必须要设置一下锚点
        _this.anchorOffsetX = _this.width / 2;
        _this.anchorOffsetY = _this.height / 2;
        // bitmap也设置相同的大小
        _this.bitmap.width = _this.width;
        _this.bitmap.height = _this.height;
        return _this;
    }
    GameElement.prototype.getfocus = function () {
        return this.isfocus;
    };
    // 设置选中状态的焦点样式
    GameElement.prototype.focusEffect = function (val) {
        // 先对传递过来的参数与目前的状态进行比对
        if (val != this.isfocus) {
            this.isfocus = val;
            // 如果这个MovieClip还没有被创建
            if (!this.focusMovieClip) {
                /* 这里需要调整 */
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
    GameElement.prototype.moveDown = function () {
        var tw = egret.Tween.get(this);
        // 移动到新位置,使用cubicInOut算法移动,直线运动
        tw.to({ x: this.gridX(), y: this.gridY() }, this.duration, egret.Ease.cubicInOut);
    };
    // 这个x值是根据地图位置求出的,注意与游戏元素本身的x,y坐标区分
    GameElement.prototype.gridX = function () {
        // X轴坐标从最左到右
        var X = this.gap + this.gridwidth * (this.location % GameData.maxRow) + this.gridwidth / 2;
        return X;
    };
    // 这个y值是根据地图位置求出的,注意与游戏元素本身的x,y坐标区分
    GameElement.prototype.gridY = function () {
        var Y = this.startY + this.gridwidth * (Math.floor(this.location / GameData.maxColumn)) + this.gridwidth / 2;
        return Y;
    };
    // 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
    GameElement.prototype.show = function (delay) {
        // 游戏元素下落的起点
        this.x = this.gridX();
        this.y = this.startY - this.width;
        var tw = egret.Tween.get(this);
        tw.wait(delay, false);
        tw.to({ y: this.gridY() }, this.duration, egret.Ease.bounceOut);
    };
    // 当用户尝试交换两个元素后,但未能形成连线消除时,将两个元素的位置互换回来
    GameElement.prototype.moveAndBack = function (targetLocation, isScale) {
        if (isScale === void 0) { isScale = false; }
        var gridwidth = (GameData.stageW - 200 * 2) / GameData.maxColumn;
        var targetX = 200 + gridwidth * (targetLocation % GameData.maxRow) + gridwidth / 2 + 12;
        var startY = (GameData.stageH - gridwidth * GameData.maxColumn) / 2;
        var targetY = startY + gridwidth * (Math.floor(targetLocation / GameData.maxColumn)) + gridwidth / 2 + 12;
        // 移动的时候,不仅会移动位置,还会放大或者缩小,移动回来时,scale都设置为1
        var tw = egret.Tween.get(this);
        if (isScale) {
            tw.to({ x: targetX, y: targetY, scaleX: 1.2, scaleY: 1.2 }, 300, egret.Ease.cubicInOut).call(this.back, this);
        }
        else {
            tw.to({ x: targetX, y: targetY, scaleX: 0.8, scaleY: 0.8 }, 300, egret.Ease.cubicInOut).call(this.back, this);
        }
    };
    GameElement.prototype.back = function () {
        var tw = egret.Tween.get(this);
        // 此时回到了原来的(x,y)位置
        tw.to({ x: this.gridX(), y: this.gridY(), scaleX: 1, scaleY: 1 }, 300, egret.Ease.cubicInOut);
    };
    // 当用户尝试交换两个元素后,经过计算后,如果能形成连线消除,那么这两个元素执行互换操作. 注意这里只是成功执行交换元素,但还没有执行消除操作
    // 与上面moveAndBack方法很类似,区别在于最后的(x,y)位置
    GameElement.prototype.moveAndScale = function (targetLocation, isscale) {
        if (isscale === void 0) { isscale = false; }
        var gridwidth = (GameData.stageW - this.gap * 2) / GameData.maxColumn;
        var targetX = this.gap + gridwidth * (targetLocation % GameData.maxColumn) + gridwidth / 2 + 12;
        var startY = (GameData.stageH - gridwidth * GameData.maxColumn) / 2;
        var targetY = startY + gridwidth * (Math.floor(targetLocation / GameData.maxColumn)) + gridwidth / 2 + 12;
        var tw = egret.Tween.get(this);
        if (isscale) {
            tw.to({ x: targetX, y: targetY, scaleX: 1.4, scaleY: 1.4 }, 300, egret.Ease.cubicInOut).call(this.backScale, this);
        }
        else {
            tw.to({ x: targetX, y: targetY, scaleX: 0.6, scaleY: 0.6 }, 300, egret.Ease.cubicInOut).call(this.backScale, this);
        }
    };
    GameElement.prototype.backScale = function () {
        var tw = egret.Tween.get(this);
        // 此时游戏元素在另一个元素的位置上,并没有返回到原来的位置
        tw.to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut).call(this.doRemove, this);
    };
    // 派发消除动画事件,从显示列表中消除该游戏元素
    GameElement.prototype.doRemove = function () {
        var event = new CustomizedEvent(CustomizedEvent.ELIMINATE_OVER);
        this.dispatchEvent(event);
    };
    // 当消除的元素为条件元素时才会执行这个动画,消除元素会移动到过关条件位置,然后再从显示列表移除
    // 如果消除的不是条件元素,则播放另一个消除动画
    GameElement.prototype.moveToRequiredElement = function (targetX, targetY) {
        var tw = egret.Tween.get(this);
        tw.to({ x: targetX, y: targetY }, 700, egret.Ease.quadOut).call(this.updateMap, this);
    };
    GameElement.prototype.updateMap = function () {
        // 只有当游戏元素在地图上才能执行删除操作
        if (this.parent) {
            this.parent.removeChild(this);
        }
        var event = new CustomizedEvent(CustomizedEvent.UPDATE_MAP);
        this.dispatchEvent(event);
    };
    // 消除元素,当元素不属于关卡条件时,执行此动画. 消除元素先缩放一下,然后再从显示列表移除
    // 这个优势卡片元素消除效果的动画,但是与playCurveMove使用场景不一样,而且playCurveMove消除元素时没有缩放效果
    GameElement.prototype.scaleAndRemove = function () {
        var tw = egret.Tween.get(this);
        tw.to({ scaleX: 1.4, scaleY: 1.4 }, 300, egret.Ease.cubicInOut).to({ scaleX: 0.1, scaleY: 0.1 }, 300, egret.Ease.cubicInOut).call(this.updateMap, this);
    };
    // 游戏元素被消除后,重新生成从地图上方掉落
    GameElement.prototype.dropDown = function () {
        // 只有当游戏元素还没添加到地图上,才能执行新添加的操作
        if (!this.parent) {
            var gridwidth = (GameData.stageW - 200 * 2) / GameData.maxColumn;
            var startY = (GameData.stageH - gridwidth * GameData.maxColumn) / 2;
            this.y = startY - this.width;
            this.scaleX = 1;
            this.scaleY = 1;
            this.x = this.gridX();
            //this.layer.addChild(this);
        }
        var tw = egret.Tween.get(this);
        tw.to({ x: this.gridX(), y: this.gridY() }, this.duration, egret.Ease.bounceOut).call(this.updateView, this);
    };
    GameElement.prototype.updateView = function () {
        var event = new CustomizedEvent(CustomizedEvent.UPDATE_VIEW_OVER);
        this.dispatchEvent(event);
    };
    return GameElement;
}(egret.Sprite));
__reflect(GameElement.prototype, "GameElement");
//# sourceMappingURL=GameElement.js.map