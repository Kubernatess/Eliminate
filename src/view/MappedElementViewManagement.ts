/**
 * 消除元素控制器,负责操作卡片元素的样式与行为
 */
class MappedElementViewManagement extends egret.EventDispatcher {

	// 卡片元素显示容器
	private layer:egret.Sprite;

	public constructor(elementLayer:egret.Sprite) {
		super();
		this.layer = elementLayer;
		this.init();
	}

	// ElementView对象池,最多64个
	private elementViews:ElementView[];

	// 初始化所有的ElementView
	private init(){
		this.elementViews = new Array();
		let l:number = GameData.maxRow * GameData.maxColumn;
		let el:ElementView;
		for(let i=0;i<l;i++){
			el = new ElementView(this.layer);
			el.id = i;
			el.location = GameData.elements[i].location;
			this.elementViews.push(el);
			// 
			el.addEventListener(ElementViewManagementEvent.REMOVE_ANIMATION_OVER,this.removeAniOver,this);
			// 当卡片元素被点击时响应事件
			el.addEventListener(egret.TouchEvent.TOUCH_TAP,this.elTap,this);
			el.addEventListener(ElementViewManagementEvent.UPDATE_MAP,this.updateMap,this);
			el.addEventListener(ElementViewManagementEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
		}
	}

	// 当前被点击(即将获取焦点)的元素ID,如为-1则表示没有元素获取焦点
	private currentTapID:number = -1;

	// 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑,
	private elTap(evt:egret.TouchEvent){
		// proptype=-1表示没有使用道具的情况
		if(PropViewManagement.proptype == -1){
			// 获取用户点击的卡片元素
			if(evt.currentTarget instanceof ElementView){
				let ev:ElementView = <ElementView> evt.currentTarget;
				if(this.currentTapID!=-1){
					// 如果currentTapID本来就是当前元素id,那现在相当于当前元素点击了第二次
					// 第一次点击元素设置卡片样式,第二次恢复默认样式
					if(ev.id==this.currentTapID){
						ev.setFocus(false);
						this.currentTapID = -1;
					}
					// 如果currentTapID本身不在当前元素,然后现在用户点击了当前元素,那么用户点击的元素和焦点元素,将尝试执行交换两个卡片元素
					else{
						let event:ElementViewManagementEvent = new ElementViewManagementEvent(ElementViewManagementEvent.TAP_TWO_ELEMENT);
						// 另一个卡片元素,而且这个元素处于焦点状态
						event.elementA = this.currentTapID;
						// 当前点击的那个卡片元素
						event.elementB = ev.id;
						this.dispatchEvent(event);
					}
				}
				// 如果当前地图上没有焦点卡片元素
				else{
					ev.setFocus(true);
					this.currentTapID = ev.id;
				}
			}
		}
		// 使用了道具的情况下
		// 道具是这样使用的,先点击道具,然后再消除元素
		else{
			// 点击道具元素,相当于点击了地图之外的位置,这时候取消焦点元素
			if(this.currentTapID!=-1){
				this.currentTapID = -1;
			}
			let evts:ElementViewManagementEvent = new ElementViewManagementEvent(ElementViewManagementEvent.USE_PROP_CLICK);
			evts.propToElementLocation = (<ElementView>evt.currentTarget).location;
			this.dispatchEvent(evts);
		}
	}

	// 改变焦点,将旧焦点取消,设置新对象焦点
	public setNewElementFocus(location:number){
		this.elementViews[this.currentTapID].setFocus(false);
		this.elementViews[location].setFocus(true);
		this.currentTapID = location;
	}

	// 播放一个交换动画,然后两个位置再回来
	public changeLocationAndBack(id1:number,id2:number){
		if(this.elementViews[id1].focus){
			// 交换元素的时候焦点效果会消失掉
			this.elementViews[id1].setFocus(false);
			// 现在elementViews[id1]是被选中的元素,交换的时候,必须要保证elementViews[id1]的Z轴在另一个元素之上
			if(this.layer.getChildIndex(this.elementViews[id1]) < this.layer.getChildIndex(this.elementViews[id2])){
				this.layer.swapChildren(this.elementViews[id1],this.elementViews[id2]);
			}
			// moveAndBack第二个参数设置为true,因为当选中了第一个卡片元素,然后跟第二个元素互换的时候,第一个元素通过放大大小,交换的时候就可以盖在第二个元素上面
			this.elementViews[id1].moveAndBack(this.elementViews[id2].location,true);
			this.elementViews[id2].moveAndBack(this.elementViews[id1].location);
		}
		else if(this.elementViews[id2].focus){
			this.elementViews[id2].setFocus(false);
			if(this.layer.getChildIndex(this.elementViews[id1]) > this.layer.getChildIndex(this.elementViews[id2])){
				this.layer.swapChildren(this.elementViews[id1],this.elementViews[id2]);
			}
			this.elementViews[id1].moveAndBack(this.elementViews[id2].location);
			this.elementViews[id2].moveAndBack(this.elementViews[id1].location,true);
		}
		// 交换元素的时候焦点效果会消失掉
		this.currentTapID = -1;
	}

	// 播放一个交换动画,然后两个位置不再回来,注意这时候两个元素只是执行了互换操作,但还没有真正执行消除操作
	public changeLocationAndScale(id1:number,id2:number){
		if(this.elementViews[id1].focus){
			this.elementViews[id1].setFocus(false);
			if(this.layer.getChildIndex(this.elementViews[id1]) < this.layer.getChildIndex(this.elementViews[id2])){
				this.layer.swapChildren(this.elementViews[id1],this.elementViews[id2]);
			}
			this.elementViews[id1].moveAndScale(this.elementViews[id2].location,true);
			this.elementViews[id2].moveAndScale(this.elementViews[id1].location);
		}
		else if(this.elementViews[id2].focus){
			this.elementViews[id2].setFocus(false);
			if(this.layer.getChildIndex(this.elementViews[id1]) > this.layer.getChildIndex(this.elementViews[id2])){
				this.layer.swapChildren(this.elementViews[id1],this.elementViews[id2]);
			}
			this.elementViews[id1].moveAndScale(this.elementViews[id2].location);
			this.elementViews[id2].moveAndScale(this.elementViews[id1].location,true);
		}
		this.currentTapID = -1;
	}

	// 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
	public showAllElement(){
		this.layer.removeChildren();
		let girdWidth:number = (GameData.stageW-40)/GameData.maxColumn;
		let startY:number = (GameData.stageH-(GameData.stageW-30)/6-60)-girdWidth*GameData.maxColumn;
		let ele:ElementView;
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				if(GameData.mapData[i][j]!=-1){
					ele = this.elementViews[GameData.mapData[i][j]];
					ele.setTexture("e"+GameData.elements[GameData.mapData[i][j]].type+"_png");
					ele.x = ele.currentX();
					ele.y = startY-ele.width;
					ele.show((50*GameData.maxColumn*GameData.maxRow-50*GameData.unmapnum)-(i*GameData.maxRow+j));
				}
			}
		}
	}


	/*--------------------------动画播放控制----------------------------*/

	// 即将消除的元素数量
	private removenum:number = 0;

	// 消除动画播放结束后,调用这个函数
	// 因为每个元素被消除时,会有先后顺序的,所以要作一个数量标记
	private removeAniOver(evt:ElementViewManagementEvent){
		this.removenum++;
		if(this.removenum==2){
			this.removenum = 0;
			this.dispatchEvent(evt);
		}
	}


	// 即将消除元素的数量
	private moveeleNum:number = 0;

	// 播放曲线动画,用于消除过关条件元素的情况下. 同上,也要作数量标记
	public playLevelRequireEliminateAnimation(id:number,tx:number,ty:number){
		this.moveeleNum++;
		let el:ElementView = this.elementViews[id];
		if(el.parent){
			// 将过关条件元素放置于最顶层
			this.layer.setChildIndex(el,this.layer.numChildren);
		}
		el.LevelRequireEliminateAnimation(tx,ty);
	}

	// 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
	public playEliminateAnimation(id:number){
		this.moveeleNum++;
		let el:ElementView = this.elementViews[id];
		if(el.parent){
			this.layer.setChildIndex(el,this.layer.numChildren);
		}
		el.EliminateAnimation();
	}

	// 消除动画完成,现在更新地图元素
	private updateMap(evt:ElementViewManagementEvent){
		this.moveeleNum--;
		if(this.moveeleNum==0){
			// 消除动画全部播放完毕,然后派发一个结束的时间
			this.dispatchEvent(evt);
		}
	}


	// 重新布局,更新整个地图中元素位置
	public updateMapData(){
		let len:number = this.elementViews.length;
		this.moveLocElementNum = 0;
		for(let i=0;i<len;i++){
			this.elementViews[i].location = GameData.elements[i].location;
			this.elementViews[i].setTexture("e"+GameData.elements[i].type+"_png");
			this.elementViews[i].moveNewLocation();
		}
	}

	private moveLocElementNum = 0;

	// 新位置掉落结束
	private moveNewLocationOver(event:ElementViewManagementEvent){
		this.moveLocElementNum++;
		if(this.moveLocElementNum == (GameData.maxRow*GameData.maxColumn)){
			let evt:ElementViewManagementEvent = new ElementViewManagementEvent(ElementViewManagementEvent.UPDATE_VIEW_OVER);
			this.dispatchEvent(evt);
		}
	}

	// 当游戏没有元素可以再消除的时候,需要打乱所有元素,移动全部元素位置
	public updateOrder(){
		let len:number = this.elementViews.length;
		egret.Tween.removeAllTweens();
		for(let i=0;i<len;i++){
			this.elementViews[i].location = GameData.elements[i].location;
			this.elementViews[i].moveDown();
		}
	}
}