var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏主逻辑
 */
var GameLogic = (function () {
    function GameLogic(container) {
        this.swapElementNum = 0;
        this.container = container;
        // 添加游戏背景,同时包括了地图格子图和纯色层
        var background = new GameBackground();
        this.container.addChild(background);
        // 初始化条件元素控制器,并创建条件元素
        var requiredElementContainer = new egret.DisplayObjectContainer();
        this.container.addChild(requiredElementContainer);
        this.requiredElementManagement = new RequiredElementManagement(requiredElementContainer);
        // 添加移动步数文本
        this.stepNumText = new StepNumText(this.container);
        this.stepNumText.setNum(20);
        // 创建道具元素
        var propElementController = new egret.Sprite();
        this.container.addChild(propElementController);
        this.propElementManagement = new PropElementManagement(propElementController);
        // 创建所有游戏元素
        var GameElementContainer = new egret.DisplayObjectContainer();
        this.container.addChild(GameElementContainer);
        this.gameElementManagement = new GameElementManagement(GameElementContainer);
        this.gameElementManagement.createElements();
        // 监听游戏元素事件
        this.gameElementManagement.addEventListener(CustomizedEvent.TAP_TWO_ELEMENT, this.onTapTwoElement, this);
        this.gameElementManagement.addEventListener(CustomizedEvent.SWAP_ELEMENT, this.swapElementHandler, this);
        this.gameElementManagement.addEventListener(CustomizedEvent.ELIMINATE_OVER, this.onEliminateOver, this);
        this.gameElementManagement.addEventListener(CustomizedEvent.AUTO_ELIMINATE, this.autoEliminate, this);
        //this.gameElementManagement.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.checkOtherElementLink,this);
        //this.gameElementController.addEventListener(CustomizedEvent.USE_PROP_CLICK,this.usePropClick,this);
    }
    GameLogic.prototype.onTapTwoElement = function (evt) {
        // 不管是否执行交换,当前元素的样式都应该被取消
        this.gameElementManagement.container.getChildAt(CustomizedEvent.currentTap).focusEffect(false);
        // 先判断两个元素能否可以交换,如果能交换,则执行交换操作
        if (this.gameElementManagement.canMove()) {
            this.gameElementManagement.playSwapElement();
        }
        else {
            this.gameElementManagement.container.getChildAt(CustomizedEvent.anotherTap).focusEffect(true);
            CustomizedEvent.currentTap = CustomizedEvent.anotherTap;
        }
    };
    GameLogic.prototype.swapElementHandler = function () {
        this.swapElementNum++;
        // 前面swapElement()已经交换成功,然后交换堆叠顺序
        var displayContainer = this.gameElementManagement.container;
        displayContainer.swapChildren(displayContainer.getChildAt(CustomizedEvent.currentTap), displayContainer.getChildAt(CustomizedEvent.anotherTap));
        // 如果是第二次交换,到这里就结束事件派发
        if (this.swapElementNum == 2) {
            this.swapElementNum = 0;
            CustomizedEvent.currentTap = -1;
        }
        else {
            // 把消除元素收集起来
            this.gameElementManagement.collectEliminates();
            // 还要判断消除的是普通的游戏元素还是条件元素	
            if (this.gameElementManagement.eliminates.length > 0) {
                this.swapElementNum = 0;
                this.eliminateElements();
            }
            else {
                // 否则,执行返回操作
                this.gameElementManagement.playSwapElement();
            }
        }
    };
    GameLogic.prototype.eliminateElements = function () {
        var len = this.gameElementManagement.eliminates.length;
        for (var i = 0; i < len; i++) {
            var ele = this.gameElementManagement.eliminates[i];
            var eleType = this.gameElementManagement.container.getChildAt(ele).getType();
            var rel = this.requiredElementManagement.isRequiredElementType(eleType);
            if (rel) {
                // 有相同关卡类型,则运动到指定位置
                var point = this.requiredElementManagement.getPointByType(eleType);
                this.requiredElementManagement.updateNumText(eleType, 1);
                this.gameElementManagement.playMoveToRequiredElement(ele, point);
            }
            else {
                this.gameElementManagement.playScaleAndRemove(ele);
            }
        }
        // 更新步数
        var stepNum = this.stepNumText.getNum();
        this.stepNumText.setNum(stepNum - 1);
    };
    // 所有元素都删除完毕后,接下来就是元素的下落
    GameLogic.prototype.onEliminateOver = function () {
        CustomizedEvent.currentTap = -1;
        this.gameElementManagement.dropDownAndNewElement();
    };
    // 检测地图中是否剩余可消除元素,然后自动执行消除操作
    GameLogic.prototype.autoEliminate = function (evt) {
        this.gameElementManagement.collectEliminates();
        console.log("能执行到这里吗");
        if (this.gameElementManagement.eliminates.length > 0) {
            this.eliminateElements();
        }
        else {
            /*if(!EliminateLogic.isHaveFormedSeries()){
                let rel:boolean = false;
                // 没有可消除的元素了,检查是否存在移动一步就可消除的项目
                let next:boolean = true;
                while(next){
                    // 乱序
                    EliminateLogic.changeOrder();
                    if(!EliminateLogic.isHaveSeries()){
                        if(EliminateLogic.isHaveFormedSeries){
                            next = false;
                            rel = true;
                        }
                    }
                }
                if(rel){
                    this.gameElementController.updateOrder();
                }
            }*/
        }
        // 检测步数和关卡数
        //this.isGameOver();
    };
    GameLogic.prototype.isGameOver = function () {
        if (!this.gameoverpanel) {
            // 步数为0,GameOver
            if (GameData.surplusStep == 0) {
                this.gameoverpanel = new GameOverPanel();
                this.gameStage.addChild(this.gameoverpanel);
                if (GameData.requiredElementManagement.isAllElementEliminated()) {
                    this.gameoverpanel.show(true);
                }
                else {
                    this.gameoverpanel.show(false);
                }
            }
            else {
                if (GameData.requiredElementManagement.isAllElementEliminated()) {
                    this.gameoverpanel = new GameOverPanel();
                    this.gameStage.addChild(this.gameoverpanel);
                    this.gameoverpanel.show(true);
                }
            }
        }
    };
    // 携带道具被点击
    GameLogic.prototype.usePropClick = function (evt) {
        // 操作数据
        PropLogic.useProp(PropElementController.propType, evt.propToElementLocation);
        this.propElementController.useProp();
        // 播放删除动画
        this.removeAniOver(null);
    };
    return GameLogic;
}());
__reflect(GameLogic.prototype, "GameLogic");
//# sourceMappingURL=GameLogic.js.map