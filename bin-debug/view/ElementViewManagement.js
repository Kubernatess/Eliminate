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
 * 消除元素控制器,负责操作卡片元素的样式与行为
 */
var ElementViewManagement = (function (_super) {
    __extends(ElementViewManagement, _super);
    function ElementViewManagement(elementLayer) {
        var _this = _super.call(this) || this;
        // 当前被点击(即将获取焦点)的元素ID,如为-1则表示没有元素获取焦点
        _this.currentTapID = -1;
        /*--------------------------动画播放控制----------------------------*/
        // 即将消除的元素数量
        _this.removenum = 0;
        // 即将消除元素的数量
        _this.moveeleNum = 0;
        _this.moveLocElementNum = 0;
        _this.layer = elementLayer;
        _this.init();
        return _this;
    }
    // 初始化所有的ElementView
    ElementViewManagement.prototype.init = function () {
        this.elementViews = new Array();
        var l = GameData.maxRow * GameData.maxColumn;
        var el;
        for (var i = 0; i < l; i++) {
            el = new ElementView(this.layer);
            el.id = i;
            el.location = GameData.elements[i].location;
            this.elementViews.push(el);
            // 
            el.addEventListener(ElementViewManagementEvent.REMOVE_ANIMATION_OVER, this.removeAniOver, this);
            // 当卡片元素被点击时响应事件
            el.addEventListener(egret.TouchEvent.TOUCH_TAP, this.elTap, this);
            el.addEventListener(ElementViewManagementEvent.UPDATE_MAP, this.updateMap, this);
            el.addEventListener(ElementViewManagementEvent.UPDATE_VIEW_OVER, this.moveNewLocationOver, this);
        }
    };
    // 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑,
    ElementViewManagement.prototype.elTap = function (evt) {
        // proptype=-1表示没有使用道具的情况
        if (PropViewManagement.proptype == -1) {
            // 获取用户点击的卡片元素
            if (evt.currentTarget instanceof ElementView) {
                var ev = evt.currentTarget;
                if (this.currentTapID != -1) {
                    // 如果currentTapID本来就是当前元素id,那现在相当于当前元素点击了第二次
                    // 第一次点击元素设置卡片样式,第二次恢复默认样式
                    if (ev.id == this.currentTapID) {
                        ev.setFocus(false);
                        this.currentTapID = -1;
                    }
                    else {
                        var event_1 = new ElementViewManagementEvent(ElementViewManagementEvent.TAP_TWO_ELEMENT);
                        // 另一个卡片元素,而且这个元素处于焦点状态
                        event_1.elementA = this.currentTapID;
                        // 当前点击的那个卡片元素
                        event_1.elementB = ev.id;
                        this.dispatchEvent(event_1);
                    }
                }
                else {
                    ev.setFocus(true);
                    this.currentTapID = ev.id;
                }
            }
        }
        else {
            // 点击道具元素,相当于点击了地图之外的位置,这时候取消焦点元素
            if (this.currentTapID != -1) {
                this.currentTapID = -1;
            }
            var evts = new ElementViewManagementEvent(ElementViewManagementEvent.USE_PROP_CLICK);
            evts.propToElementLocation = evt.currentTarget.location;
            this.dispatchEvent(evts);
        }
    };
    // 改变焦点,将旧焦点取消,设置新对象焦点
    ElementViewManagement.prototype.setNewElementFocus = function (location) {
        this.elementViews[this.currentTapID].setFocus(false);
        this.elementViews[location].setFocus(true);
        this.currentTapID = location;
    };
    // 播放一个交换动画,然后两个位置再回来
    ElementViewManagement.prototype.changeLocationAndBack = function (id1, id2) {
        if (this.elementViews[id1].focus) {
            // 交换元素的时候焦点效果会消失掉
            this.elementViews[id1].setFocus(false);
            // 现在elementViews[id1]是被选中的元素,交换的时候,必须要保证elementViews[id1]的Z轴在另一个元素之上
            if (this.layer.getChildIndex(this.elementViews[id1]) < this.layer.getChildIndex(this.elementViews[id2])) {
                this.layer.swapChildren(this.elementViews[id1], this.elementViews[id2]);
            }
            // moveAndBack第二个参数设置为true,因为当选中了第一个卡片元素,然后跟第二个元素互换的时候,第一个元素通过放大大小,交换的时候就可以盖在第二个元素上面
            this.elementViews[id1].moveAndBack(this.elementViews[id2].location, true);
            this.elementViews[id2].moveAndBack(this.elementViews[id1].location);
        }
        else if (this.elementViews[id2].focus) {
            this.elementViews[id2].setFocus(false);
            if (this.layer.getChildIndex(this.elementViews[id1]) > this.layer.getChildIndex(this.elementViews[id2])) {
                this.layer.swapChildren(this.elementViews[id1], this.elementViews[id2]);
            }
            this.elementViews[id1].moveAndBack(this.elementViews[id2].location);
            this.elementViews[id2].moveAndBack(this.elementViews[id1].location, true);
        }
        // 交换元素的时候焦点效果会消失掉
        this.currentTapID = -1;
    };
    // 播放一个交换动画,然后两个位置不再回来,注意这时候两个元素只是执行了互换操作,但还没有真正执行消除操作
    ElementViewManagement.prototype.changeLocationAndScale = function (id1, id2) {
        if (this.elementViews[id1].focus) {
            this.elementViews[id1].setFocus(false);
            if (this.layer.getChildIndex(this.elementViews[id1]) < this.layer.getChildIndex(this.elementViews[id2])) {
                this.layer.swapChildren(this.elementViews[id1], this.elementViews[id2]);
            }
            this.elementViews[id1].moveAndScale(this.elementViews[id2].location, true);
            this.elementViews[id2].moveAndScale(this.elementViews[id1].location);
        }
        else if (this.elementViews[id2].focus) {
            this.elementViews[id2].setFocus(false);
            if (this.layer.getChildIndex(this.elementViews[id1]) > this.layer.getChildIndex(this.elementViews[id2])) {
                this.layer.swapChildren(this.elementViews[id1], this.elementViews[id2]);
            }
            this.elementViews[id1].moveAndScale(this.elementViews[id2].location);
            this.elementViews[id2].moveAndScale(this.elementViews[id1].location, true);
        }
        this.currentTapID = -1;
    };
    // 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
    ElementViewManagement.prototype.showAllElement = function () {
        this.layer.removeChildren();
        var girdWidth = (GameData.stageW - 40) / GameData.maxColumn;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdWidth * GameData.maxColumn;
        var ele;
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                if (GameData.mapData[i][j] != -1) {
                    ele = this.elementViews[GameData.mapData[i][j]];
                    ele.setTexture("e" + GameData.elements[GameData.mapData[i][j]].type + "_png");
                    ele.x = ele.currentX();
                    ele.y = startY - ele.width;
                    ele.show((50 * GameData.maxColumn * GameData.maxRow - 50 * GameData.unmapnum) - (i * GameData.maxRow + j));
                }
            }
        }
    };
    // 消除动画播放结束后,调用这个函数
    // 因为每个元素被消除时,会有先后顺序的,所以要作一个数量标记
    ElementViewManagement.prototype.removeAniOver = function (evt) {
        this.removenum++;
        if (this.removenum == 2) {
            this.removenum = 0;
            this.dispatchEvent(evt);
        }
    };
    // 播放曲线动画,用于消除过关条件元素的情况下. 同上,也要作数量标记
    ElementViewManagement.prototype.playLevelRequireEliminateAnimation = function (id, tx, ty) {
        this.moveeleNum++;
        var el = this.elementViews[id];
        if (el.parent) {
            // 将过关条件元素放置于最顶层
            this.layer.setChildIndex(el, this.layer.numChildren);
        }
        el.LevelRequireEliminateAnimation(tx, ty);
    };
    // 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
    ElementViewManagement.prototype.playEliminateAnimation = function (id) {
        this.moveeleNum++;
        var el = this.elementViews[id];
        if (el.parent) {
            this.layer.setChildIndex(el, this.layer.numChildren);
        }
        el.EliminateAnimation();
    };
    // 消除动画完成,现在更新地图元素
    ElementViewManagement.prototype.updateMap = function (evt) {
        this.moveeleNum--;
        if (this.moveeleNum == 0) {
            // 消除动画全部播放完毕,然后派发一个结束的时间
            this.dispatchEvent(evt);
        }
    };
    // 重新布局,更新整个地图中元素位置
    ElementViewManagement.prototype.updateMapData = function () {
        var len = this.elementViews.length;
        this.moveLocElementNum = 0;
        for (var i = 0; i < len; i++) {
            this.elementViews[i].location = GameData.elements[i].location;
            this.elementViews[i].setTexture("e" + GameData.elements[i].type + "_png");
            this.elementViews[i].moveNewLocation();
        }
    };
    // 新位置掉落结束
    ElementViewManagement.prototype.moveNewLocationOver = function (event) {
        this.moveLocElementNum++;
        if (this.moveLocElementNum == (GameData.maxRow * GameData.maxColumn)) {
            var evt = new ElementViewManagementEvent(ElementViewManagementEvent.UPDATE_VIEW_OVER);
            this.dispatchEvent(evt);
        }
    };
    // 当游戏没有元素可以再消除的时候,需要打乱所有元素,移动全部元素位置
    ElementViewManagement.prototype.updateOrder = function () {
        var len = this.elementViews.length;
        egret.Tween.removeAllTweens();
        for (var i = 0; i < len; i++) {
            this.elementViews[i].location = GameData.elements[i].location;
            this.elementViews[i].moveDown();
        }
    };
    return ElementViewManagement;
}(egret.EventDispatcher));
__reflect(ElementViewManagement.prototype, "ElementViewManagement");
//# sourceMappingURL=ElementViewManagement.js.map