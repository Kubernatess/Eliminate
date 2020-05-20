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
        // 因为消除元素这个动作有两个元素需要交换,交换的时候两个元素都要执行一次动画
        // 必须要等到两个元素执行完动画之后,才触发消除元素事件响应
        _this.removeNum = 0;
        // 即将消除元素的数量
        _this.moveeleNum = 0;
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
                element.addEventListener(CustomizedEvent.SWAP_ELEMENT, this.onSwapElement, this);
                element.addEventListener(CustomizedEvent.ELIMINATE_OVER, this.onEliminateOver, this);
                element.addEventListener(CustomizedEvent.UPDATE_MAP, this.onUpdateMap, this);
                //ele.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
            }
        }
    };
    GameElementManagement.prototype.getRandomType = function () {
        var rand = Math.floor(Math.random() * GameData.GameElementTypes.length);
        return GameData.GameElementTypes[rand];
    };
    // 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑
    GameElementManagement.prototype.onTouchTap = function (event) {
        // 没有使用道具的情况
        if (PropElementManagement.propType == "" && event.currentTarget instanceof GameElement) {
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
        /*else if(PropElementManagement.propType!=""){
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
    GameElementManagement.prototype.swapElement = function () {
        this.container.getChildAt(CustomizedEvent.currentTap).moveTo(CustomizedEvent.anotherTap);
        this.container.getChildAt(CustomizedEvent.anotherTap).moveTo(CustomizedEvent.currentTap);
    };
    GameElementManagement.prototype.onSwapElement = function (evt) {
        this.swapElementNum++;
        if (this.swapElementNum == 2) {
            this.swapElementNum = 0;
            this.dispatchEvent(evt);
        }
    };
    // 在交换卡片元素之后,全局判断是否有连线消除
    GameElementManagement.prototype.isHaveSeries = function () {
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
        // 返回最终结果
        if (this.eliminates.length > 0) {
            return true;
        }
        return false;
    };
    // 播放一个交换动画,然后再回来
    GameElementManagement.prototype.changeLocationAndBack = function () {
        if (this.container.getChildIndex(this.elementViews[evt.ele1]) < this.container.getChildIndex(this.elementViews[evt.ele2])) {
            this.container.swapChildren(this.elementViews[evt.ele1], this.elementViews[evt.ele2]);
        }
        this.elementViews[evt.ele1].moveAndBack(evt.ele2, true);
        this.elementViews[evt.ele2].moveAndBack(evt.ele1, false);
    };
    // 播放一个交换动画,然后两个位置不再回来,注意这时候两个元素只是执行了互换操作,但还没有真正执行消除操作
    GameElementManagement.prototype.changeLocationAndScale = function (evt) {
        if (this.container.getChildIndex(this.elementViews[evt.ele1]) < this.container.getChildIndex(this.elementViews[evt.ele2])) {
            this.container.swapChildren(this.elementViews[evt.ele1], this.elementViews[evt.ele2]);
        }
        this.elementViews[evt.ele1].moveAndScale(evt.ele2, true);
        this.elementViews[evt.ele2].moveAndScale(evt.ele1, false);
        var temp = this.elementViews[evt.ele1];
        this.elementViews[evt.ele1] = this.elementViews[evt.ele2];
        this.elementViews[evt.ele2] = temp;
    };
    GameElementManagement.prototype.onEliminateOver = function (evt) {
        this.removeNum++;
        if (this.removeNum == 2) {
            this.removeNum = 0;
            this.dispatchEvent(evt);
        }
    };
    // 用于消除过关条件元素. 同上,也要作数量标记
    GameElementManagement.prototype.playMoveToRequiredElement = function (ele, point) {
        this.moveeleNum++;
        // 将条件元素放置于最顶层
        var view = this.elementViews[ele];
        view.moveToRequiredElement(point);
    };
    // 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
    GameElementManagement.prototype.playScaleAndRemove = function (ele) {
        this.moveeleNum++;
        var view = this.elementViews[ele];
        view.scaleAndRemove();
    };
    // 消除动画完成,现在更新地图元素
    GameElementManagement.prototype.onUpdateMap = function (evt) {
        this.moveeleNum--;
        if (this.moveeleNum == 0) {
            // 消除动画全部播放完毕,然后派发一个结束的时间
            this.dispatchEvent(evt);
        }
    };
    // 对某一个卡片元素,更新它的类型
    GameElementManagement.prototype.changeTypeByID = function (id) {
        GameData.GameElements[id].type = this.getRandomType();
    };
    // 创建任意数量的随机类型
    /*public getAnyRandomTypes(num:number):string[] {
        let types:string[] = [];
        for(let i=0;i<num;i++){
            types.push(this.getRandomType());
        }
        return types;
    }*/
    // 根据当前删除的地图元素,刷新所有的元素位置
    // 例如,如果消除了三个卡片元素,那么这三个元素的位置要重新排列,同时它们上方的元素要向下移动
    GameElementManagement.prototype.updateMap = function () {
        var len = this.eliminates.length;
        // 记录每一个被消除元素当前的列编号
        var colarr = [];
        for (var i = 0; i < len; i++) {
            // 同上面一样,colarr只存放不重复的列编号
            if (colarr.indexOf(this.eliminates[i] % MapData.maxRow) == -1) {
                colarr.push(this.eliminates[i] % MapData.maxRow);
            }
        }
        // 循环对每一列进行调整
        len = colarr.length;
        for (var i = 0; i < len; i++) {
            // 当一些元素被消除,上面的整列元素准备要下来,newcolids就是用来存放这些正准备下落的又不是新出现的卡片元素
            var newcolids = [];
            // 保存那些被消除的元素,但是与ids不同,removeids只是其中一列
            var removeids = [];
            for (var j = MapData.maxRow - 1; j >= 0; j--) {
                if (this.eliminates.indexOf(j * MapData.maxRow + i) == -1) {
                    newcolids.push(j * MapData.maxRow + i);
                }
                else {
                    removeids.push(j * MapData.maxRow + i);
                }
            }
            // 虽然上面把newcolids和removeids拆分开来,现在又把它们两个再次合并,但是合并结果不一样,removeids拼接在newcolids的后面
            newcolids = newcolids.concat(removeids);
            for (var j = MapData.maxRow - 1; j >= 0; j--) {
                // 最后重新调整位置之后,被消除的卡片元素的id会放在上面依次排列
                GameData.mapData[j][colarr[i]] = newcolids[0];
                GameData.GameElements[newcolids[0]].location = j * GameData.maxRow + colarr[i];
                newcolids.shift();
            }
        }
    };
    // 重新布局,更新整个地图中元素位置
    GameElementManagement.prototype.updateMapData = function () {
        var len = this.elements.length;
        this.moveLocElementNum = 0;
        for (var i = 0; i < len; i++) {
            this.elements[i].location = GameData.GameElements[i].location;
            this.elements[i].setTexture(GameData.GameElements[i].type + "_png");
            this.elements[i].dropDown();
        }
    };
    GameElementManagement.prototype.dropDownOver = function (event) {
        this.moveLocElementNum++;
        if (this.moveLocElementNum == (GameData.maxRow * GameData.maxColumn)) {
            var evt = new CustomizedEvent(CustomizedEvent.UPDATE_VIEW_OVER);
            this.dispatchEvent(evt);
        }
    };
    // 当游戏没有元素可以再消除的时候,需要打乱所有元素,移动全部元素位置
    GameElementManagement.prototype.updateOrder = function () {
        var len = this.elements.length;
        egret.Tween.removeAllTweens();
        for (var i = 0; i < len; i++) {
            this.elements[i].location = GameData.GameElements[i].location;
            this.elements[i].moveDown();
        }
    };
    return GameElementManagement;
}(egret.EventDispatcher));
__reflect(GameElementManagement.prototype, "GameElementManagement");
//# sourceMappingURL=GameElementManagement.js.map