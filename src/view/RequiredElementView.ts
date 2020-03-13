/**
 * 条件元素的样式与行为
 */
class RequiredElementView extends egret.Sprite {
	public constructor() {
		super();
		this.init();
	}

	// 过关条件元素类型
	//public eltype:string = "";
	// 条件元素上面的位图文本
	private bittext:egret.BitmapText;
	// 元素图
	private bitmap:egret.Bitmap;

	// num指的是元素上面所显示的数字
	public set num(val:number){
		if(val>=0){
			this.bittext.text = val.toString();
		}
	}

	public get num():number {
		return Number(this.bittext.text);
	}


	private init(){
		this.touchChildren = false;
		if(!this.bitmap){
			this.bitmap = new egret.Bitmap();
		}
		// 条件元素之间的距离为80像素
		let bitmapWidth:number = ((GameData.stageW/3)-80*4)/3;
		this.bitmap.width = bitmapWidth;
		this.bitmap.height = bitmapWidth;
		this.addChild(this.bitmap);
		// 位图文本对象的锚点在左上角
		this.bittext = new egret.BitmapText();
		this.bittext.font = RES.getRes("方正大黑简体_fnt");
		this.bittext.text = "×0";
		// 这里需要运行一下才能调试定位
		// 这里bittext相对该Sprite定位
		this.bittext.x = (bitmapWidth-this.bittext.width)/2;
		this.bittext.y = this.bitmap.height+this.bitmap.y-this.bittext.height/2;
		this.addChild(this.bittext);
	}

	// 根据过关条件元素类型设置纹理贴图
	public setTexture(val:string){
		this.bitmap.texture = RES.getRes(val);
	}
}