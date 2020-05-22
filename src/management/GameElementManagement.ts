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
				element.addEventListener(CustomizedEvent.SWAP_ELEMENT,this.swapElementHandler,this);
				element.addEventListener(CustomizedEvent.ELIMINATE_OVER,this.onEliminateOver,this);
				element.addEventListener(CustomizedEvent.AUTO_ELIMINATE,this.autoEliminate,this);
				//ele.addEventListener(CustomizedEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
			}
		}
		// 如果没有可消除元素,则需要打乱地图顺序
		if(!this.isHaveSeries()){
			this.disOrder();
		}
	}

	private getRandomType():string {
		let rand = Math.floor(Math.random()*GameData.GameElementTypes.length);
		return GameData.GameElementTypes[rand];
	}

	
	// 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑
	private onTouchTap(event:egret.TouchEvent){
		// 没有使用道具的情况
		if(PropElementManagement.propType==""){
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

	public playSwapElement(){
		(<GameElement>this.container.getChildAt(CustomizedEvent.currentTap)).moveTo(CustomizedEvent.anotherTap);
		(<GameElement>this.container.getChildAt(CustomizedEvent.anotherTap)).moveTo(CustomizedEvent.currentTap);
	}

	private swapElementNum:number = 0;
	private swapElementHandler(evt:CustomizedEvent){
		this.swapElementNum++;
		if(this.swapElementNum==2){
			this.swapElementNum = 0;
			this.dispatchEvent(evt);
		}
	}


	//把所有可消除的元素保存起来
	public eliminates:number[];

	// 收集所有的消除元素
	public collectEliminates() {
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
	}


	// 用于消除过关条件元素. 同上,也要作数量标记
	private eliminateNum:number = 0;
	public playMoveToRequiredElement(ele:number,point:egret.Point){
		this.eliminateNum++;
		// 将条件元素放置于最顶层
		let element:GameElement = <GameElement>this.container.getChildAt(ele);
		element.moveToRequiredElement(point);
	}

	// 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
	public playScaleAndRemove(ele:number){
		this.eliminateNum++;
		let element:GameElement = <GameElement>this.container.getChildAt(ele);
		element.scaleAndRemove();
	}

	// 消除动画全部播放完毕,然后派发一个结束的时间
	private onEliminateOver(evt:CustomizedEvent){
		this.eliminateNum--;
		if(this.eliminateNum==0){
			this.dispatchEvent(evt);
		}
	}

	public dropDownAndNewElement(){
		// 循环每一列
		for(let i=0;i<MapData.maxCol;i++){
			// 循环其中一列的所有的消除元素
			let j:number = MapData.maxRow-1;
			let block:number = 0;
			while(j>=block+1){
				// 如果是被消除元素
				if((<GameElement>this.container.getChildAt(j*MapData.maxRow+i)).getType()==""){
					// 冒泡操作,将元素放到最上面
					for(let k=j; k>=1; k--){
						this.container.swapChildren(<GameElement>this.container.getChildAt(k*MapData.maxRow+i),<GameElement>this.container.getChildAt((k-1)*MapData.maxRow+i));
					}
					block++;
				}
				else{
					j--;
				}
			}
		}

		// 所有的堆叠顺序调整好以后,就可以执行动画
		let len:number = MapData.maxRow * MapData.maxCol;
		for(let i=0; i<len; i++){
			let element:GameElement = <GameElement>this.container.getChildAt(i);
			if(element.getType()==""){
				element.setType(this.getRandomType());
				element.dropDown(this.container.getChildIndex(element));
			}
			else{
				element.moveDown(this.container.getChildIndex(element));
			}			
		}
	}


	// 新位置掉落结束
	private moveLocElementNum = 0;
	private autoEliminate(evt:CustomizedEvent){
		this.moveLocElementNum++;
		if(this.moveLocElementNum == MapData.maxRow*MapData.maxCol){
			this.moveLocElementNum = 0;
			let evt:CustomizedEvent = new CustomizedEvent(CustomizedEvent.AUTO_ELIMINATE);
			this.dispatchEvent(evt);
		}
	}


	// 在游戏开始之前,全局判断能否移动其中一个元素之后可以形成连线消除
	// 如果能够形成连线消除,则继续游戏,否则,打乱所有元素的顺序
	public isHaveSeries():boolean {
		for(let i=0; i<MapData.maxRow; i++){
			for(let j=0; j<MapData.maxCol; j++){
				// 表示当前地图元素
				let element = <GameElement>this.container.getChildAt(i*MapData.maxRow+j);
				// 第一种情况,有两个类型相同的相邻的卡片元素横向排列,寻找它周围的六个元素(先不考虑极限值的情况下)
				if(j<(MapData.maxCol-1) && element.getType()==(<GameElement>this.container.getChildAt(i*MapData.maxRow+j+1)).getType()){
					// 寻找周围六个元素,同样先保证地图块可用,先寻找左侧三个元素
					if(j>0){
						// 判断左上角
						if(i>0 && element.getType()==(<GameElement>this.container.getChildAt((i-1)*MapData.maxRow+j-1)).getType()){
							return true;
						}
						// 判断左下角
						if(i<(MapData.maxRow-1) && element.getType()==(<GameElement>this.container.getChildAt((i+1)*MapData.maxRow+j-1)).getType()){
							return true;
						}
						// 判断左侧跳格
						if(j>1 && element.getType()==(<GameElement>this.container.getChildAt(i*MapData.maxRow+j-2)).getType()){
							return true;
						}
					}
					// 寻找右侧三个元素,以当前地图块为准,以相隔右侧一个地图块作为中心点,去寻找右侧三个元素
					if(j<(MapData.maxCol-2)){
						// 判断右上角
						if(i>0 && element.getType()==(<GameElement>this.container.getChildAt((i-1)*MapData.maxRow+j+2)).getType()){
							return true;
						}
						// 判断右下角
						if(i<(MapData.maxRow-1) && element.getType()==(<GameElement>this.container.getChildAt((i+1)*MapData.maxRow+j+2)).getType()){
							return true;
						}
						// 判断右侧跳格
						if(j<(MapData.maxCol-3) && element.getType()==(<GameElement>this.container.getChildAt(i*MapData.maxRow+j+3)).getType()){
							return true;
						}
					}
				}

				// 同样是第一种情况,只是纵向排列(也是不考虑极限值的情况下)
				if(i<(MapData.maxRow-1) && element.getType()==(<GameElement>this.container.getChildAt((i+1)*MapData.maxRow+j)).getType()){
					// 寻找周围六个元素,同样先保证地图块可用,先寻找上侧三个元素
					if(i>0){
						// 判断左上角
						if(j>0 && element.getType()==(<GameElement>this.container.getChildAt((i-1)*MapData.maxRow+j-1)).getType()){
							return true;
						}
						// 判断右上角
						if(j<(MapData.maxCol-1) && element.getType()==(<GameElement>this.container.getChildAt((i-1)*MapData.maxRow+j+1)).getType()){
							return true;
						}
						// 判断上方跳格
						if(i>1 && element.getType()==(<GameElement>this.container.getChildAt((i-2)*MapData.maxRow+j)).getType()){
							return true;
						}
					}
					// 寻找下方三个元素,以当前地图块为准,以相隔下方一个地图块作为中心点,去寻找下方三个元素
					if(i<(MapData.maxRow-2)){
						// 判断左下角
						if(j>0 && element.getType()==(<GameElement>this.container.getChildAt((i+2)*MapData.maxRow+j-1)).getType()){
							return true;
						}
						// 判断右下角
						if(j<(MapData.maxCol-1) && element.getType()==(<GameElement>this.container.getChildAt((i+2)*MapData.maxRow+j+1)).getType()){
							return true;
						}
						// 判断下方跳格
						if(i<(MapData.maxRow-3) && element.getType()==(<GameElement>this.container.getChildAt((i+3)*MapData.maxRow+j)).getType()){
							return true;
						}
					}
				}

				// 第二种情况,有两个类型相同的卡片元素横向相隔地排列,中间隔了两个元素(先不考虑极限值的情况下)
				if(j<(MapData.maxCol-2) && element.getType()==(<GameElement>this.container.getChildAt(i*MapData.maxRow+j+2)).getType()){
					// 判断正上方
					if(i>0 && element.getType()==(<GameElement>this.container.getChildAt((i-1)*MapData.maxRow+j+1)).getType()){
						return true;
					}
					// 判断正下方
					if(i<(MapData.maxRow-1) && element.getType()==(<GameElement>this.container.getChildAt((i+1)*MapData.maxRow+j+1)).getType()){
						return true;
					}
				}

				// 第二种情况,有两个类型相同的卡片元素纵向相隔地排列,中间隔了两个元素(也是先不考虑极限值的情况下)
				if(i<(MapData.maxRow-2) && element.getType()==(<GameElement>this.container.getChildAt((i+2)*MapData.maxRow+j)).getType()){
					// 判断左格子
					if(j>0 && element.getType()==(<GameElement>this.container.getChildAt((i+1)*MapData.maxRow+j-1)).getType()){
						return true;
					}
					// 判断右格子
					if(j<(MapData.maxCol-1) && element.getType()==(<GameElement>this.container.getChildAt((i+1)*MapData.maxRow+j+1)).getType()){
						return true;
					}
				}
			}
		}
		return false;
	}


	// 当游戏没有元素可以再消除的时候,需要打乱所有元素,移动全部元素位置
	public disOrder(){
		let len:number = MapData.maxRow * MapData.maxCol;
		egret.Tween.removeAllTweens();
		for(let i=0; i<len; i++){
			let element:GameElement = <GameElement>this.container.getChildAt(i);
			element.setType(this.getRandomType());
			element.dropDown(this.container.getChildIndex(element));
		}
	}
	
}