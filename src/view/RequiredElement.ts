/**
 * 条件元素的样式与行为
 */
class RequiredElement extends egret.Sprite {

	public constructor() {
		super();
		this.touchChildren = false;

		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
		// 条件元素之间的距离为80像素
		this.gap = 80;
		let bitmapWidth:number = ((GameData.stageW/2)-this.gap*5)/4;
		this.bitmap.width = bitmapWidth;
		this.bitmap.height = bitmapWidth;
		// 这里numText相对该Sprite定位
		this.numText = new egret.TextField();
		this.addChild(this.numText);
		this.numText.size = 64;
		this.numText.width = bitmapWidth;
		this.numText.textAlign = egret.HorizontalAlign.CENTER;
		this.numText.y = bitmapWidth-20;
        this.numText.fontFamily = "方正大黑简体";
		// 最后设置Sprite对象的宽高
		this.width = this.bitmap.width;
		this.height = this.bitmap.height+this.numText.textHeight/2;
		this.anchorOffsetY = this.height/2;
		// 这10像素是因为TextField那里获取不到高度
		this.y = GameBackground.topHeight/2-10;
	}

	
	// 条件元素类型
	private type:string = "";
	public getType():string{
		return this.type;
	}
	// 设置条件元素的纹理
	private bitmap:egret.Bitmap;
	public setType(type:string){
		this.type = type;
		this.bitmap.texture = RES.getRes(this.type+"_png");
	}

	// 条件元素剩余数量
	private reqNum:number;
	public getReqNum():number{
		return this.reqNum;
	}
	// 设置剩余数量文本
	private numText:egret.TextField;
	public setReqNum(num:number){
		this.reqNum = num;
		this.numText.text = "×"+num;
	}

	// 设置X坐标值
	private gap = 80;
	public setX(index:number){
		this.x = this.gap+(this.gap+this.width)*index;
	}
}