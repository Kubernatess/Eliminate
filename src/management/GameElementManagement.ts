/**
 * 游戏元素控制器,负责操作游戏元素的样式与行为
 */
class GameElementManagement extends egret.EventDispatcher {

	public container:egret.DisplayObjectContainer;
	
	public constructor(container:egret.DisplayObjectContainer) {
		super();
		this.container = container;
	}


	// 创建地图上所有的游戏元素
	public createElements(){
		this.container.removeChildren();
		let len:number = MapData.maxRow*MapData.maxCol;
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
				let element:GameElement = new GameElement();
				let index = i*MapData.maxRow+j;
				this.container.addChildAt(element,index);
				element.setType(type);				
				// 播放出场动画
				element.show(index);
				// 必须等它就位以后才能点击
				element.touchEnabled = true;
				// 必须等到元素出场完毕后再监听事件,每次重新开始游戏的时候都要重新监听
				element.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
				element.addEventListener(CustomizedEvent.SWAP_ELEMENT,this.onSwapElement,this);
				element.addEventListener(CustomizedEvent.ELIMINATE_OVER,this.onEliminateOver,this);
				element.addEventListener(CustomizedEvent.UPDATE_MAP,this.onUpdateMap,this);
				//ele.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
			}
		}
	}

	private getRandomType():string {
		let rand = Math.floor(Math.random()*GameData.GameElementTypes.length);
		return GameData.GameElementTypes[rand];
	}

	
	// 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑
	private onTouchTap(event:egret.TouchEvent){
		// 没有使用道具的情况
		if(PropElementManagement.propType=="" && event.currentTarget instanceof GameElement){
			// 获取用户点击的游戏元素
			let element:GameElement = <GameElement>event.currentTarget;
			// 如果当前地图上没有焦点卡片元素
			if(CustomizedEvent.currentTap==-1){
				element.focusEffect(true);
				CustomizedEvent.currentTap = this.container.getChildIndex(element);
			}
			else{
				// 如果currentTapID本来就是当前元素id,那现在相当于当前元素点击了第二次
				if(CustomizedEvent.currentTap==this.container.getChildIndex(element)){
					element.focusEffect(false);
					CustomizedEvent.currentTap = -1;
				}
				// 如果currentTapID本身有记录,然后现在用户点击了另一个元素,则派发点击两个元素事件
				else{
					CustomizedEvent.anotherTap = this.container.getChildIndex(element);
					let evt:CustomizedEvent = new CustomizedEvent(CustomizedEvent.TAP_TWO_ELEMENT);
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
	}


	// 判断两个元素是否能交换
	public canMove():boolean {
		let row1 = Math.floor(CustomizedEvent.currentTap/MapData.maxCol);
		let row2 = Math.floor(CustomizedEvent.anotherTap/MapData.maxCol);
		let col1 = CustomizedEvent.currentTap%MapData.maxRow;
		let col2 = CustomizedEvent.anotherTap%MapData.maxRow;
		if(row1==row2 && Math.abs(col1-col2)==1){
            return true;
        }
        if(col1==col2 && Math.abs(row1-row2)==1) {
            return true;
        }
        return false;
    }

	public swapElement(){
		(<GameElement>this.container.getChildAt(CustomizedEvent.currentTap)).moveTo(CustomizedEvent.anotherTap);
		(<GameElement>this.container.getChildAt(CustomizedEvent.anotherTap)).moveTo(CustomizedEvent.currentTap);
	}

	private swapElementNum:number = 0;
	private onSwapElement(evt:CustomizedEvent){
		this.swapElementNum++;
		if(this.swapElementNum==2){
			this.swapElementNum = 0;
			this.dispatchEvent(evt);
		}
	}


	//把所有可消除的元素保存起来
	public eliminates:number[];

	// 在交换卡片元素之后,全局判断是否有连线消除
	public isHaveSeries():boolean {
		this.eliminates = [];
		// 横向循环判断
		for(let i=0; i<MapData.maxRow; i++){
			let currentType:string = "";
			let typeNum:number = 0;
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
		}
		
		// 纵向循环判断,方法同上
		for(let i=0; i<MapData.maxRow; i++){
			let currentType:string = "";
			let typeNum:number = 0;
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
			}
			// 列末尾判断
			if(typeNum >= 3){
				for(let k=0; k<typeNum; k++){
					if(this.eliminates.indexOf((MapData.maxRow-k-1)*MapData.maxCol+i)==-1){
						this.eliminates.push((MapData.maxRow-k-1)*MapData.maxCol+i);
					}				
				}
			}
		}
		// 返回最终结果
		if(this.eliminates.length > 0){
			return true;
		}
		return false;
	}

	// 播放一个交换动画,然后再回来
	public changeLocationAndBack(){
		if(this.container.getChildIndex(this.elementViews[evt.ele1]) < this.container.getChildIndex(this.elementViews[evt.ele2])){
			this.container.swapChildren(this.elementViews[evt.ele1],this.elementViews[evt.ele2]);
		}
		this.elementViews[evt.ele1].moveAndBack(evt.ele2,true);
		this.elementViews[evt.ele2].moveAndBack(evt.ele1,false);
	}

	// 播放一个交换动画,然后两个位置不再回来,注意这时候两个元素只是执行了互换操作,但还没有真正执行消除操作
	public changeLocationAndScale(evt:CustomizedEvent){
		if(this.container.getChildIndex(this.elementViews[evt.ele1]) < this.container.getChildIndex(this.elementViews[evt.ele2])){
			this.container.swapChildren(this.elementViews[evt.ele1],this.elementViews[evt.ele2]);
		}
		this.elementViews[evt.ele1].moveAndScale(evt.ele2,true);
		this.elementViews[evt.ele2].moveAndScale(evt.ele1,false);

		let temp:GameElementView = this.elementViews[evt.ele1];
		this.elementViews[evt.ele1] = this.elementViews[evt.ele2];
		this.elementViews[evt.ele2] = temp;
	}


	// 因为消除元素这个动作有两个元素需要交换,交换的时候两个元素都要执行一次动画
	// 必须要等到两个元素执行完动画之后,才触发消除元素事件响应
	private removeNum:number = 0;
	private onEliminateOver(evt:CustomizedEvent){
		this.removeNum++;
		if(this.removeNum==2){
			this.removeNum = 0;
			this.dispatchEvent(evt);
		}
	}


	// 即将消除元素的数量
	private moveeleNum:number = 0;

	// 用于消除过关条件元素. 同上,也要作数量标记
	public playMoveToRequiredElement(ele:number,point:egret.Point){
		this.moveeleNum++;
		// 将条件元素放置于最顶层
		let view:GameElementView = this.elementViews[ele];
		view.moveToRequiredElement(point);
	}

	// 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
	public playScaleAndRemove(ele:number){
		this.moveeleNum++;
		let view:GameElementView = this.elementViews[ele];
		view.scaleAndRemove();
	}

	// 消除动画完成,现在更新地图元素
	private onUpdateMap(evt:CustomizedEvent){
		this.moveeleNum--;
		if(this.moveeleNum==0){
			// 消除动画全部播放完毕,然后派发一个结束的时间
			this.dispatchEvent(evt);
		}
	}


	// 对某一个卡片元素,更新它的类型
	public changeTypeByID(id:number){
		GameData.GameElements[id].type = this.getRandomType();
	}

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
	public updateMap(){
		let len = this.eliminates.length;
		// 记录每一个被消除元素当前的列编号
		let colarr:number[] = [];
		for(let i=0;i<len;i++){
			// 同上面一样,colarr只存放不重复的列编号
			if(colarr.indexOf(this.eliminates[i]%MapData.maxRow) == -1){
				colarr.push(this.eliminates[i]%MapData.maxRow);
			}
		}

		// 循环对每一列进行调整
		len = colarr.length;
		for(let i=0;i<len;i++){
			// 当一些元素被消除,上面的整列元素准备要下来,newcolids就是用来存放这些正准备下落的又不是新出现的卡片元素
			let newcolids:number[] = [];
			// 保存那些被消除的元素,但是与ids不同,removeids只是其中一列
			let removeids:number[] = [];
			for(let j=MapData.maxRow-1; j>=0; j--){
				if(this.eliminates.indexOf(j*MapData.maxRow+i) == -1){
					newcolids.push(j*MapData.maxRow+i);
				}
				else{
					removeids.push(j*MapData.maxRow+i);
				}
			}

			// 虽然上面把newcolids和removeids拆分开来,现在又把它们两个再次合并,但是合并结果不一样,removeids拼接在newcolids的后面
			newcolids = newcolids.concat(removeids);
			for(let j=MapData.maxRow-1; j>=0; j--){
				// 最后重新调整位置之后,被消除的卡片元素的id会放在上面依次排列
				GameData.mapData[j][colarr[i]] = newcolids[0];
				GameData.GameElements[newcolids[0]].location = j*GameData.maxRow+colarr[i];
				newcolids.shift();
			}
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


	// 新位置掉落结束
	private moveLocElementNum = 0;
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
	}
}