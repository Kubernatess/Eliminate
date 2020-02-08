/**
 * 游戏主逻辑
 */
class GameLogic {
	private _gameStage:egret.Sprite;
	public constructor(gameStage:egret.Sprite) {
		this._gameStage = gameStage;
		this.init();
	}

	// 初始化数据,创建各种控制器
	private evm:ElementViewManage;
	private levm:LevelReqViewManage;
	private mapc:MapController;
	private pvm:PropViewManage;
	private init(){
		// 初始化数据
		GameData.initData();
		// 初始化GameData数据
		let leveldata = RES.getRes("l1");
		// 创建地图数据
		MapDataParse.createMapData(leveldata.map);
		// 解析游戏关卡数据
		LevelGameDataParse.parseLevelGameData(leveldata);

		this.mapc = new MapController();
		this.mapc.createElementAllMap();

		let gbg:GameBackground = new GameBackground();
		this._gameStage.addChild(gbg);
		gbg.changeBackground();

		let lec:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild(lec);
		this.levm = new LevelReqViewManage(lec);
		this.levm.createCurrentLevelReq();

		let pvmc:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild(pvmc);
		this.pvm = new PropViewManage(pvmc);

		let cc:egret.Sprite = new egret.Sprite();
		this._gameStage.addChild(cc);
		this.evm = new ElementViewManage(cc);
		this.evm.showAllElement();
		this.evm.addEventListener(ElementViewManageEvent.TAP_TWO_ELEMENT,this.viewTouchTap,this);
		this.evm.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER,this.removeAniOver,this);
		this.evm.addEventListener(ElementViewManageEvent.UPDATE_MAP,this.createNewElement,this);
		this.evm.addEventListener(ElementViewManageEvent.UPDATE_VIEW_OVER,this.checkOtherElementLink,this);
		this.evm.addEventListener(ElementViewManageEvent.USE_PROP_CLICK,this.usePropClick,this);
	}

	// 视图管理器中存在两个被tap的元素进行判断
	private viewTouchTap(evt:ElementViewManageEvent){
		// 从二维地图中判断,两个元素是否可以交换位置
		let rel:boolean = LinkLogic.canMove(evt.ele1,evt.ele2);
		if(rel){
			// 判断两个位置移动后是否可以消除
			let linerel:boolean = LinkLogic.isHaveLineByIndex(GameData.elements[evt.ele1].location , GameData.elements[evt.ele2].location);
			// 执行移动
			if(linerel){
				this.evm.changeLocationAndScale(evt.ele1,evt.ele2);
				// 更新步数
				GameData.stepNum--;
				this.levm.updateStep();
			}
			else{
				this.evm.changeLocationAndBack(evt.ele1,evt.ele2);
			}
		}
		else{
			// 两个元素从空洞位置上不可交换,设置新焦点
			this.evm.setNewElementFocus(evt.ele2);
		}
	}

	private removeAniOver(evt:ElementViewManageEvent){
		let len:number = LinkLogic.lines.length;
		let rel:boolean;
		for(let i=0;i<len;i++){
			let etype:string = "";
			let l:number = LinkLogic.lines[i].length;
			for(let j=0;j<l;j++){
				etype = GameData.elements[LinkLogic.lines[i][j]].type;
				rel = this.levm.haveReqType(etype);
				// 有相同关卡类型,运动到指定位置
				if(rel){
					let p:egret.Point = new egret.Point();
					GameData.levelreq.changeReqNum(etype,1);
					this.levm.update();
					this.evm.playReqRemoveAni(LinkLogic.lines[i][j],p.x,p.y);
				}
				else{
					this.evm.playRemoveAni(LinkLogic.lines[i][j]);
				}
			}
		}
	}

	// 所有元素都删除完毕后,创建新元素,并解析视图
	private createNewElement(evt:ElementViewManageEvent){
		this.mapc.updateMapLocation();
		this.evm.updateMapData();
	}

	// 删除动画完成后,检测地图中是否剩余可消除元素
	private checkOtherElementLink(evt:ElementViewManageEvent){
		if(LinkLogic.isHaveLine()){
			this.removeAniOver(null);
		}
		else{
			if(!LinkLogic.isNextHaveLine()){
				let rel:boolean = false;
				// 没有可消除的元素了,检查是否存在移动一步就可消除的项目
				let next:boolean = true;
				while(next){
					// 乱序
					LinkLogic.changeOrder();
					if(!LinkLogic.isHaveLine()){
						if(LinkLogic.isNextHaveLine){
							next = false;
							rel = true;
						}
					}
				}
				if(rel){
					this.evm.updateOrder();
				}
			}
		}
		// 检测步数和关卡数
		this.isGameOver();
	}

	// 检测当前游戏是否GameOver
	private gameoverpanel:GameOverPanel;
	private isGameOver(){
		if(!this.gameoverpanel){
			// 步数为0,GameOver
			if(GameData.stepNum == 0){
				this.gameoverpanel = new GameOverPanel();
				this._gameStage.addChild(this.gameoverpanel);
				if(GameData.levelreq.isClear()){
					this.gameoverpanel.show(true);
				}
				else{
					this.gameoverpanel.show(false);
				}
			}
			else{
				if(GameData.levelreq.isClear()){
					this.gameoverpanel = new GameOverPanel();
					this._gameStage.addChild(this.gameoverpanel);
					this.gameoverpanel.show(true);
				}
			}
		}
	}

	// 携带道具被点击
	private usePropClick(evt:ElementViewManageEvent){
		// 操作数据
		PropLogic.useProp(PropViewManage.proptype , evt.propToElementLocation);
		this.pvm.useProp();
		// 播放删除动画
		this.removeAniOver(null);
	}
}