/**
 * 道具控制器
 */
class PropElementManagement {

	public container:egret.DisplayObjectContainer;
	
	public constructor(container:egret.DisplayObjectContainer) {
		this.container = container;
		// 创建所有道具元素
		for(let i=0;i<5;i++){
			let element:PropElement = new PropElement();
			this.container.addChildAt(element,i);
			element.touchEnabled = true;
			element.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
		}
		this.init();
	}

	// 初始化填充数据
	public init(){
		for(let i=0;i<5;i++){
			let element:PropElement = <PropElement>this.container.getChildAt(i);		
			element.setType(GameData.PropElements[i].type);
			element.setPropNum(GameData.PropElements[i].num);
			element.setX(i);
		}
	}


	// 当前使用的道具元素
	public static propType:string = "";

	private currentTap:number = -1;
	private onTouchTap(evt:egret.TouchEvent){
		let element:PropElement = <PropElement>evt.currentTarget;
		if(this.currentTap == this.container.getChildIndex(element)){
			element.focusEffect(false);
			PropElementManagement.propType = "";
			this.currentTap = -1;
		}
		else{
			if(this.currentTap!=-1){
				(<PropElement>this.container.getChildAt(this.currentTap)).focusEffect(false);
			}			
			element.focusEffect(true);
			this.currentTap = this.container.getChildIndex(element);					
			PropElementManagement.propType = element.getType();
		}
	}


	public useProp(gameElementManagement:GameElementManagement){
		let element:PropElement = <PropElement>this.container.getChildAt(this.currentTap);
		let num:number = element.getPropNum();
		if(num>0){
			element.setPropNum(num-1);
		}		
		element.focusEffect(false);
		// 执行不同的道具
		switch(PropElementManagement.propType){
			case "same":this.samelyEliminate(gameElementManagement);break;
			case "cross":this.crosswiseEliminate(gameElementManagement);break;
			case "line":this.linelyEliminate(gameElementManagement);break;
			case "column":this.columnEliminate(gameElementManagement);break;
			case "single":this.singlyEliminate(gameElementManagement);break;
		}
		this.currentTap = -1;
		PropElementManagement.propType = "";
	}

	// 同色消除
	private samelyEliminate(gameElementManagement:GameElementManagement){
		let type:string = (<GameElement>gameElementManagement.container.getChildAt(CustomizedEvent.currentTap)).getType();
		let len:number = MapData.maxRow * MapData.maxCol;
		for(let i=0; i<len; i++){
			if((<GameElement>gameElementManagement.container.getChildAt(i)).getType()==type){
				gameElementManagement.eliminates.push(i);
			}
		}
	}

	// 消除一周
	private crosswiseEliminate(gameElementManagement:GameElementManagement){
		let row:number = Math.floor(CustomizedEvent.currentTap/MapData.maxCol);
		let col:number = CustomizedEvent.currentTap%MapData.maxRow;
		gameElementManagement.eliminates.push(row*MapData.maxRow+col);
		if(row>0){
			gameElementManagement.eliminates.push((row-1)*MapData.maxRow+col);
		}
		if(row<(MapData.maxRow-1)){
			gameElementManagement.eliminates.push((row+1)*MapData.maxRow+col);
		}
		if(col>0){
			gameElementManagement.eliminates.push(row*MapData.maxRow+col-1);
		}
		if(col<(MapData.maxCol-1)){
			gameElementManagement.eliminates.push(row*MapData.maxRow+col+1);
		}
	}

	// 消除整行
	private linelyEliminate(gameElementManagement:GameElementManagement){
		// 获取行数据
		let row:number = Math.floor(CustomizedEvent.currentTap/MapData.maxCol);
		for(let col=0;col<MapData.maxCol;col++){
			gameElementManagement.eliminates.push(row*MapData.maxRow+col);
		}
	}

	// 消除整列
	private columnEliminate(gameElementManagement:GameElementManagement){
		// 获取列数据
		let col:number = CustomizedEvent.currentTap%MapData.maxRow;
		for(let row=0; row<MapData.maxRow; row++){
			gameElementManagement.eliminates.push(row*MapData.maxRow+col);
		}
	}

	// 消除单一颜色
	private singlyEliminate(gameElementManagement:GameElementManagement){
		gameElementManagement.eliminates.push(CustomizedEvent.currentTap);
	}

}