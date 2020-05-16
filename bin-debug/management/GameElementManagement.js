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
 * 游戏元素控制器,负责操作游戏元素的样式与行为
 */
var GameElementManagement = (function (_super) {
    __extends(GameElementManagement, _super);
    function GameElementManagement(container) {
        var _this = _super.call(this) || this;
        // 当前被点击(即将获取焦点)的元素位置,如为-1则表示没有元素获取焦点
        _this.currentTap = -1;
        /*--------------------------动画播放控制----------------------------*/
        // 即将消除的元素数量
        _this.removeNum = 0;
        _this.container = container;
        return _this;
    }
    // 创建地图上所有的游戏元素
    GameElementManagement.prototype.createElements = function () {
        this.container.removeChildren();
        for (var i = 0; i < MapData.maxRow; i++) {
            for (var j = 0; j < MapData.maxCol; j++) {
                // 当前类型
                var type = "";
                var haveSeries = true;
                // 纵向类型
                var ztype = "";
                // 横向类型
                var htype = "";
                if (i > 1 && this.container.getChildAt((i - 1) * MapData.maxRow + j).getType() == this.container.getChildAt((i - 2) * MapData.maxRow + j).getType()) {
                    // 在当前卡片元素上面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
                    ztype = this.container.getChildAt((i - 1) * MapData.maxRow + j).getType();
                }
                if (j > 1 && this.container.getChildAt(i * MapData.maxRow + j - 1).getType() == this.container.getChildAt(i * MapData.maxRow + j - 2).getType()) {
                    // 在当前卡片元素前面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
                    htype = this.container.getChildAt(i * MapData.maxRow + j - 1).getType();
                }
                // 判断是否有三个相连的游戏元素,确保游戏一开始不允许自动消除
                while (haveSeries) {
                    // 循环获取随机类型
                    type = this.getRandomType();
                    if (type != ztype && type != htype) {
                        haveSeries = false;
                    }
                }
                /*-- 到这里为止,元素类型已经确定下来 --*/
                // 创建新的游戏元素
                var index = i * MapData.maxRow + j;
                var element = new GameElement();
                this.container.addChildAt(element, index);
                element.setType(type);
                // 播放出场动画
                element.show(index);
                // 必须等它就位以后才能点击
                element.touchEnabled = true;
                // 必须等到元素出场完毕后再监听事件,每次重新开始游戏的时候都要重新监听
                element.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                //ele.addEventListener(CustomizedEvent.ELIMINATE_OVER,this.onEliminateOver,this);
                //ele.addEventListener(CustomizedEvent.UPDATE_MAP,this.updateMap,this);
                //ele.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
            }
        }
    };
    // 随机生成地图元素的类型
    GameElementManagement.prototype.getRandomType = function () {
        var rand = Math.floor(Math.random() * GameData.GameElementTypes.length);
        return GameData.GameElementTypes[rand];
    };
    // 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑,
    GameElementManagement.prototype.onTouchTap = function (event) {
        // proptype==null表示没有使用道具的情况
        if (PropElementManagement.propType == "") {
            // 获取用户点击的游戏元素
            if (event.currentTarget instanceof GameElement) {
                var element = event.currentTarget;
                // 如果当前地图上没有焦点卡片元素
                if (this.currentTap == -1) {
                    element.focusEffect(true);
                    this.currentTap = element.getIndex();
                }
                else {
                    // 如果currentTapID本来就是当前元素id,那现在相当于当前元素点击了第二次
                    if (element.getIndex() == this.currentTap) {
                        element.focusEffect(false);
                        this.currentTap = -1;
                    }
                    else {
                        var evt = new CustomizedEvent(CustomizedEvent.TAP_TWO_ELEMENT);
                        // 当前点击的那个游戏元素
                        evt.currentTap = this.currentTap;
                        // 另一个游戏元素,而且这个元素处于焦点状态
                        evt.anotherTap = element.getIndex();
                        // 触发点击两个元素事件
                        this.dispatchEvent(evt);
                    }
                }
            }
        }
        // 使用了道具的情况下
        // 道具是这样使用的,先点击道具,然后再消除元素
        /*else{
            if(this.currentTap!=-1){
                this.currentTap = -1;
            }
            let evt:CustomizedEvent = new CustomizedEvent(CustomizedEvent.USE_PROP_CLICK);
            evt.propToElementLocation = (<GameElement>evt.currentTarget).location;
            this.dispatchEvent(evt);
        }*/
    };
    // 判断两个元素是否能交换
    GameElementManagement.prototype.canMove = function (evt) {
        var currentTapRow = Math.floor(evt.currentTap / MapData.maxCol);
        var anotherTapRow = Math.floor(evt.anotherTap / MapData.maxCol);
        var currentTapCol = evt.currentTap % MapData.maxRow;
        var anotherTapCol = evt.anotherTap % MapData.maxRow;
        if ((currentTapRow == anotherTapRow) && (Math.abs(currentTapCol - anotherTapCol) == 1)) {
            return true;
        }
        if ((currentTapCol == anotherTapCol) && (Math.abs(currentTapRow - anotherTapRow) == 1)) {
            return true;
        }
        return false;
    };
    // 改变焦点,将旧焦点取消,设置新对象焦点
    GameElementManagement.prototype.setNewElementFocus = function (evt) {
        this.selector(evt.currentTap).focusEffect(false);
        this.selector(evt.anotherTap).focusEffect(true);
        this.currentTap = evt.anotherTap;
    };
    // 元素选择器
    GameElementManagement.prototype.selector = function (index) {
        for (var i = 0; i < this.container.numChildren; i++) {
            var element = this.container.getChildAt(i);
            if (element.getIndex() == index) {
                return element;
            }
        }
    };
    // 播放一个交换动画,然后两个位置再回来
    GameElementManagement.prototype.swapLocation = function (evt) {
        // 交换元素的时候焦点效果会消失掉
        if (this.currentTap != -1) {
            this.selector(this.currentTap).focusEffect(false);
            this.currentTap = -1;
        }
        // 执行动画
        this.selector(evt.currentTap).moveTo(evt.anotherTap);
        this.selector(evt.anotherTap).moveTo(evt.currentTap);
    };
    // 在交换卡片元素之后,全局判断是否有连线消除
    GameElementManagement.prototype.isHaveSeries = function () {
        this.eliminates = [];
        // 记录当前类型的一个指针
        var currentType = "";
        // 当前检索类型的数量
        var typeNum = 0;
        // 横向循环判断
        for (var i = 0; i < MapData.maxRow; i++) {
            for (var j = 0; j < MapData.maxCol; j++) {
                if (currentType == this.container.getChildAt(i * MapData.maxRow + j).getType()) {
                    typeNum++;
                }
                else {
                    // 如果上一次的检索类型数量大于等于3,把这组可消除元素全部存起来
                    if (typeNum >= 3) {
                        for (var k = 0; k < typeNum; k++) {
                            if (this.eliminates.indexOf(i * MapData.maxRow + j - k - 1) == -1) {
                                this.eliminates.push(i * MapData.maxRow + j - k - 1);
                            }
                        }
                    }
                    // 重置当前类型和检索类型计数器
                    currentType = this.container.getChildAt(i * MapData.maxRow + j).getType();
                    typeNum = 1;
                }
            }
            // 最后行结尾还要再统计一次typeNum
            if (typeNum >= 3) {
                var eliminate = [];
                for (var k = 0; k < typeNum; k++) {
                    if (this.eliminates.indexOf(i * MapData.maxRow + MapData.maxCol - k - 1) == -1) {
                        this.eliminates.push(i * MapData.maxRow + MapData.maxCol - k - 1);
                    }
                }
            }
            // 把当前类型和检索类型计数器纸为空
            currentType = "";
            typeNum = 0;
        }
        // 纵向循环判断,方法同上
        for (var i = 0; i < MapData.maxRow; i++) {
            for (var j = 0; j < MapData.maxCol; j++) {
                if (currentType == this.container.getChildAt(j * MapData.maxCol + i).getType()) {
                    typeNum++;
                }
                else {
                    if (typeNum >= 3) {
                        for (var k = 0; k < typeNum; k++) {
                            if (this.eliminates.indexOf((j - k - 1) * MapData.maxCol + i) == -1) {
                                this.eliminates.push((j - k - 1) * MapData.maxCol + i);
                            }
                        }
                    }
                    currentType = this.container.getChildAt(j * MapData.maxCol + i).getType();
                    typeNum = 1;
                }
                currentType = "";
                typeNum = 0;
            }
            // 列末尾判断
            if (typeNum >= 3) {
                for (var k = 0; k < typeNum; k++) {
                    if (this.eliminates.indexOf((MapData.maxRow - k - 1) * MapData.maxCol + i) == -1) {
                        this.eliminates.push((MapData.maxRow - k - 1) * MapData.maxCol + i);
                    }
                }
            }
            currentType = "";
            typeNum = 0;
        }
        // 返回最终结果
        if (this.eliminates.length > 0) {
            return true;
        }
        return false;
    };
    return GameElementManagement;
}(egret.EventDispatcher));
__reflect(GameElementManagement.prototype, "GameElementManagement");
//# sourceMappingURL=GameElementManagement.js.map