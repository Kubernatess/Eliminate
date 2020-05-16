/**
 * 负责条件元素的管理和操作
 */
class RequiredElementManagement {

	private container:egret.DisplayObjectContainer;
	
	public constructor(container:egret.DisplayObjectContainer) {
		this.container = container;

		// 创建条件元素并添加到显示列表
		for(let i=0; i<GameData.RequiredElements.length; i++){
			let element:RequiredElement = new RequiredElement();
			this.container.addChildAt(element,i);
			// 将模型数据填充到视图
			element.setType(GameData.RequiredElements[i].type);
			element.setReqNum(GameData.RequiredElements[i].num);
			element.setX(i);
		}
	}


	// 检测当前是否所有要求元素都被消除掉了
	public isAllElementEliminated():boolean {
		let len:number = this.container.numChildren;
		for(let i=0;i<len;i++){
			// 如果发现某一个元素剩余的数量不为0,则返回false,还有未消除的元素
			if(Number((<RequiredElement>this.container.getChildAt(i)).numText.text)>0){
				return false;
			}
		}
		// 返回true表示所有元素消除了
		return true;
	}


	// 判断是否为指定类型
	public isRequiredElementType(type:string):boolean {
		let len:number = this.container.numChildren;
		for(let i=0;i<len;i++){
			if((<RequiredElement>this.container.getChildAt(i)).type == type){
				return true;
			}
		}
		return false;
	}

	// 通过类型获取当前条件元素在视图中的位置信息
	public getPointByType(type:string):egret.Point {
		let point:egret.Point = new egret.Point();
		let len:number = this.container.numChildren;
		for(let i=0; i<len; i++){
			if((<RequiredElement>this.container.getChildAt(i)).type == type){
				/* 建议这里改变一下条件元素的锚点 */
				point.x = (<RequiredElement>this.container.getChildAt(i)).x+(<RequiredElement>this.container.getChildAt(i)).width/2;
				point.y = (<RequiredElement>this.container.getChildAt(i)).y+(<RequiredElement>this.container.getChildAt(i)).height/2;
			}
		}
		return point;
	}

	// 减少其中一种条件元素的数量,其中subtrahend参数指的是需要消除的数量
	public updateNumText(type:string , subtrahend:number) {
		let len:number = this.container.numChildren;
		for(let i=0;i<len;i++){
			if((<RequiredElement>this.container.getChildAt(i)).type == type) {
				let num:number = Number((<RequiredElement>this.container.getChildAt(i)).numText.text);
				(<RequiredElement>this.container.getChildAt(i)).numText.text = (num-subtrahend).toString();
				return ;
			}
		}
	}

	// 重置条件元素数量
	public updateElementsNum(){
		let len:number = this.container.numChildren;
		for(let i=0;i<len;i++){
			(<RequiredElement>this.container.getChildAt(i)).numText.text = "×"+GameData.RequiredElements[i].num;
		}
	}

}