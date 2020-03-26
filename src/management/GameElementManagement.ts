/**
 * 游戏元素控制器,负责操作游戏元素的样式与行为
 */
class GameElementManagement extends egret.EventDispatcher {

	private container:egret.DisplayObjectContainer;

	public constructor(container:egret.DisplayObjectContainer) {
		super();
		this.container = container;
	}


	// 创建地图上所有的游戏元素
	public createElements(){
		this.container.removeChildren();
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				// 当前类型
				let type:string = "";
				let haveSeries:boolean = true;
				// 纵向类型
				let ztype:string = "";
				// 横向类型
				let htype:string = "";
				if(i>1 && ((<GameElement>this.container.getChildAt((i-1)*GameData.maxRow+j)).type == (<GameElement>this.container.getChildAt((i-2)*GameData.maxRow+j)).type)){
					// 在当前卡片元素上面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
					ztype = (<GameElement>this.container.getChildAt((i-1)*GameData.maxRow+j)).type;
				}
				if(j>1 && ((<GameElement>this.container.getChildAt(i*GameData.maxRow+j-1)).type == (<GameElement>this.container.getChildAt(i*GameData.maxRow+j-2)).type)){
					// 在当前卡片元素前面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
					htype = (<GameElement>this.container.getChildAt(i*GameData.maxRow+j-1)).type;
				}
				// 判断是否有三个相连的游戏元素,确保游戏一开始不允许自动消除
				while(haveSeries){
					// 循环获取随机类型
					type = this.getRandomType();
					if(type!=ztype && type!=htype){
						haveSeries = false;
					}
				}
				/*-- 到这里为止,元素类型已经确定下来 --*/
				// 创建新的游戏元素
				let index = i*GameData.maxRow+j;
				let element:GameElement = new GameElement();
				this.container.addChild(element);
				element.type = type;
				element.location = index;
				element.bitmap.texture = RES.getRes(element.type+"_png");
				// 播放出场动画
				element.show(50*(GameData.maxRow*GameData.maxColumn-index));
				// 必须等它就位以后才能点击
				element.touchEnabled = true;
				// 必须等到元素出场完毕后再监听事件,每次重新开始游戏的时候都要重新监听
				//ele.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
				//ele.addEventListener(CustomizedEvent.ELIMINATE_OVER,this.onEliminateOver,this);
				//ele.addEventListener(CustomizedEvent.UPDATE_MAP,this.updateMap,this);
				//ele.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
			}
		}
	}

	// 随机生成地图元素的类型
	private getRandomType():string {
		let rand = Math.floor(Math.random()*GameData.GameElementTypes.length);
		return GameData.GameElementTypes[rand];
	}


	// 当前被点击(即将获取焦点)的元素ID,如为-1则表示没有元素获取焦点
	private currentTapID:number = -1;

	// 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑,
	/*private onTouchTap(event:egret.TouchEvent){
		// proptype==null表示没有使用道具的情况
		if(PropElementManagement.propType == null){
			// 获取用户点击的游戏元素
			if(event.currentTarget instanceof GameElement){
				let ele:GameElement = <GameElement> event.currentTarget;
				// currentTapID!=-1说明已经有记录了
				if(this.currentTapID!=-1){
					// 如果currentTapID本来就是当前元素id,那现在相当于当前元素点击了第二次
					// 第一次点击元素设置卡片样式,第二次恢复默认样式
					if(ele.id==this.currentTapID){
						ele.focusEffect(false);
						this.currentTapID = -1;
					}
					// 如果currentTapID本身不在当前元素,然后现在用户点击了当前元素,那么用户点击的元素和焦点元素,将尝试执行交换两个卡片元素
					else{
						let evt:CustomizedEvent = new CustomizedEvent(CustomizedEvent.TAP_TWO_ELEMENT);
						// 另一个游戏元素,而且这个元素处于焦点状态
						evt.element1 = this.currentTapID;
						// 当前点击的那个游戏元素
						evt.element2 = ele.id;
						// 触发点击两个元素事件
						this.dispatchEvent(evt);
					}
				}
				// 如果当前地图上没有焦点卡片元素
				else{
					ele.focusEffect(true);
					this.currentTapID = ele.id;
				}
			}
		}
		// 使用了道具的情况下
		// 道具是这样使用的,先点击道具,然后再消除元素
		else{
			if(this.currentTapID!=-1){
				this.currentTapID = -1;
			}
			let evt:CustomizedEvent = new CustomizedEvent(CustomizedEvent.USE_PROP_CLICK);
			evt.propToElementLocation = (<GameElement>evt.currentTarget).location;
			this.dispatchEvent(evt);
		}
	}

	// 改变焦点,将旧焦点取消,设置新对象焦点
	public setNewElementFocus(location:number){
		this.elements[this.currentTapID].focusEffect(false);
		this.elements[location].focusEffect(true);
		this.currentTapID = location;
	}

	// 播放一个交换动画,然后两个位置再回来
	public changeLocationAndBack(id1:number,id2:number){
		if(this.elements[id1].getfocus()){
			// 交换元素的时候焦点效果会消失掉
			this.elements[id1].focusEffect(false);
			// 现在elementViews[id1]是被选中的元素,交换的时候,必须要保证elementViews[id1]的Z轴在另一个元素之上
			if(this.container.getChildIndex(this.elements[id1]) < this.container.getChildIndex(this.elements[id2])){
				this.container.swapChildren(this.elements[id1],this.elements[id2]);
			}
			// moveAndBack第二个参数设置为true,因为当选中了第一个卡片元素,然后跟第二个元素互换的时候,第一个元素通过放大大小,交换的时候就可以盖在第二个元素上面
			this.elements[id1].moveAndBack(this.elements[id2].location,true);
			this.elements[id2].moveAndBack(this.elements[id1].location);
		}
		else if(this.elements[id2].getfocus()){
			this.elements[id2].focusEffect(false);
			if(this.container.getChildIndex(this.elements[id1]) > this.container.getChildIndex(this.elements[id2])){
				this.container.swapChildren(this.elements[id1],this.elements[id2]);
			}
			this.elements[id1].moveAndBack(this.elements[id2].location);
			this.elements[id2].moveAndBack(this.elements[id1].location,true);
		}
		// 交换元素的时候焦点效果会消失掉
		this.currentTapID = -1;
	}

	// 播放一个交换动画,然后两个位置不再回来,注意这时候两个元素只是执行了互换操作,但还没有真正执行消除操作
	public changeLocationAndScale(id1:number,id2:number){
		if(this.elements[id1].getfocus()){
			this.elements[id1].focusEffect(false);
			if(this.container.getChildIndex(this.elements[id1]) < this.container.getChildIndex(this.elements[id2])){
				this.container.swapChildren(this.elements[id1],this.elements[id2]);
			}
			this.elements[id1].moveAndScale(this.elements[id2].location,true);
			this.elements[id2].moveAndScale(this.elements[id1].location);
		}
		else if(this.elements[id2].getfocus()){
			this.elements[id2].focusEffect(false);
			if(this.container.getChildIndex(this.elements[id1]) > this.container.getChildIndex(this.elements[id2])){
				this.container.swapChildren(this.elements[id1],this.elements[id2]);
			}
			this.elements[id1].moveAndScale(this.elements[id2].location);
			this.elements[id2].moveAndScale(this.elements[id1].location,true);
		}
		this.currentTapID = -1;
	}*/

	


	/*--------------------------动画播放控制----------------------------*/

	// 即将消除的元素数量
	private removeNum:number = 0;

	// 消除动画播放结束后,调用这个函数
	// 因为每个元素被消除时,会有先后顺序的,所以要作一个数量标记
	/*private onEliminateOver(evt:CustomizedEvent){
		this.removeNum++;
		if(this.removeNum==2){
			this.removeNum = 0;
			this.dispatchEvent(evt);
		}
	}


	// 即将消除元素的数量
	private moveeleNum:number = 0;

	// 用于消除过关条件元素. 同上,也要作数量标记
	public playMoveToRequiredElement(id:number,tx:number,ty:number){
		this.moveeleNum++;
		let ele:GameElement = this.elements[id];
		if(ele.parent){
			// 将条件元素放置于最顶层
			this.layer.setChildIndex(ele,this.layer.numChildren);
		}
		ele.moveToRequiredElement(tx,ty);
	}

	// 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
	public playScaleAndRemove(id:number){
		this.moveeleNum++;
		let el:GameElementView = this.elements[id];
		if(el.parent){
			this.layer.setChildIndex(el,this.layer.numChildren);
		}
		el.scaleAndRemove();
	}

	// 消除动画完成,现在更新地图元素
	private updateMap(evt:CustomizedEvent){
		this.moveeleNum--;
		if(this.moveeleNum==0){
			// 消除动画全部播放完毕,然后派发一个结束的时间
			this.dispatchEvent(evt);
		}
	}


	// 重新布局,更新整个地图中元素位置
	public updateMapData(){
		let len:number = this.elements.length;
		this.moveLocElementNum = 0;
		for(let i=0;i<len;i++){
			this.elements[i].location = GameData.GameElements[i].location;
			this.elements[i].setTexture(GameData.GameElements[i].type+"_png");
			this.elements[i].dropDown();
		}
	}

	private moveLocElementNum = 0;

	// 新位置掉落结束
	private dropDownOver(event:CustomizedEvent){
		this.moveLocElementNum++;
		if(this.moveLocElementNum == (GameData.maxRow*GameData.maxColumn)){
			let evt:CustomizedEvent = new CustomizedEvent(CustomizedEvent.UPDATE_VIEW_OVER);
			this.dispatchEvent(evt);
		}
	}

	// 当游戏没有元素可以再消除的时候,需要打乱所有元素,移动全部元素位置
	public updateOrder(){
		let len:number = this.elements.length;
		egret.Tween.removeAllTweens();
		for(let i=0;i<len;i++){
			this.elements[i].location = GameData.GameElements[i].location;
			this.elements[i].moveDown();
		}
	}*/
}