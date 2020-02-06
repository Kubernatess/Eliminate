/**
 * 封装消除元素的样式与行为
 */
class ElementView extends egret.Sprite {
	private thisparent:egret.Sprite;
	// 游戏中的元素
	public constructor(tparent:egret.Sprite) {
		super();
		this.thisparent = tparent;
		this.init();
	}

	// 位置编号,用于位置移动
	public location:number = 0;

	// 与GameData.elements[]数组下标相同
	public _id:number = -1;
	public get id():number {
		return this._id;
	}
	public set id(val:number) {
		this._id = val;
	}

	// 当前元素中的位图数据
	private bitmap:egret.Bitmap;

	// 初始化所有数据
	private init(){
		this.touchEnabled = true;
		this.touchChildren = false;
		this.bitmap = new egret.Bitmap();
		let bitwidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		this.bitmap.width = bitwidth-10;
		this.bitmap.height = bitwidth-10;
		this.bitmap.x = -1*bitwidth/2;
		this.bitmap.y = -1*bitwidth/2;
		this.addChild(this.bitmap);
	}

	// 设置贴图
	public setTexture(val:string){
		this.bitmap.texture = RES.getRes(val);
	}

	private _focus:boolean = false;
	public get focus():boolean{
		return this._focus;
	}
	private _focusMc:egret.MovieClip;
	// 设置选中状态的焦点样式
	public setFocus(val:boolean){
		if(val!=this._focus){
			this._focus = val;
			if(!this._focusMc){
				let tex = RES.getRes("focusmc_png");
				let data = RES.getRes("focusmc_json");
				let mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(tex , data);
				this._focusMc = new egret.MovieClip(mcf.generateMovieClipData("focusmc"));
				this._focusMc.x = this._focusMc.width/-2;
				this._focusMc.y = this._focusMc.height/-2;
				this._focusMc.width = this.bitmap.width;
				this._focusMc.height = this.bitmap.height;
			}
			if(val){
				this.addChild(this._focusMc);
				this._focusMc.play(-1);
			}
			else{
				if(this._focusMc.parent){
					this._focusMc.stop();
					this.removeChild(this._focusMc);
				}
			}
		}
	}

	public speed:number = 700;
	// 移动到新位置,使用cubicInOut算法移动,直线运动
	public move(){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:this.targetX(),y:this.targetY()} , this.speed , egret.Ease.cubicInOut);
	}

	public show(wait:number){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.wait(wait , false);
		tw.call(this.addThisToParent,this);
		tw.to({x:this.targetX(),y:this.targetY()} , this.speed , egret.Ease.bounceOut);
	}

	// 添加到父级显示对象
	private addThisToParent(){
		if(!this.parent){
			this.thisparent.addChild(this);
		}
	}

	public targetX():number{
		let girdwidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		let xx:number = 20+girdwidth*(this.location%GameData.MaxColumn)+girdwidth/2+5;
		return xx;
	}

	public targetY():number {
		let girdwidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		let startY:number = (GameData.stageH-(GameData.stageW-30)/6-60)-girdwidth*GameData.MaxColumn;
		let yy:number = startY+girdwidth*(Math.floor(this.location/GameData.MaxColumn))+girdwidth/2+5;
		return yy;
	}

	// 移动到另一个位置,然后再移动回来
	public moveAndBack(location:number , isscale:boolean=false){
		let girdwidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		let xx:number = 20+girdwidth*(location%GameData.MaxColumn)+girdwidth/2+5;
		let startY:number = (GameData.stageH-(GameData.stageW-30)/6-60)-girdwidth*GameData.MaxColumn;
		let yy:number = startY+girdwidth*(Math.floor(location/GameData.MaxColumn))+girdwidth/2+5;
		// 移动的时候,不仅会移动位置,还会放大或者缩小,移动回来时,scale都设置为1
		let tw:egret.Tween = egret.Tween.get(this);
		if(isscale){
			tw.to({x:xx,y:yy,scaleX:1.2,scaleY:1.2},300,egret.Ease.cubicInOut).call(this.back,this);
		}
		else{
			tw.to({x:xx,y:yy,scaleX:0.8,scaleY:0.8},300,egret.Ease.cubicInOut).call(this.back,this);
		}
	}

	private back(){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:this.targetX(),y:this.targetY(),scaleX:1,scaleY:1},300,egret.Ease.cubicInOut);
	}

	// 移动到另一个位置
	public moveAndScale(location:number , isscale:boolean=false){
		let girdwidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		let xx:number = 20+girdwidth*(location%GameData.MaxColumn)+girdwidth/2+5;
		let startY:number = (GameData.stageH-(GameData.stageW-30)/6-60)-girdwidth*GameData.MaxColumn;
		let yy:number = startY+girdwidth*(Math.floor(location/GameData.MaxColumn))+girdwidth/2+5;

		let tw:egret.Tween = egret.Tween.get(this);
		if(isscale){
			tw.to({x:xx,y:yy,scaleX:1.4,scaleY:1.4},300,egret.Ease.cubicInOut).call(this.backScale,this);
		}
		else{
			tw.to({x:xx,y:yy,scaleX:0.6,scaleY:0.6},300,egret.Ease.cubicInOut).call(this.backScale,this);
		}
	}

	private backScale(){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({scaleX:1,scaleY:1},300,egret.Ease.backOut).call(this.canRemove,this);
	}

	private canRemove(){
		let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.REMOVE_ANIMATION_OVER);
		this.dispatchEvent(evt);
	}

	// 播放曲线动画
	public playCurveMove(tx:number , ty:number){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:tx,y:ty},700,egret.Ease.quadOut).call(this.overCurveMove , this);
	}
	private overCurveMove(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
		this.dispatchEvent(evt);
	}

	// 播放直接消除动画,自己放大,然后缩回到原有大小,然后删除
	public playRemoveAni(){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({scaleX:1.4,scaleY:1.4},300,egret.Ease.cubicInOut).to({scaleX:0.1,scaleY:0.1},300,egret.Ease.cubicInOut).call(this.removeAniCall,this);
	}
	private removeAniCall(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
		this.dispatchEvent(evt);
	}

	// 根据列编号,重新计算元素X轴位置,从其Y轴开始播放下落动画
	public moveNewLocation(){
		if(!this.parent){
			let girdwidth:number = (GameData.stageW-40)/GameData.MaxColumn;
			let startY:number = (GameData.stageH-(GameData.stageW-30)/6-60)-girdwidth*GameData.MaxColumn;
			this.y = startY-this.width;
			this.scaleX = 1;
			this.scaleY = 1;
			this.x = this.targetX();
			this.thisparent.addChild(this);
		}
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:this.targetX(),y:this.targetY()},this.speed,egret.Ease.bounceOut).call(this.moveNewLocationOver , this);
	}
	private moveNewLocationOver(){
		let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
		this.dispatchEvent(evt);
	}
}