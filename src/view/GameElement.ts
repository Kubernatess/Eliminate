/**
 * 地图元素的样式与动画行为
 */
class GameElement extends egret.Sprite {

	// 游戏元素类型
	public type:string = "";
	// 注意游戏元素本身也有x,y坐标. 而location只是地图上的一个位置
	public location:number = 0;
	// 用于设置游戏元素的纹理贴图
	public bitmap:egret.Bitmap;
	// 地图格子的宽度
	private gridwidth:number = 0;

	private startY:number = 0;
	// 地图左右两边间隔
	private gap:number = 200*GameData.ratio;


	public constructor() {
		super();
		this.touchEnabled = false;
		// 为了节约性能,关闭全部的touchChildren属性
		this.touchChildren = false;
		this.bitmap = new egret.Bitmap();
		this.addChild(this.bitmap);
		// 格子宽度和高度一样
		this.gridwidth = (GameData.stageW-this.gap*2)/GameData.maxColumn;
		// Y轴坐标从最上向下
		// 整个地图区域定位在正中心
		this.startY = (GameData.stageH-this.gridwidth*GameData.maxColumn)/2;
		/* 游戏元素之间的间隔为12像素 */
		this.width = this.gridwidth-12*GameData.ratio*2;
		this.height = this.gridwidth-12*GameData.ratio*2;
		// 为了方便计算,必须要设置一下锚点
		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height/2;
		// bitmap也设置相同的大小
		this.bitmap.width = this.width;
		this.bitmap.height = this.height;
	}


	// 当前元素是否被用户点击过了
	private isfocus:boolean = false;
	public getfocus():boolean{
		return this.isfocus;
	}

	// 如果当前元素被用户点击了,则在它上面显示一个MovieClip
	private focusMovieClip:egret.MovieClip;
	// 设置选中状态的焦点样式
	public focusEffect(val:boolean){
		// 先对传递过来的参数与目前的状态进行比对
		if(val!=this.isfocus){
			this.isfocus = val;
			// 如果这个MovieClip还没有被创建
			if(!this.focusMovieClip){
				/* 这里需要调整 */
				let texture = RES.getRes("focusmc_png");
				let data = RES.getRes("focusmc_json");
				let mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
				this.focusMovieClip = new egret.MovieClip(mcf.generateMovieClipData("focusmc"));
				this.focusMovieClip.x = this.focusMovieClip.width/-2;
				this.focusMovieClip.y = this.focusMovieClip.height/-2;
				this.focusMovieClip.width = this.bitmap.width;
				this.focusMovieClip.height = this.bitmap.height;
			}
			// 如果value值为true,则显示焦点MovieClip,并播放这个焦点MovieClip
			if(val){
				this.addChild(this.focusMovieClip);
				this.focusMovieClip.play(-1);
			}
			// 否则移除这个MovieClip
			else{
				if(this.focusMovieClip.parent){
					this.focusMovieClip.stop();
					this.removeChild(this.focusMovieClip);
				}
			}
		}
	}


	// 用作动画的时间,单位为毫秒
	public duration:number = 700;
	
	// 当元素被消除,或者其他周围的元素被消除,它需要向下移动
	public moveDown(){
		let tw:egret.Tween = egret.Tween.get(this);
		// 移动到新位置,使用cubicInOut算法移动,直线运动
		tw.to({x:this.gridX(),y:this.gridY()} , this.duration , egret.Ease.cubicInOut);
	}

	// 这个x值是根据地图位置求出的,注意与游戏元素本身的x,y坐标区分
	public gridX():number{
		// X轴坐标从最左到右
		let X:number = this.gap+this.gridwidth*(this.location%GameData.maxRow)+this.gridwidth/2;
		return X;
	}

	// 这个y值是根据地图位置求出的,注意与游戏元素本身的x,y坐标区分
	public gridY():number {
		let Y:number = this.startY + this.gridwidth*(Math.floor(this.location/GameData.maxColumn)) + this.gridwidth/2;
		return Y;
	}


	// 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
	public show(delay:number){
		// 游戏元素下落的起点
		this.x = this.gridX();
		this.y = this.startY-this.width;
		let tw:egret.Tween = egret.Tween.get(this);
		tw.wait(delay,false);
		tw.to({y:this.gridY()}, this.duration, egret.Ease.bounceOut);
	}


	// 当用户尝试交换两个元素后,但未能形成连线消除时,将两个元素的位置互换回来
	public moveAndBack(targetLocation:number , isScale:boolean=false){
		let gridwidth:number = (GameData.stageW-200*2)/GameData.maxColumn;
		let targetX:number = 200+gridwidth*(targetLocation%GameData.maxRow) + gridwidth/2+12;
		let startY:number = (GameData.stageH-gridwidth*GameData.maxColumn)/2;
		let targetY:number = startY + gridwidth*(Math.floor(targetLocation/GameData.maxColumn)) + gridwidth/2+12;
		// 移动的时候,不仅会移动位置,还会放大或者缩小,移动回来时,scale都设置为1
		let tw:egret.Tween = egret.Tween.get(this);
		if(isScale){
			tw.to({x:targetX,y:targetY,scaleX:1.2,scaleY:1.2} , 300 , egret.Ease.cubicInOut).call(this.back,this);
		}
		else{
			tw.to({x:targetX,y:targetY,scaleX:0.8,scaleY:0.8} , 300, egret.Ease.cubicInOut).call(this.back,this);
		}
	}
	private back(){
		let tw:egret.Tween = egret.Tween.get(this);
		// 此时回到了原来的(x,y)位置
		tw.to({x:this.gridX(),y:this.gridY(),scaleX:1,scaleY:1} , 300 , egret.Ease.cubicInOut);
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