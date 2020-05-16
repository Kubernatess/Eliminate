/**
 * 游戏主逻辑
 */
class GameLogic {

	private container:egret.DisplayObjectContainer;

	private gameElementManagement:GameElementManagement;
	private requiredElementManagement:RequiredElementManagement;
	private propElementManagement:PropElementManagement;
	private stepNumText:StepNumText;

	public constructor(container:egret.DisplayObjectContainer) {
		this.container = container;

		// 添加游戏背景,同时包括了地图格子图和纯色层
		let background:GameBackground = new GameBackground();
		this.container.addChild(background);

		// 初始化条件元素控制器,并创建条件元素
		let requiredElementContainer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
		this.container.addChild(requiredElementContainer);
		this.requiredElementManagement = new RequiredElementManagement(requiredElementContainer);

		// 添加移动步数文本
		this.stepNumText = new StepNumText(this.container);
		this.stepNumText.setNum(20);

		// 创建道具元素
		let propElementController:egret.Sprite = new egret.Sprite();
		this.container.addChild(propElementController);
		this.propElementManagement = new PropElementManagement(propElementController);

		// 创建所有游戏元素
		let GameElementContainer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
		this.container.addChild(GameElementContainer);
		this.gameElementManagement = new GameElementManagement(GameElementContainer);
		this.gameElementManagement.createElements();

		// 监听游戏元素事件
		this.gameElementManagement.addEventListener(CustomizedEvent.TAP_TWO_ELEMENT,this.onTapTwoElement,this);

	}


	// 初始化数据,创建各种控制器
	/*private init(){		
		this.gameElementController.addEventListener(CustomizedEvent.ELIMINATE_OVER,this.removeAniOver,this);
		this.gameElementController.addEventListener(CustomizedEvent.UPDATE_MAP,this.createNewElement,this);
		this.gameElementController.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.checkOtherElementLink,this);
		this.gameElementController.addEventListener(CustomizedEvent.USE_PROP_CLICK,this.usePropClick,this);
	}*/

	// 视图管理器中存在两个被tap的元素进行判断
	private onTapTwoElement(evt:CustomizedEvent){
		// 从二维地图中判断,两个元素是否可以交换位置
		let rel:boolean = this.gameElementManagement.canMove(evt);
		if(rel){
			this.gameElementManagement.swapLocation(evt);
			// 判断两个位置交换后是否可以消除
			let linerel:boolean = this.gameElementManagement.isHaveSeries();
			if(linerel){
				// 执行消除操作
				this.gameElementController.changeLocationAndScale(evt.element1,evt.element2);
				// 更新步数
				let stepNum = this.stepNumText.getNum();
				this.stepNumText.setNum(stepNum-1);
			}
			else{
				// 否则,再互换回来
				setTimeout(function(){this.gameElementManagement.swapLocation(evt);}.bind(this),300);
			}
		}
		// 设置新焦点
		else{
			this.gameElementManagement.setNewElementFocus(evt);
		}
	}

	private removeAniOver(evt:GameElementController){
		let len:number = EliminateLogic.eliminates.length;
		let rel:boolean;
		for(let i=0;i<len;i++){
			let etype:string = "";
			let l:number = EliminateLogic.eliminates[i].length;
			for(let j=0;j<l;j++){
				etype = GameData.GameElements[EliminateLogic.eliminates[i][j]].type;
				rel = this.levelRequirementController.isRequiredElementType(etype);
				// 有相同关卡类型,运动到指定位置
				if(rel){
					let p:egret.Point = new egret.Point();
					GameData.requiredElementManagement.updateNumText(etype,1);
					this.levelRequirementController.updateElementNum();
					this.gameElementController.playMoveToRequiredElement(EliminateLogic.eliminates[i][j],p.x,p.y);
				}
				else{
					this.gameElementController.playScaleAndRemove(EliminateLogic.eliminates[i][j]);
				}
			}
		}
	}

	// 所有元素都删除完毕后,创建新元素,并解析视图
	private createNewElement(evt:CustomizedEvent){
		this.mapController.updateMap();
		this.gameElementController.updateMapData();
	}

	// 删除动画完成后,检测地图中是否剩余可消除元素
	private checkOtherElementLink(evt:CustomizedEvent){
		if(EliminateLogic.isHaveSeries()){
			this.removeAniOver(null);
		}
		else{
			if(!EliminateLogic.isHaveFormedSeries()){
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
			if(GameData.surplusStep == 0){
				this.gameoverpanel = new GameOverPanel();
				this.gameStage.addChild(this.gameoverpanel);
				if(GameData.requiredElementManagement.isAllElementEliminated()){
					this.gameoverpanel.show(true);
				}
				else{
					this.gameoverpanel.show(false);
				}
			}
			else{
				if(GameData.requiredElementManagement.isAllElementEliminated()){
					this.gameoverpanel = new GameOverPanel();
					this.gameStage.addChild(this.gameoverpanel);
					this.gameoverpanel.show(true);
				}
			}
		}
	}

	// 携带道具被点击
	private usePropClick(evt:CustomizedEvent){
		// 操作数据
		PropLogic.useProp(PropElementController.propType , evt.propToElementLocation);
		this.propElementController.useProp();
		// 播放删除动画
		this.removeAniOver(null);
	}
}