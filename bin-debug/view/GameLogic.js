var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏主逻辑
 */
var GameLogic = (function () {
    function GameLogic(container) {
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
    }
    // 初始化数据,创建各种控制器
    /*private init(){
        this.gameElementController.addEventListener(CustomizedEvent.ELIMINATE_OVER,this.removeAniOver,this);
        this.gameElementController.addEventListener(CustomizedEvent.UPDATE_MAP,this.createNewElement,this);
        this.gameElementController.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.checkOtherElementLink,this);
        this.gameElementController.addEventListener(CustomizedEvent.USE_PROP_CLICK,this.usePropClick,this);
    }*/
    // 视图管理器中存在两个被tap的元素进行判断
    GameLogic.prototype.onTapTwoElement = function (evt) {
        console.log("触发两个元素");
        // 从二维地图中判断,两个元素是否可以交换位置
        var rel = this.gameElementManagement.canMove(evt);
        if (rel) {
            this.gameElementManagement.swapLocation(evt);
            // 判断两个位置交换后是否可以消除
            var linerel = this.gameElementManagement.isHaveSeries();
            if (linerel) {
                // 执行消除操作
                this.gameElementController.changeLocationAndScale(evt.element1, evt.element2);
                // 更新步数
                var stepNum = this.stepNumText.getNum();
                this.stepNumText.setNum(stepNum - 1);
            }
            else {
                // 否则,再互换回来
                setTimeout(function () {
                    this.gameElementManagement.swapLocation(evt);
                    //evt.currentTap=-1;
                    //evt.anotherTap=-1;
                }.bind(this), 300);
            }
        }
        else {
            this.gameElementManagement.setNewElementFocus(evt);
        }
    };
    GameLogic.prototype.removeAniOver = function (evt) {
        var len = EliminateLogic.eliminates.length;
        var rel;
        for (var i = 0; i < len; i++) {
            var etype = "";
            var l = EliminateLogic.eliminates[i].length;
            for (var j = 0; j < l; j++) {
                etype = GameData.GameElements[EliminateLogic.eliminates[i][j]].type;
                rel = this.levelRequirementController.isRequiredElementType(etype);
                // 有相同关卡类型,运动到指定位置
                if (rel) {
                    var p = new egret.Point();
                    GameData.requiredElementManagement.updateNumText(etype, 1);
                    this.levelRequirementController.updateElementNum();
                    this.gameElementController.playMoveToRequiredElement(EliminateLogic.eliminates[i][j], p.x, p.y);
                }
                else {
                    this.gameElementController.playScaleAndRemove(EliminateLogic.eliminates[i][j]);
                }
            }
        }
    };
    // 所有元素都删除完毕后,创建新元素,并解析视图
    GameLogic.prototype.createNewElement = function (evt) {
        this.mapController.updateMap();
        this.gameElementController.updateMapData();
    };
    // 删除动画完成后,检测地图中是否剩余可消除元素
    GameLogic.prototype.checkOtherElementLink = function (evt) {
        if (EliminateLogic.isHaveSeries()) {
            this.removeAniOver(null);
        }
        else {
            if (!EliminateLogic.isHaveFormedSeries()) {
                var rel = false;
                // 没有可消除的元素了,检查是否存在移动一步就可消除的项目
                var next = true;
                while (next) {
                    // 乱序
                    EliminateLogic.changeOrder();
                    if (!EliminateLogic.isHaveSeries()) {
                        if (EliminateLogic.isHaveFormedSeries) {
                            next = false;
                            rel = true;
                        }
                    }
                }
                if (rel) {
                    this.gameElementController.updateOrder();
                }
            }
        }
        // 检测步数和关卡数
        this.isGameOver();
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