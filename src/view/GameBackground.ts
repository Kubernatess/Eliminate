/**
 * 创建所有游戏相关的背景
 * 由于背景需要显示在显示列表当中,所以需要继承egret.Sprite类
 */
class GameBackground extends egret.Sprite {
	public constructor() {
		super();
	}

	// 每次关卡更新,重新创建背景
	public updateBackground():void{
		this.cacheAsBitmap = false;
		// 从DisplayObjectContainer实例的子级列表中删除所有child DisplayObject实例
		this.removeChildren();
		this.createGameBackground();
		this.createAllGrid();
		// 将所有的图片默认当成一张纹理来处理
		this.cacheAsBitmap = true;
	}

	// 游戏背景图片
	private gameBackground:egret.Bitmap;	
	// 网格背景对象池
	private gridBackgrounds:egret.Bitmap[];

	// 创建游戏背景
	private createGameBackground(){
		// 先进行初始化操作
		if(!this.gameBackground){
			this.gameBackground = new egret.Bitmap();
		}
		// 添加texture属性,GameData.levelBackgroundImageName是唯一标识
		this.gameBackground.texture = RES.getRes(GameData.gameBackground);
		this.gameBackground.width = GameData.stageW;
		this.gameBackground.height = GameData.stageH;
		// 添加到显示列表
		this.addChild(this.gameBackground);
	}

	// 创建所有地图格子
	private createAllGrid(){
		if(!this.gridBackgrounds){
			this.gridBackgrounds = new Array();
		}

		let grid:egret.Bitmap;
		// 网格宽度和高度的值一样
		let gridwidth:number = (GameData.stageW-200*2)/GameData.maxColumn;

		let startY:number = (GameData.stageH-gridwidth*GameData.maxColumn)/2;
		
		for(let i:number=0;i<GameData.maxRow;i++){
			for(let j:number=0;j<GameData.maxColumn;j++){
				if(GameData.mapData[i][j]!=null){
					// 初始化格子图
					if(this.gridBackgrounds.length < (i*GameData.maxRow+j+1)){
						grid = new egret.Bitmap();
						this.gridBackgrounds.push(grid);
					}
					else{
						grid = this.gridBackgrounds[i*GameData.maxRow+j];
					}
					// 设置格子图属性,格子图可以不对其设置锚点
					grid.width = gridwidth;
					grid.height = gridwidth;
					grid.x = 200+gridwidth*j;
					grid.y = startY+gridwidth*i;
					// 单数行和双数行分别设置不同的皮肤,类似于国际象棋的棋盘
					if((i%2==0&&j%2==0) || (i%2==1&&j%2==1)){
						grid.texture = RES.getRes("DeepSkyBlue _png");
					}
					else{
						grid.texture = RES.getRes("DarkTurquoise _png");
					}
					this.addChild(grid);
				}
			}
		}
	}

}