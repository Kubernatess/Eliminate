/**
 * 游戏主逻辑
 */
class GameLogic {

	private container:egret.DisplayObjectContainer;

	private gameElementManagement:GameElementManagement;
	private requiredElementManagement:RequiredElementManagement;
	private propElementManagement:PropElementManagement;
	private stepNumText:StepNumText;
	private gameoverpanel:GameOverPanel;

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

		// 提前准备好GameOver面板
		this.gameoverpanel = new GameOverPanel();
		this.container.addChild(this.gameoverpanel);	
		this.gameoverpanel.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRestart,this);

		// 监听游戏元素事件
		this.gameElementManagement.addEventListener(CustomizedEvent.TAP_TWO_ELEMENT,this.onTapTwoElement,this);
		this.gameElementManagement.addEventListener(CustomizedEvent.SWAP_ELEMENT,this.swapElementHandler,this);
		this.gameElementManagement.addEventListener(CustomizedEvent.ELIMINATE_OVER,this.onEliminateOver,this);
		this.gameElementManagement.addEventListener(CustomizedEvent.AUTO_ELIMINATE,this.autoEliminate,this);
		//this.gameElementManagement.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.checkOtherElementLink,this);
		//this.gameElementController.addEventListener(CustomizedEvent.USE_PROP_CLICK,this.usePropClick,this);
	}

	private onTapTwoElement(evt:CustomizedEvent){
		// 不管是否执行交换,当前元素的样式都应该被取消
		(<GameElement>this.gameElementManagement.container.getChildAt(CustomizedEvent.currentTap)).focusEffect(false);
		// 先判断两个元素能否可以交换,如果能交换,则执行交换操作
		if(this.gameElementManagement.canMove()){
			this.gameElementManagement.playSwapElement();
		}
		// 否则,设置另一个元素的焦点
		else{
			(<GameElement>this.gameElementManagement.container.getChildAt(CustomizedEvent.anotherTap)).focusEffect(true);
			CustomizedEvent.currentTap = CustomizedEvent.anotherTap;
		}
	}

	private swapElementNum:number = 0;
	private swapElementHandler(){
		this.swapElementNum++;
		// 前面swapElement()已经交换成功,然后交换堆叠顺序
		let displayContainer:egret.DisplayObjectContainer = this.gameElementManagement.container;
		displayContainer.swapChildren(displayContainer.getChildAt(CustomizedEvent.currentTap),displayContainer.getChildAt(CustomizedEvent.anotherTap));
		// 如果是第二次交换,到这里就结束事件派发
		if(this.swapElementNum==2){
			this.swapElementNum = 0;
			CustomizedEvent.currentTap = -1;
		}
		// 如果是第一次交换,才执行判断操作
		else{
			// 把消除元素收集起来
			this.gameElementManagement.collectEliminates();
			// 还要判断消除的是普通的游戏元素还是条件元素	
			if(this.gameElementManagement.eliminates.length>0){
				this.gameElementManagement.container.touchChildren = false;
				this.swapElementNum = 0;
				this.eliminateElements();
				// 更新步数
				let stepNum = this.stepNumText.getNum();
				this.stepNumText.setNum(stepNum-1);
			}
			else{
				// 否则,执行返回操作
				this.gameElementManagement.playSwapElement();
			}
		}
	}

	private eliminateElements(){
		let len:number = this.gameElementManagement.eliminates.length;
		for(let i=0;i<len;i++){
			let ele:number = this.gameElementManagement.eliminates[i];
			let eleType = (<GameElement>this.gameElementManagement.container.getChildAt(ele)).getType();
			let rel:boolean = this.requiredElementManagement.isRequiredElementType(eleType);			
			if(rel){
				// 有相同关卡类型,则运动到指定位置
				let point:egret.Point = this.requiredElementManagement.getPointByType(eleType);
				this.requiredElementManagement.updateNumText(eleType,1);
				this.gameElementManagement.playMoveToRequiredElement(ele,point);
			}
			else{
				this.gameElementManagement.playScaleAndRemove(ele);
			}
		}		
	}


	// 所有元素都删除完毕后,接下来就是元素的下落
	private onEliminateOver(){
		CustomizedEvent.currentTap = -1;
		this.gameElementManagement.dropDownAndNewElement();		
	}

	// 检测地图中是否剩余可消除元素,然后自动执行消除操作
	private autoEliminate(evt:CustomizedEvent){
		this.gameElementManagement.collectEliminates();
		if(this.gameElementManagement.eliminates.length>0){
			this.eliminateElements();
		}
		else{
			// 如果没有可消除元素,则需要打乱地图顺序
			if(!this.gameElementManagement.isHaveSeries()){
				this.gameElementManagement.disOrder();
			}
		}
		this.gameElementManagement.container.touchChildren = true;
		// 检测当前游戏是否GameOver
		if(this.stepNumText.getNum()==0 && !this.requiredElementManagement.isAllElementEliminated()){
			this.gameoverpanel.show();
			this.gameElementManagement.container.touchChildren = false;
		}
	}

	// 点击restart按钮
	private onRestart(){
		this.gameoverpanel.y = -GameData.stageH/2;
		this.requiredElementManagement.init();
		this.stepNumText.setNum(20);
		this.gameElementManagement.container.touchChildren = true;
		this.gameElementManagement.createElements();
		this.propElementManagement.init();
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