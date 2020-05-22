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
        _this.swapElementNum = 0;
        // 用于消除过关条件元素. 同上,也要作数量标记
        _this.eliminateNum = 0;
        // 新位置掉落结束
        _this.moveLocElementNum = 0;
        _this.container = container;
        return _this;
    }
    // 创建地图上所有的游戏元素
    GameElementManagement.prototype.createElements = function () {
        this.container.removeChildren();
        var len = MapData.maxRow * MapData.maxCol;
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
                var element = new GameElement();
                var index = i * MapData.maxRow + j;
                this.container.addChildAt(element, index);
                element.setType(type);
                // 播放出场动画
                element.show(index);
                // 必须等它就位以后才能点击
                element.touchEnabled = true;
                // 必须等到元素出场完毕后再监听事件,每次重新开始游戏的时候都要重新监听
                element.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                element.addEventListener(CustomizedEvent.SWAP_ELEMENT, this.swapElementHandler, this);
                element.addEventListener(CustomizedEvent.ELIMINATE_OVER, this.onEliminateOver, this);
                element.addEventListener(CustomizedEvent.AUTO_ELIMINATE, this.autoEliminate, this);
                //ele.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
            }
        }
        // 如果没有可消除元素,则需要打乱地图顺序
        if (!this.isHaveSeries()) {
            this.disOrder();
        }
    };
    GameElementManagement.prototype.getRandomType = function () {
        var rand = Math.floor(Math.random() * GameData.GameElementTypes.length);
        return GameData.GameElementTypes[rand];
    };
    // 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑
    GameElementManagement.prototype.onTouchTap = function (event) {
        // 没有使用道具的情况
        if (PropElementManagement.propType == "") {
            // 获取用户点击的游戏元素
            var element = event.currentTarget;
            // 如果当前地图上没有焦点卡片元素
            if (CustomizedEvent.currentTap == -1) {
                element.focusEffect(true);
                CustomizedEvent.currentTap = this.container.getChildIndex(element);
            }
            else {
                // 如果currentTapID本来就是当前元素id,那现在相当于当前元素点击了第二次
                if (CustomizedEvent.currentTap == this.container.getChildIndex(element)) {
                    element.focusEffect(false);
                    CustomizedEvent.currentTap = -1;
                }
                else {
                    CustomizedEvent.anotherTap = this.container.getChildIndex(element);
                    var evt = new CustomizedEvent(CustomizedEvent.TAP_TWO_ELEMENT);
                    this.dispatchEvent(evt);
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
    GameElementManagement.prototype.canMove = function () {
        var row1 = Math.floor(CustomizedEvent.currentTap / MapData.maxCol);
        var row2 = Math.floor(CustomizedEvent.anotherTap / MapData.maxCol);
        var col1 = CustomizedEvent.currentTap % MapData.maxRow;
        var col2 = CustomizedEvent.anotherTap % MapData.maxRow;
        if (row1 == row2 && Math.abs(col1 - col2) == 1) {
            return true;
        }
        if (col1 == col2 && Math.abs(row1 - row2) == 1) {
            return true;
        }
        return false;
    };
    GameElementManagement.prototype.playSwapElement = function () {
        this.container.getChildAt(CustomizedEvent.currentTap).moveTo(CustomizedEvent.anotherTap);
        this.container.getChildAt(CustomizedEvent.anotherTap).moveTo(CustomizedEvent.currentTap);
    };
    GameElementManagement.prototype.swapElementHandler = function (evt) {
        this.swapElementNum++;
        if (this.swapElementNum == 2) {
            this.swapElementNum = 0;
            this.dispatchEvent(evt);
        }
    };
    // 收集所有的消除元素
    GameElementManagement.prototype.collectEliminates = function () {
        this.eliminates = [];
        // 横向循环判断
        for (var i = 0; i < MapData.maxRow; i++) {
            var currentType = "";
            var typeNum = 0;
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
        }
        // 纵向循环判断,方法同上
        for (var i = 0; i < MapData.maxRow; i++) {
            var currentType = "";
            var typeNum = 0;
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
            }
            // 列末尾判断
            if (typeNum >= 3) {
                for (var k = 0; k < typeNum; k++) {
                    if (this.eliminates.indexOf((MapData.maxRow - k - 1) * MapData.maxCol + i) == -1) {
                        this.eliminates.push((MapData.maxRow - k - 1) * MapData.maxCol + i);
                    }
                }
            }
        }
    };
    GameElementManagement.prototype.playMoveToRequiredElement = function (ele, point) {
        this.eliminateNum++;
        // 将条件元素放置于最顶层
        var element = this.container.getChildAt(ele);
        element.moveToRequiredElement(point);
    };
    // 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
    GameElementManagement.prototype.playScaleAndRemove = function (ele) {
        this.eliminateNum++;
        var element = this.container.getChildAt(ele);
        element.scaleAndRemove();
    };
    // 消除动画全部播放完毕,然后派发一个结束的时间
    GameElementManagement.prototype.onEliminateOver = function (evt) {
        this.eliminateNum--;
        if (this.eliminateNum == 0) {
            this.dispatchEvent(evt);
        }
    };
    GameElementManagement.prototype.dropDownAndNewElement = function () {
        // 循环每一列
        for (var i = 0; i < MapData.maxCol; i++) {
            // 循环其中一列的所有的消除元素
            var j = MapData.maxRow - 1;
            var block = 0;
            while (j >= block + 1) {
                // 如果是被消除元素
                if (this.container.getChildAt(j * MapData.maxRow + i).getType() == "") {
                    // 冒泡操作,将元素放到最上面
                    for (var k = j; k >= 1; k--) {
                        this.container.swapChildren(this.container.getChildAt(k * MapData.maxRow + i), this.container.getChildAt((k - 1) * MapData.maxRow + i));
                    }
                    block++;
                }
                else {
                    j--;
                }
            }
        }
        // 所有的堆叠顺序调整好以后,就可以执行动画
        var len = MapData.maxRow * MapData.maxCol;
        for (var i = 0; i < len; i++) {
            var element = this.container.getChildAt(i);
            if (element.getType() == "") {
                element.setType(this.getRandomType());
                element.dropDown(this.container.getChildIndex(element));
            }
            else {
                element.moveDown(this.container.getChildIndex(element));
            }
        }
    };
    GameElementManagement.prototype.autoEliminate = function (evt) {
        this.moveLocElementNum++;
        if (this.moveLocElementNum == MapData.maxRow * MapData.maxCol) {
            this.moveLocElementNum = 0;
            var evt_1 = new CustomizedEvent(CustomizedEvent.AUTO_ELIMINATE);
            this.dispatchEvent(evt_1);
        }
    };
    // 在游戏开始之前,全局判断能否移动其中一个元素之后可以形成连线消除
    // 如果能够形成连线消除,则继续游戏,否则,打乱所有元素的顺序
    GameElementManagement.prototype.isHaveSeries = function () {
        for (var i = 0; i < MapData.maxRow; i++) {
            for (var j = 0; j < MapData.maxCol; j++) {
                // 表示当前地图元素
                var element = this.container.getChildAt(i * MapData.maxRow + j);
                // 第一种情况,有两个类型相同的相邻的卡片元素横向排列,寻找它周围的六个元素(先不考虑极限值的情况下)
                if (j < (MapData.maxCol - 1) && element.getType() == this.container.getChildAt(i * MapData.maxRow + j + 1).getType()) {
                    // 寻找周围六个元素,同样先保证地图块可用,先寻找左侧三个元素
                    if (j > 0) {
                        // 判断左上角
                        if (i > 0 && element.getType() == this.container.getChildAt((i - 1) * MapData.maxRow + j - 1).getType()) {
                            return true;
                        }
                        // 判断左下角
                        if (i < (MapData.maxRow - 1) && element.getType() == this.container.getChildAt((i + 1) * MapData.maxRow + j - 1).getType()) {
                            return true;
                        }
                        // 判断左侧跳格
                        if (j > 1 && element.getType() == this.container.getChildAt(i * MapData.maxRow + j - 2).getType()) {
                            return true;
                        }
                    }
                    // 寻找右侧三个元素,以当前地图块为准,以相隔右侧一个地图块作为中心点,去寻找右侧三个元素
                    if (j < (MapData.maxCol - 2)) {
                        // 判断右上角
                        if (i > 0 && element.getType() == this.container.getChildAt((i - 1) * MapData.maxRow + j + 2).getType()) {
                            return true;
                        }
                        // 判断右下角
                        if (i < (MapData.maxRow - 1) && element.getType() == this.container.getChildAt((i + 1) * MapData.maxRow + j + 2).getType()) {
                            return true;
                        }
                        // 判断右侧跳格
                        if (j < (MapData.maxCol - 3) && element.getType() == this.container.getChildAt(i * MapData.maxRow + j + 3).getType()) {
                            return true;
                        }
                    }
                }
                // 同样是第一种情况,只是纵向排列(也是不考虑极限值的情况下)
                if (i < (MapData.maxRow - 1) && element.getType() == this.container.getChildAt((i + 1) * MapData.maxRow + j).getType()) {
                    // 寻找周围六个元素,同样先保证地图块可用,先寻找上侧三个元素
                    if (i > 0) {
                        // 判断左上角
                        if (j > 0 && element.getType() == this.container.getChildAt((i - 1) * MapData.maxRow + j - 1).getType()) {
                            return true;
                        }
                        // 判断右上角
                        if (j < (MapData.maxCol - 1) && element.getType() == this.container.getChildAt((i - 1) * MapData.maxRow + j + 1).getType()) {
                            return true;
                        }
                        // 判断上方跳格
                        if (i > 1 && element.getType() == this.container.getChildAt((i - 2) * MapData.maxRow + j).getType()) {
                            return true;
                        }
                    }
                    // 寻找下方三个元素,以当前地图块为准,以相隔下方一个地图块作为中心点,去寻找下方三个元素
                    if (i < (MapData.maxRow - 2)) {
                        // 判断左下角
                        if (j > 0 && element.getType() == this.container.getChildAt((i + 2) * MapData.maxRow + j - 1).getType()) {
                            return true;
                        }
                        // 判断右下角
                        if (j < (MapData.maxCol - 1) && element.getType() == this.container.getChildAt((i + 2) * MapData.maxRow + j + 1).getType()) {
                            return true;
                        }
                        // 判断下方跳格
                        if (i < (MapData.maxRow - 3) && element.getType() == this.container.getChildAt((i + 3) * MapData.maxRow + j).getType()) {
                            return true;
                        }
                    }
                }
                // 第二种情况,有两个类型相同的卡片元素横向相隔地排列,中间隔了两个元素(先不考虑极限值的情况下)
                if (j < (MapData.maxCol - 2) && element.getType() == this.container.getChildAt(i * MapData.maxRow + j + 2).getType()) {
                    // 判断正上方
                    if (i > 0 && element.getType() == this.container.getChildAt((i - 1) * MapData.maxRow + j + 1).getType()) {
                        return true;
                    }
                    // 判断正下方
                    if (i < (MapData.maxRow - 1) && element.getType() == this.container.getChildAt((i + 1) * MapData.maxRow + j + 1).getType()) {
                        return true;
                    }
                }
                // 第二种情况,有两个类型相同的卡片元素纵向相隔地排列,中间隔了两个元素(也是先不考虑极限值的情况下)
                if (i < (MapData.maxRow - 2) && element.getType() == this.container.getChildAt((i + 2) * MapData.maxRow + j).getType()) {
                    // 判断左格子
                    if (j > 0 && element.getType() == this.container.getChildAt((i + 1) * MapData.maxRow + j - 1).getType()) {
                        return true;
                    }
                    // 判断右格子
                    if (j < (MapData.maxCol - 1) && element.getType() == this.container.getChildAt((i + 1) * MapData.maxRow + j + 1).getType()) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    // 当游戏没有元素可以再消除的时候,需要打乱所有元素,移动全部元素位置
    GameElementManagement.prototype.disOrder = function () {
        var len = MapData.maxRow * MapData.maxCol;
        egret.Tween.removeAllTweens();
        for (var i = 0; i < len; i++) {
            var element = this.container.getChildAt(i);
            element.setType(this.getRandomType());
            element.dropDown(this.container.getChildIndex(element));
        }
    };
    return GameElementManagement;
}(egret.EventDispatcher));
__reflect(GameElementManagement.prototype, "GameElementManagement");
//# sourceMappingURL=GameElementManagement.js.map