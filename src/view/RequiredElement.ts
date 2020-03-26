/**
 * 条件元素的样式与行为
 */
class RequiredElement extends egret.Sprite {
	// 条件元素类型
	public type:string = "";
	// 条件元素上面的数字
	public textInfo:egret.TextField;
	// 元素图
	public bitmap:egret.Bitmap;

	public constructor() {
		super();
		this.touchChildren = false;

		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
		// 条件元素左右两边间隔
		let gap:number = 80*GameData.ratio;
		// 条件元素之间的距离为80像素
		let bitmapWidth:number = ((GameData.stageW/2)-gap*5)/4;
		this.bitmap.width = bitmapWidth;
		this.bitmap.height = bitmapWidth;
		// 这里bittext相对该Sprite定位
		this.textInfo = new egret.TextField();
		this.addChild(this.textInfo);
		this.textInfo.size = 64*GameData.ratio;
		this.textInfo.width = bitmapWidth;
		this.textInfo.textAlign = egret.HorizontalAlign.CENTER;
		this.textInfo.y = bitmapWidth-20;
        this.textInfo.textColor = 0xFFFFFF;
		this.textInfo.fontFamily = "方正大黑简体";
		// 最后设置Sprite对象的宽高
		this.width = this.bitmap.width;
		this.height = this.bitmap.height+this.textInfo.textHeight/2;
	}

}