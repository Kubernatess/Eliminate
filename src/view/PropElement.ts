/**
 * 道具元素的样式与行为
 */
class PropElement extends egret.Sprite {
	// 道具类型
	public type:string = "";
	// 道具元素剩余数量
	public numText:egret.TextField;
	// 元素图
	public bitmap:egret.Bitmap;

	public constructor() {
		super();
		this.touchEnabled = true;
		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
		// 条件元素之间的距离为150像素
		let gap:number = 150*GameData.ratio;
		let propWidth:number = (GameData.stageW-gap*6)/5;
		this.bitmap.width = propWidth;
		this.bitmap.height = propWidth;
		// 位图文本对象的锚点在左上角
		this.numText = new egret.TextField();
		this.addChild(this.numText);
		this.numText.fontFamily = "方正大黑简体";
		this.numText.size = 120*GameData.ratio;
		this.numText.width = propWidth;
		this.numText.textAlign = egret.HorizontalAlign.CENTER;
		// 使整个Sprite垂直居中对齐
		this.width = propWidth;
		this.height = this.bitmap.height+this.numText.height;
		this.anchorOffsetY = this.height/2;
		this.y = GameData.stageH-GameData.bottomHeight/2-20;
		// 道具元素数量添加到底部
		this.numText.y = this.bitmap.height-40;
	}

	// 道具盒子
	private _view_box:egret.Bitmap;
	// 激活道具图像
	private _view_activate:egret.Bitmap;
	

	public get propType():string {
		return this.type;
	}

	/*private init(){
		this.createView();
		this.createNumText();
		this.addChild(this._view_activate);
		this.addChild(this._view_box);
		this.addChild(this._numText);
		this.setActivateState(true);
	}

	private createNumText(){
		this._numText = new egret.BitmapText();
		this._numText.font = RES.getRes("number_fnt");
		this._numText.x = this._view_activate.width-31;
	}

	private createView(){
		let _interval:number = 15;
		let _width:number = (GameData.stageW-_interval*6)/5;
		if(!this._view_activate){
			this._view_activate = new egret.Bitmap();
			this._view_activate.texture = RES.getRes(this.getActivateTexture(this.type));
			this._view_activate.width = _width;
			this._view_activate.height = _width;
		}
		// 类似于小盒,可以把道具元素放在里面
		if(!this._view_box){
			this._view_box = new egret.Bitmap();
			this._view_box.texture = RES.getRes("propbox_png");
			this._view_box.width = this._view_activate.width+10;
			this._view_box.height = this._view_activate.height+10;
			this._view_box.x = -5;
			this._view_box.y = -5;
		}
	}

	// 数量
	private _num:number = 0;
	public get num(){
		return this._num;
	}
	public set num(val:number){
		this._num = val;
		this._numText.text = val.toString();
		if(val<=0){
			this.setActivateState(false);
		}
		else{
			this.setActivateState(true);
		}
	}

	private setActivateState(val:boolean){
		this.touchEnabled = val;
		if(val){
			this._view_activate.texture = RES.getRes(this.getActivateTexture(this.type));
			this._view_box.texture = RES.getRes("propbox_png");
			this._numText.font = RES.getRes("number_fnt");
		}
		else{
			this._view_activate.texture = RES.getRes(this.getDisableTexture(this.type));
			this._view_box.texture = RES.getRes("propboxdisable_png");
			this._numText.font = RES.getRes("numberdisable_fnt");
		}
	}

	// 获取道具元素激活状态的纹理
	private getActivateTexture(type:number):string {
		let texturename:string = "";
		switch(type){
			case 0:texturename = "tongse_png";break;
			case 1:texturename = "zhadan_png";break;
			case 2:texturename = "zhenghang_png";break;
			case 3:texturename = "zhenglie_png";break;
			case 4:texturename = "danzhi_png";break;
		}
		return texturename;
	}

	// 获取道具元素禁用状态的纹理
	private getDisableTexture(type:number):string {
		let texturename:string = "";
		switch(type){
			case 0:texturename = "tongsedisable_png";break;
			case 1:texturename = "zhadandisable_png";break;
			case 2:texturename = "zhenghangdisable_png";break;
			case 3:texturename = "zhengliedisable_png";break;
			case 4:texturename = "danzhidisable_png";break;
		}
		return texturename;
	}

	// 设置焦点状态的纹理
	public setFocus(val:boolean){
		if(val){
			this._view_box.texture = RES.getRes("propboxactive_png");
		}
		else{
			this._view_box.texture = RES.getRes("propbox_png");
		}
	}*/
}