/**
 * 创建所有游戏相关的背景
 */
class GameBackground extends egret.Sprite {
	public constructor() {
		super();
	}

	// 关卡更新,重新创建背景
	public changeBackground():void{
		this.cacheAsBitmap = false;
		this.removeChildren();
		this.createBackgroundImage();
		this.createMapBg();
		this.createLevelReqBg();
		this.createStepBg();
		this.cacheAsBitmap = true;
		// 将所有的图片默认当成一张纹理来处理

	}

	// 背景图片
	private bgImage:egret.Bitmap;	
	// 半透明黑色网格
	private girdBg:egret.Bitmap[];

	// 创建背景图片方法
	private createBackgroundImage(){
		// 先进行初始化操作
		if(!this.bgImage){
			this.bgImage = new egret.Bitmap();
		}
		// 添加texture属性
		this.bgImage.texture = RES.getRes(GameData.levelBackgroundImageName);
		this.bgImage.width = GameData.stageW;
		this.bgImage.height = GameData.stageH;
		// 添加到显示列表
		this.addChild(this.bgImage);

		// 道具也有一张背景图
		let propBg:egret.Bitmap = new egret.Bitmap();
		propBg.texture = RES.getRes("propbg.png");
		propBg.width = GameData.stageW;
		propBg.height = GameData.stageW/5+20;
		propBg.y = GameData.stageH-propBg.height;
		this.addChild(propBg);
	}

	// 创建格子图
	private createMapBg(){
		if(!this.girdBg){
			this.girdBg = new Array();
		}

		let gird:egret.Bitmap;
		let girdWidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		let startY:number = (GameData.stageH-(GameData.stageW-30)/6-60)-girdWidth*GameData.MaxColumn;
		for(let i:number=0;i<GameData.MaxRow;i++){
			for(let j:number=0;j<GameData.MaxColumn;j++){
				if(GameData.mapData[i][j]!=-1){
					if(this.girdBg.length<(i*GameData.MaxRow+j)){
						gird = new egret.Bitmap();
						this.girdBg.push(gird);
					}
					else{
						gird = this.girdBg[i*GameData.MaxRow+j];
					}
					gird.width = girdWidth;
					gird.height = girdWidth;
					gird.x = 20+girdWidth*j;
					gird.y = startY+girdWidth*i;
					if((i%2==0&&j%2==0) || (i%2==1&&j%2==1)){
						gird.texture = RES.getRes("elementbg1");
					}
					else{
						gird.texture = RES.getRes("elementbg2");
					}
					this.addChild(gird);
				}
			}
		}
	}

	// 创建关卡元素背景图
	private createLevelReqBg(){
		let girdWidth:number = (GameData.stageW-40)/GameData.MaxColumn;
		let bg:egret.Bitmap = new egret.Bitmap();
		bg.texture = RES.getRes("levelreqbg.png");
		bg.width = GameData.levelreq.getLevelReqNum()*(10+girdWidth)+20;
		bg.height-girdWidth+60;
		bg.x = 20;
		bg.y = 50;
		this.addChild(bg);

		let bgtxt:egret.Bitmap = new egret.Bitmap();
		bgtxt.texture = RES.getRes("levelreqtitle.png");
		bgtxt.x = bg.x+(bg.width-bgtxt.width)/2;
		bgtxt.y = bg.y-18;
		this.addChild(bgtxt);
	}

	// 创建剩余步数背景
	private createStepBg(){
		let bg:egret.Bitmap = new egret.Bitmap();
		bg.texture = RES.getRes("levelreqbg.png");
		bg.width = 100;
		bg.height = 100;
		bg.x = GameData.stageW-110;
		bg.y = 50;
		this.addChild(bg);

		let bgtxt:egret.Bitmap = new egret.Bitmap();
		bgtxt.texture = RES.getRes("sursteptitle.png");
		bgtxt.x = bg.x+(bg.width-bgtxt.width)/2;
		bgtxt.y = bg.y+10;
		this.addChild(bgtxt);
	}
}