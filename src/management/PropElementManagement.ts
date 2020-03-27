/**
 * 道具控制器
 */
class PropElementManagement {

	private container:egret.DisplayObjectContainer;
	
	public constructor(container:egret.DisplayObjectContainer) {
		this.container = container;
		// 创建所有道具元素
		for(let i=0;i<5;i++){
			let element:PropElement = new PropElement();
			this.container.addChild(element);
			element.type = GameData.PropElements[i].type;
			element.bitmap.texture = RES.getRes(element.type+"_png");
			element.numText.text = "x"+GameData.PropElements[i].num;
			// 道具元素之间的间隔为150像素
			let gap:number = 150*GameData.ratio;
			element.x = gap+(gap+element.width)*i;
			//ele.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
		}
	}


	// 当前焦点道具元素
	/*private currentType:string = "";
	private onTouchTap(evt:egret.TouchEvent){
		let ele:PropElement = <PropElement>evt.currentTarget;
		if(this.currentType == ele.type){
			ele.setFocus(false);
			this.currentType = "";
			PropElementManagement.propType = null;

		}
		else{
			this.currentType == ele.type;
			ele.setFocus(true);
			PropElementManagement.propType = this.propElements[this._currentID].propType;
		}
	}

	// 道具类型
	public static propType:string = null;

	public useProp(){
		for(let i=0; i<this.elements.length; i++){
			if(this.elements[i].type==this.currentType){
				this.elements[i].num--;
				this.elements[i].setFocus(false);
				this.currentType = "";
				PropElementManagement.propType = null;
			}
		}
	}

	// 重置道具元素数量
	public updateElementsNum(){
		let len:number = this.elements.length;
		for(let i=0;i<len;i++){
			this.elements[i].bittext.text = "x"+GameData.PropElements[i].num;
		}
	}*/
}