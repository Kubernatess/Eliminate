class ElementViewManage extends egret.EventDispatcher {
	public constructor(elementLayer:egret.Sprite) {
		super();
		this._layer = elementLayer;
		this.init();
	}

	// ElementView对象池,最多64个
	private elementviews:ElementView[];

	private init(){
		this.elementviews = new Array();
		let l:number = GameData.MaxRow*GameData.MaxColumn;
		let el:ElementView;
		for(let i=0;i<l;i++){
			el = new ElementView(this._layer);
			el.id = i;
			el.location = GameData.elements[i].location;
			this.elementviews.push(el);
			el.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER,this.removeAniOver,this);
			el.addEventListener(egret.TouchEvent.TOUCH_TAP,this.elTap,this);
			el.addEventListener(ElementViewManageEvent.UPDATE_MAP,this.updateMap,this);
			el.addEventListener(ElementViewManageEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this);
		}
	}

	// 当前被点击(即将获取焦点)的元素ID,如为-1则表示没有元素获取焦点
	private _currentTapID:number = -1;

	// 判断当前元素焦点状态,是否需要改变,如果有两个焦点,则派发TAP_TWO_ELEMENT,通知上层逻辑,
	private elTap(evt:egret.TouchEvent){
		// 无道具激活
		if(PropViewManage.proptype == -1){
			if(evt.currentTarget instanceof ElementView){
				let ev:ElementView = <ElementView> evt.currentTarget;
				if(this._currentTapID!=-1){
					if(ev.id==this._currentTapID){
						ev.setFocus(false);
						this._currentTapID = -1;
					}
					else{
						let event:ElementViewManageEvent = new ElementViewManageEvent(ElementView.toString());
						event.ele1 = this._currentTapID;
						event.ele2 = ev.id;
						this.dispatchEvent(event);
					}
				}
				else{
					ev.setFocus(true);
					this._currentTapID = ev.id;
				}
			}
		}
		else{
			if(this._currentTapID!=-1){
				this._currentTapID = -1;
			}
			let evts:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.toString());
			evts.propToElementLocation = (<ElementView>evt.currentTarget).location;
			this.dispatchEvent(evts);
		}
	}

	// 改变焦点,将旧焦点取消,设置新对象焦点
	public setNewElementFocus(location:number){
		this.elementviews[this._currentTapID].setFocus(false);
		this.elementviews[location].setFocus(true);
		this._currentTapID = location;
	}

	// 播放一个交换动画,然后两个位置再回来
	public changeLocationAndBack(id1:number,id2:number){
		if(this.elementviews[id1].focus){
			this.elementviews[id1].setFocus(false);
			if(this._layer.getChildIndex(this.elementviews[id1]) < this._layer.getChildIndex(this.elementviews[id2])){
				this._layer.swapChildren(this.elementviews[id1],this.elementviews[id2]);
			}
			this.elementviews[id1].moveAndBack(this.elementviews[id2].location);
			this.elementviews[id2].moveAndBack(this.elementviews[id1].location,true);
		}
		this._currentTapID = -1;
	}

	// 播放删除动画
	public changeLocationAndScale(id1:number,id2:number){
		if(this.elementviews[id1].focus){
			this.elementviews[id1].setFocus(false);
			if(this._layer.getChildIndex(this.elementviews[id1]) < this._layer.getChildIndex(this.elementviews[id2])){
				this._layer.swapChildren(this.elementviews[id1],this.elementviews[id2]);
			}
			this.elementviews[id1].moveAndScale(this.elementviews[id2].location,true);
			this.elementviews[id2].moveAndScale(this.elementviews[id1].location);
		}
		else{
			this.elementviews[id2].setFocus(false);
			if(this._layer.getChildIndex(this.elementviews[id1]) > this._layer.getChildIndex(this.elementviews[id2])){
				this._layer.swapChildren(this.elementviews[id1],this.elementviews[id2]);
			}
			this.elementviews[id1].moveAndScale(this.elementviews[id2].location);
			this.elementviews[id2].moveAndScale(this.elementviews[id1].location,true);
		}
		this._currentTapID = -1;
	}

	// 显示所有元素,并播放出场动画
	public showAllElement(){
		this._layer.removeChildren();
		let girdWidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		let startY:number = (GameData.stageH-(GameData.stageW-30)/6-60)-girdWidth*GameData.MaxColumn;
		let ele:ElementView;
		for(let i=0;i<GameData.MaxRow;i++){
			for(let j=0;j<GameData.MaxColumn;j++){
				if(GameData.mapData[i][j]!=-1){
					ele = this.elementviews[GameData.mapData[i][j]];
					ele.setTexture("e"+GameData.elements[GameData.mapData[i][j]].type+"_png");
					ele.x = ele.targetX();
					ele.y = startY-ele.width;
					ele.show((50*GameData.MaxColumn*GameData.MaxRow-50*GameData.unmapnum)-(i*GameData.MaxRow+j));
				}
			}
		}
	}

	// 即将删除的元素数量
	private removenum:number = 0;

	// 消除动画播放结束
	private removeAniOver(evt:ElementViewManageEvent){
		this.removenum++;
		if(this.removenum==2){
			this.removenum = 0;
			this.dispatchEvent(evt);
		}
	}

	private moveeleNum:number = 0;

	// 播放曲线动画,此类型动画用于可消除过关条件的情况
	public playReqRemoveAni(id:number,tx:number,ty:number){
		this.moveeleNum++;
		let el:ElementView = this.elementviews[id];
		if(el.parent){
			this._layer.setChildIndex(el,this._layer.numChildren);
		}
		el.playCurveMove(tx,ty);
	}

	// 播放放大动画,播放后直接删除元素,但元素类型不是过关关卡条件
	public playRemoveAni(id:number){
		this.moveeleNum++;
		let el:ElementView = this.elementviews[id];
		if(el.parent){
			this._layer.setChildIndex(el,this._layer.numChildren);
		}
		el.playRemoveAni();
	}

	// 删除动画完成,现在更新地图元素
	private updateMap(evt:ElementViewManageEvent){
		this.moveeleNum--;
		if(this.moveeleNum==0){
			this.dispatchEvent(evt);
		}
	}

	// 更新整个地图中元素位置
	public updateMapData(){
		let len:number = this.elementviews.length;
		this.moveLocElementNum = 0;
		for(let i=0;i<len;i++){
			this.elementviews[i].location = GameData.elements[i].location;
			this.elementviews[i].setTexture("e"+GameData.elements[i].type+"_png");
			this.elementviews[i].moveNewLocation();
		}
	}

	private moveLocElementNum = 0;

	// 新位置掉落结束
	private moveNewLocationOver(event:ElementViewManageEvent){
		this.moveLocElementNum++;
		if(this.moveLocElementNum == (GameData.MaxRow*GameData.MaxColumn)){
			let evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
			this.dispatchEvent(evt);
		}
	}

	// 乱序操作,移动全部元素位置
	public updateOrder(){
		let len:number = this.elementviews.length;
		egret.Tween.removeAllTweens();
		for(let i=0;i<len;i++){
			this.elementviews[i].location = GameData.elements[i].location;
			this.elementviews[i].move();
		}
	}
}