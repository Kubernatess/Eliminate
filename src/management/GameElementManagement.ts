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
		for(let i=0; i<MapData.maxRow; i++){
			for(let j=0; j<MapData.maxCol; j++){
				// 当前类型
				let type:string = "";
				let haveSeries:boolean = true;
				// 纵向类型
				let ztype:string = "";
				// 横向类型
				let htype:string = "";
				if(i>1 && (<GameElement>this.container.getChildAt((i-1)*MapData.maxRow+j)).getType()==(<GameElement>this.container.getChildAt((i-2)*MapData.maxRow+j)).getType()){
					// 在当前卡片元素上面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
					ztype = (<GameElement>this.container.getChildAt((i-1)*MapData.maxRow+j)).getType();
				}
				if(j>1 && (<GameElement>this.container.getChildAt(i*MapData.maxRow+j-1)).getType()==(<GameElement>this.container.getChildAt(i*MapData.maxRow+j-2)).getType()){
					// 在当前卡片元素前面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
					htype = (<GameElement>this.container.getChildAt(i*MapData.maxRow+j-1)).getType();
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
				let index = i*MapData.maxRow+j;
				let element:GameElement = new GameElement();
				this.container.addChildAt(element,index);
				element.setType(type);
				// 播放出场动画
				element.show(index);
				// 必须等它就位以后才能点击
				element.touchEnabled = true;
				// 必须等到元素出场完毕后再监听事件,每次重新开始游戏的时候都要重新监听
				element.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
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


	// 当前被点击(即将获取焦点)的元素位置,如为-1则表示没有元素获取焦点
	private currentTap:number = -1;

	// 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑,
	private onTouchTap(event:egret.TouchEvent){
		// proptype==null表示没有使用道具的情况
		if(PropElementManagement.propType == ""){
			// 获取用户点击的游戏元素
			if(event.currentTarget instanceof GameElement){
				let element:GameElement = <GameElement>event.currentTarget;
				// 如果当前地图上没有焦点卡片元素
				if(this.currentTap==-1){
					element.focusEffect(true);
					this.currentTap = element.getIndex();
				}
				// currentTap!=-1说明已经有记录了
				else{
					// 如果currentTapID本来就是当前元素id,那现在相当于当前元素点击了第二次
					if(element.getIndex()==this.currentTap){
						element.focusEffect(false);
						this.currentTap = -1;
					}
					// 如果currentTapID本身不在当前元素,然后现在用户点击了当前元素,那么用户点击的元素和焦点元素,将尝试执行交换两个卡片元素
					else{
						let evt:CustomizedEvent = new CustomizedEvent(CustomizedEvent.TAP_TWO_ELEMENT);
						// 当前点击的那个游戏元素
						evt.currentTap = this.currentTap;
						// 另一个游戏元素,而且这个元素处于焦点状态
						evt.anotherTap = element.getIndex();						
						// 触发点击两个元素事件
						this.dispatchEvent(evt);					
					}
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
	}


	// 判断两个元素是否能交换
	public canMove(evt:CustomizedEvent):boolean {
		let currentTapRow = Math.floor(evt.currentTap/MapData.maxCol);
		let anotherTapRow = Math.floor(evt.anotherTap/MapData.maxCol);
		let currentTapCol = evt.currentTap%MapData.maxRow;
		let anotherTapCol = evt.anotherTap%MapData.maxRow;
		if((currentTapRow==anotherTapRow) && (Math.abs(currentTapCol-anotherTapCol)==1)) {
            return true;
        }
        if((currentTapCol==anotherTapCol) && (Math.abs(currentTapRow-anotherTapRow)==1)) {
            return true;
        }
        return false;
    }


	// 改变焦点,将旧焦点取消,设置新对象焦点
	public setNewElementFocus(evt:CustomizedEvent){
		this.selector(evt.currentTap).focusEffect(false);
		this.selector(evt.anotherTap).focusEffect(true);
		this.currentTap = evt.anotherTap;
	}

	// 元素选择器
	private selector(index:number):GameElement{
		for(let i=0; i<this.container.numChildren; i++){
			let element:GameElement = (<GameElement>this.container.getChildAt(i));
			if(element.getIndex()==index){
				return element;
			}
		}
	}
	// 播放一个交换动画,然后两个位置再回来
	public swapLocation(evt:CustomizedEvent){
		// 交换元素的时候焦点效果会消失掉
		if(this.currentTap!=-1){
			this.selector(this.currentTap).focusEffect(false);
			this.currentTap = -1;
		}		
		// 执行动画
		this.selector(evt.currentTap).moveTo(evt.anotherTap);
		this.selector(evt.anotherTap).moveTo(evt.currentTap);
	}

	// 播放一个交换动画,然后两个位置不再回来,注意这时候两个元素只是执行了互换操作,但还没有真正执行消除操作
	/*public changeLocationAndScale(id1:number,id2:number){
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


	//把所有可消除元素的组合保存在一维数组,一维数组存储的值是游戏元素的location
	private eliminates:number[];

	// 在交换卡片元素之后,全局判断是否有连线消除
	public isHaveSeries():boolean {
		this.eliminates = [];
		// 记录当前类型的一个指针
		let currentType:string = "";
		// 当前检索类型的数量
		let typeNum:number = 0;

		// 横向循环判断
		for(let i=0; i<MapData.maxRow; i++){
			for(let j=0; j<MapData.maxCol; j++){				
				if(currentType == (<GameElement>this.container.getChildAt(i*MapData.maxRow+j)).getType()){
					typeNum++;					
				}
				// 如果当前的类型与对象池存放的游戏元素类型不同,表明上一组的检测结束了
				else {
					// 如果上一次的检索类型数量大于等于3,把这组可消除元素全部存起来
					if(typeNum >= 3){
						for(let k=0; k<typeNum; k++){
							if(this.eliminates.indexOf(i*MapData.maxRow+j-k-1)==-1){
								this.eliminates.push(i*MapData.maxRow+j-k-1);
							}					
						}
					}
					// 重置当前类型和检索类型计数器
					currentType = (<GameElement>this.container.getChildAt(i*MapData.maxRow+j)).getType();
					typeNum = 1;
				}
			}
			// 最后行结尾还要再统计一次typeNum
			if(typeNum >= 3){
				let eliminate:number[] = [];
				for(let k=0; k<typeNum; k++){
					if(this.eliminates.indexOf(i*MapData.maxRow+MapData.maxCol-k-1)==-1){
						this.eliminates.push(i*MapData.maxRow+MapData.maxCol-k-1);
					}
				}
			}
			// 把当前类型和检索类型计数器纸为空
			currentType = "";
			typeNum = 0;
		}
		
		// 纵向循环判断,方法同上
		for(let i=0; i<MapData.maxRow; i++){
			for(let j=0; j<MapData.maxCol; j++){
				if(currentType == (<GameElement>this.container.getChildAt(j*MapData.maxCol+i)).getType()){
					typeNum++;
				}
				else {					
					if(typeNum >= 3){
						for(let k=0; k<typeNum; k++){
							if(this.eliminates.indexOf((j-k-1)*MapData.maxCol+i)==-1){
								this.eliminates.push((j-k-1)*MapData.maxCol+i);
							}
						}
					}
					currentType = (<GameElement>this.container.getChildAt(j*MapData.maxCol+i)).getType();
					typeNum = 1;
				}			
				currentType = "";
				typeNum = 0;
			}
			// 列末尾判断
			if(typeNum >= 3){
				for(let k=0; k<typeNum; k++){
					if(this.eliminates.indexOf((MapData.maxRow-k-1)*MapData.maxCol+i)==-1){
						this.eliminates.push((MapData.maxRow-k-1)*MapData.maxCol+i);
					}				
				}
			}
			currentType = "";
			typeNum = 0;
		}
		// 返回最终结果
		if(this.eliminates.length > 0){
			return true;
		}
		return false;
	}



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