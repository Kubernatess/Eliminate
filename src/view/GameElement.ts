/**
 * 地图元素的样式与动画行为
 */
class GameElement extends egret.Sprite {

	public constructor() {
		super();

		// 游戏元素之间的间隔
		let gap:number = 12*GameData.ratio;

		this.touchEnabled = false;
		// 为了节约性能,关闭全部的touchChildren属性
		this.touchChildren = false;

		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
		
		/* 游戏元素之间的间隔为12像素 */
		this.width = MapData.gridwidth - gap*2;
		this.height = MapData.gridwidth - gap*2;
		// 为了方便计算,必须要设置一下锚点
		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height/2;
		// bitmap也设置相同的大小
		this.bitmap.width = this.width;
		this.bitmap.height = this.height;		
	}


	// 游戏元素类型
	private type:string = "";
	public getType():string{
		return this.type;
	}
	// 设置游戏元素的纹理
	private bitmap:egret.Bitmap;
	public setType(type:string){
		this.type = type;
		this.bitmap.texture = RES.getRes(this.type+"_png");
	}


	// 通过X、Y坐标求出当前元素所在的位置
	public getIndex():number{
		let col:number = Math.floor((this.x-MapData.gap-MapData.gridwidth/2)/MapData.gridwidth);
		let row:number = Math.floor((this.y-MapData.startY-MapData.gridwidth/2)/MapData.gridwidth);
		return row*MapData.maxRow+col;
	}
	
	// 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
	public show(index:number){
		// 游戏元素下落的起点
		this.x = MapData.gap + MapData.gridwidth*(index%MapData.maxRow) + MapData.gridwidth/2;
		this.y = MapData.startY-this.width;
		let tw:egret.Tween = egret.Tween.get(this);
		tw.wait(50*(MapData.maxRow*MapData.maxCol-index),false);
		let gridY:number = MapData.startY + MapData.gridwidth*(Math.floor(index/MapData.maxCol)) + MapData.gridwidth/2;
		tw.to({y:gridY}, 700, egret.Ease.bounceOut);
	}


	// 设置选中状态的焦点样式
	private system:particle.ParticleSystem;	
	public focusEffect(val:boolean){
		// 如果这个粒子动画还没有被创建
		if(!this.system){
			let texture = RES.getRes("newParticle_png");
			let config = RES.getRes("newParticle_json");
			this.system = new particle.GravityParticleSystem(texture, config);
		}
		// 如果value值为true,则显示焦点粒子动画,并播放这个焦点粒子动画
		if(val){
			this.addChild(this.system);
			this.system.emitterX = this.width/2;
			this.system.emitterY = this.height;	
		    this.system.start();
		}
		// 否则移除这个MovieClip
		else{
			if(this.system.parent){
				this.system.stop();
            	this.removeChild(this.system);
			}			
		}
	}

    // 从当前位置移动到相邻位置
	public moveTo(target:number){		
		let targetX:number = MapData.gap + MapData.gridwidth*(target%MapData.maxRow) + MapData.gridwidth/2;
		let targetY:number = MapData.startY + MapData.gridwidth*(Math.floor(target/MapData.maxCol)) + MapData.gridwidth/2;		
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:targetX, y:targetY}, 300, egret.Ease.cubicInOut);
	}


	// 当元素被消除,或者其他周围的元素被消除,它需要向下移动
	public moveDown(){
		let tw:egret.Tween = egret.Tween.get(this);
		// 移动到新位置,使用cubicInOut算法移动,直线运动
		tw.to({x:this.gridX(),y:this.gridY()} , this.duration , egret.Ease.cubicInOut);
	}


	// 当用户尝试交换两个元素后,经过计算后,如果能形成连线消除,那么这两个元素执行互换操作. 注意这里只是成功执行交换元素,但还没有执行消除操作
	// 与上面moveAndBack方法很类似,区别在于最后的(x,y)位置
	public moveAndScale(targetLocation:number , isscale:boolean=false){
		let gridwidth:number = (GameData.stageW-this.gap*2)/GameData.maxColumn;
		let targetX:number = this.gap+gridwidth*(targetLocation%GameData.maxColumn) + gridwidth/2+12;
		let startY:number = (GameData.stageH-gridwidth*GameData.maxColumn)/2;
		let targetY:number = startY + gridwidth*(Math.floor(targetLocation/GameData.maxColumn)) + gridwidth/2 + 12;

		let tw:egret.Tween = egret.Tween.get(this);
		if(isscale){
			tw.to({x:targetX,y:targetY,scaleX:1.4,scaleY:1.4} , 300 , egret.Ease.cubicInOut).call(this.backScale,this);
		}
		else{
			tw.to({x:targetX,y:targetY,scaleX:0.6,scaleY:0.6} , 300 , egret.Ease.cubicInOut).call(this.backScale,this);
		}
	}
	private backScale(){
		let tw:egret.Tween = egret.Tween.get(this);
		// 此时游戏元素在另一个元素的位置上,并没有返回到原来的位置
		tw.to({scaleX:1,scaleY:1},300,egret.Ease.backOut).call(this.doRemove,this);
	}
	// 派发消除动画事件,从显示列表中消除该游戏元素
	private doRemove(){
		let event:CustomizedEvent = new CustomizedEvent(CustomizedEvent.ELIMINATE_OVER);
		this.dispatchEvent(event);
	}


	// 当消除的元素为条件元素时才会执行这个动画,消除元素会移动到过关条件位置,然后再从显示列表移除
	// 如果消除的不是条件元素,则播放另一个消除动画
	public moveToRequiredElement(targetX:number ,targetY:number){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:targetX,y:targetY},700,egret.Ease.quadOut).call(this.updateMap,this);
	}
	private updateMap(){
		// 只有当游戏元素在地图上才能执行删除操作
		if(this.parent){
			this.parent.removeChild(this);
		}
		let event:CustomizedEvent = new CustomizedEvent(CustomizedEvent.UPDATE_MAP);
		this.dispatchEvent(event);
	}

	// 消除元素,当元素不属于关卡条件时,执行此动画. 消除元素先缩放一下,然后再从显示列表移除
	// 这个优势卡片元素消除效果的动画,但是与playCurveMove使用场景不一样,而且playCurveMove消除元素时没有缩放效果
	public scaleAndRemove(){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({scaleX:1.4,scaleY:1.4},300,egret.Ease.cubicInOut).to({scaleX:0.1,scaleY:0.1},300,egret.Ease.cubicInOut).call(this.updateMap,this);
	}


	// 游戏元素被消除后,重新生成从地图上方掉落
	public dropDown(){
		// 只有当游戏元素还没添加到地图上,才能执行新添加的操作
		if(!this.parent){
			let gridwidth:number = (GameData.stageW-200*2)/GameData.maxColumn;
			let startY:number = (GameData.stageH-gridwidth*GameData.maxColumn)/2;
			this.y = startY-this.width;
			this.scaleX = 1;
			this.scaleY = 1;
			this.x = this.gridX();
			//this.layer.addChild(this);
		}
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:this.gridX(),y:this.gridY()},this.duration,egret.Ease.bounceOut).call(this.updateView,this);
	}
	private updateView(){
		let event:CustomizedEvent = new CustomizedEvent(CustomizedEvent.UPDATE_VIEW_OVER);
		this.dispatchEvent(event);
	}
}