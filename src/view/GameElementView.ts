/**
 * 地图元素的样式与动画行为
 */
class GameElementView extends egret.Sprite {

	// 当ElementView这个类被new出来的时候,我们需要知道父级,缓存父级显示对象的属性
	private layer:egret.Sprite;
	// 游戏中的元素
	public constructor(layer:egret.Sprite) {
		super();
		this.layer = layer;
		this.init();
	}

	// 注意游戏元素本身也有x,y坐标. 而location只是地图上的一个位置
	// 这个location属性用于位置移动,作动画使用. 它与游戏元素本身的x,y坐标是完全两回事
	public location:number = 0;

	// 与GameElements[]数组下标相同,用于界面与数据进行绑定
	public id:number = -1;
	public getId():number {
		return this.id;
	}
	public setId(val:number) {
		this.id = val;
	}

	// 当前元素中的位图数据,也就是地图元素的位图图片
	private bitmap:egret.Bitmap;

	// 初始化所有数据
	private init(){
		// 由于所有的元素都可以被点击,所以开启touchEnabled
		this.touchEnabled = true;
		// 为了节约性能,关闭全部的touchChildren属性,只有当前这个对象看作一个对象被点击
		this.touchChildren = false;
		// 创建位图
		this.bitmap = new egret.Bitmap();
		// 地图格子的宽度
		let gridwidth:number = (GameData.stageW-200*2)/GameData.maxColumn;
		/* 游戏元素之间的间隔为12像素 */
		this.bitmap.width = gridwidth-12*2;
		this.bitmap.height = gridwidth-12*2;
		this.bitmap.x = gridwidth/-2;
		this.bitmap.y = gridwidth/-2;
		// 将bitmap添加到ElementView显示列表中,但是还没有贴图纹理
		this.addChild(this.bitmap);
	}

	// 根据类型设置贴图纹理
	public setTexture(val:string){
		this.bitmap.texture = RES.getRes(val);
	}


	// 当前元素是否被用户点击过了
	public isfocus:boolean = false;
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
		// 如果地图左右两边留出的空位固定为200像素,那么所有的显示对象都需要根据不同的屏幕尺寸比例进行缩放 
		// 格子宽度指的是地图元素底下的那一块纯色元素
		let gridwidth:number = (GameData.stageW-200*2)/GameData.maxColumn;
		// 每个地图元素之间的间隔是12像素
		// X轴坐标从最左到右
		let X:number = 200+gridwidth*(this.location%GameData.maxRow)+gridwidth/2+12;
		return X;
	}

	// 这个y值是根据地图位置求出的,注意与游戏元素本身的x,y坐标区分
	public gridY():number {
		let gridwidth:number = (GameData.stageW-80)/GameData.maxColumn;
		// Y轴坐标从最上向下
		// 整个地图区域定位在正中心
		let startY:number = (GameData.stageH-gridwidth*GameData.maxColumn)/2;
		let Y:number = startY + gridwidth*(Math.floor(this.location/GameData.maxColumn)) + gridwidth/2+12;
		return Y;
	}


	// 播放出场动画. 当一个新关卡出现,所有的新元素出现,然后从天上依次掉落,掉落后添加到父级到显示列表
	public show(delay:number){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.wait(delay,false);
		tw.call(this.addThisToParent,this);
		tw.to({x:this.gridX(),y:this.gridY()} , this.duration , egret.Ease.bounceOut);
	}
	// 添加到父级显示对象
	private addThisToParent(){
		if(!this.parent){
			this.layer.addChild(this);
		}
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
		let gridwidth:number = (GameData.stageW-200*2)/GameData.maxColumn;
		let targetX:number = 200+gridwidth*(targetLocation%GameData.maxColumn) + gridwidth/2+12;
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
		let event:GameElementViewManagementEvent = new GameElementViewManagementEvent(GameElementViewManagementEvent.ELIMINATE_OVER);
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
		let event:GameElementViewManagementEvent = new GameElementViewManagementEvent(GameElementViewManagementEvent.UPDATE_MAP);
		this.dispatchEvent(event);
	}

	// 消除元素,当元素不属于关卡条件时,执行此动画. 消除元素先缩放一下,然后再从显示列表移除
	// 这个优势卡片元素消除效果的动画,但是与playCurveMove使用场景不一样,而且playCurveMove消除元素时没有缩放效果
	public scaleAndRemove(){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({scaleX:1.4,scaleY:1.4},300,egret.Ease.cubicInOut).to({scaleX:0.1,scaleY:0.1},300,egret.Ease.cubicInOut).call(this.updateMap,this);
	}
	/*private eliminateAnimationCall(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		let evt:ElementViewManagementEvent = new ElementViewManagementEvent(ElementViewManagementEvent.UPDATE_MAP);
		this.dispatchEvent(evt);
	}*/


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
			this.layer.addChild(this);
		}
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:this.gridX(),y:this.gridY()},this.duration,egret.Ease.bounceOut).call(this.updateView,this);
	}
	private updateView(){
		let event:GameElementViewManagementEvent = new GameElementViewManagementEvent(GameElementViewManagementEvent.UPDATE_VIEW_OVER);
		this.dispatchEvent(event);
	}
}