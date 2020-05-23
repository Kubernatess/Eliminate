/**
 * 道具元素的样式与行为
 */
class PropElement extends egret.Sprite {
	
	public constructor() {
		super();
		this.touchEnabled = true;
		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
		// 条件元素之间的距离为150像素
		this.gap = 150*GameData.ratio;
		let propWidth:number = (GameData.stageW-this.gap*6)/5;
		this.bitmap.width = propWidth;
		this.bitmap.height = propWidth;
		// 位图文本对象的锚点在左上角
		this.numText = new egret.TextField();
		this.addChild(this.numText);
		this.numText.fontFamily = "方正大黑简体";
		this.numText.size = 100*GameData.ratio;
		this.numText.width = propWidth;
		this.numText.textAlign = egret.HorizontalAlign.CENTER;
		// 使整个Sprite垂直居中对齐		
		this.width = propWidth;
		this.height = this.bitmap.height+this.numText.height;
		this.anchorOffsetY = this.height/2;
		this.y = GameData.stageH-GameBackground.topHeight/2-20;
		// 道具元素数量添加到底部
		this.numText.y = this.bitmap.height-40;

		let texture = RES.getRes("newParticle_png");
		let config = RES.getRes("newParticle_json");
		this.system = new particle.GravityParticleSystem(texture,config);
	}

	// 道具类型
	private type:string = "";
	public getType():string{
		return this.type;
	}
	// 设置道具元素的纹理
	private bitmap:egret.Bitmap;
	public setType(type:string){
		this.type = type;
		this.bitmap.texture = RES.getRes(this.type+"_png");
	}

	// 道具元素剩余数量
	private propNum:number;
	public getPropNum():number{
		return this.propNum;
	}
	// 设置剩余数量文本
	private numText:egret.TextField;
	public setPropNum(num:number){
		this.propNum = num;
		this.numText.text = "×"+num;
	}

	// 设置X坐标值
	private gap:number;
	public setX(index:number){
		this.x = this.gap+(this.gap+this.width)*index;
	}

	// 设置选中状态的焦点样式
	private system:particle.ParticleSystem;
	public focusEffect(val:boolean){
		// 如果value值为true,则显示焦点粒子动画,并播放这个焦点粒子动画
		if(val){
			this.addChild(this.system);
			this.system.emitterX = this.width/2;
			this.system.emitterY = this.height;	
		    this.system.start();
		}
		// 否则移除这个粒子动画
		else{
			if(this.contains(this.system)){
				this.system.stop();
            	this.removeChild(this.system);
			}			
		}
	}

}