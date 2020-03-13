var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏主逻辑
 */
var GameLogic = (function () {
    function GameLogic(gameStage) {
        this._gameStage = gameStage;
        this.init();
    }
    GameLogic.prototype.init = function () {
        // 初始化数据
        GameData.initData();
        // 初始化GameData数据
        var leveldata = RES.getRes("level");
        // 创建地图数据
        MapDataParse.createMapData(leveldata.map);
        // 解析游戏关卡数据
        LevelGameDataParse.parseLevelGameData(leveldata);
        this.mapc = new MapController();
        this.mapc.createElementAllMap();
        var gbg = new GameBackground();
        this._gameStage.addChild(gbg);
        gbg.changeBackground();
        var lec = new egret.Sprite();
        this._gameStage.addChild(lec);
        this.levm = new LevelReqViewManage(lec);
        this.levm.createCurrentLevelReq();
        var pvmc = new egret.Sprite();
        this._gameStage.addChild(pvmc);
        this.pvm = new PropViewManage(pvmc);
        var cc = new egret.Sprite();
        this._gameStage.addChild(cc);
        this.evm = new ElementViewManage(cc);
        this.evm.showAllElement();
        this.evm.addEventListener(ElementViewManageEvent.TAP_TWO_ELEMENT, this.viewTouchTap, this);
        this.evm.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER, this.removeAniOver, this);
        this.evm.addEventListener(ElementViewManageEvent.UPDATE_MAP, this.createNewElement, this);
        this.evm.addEventListener(ElementViewManageEvent.UPDATE_VIEW_OVER, this.checkOtherElementLink, this);
        this.evm.addEventListener(ElementViewManageEvent.USE_PROP_CLICK, this.usePropClick, this);
    };
    // 视图管理器中存在两个被tap的元素进行判断
    GameLogic.prototype.viewTouchTap = function (evt) {
        // 从二维地图中判断,两个元素是否可以交换位置
        var rel = LinkLogic.canMove(evt.ele1, evt.ele2);
        if (rel) {
            // 判断两个位置移动后是否可以消除
            var linerel = LinkLogic.isHaveLineByIndex(GameData.elements[evt.ele1].location, GameData.elements[evt.ele2].location);
            // 执行移动
            if (linerel) {
                this.evm.changeLocationAndScale(evt.ele1, evt.ele2);
                // 更新步数
                GameData.stepNum--;
                this.levm.updateStep();
            }
            else {
                this.evm.changeLocationAndBack(evt.ele1, evt.ele2);
            }
        }
        else {
            // 两个元素从空洞位置上不可交换,设置新焦点
            this.evm.setNewElementFocus(evt.ele2);
        }
    };
    GameLogic.prototype.removeAniOver = function (evt) {
        var len = LinkLogic.lines.length;
        var rel;
        for (var i = 0; i < len; i++) {
            var etype = "";
            var l = LinkLogic.lines[i].length;
            for (var j = 0; j < l; j++) {
                etype = GameData.elements[LinkLogic.lines[i][j]].type;
                rel = this.levm.haveReqType(etype);
                // 有相同关卡类型,运动到指定位置
                if (rel) {
                    var p = new egret.Point();
                    GameData.levelreq.changeReqNum(etype, 1);
                    this.levm.update();
                    this.evm.playReqRemoveAni(LinkLogic.lines[i][j], p.x, p.y);
                }
                else {
                    this.evm.playRemoveAni(LinkLogic.lines[i][j]);
                }
            }
        }
    };
    // 所有元素都删除完毕后,创建新元素,并解析视图
    GameLogic.prototype.createNewElement = function (evt) {
        this.mapc.updateMapLocation();
        this.evm.updateMapData();
    };
    // 删除动画完成后,检测地图中是否剩余可消除元素
    GameLogic.prototype.checkOtherElementLink = function (evt) {
        if (LinkLogic.isHaveLine()) {
            this.removeAniOver(null);
        }
        else {
            if (!LinkLogic.isNextHaveLine()) {
                var rel = false;
                // 没有可消除的元素了,检查是否存在移动一步就可消除的项目
                var next = true;
                while (next) {
                    // 乱序
                    LinkLogic.changeOrder();
                    if (!LinkLogic.isHaveLine()) {
                        if (LinkLogic.isNextHaveLine) {
                            next = false;
                            rel = true;
                        }
                    }
                }
                if (rel) {
                    this.evm.updateOrder();
                }
            }
        }
        // 检测步数和关卡数
        this.isGameOver();
    };
    GameLogic.prototype.isGameOver = function () {
        if (!this.gameoverpanel) {
            // 步数为0,GameOver
            if (GameData.stepNum == 0) {
                this.gameoverpanel = new GameOverPanel();
                this._gameStage.addChild(this.gameoverpanel);
                if (GameData.levelreq.isClear()) {
                    this.gameoverpanel.show(true);
                }
                else {
                    this.gameoverpanel.show(false);
                }
            }
            else {
                if (GameData.levelreq.isClear()) {
                    this.gameoverpanel = new GameOverPanel();
                    this._gameStage.addChild(this.gameoverpanel);
                    this.gameoverpanel.show(true);
                }
            }
        }
    };
    // 携带道具被点击
    GameLogic.prototype.usePropClick = function (evt) {
        // 操作数据
        PropLogic.useProp(PropViewManage.proptype, evt.propToElementLocation);
        this.pvm.useProp();
        // 播放删除动画
        this.removeAniOver(null);
    };
    return GameLogic;
}());
__reflect(GameLogic.prototype, "GameLogic");
//# sourceMappingURL=GameLogic.js.map