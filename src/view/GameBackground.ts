/**
 * 创建所有游戏相关的背景
 * 由于背景需要显示在显示列表当中,所以需要继承egret.Sprite类
 */
class GameBackground extends egret.Sprite {
	
	// 顶部或底部高度
	public static topHeight:number;

	public constructor() {
		super();
		
		// 创建游戏背景
		let gameBackground = new egret.Bitmap(RES.getRes("background_png"));
		this.addChild(gameBackground);
		gameBackground.width = GameData.stageW;
		gameBackground.height = GameData.stageH;

		// 创建顶部纯色层
		GameBackground.topHeight = 340;
		let topMask = new egret.Shape();
		this.addChild(topMask);
        topMask.graphics.beginFill(0x51BFF7);
        topMask.graphics.drawRect(0, 0, GameData.stageW, GameBackground.topHeight);
        topMask.graphics.endFill();		

		// 创建底部纯色层
		let bottomMask = new egret.Shape();
		this.addChild(bottomMask);
		bottomMask.graphics.beginFill(0x4DB44A);
        bottomMask.graphics.drawRect(0, 0, GameData.stageW, GameBackground.topHeight);
        bottomMask.graphics.endFill();
		// 设置锚点,并添加到底部
		bottomMask.anchorOffsetY = 340;
		bottomMask.y = GameData.stageH;
				
		// 多个显示对象可以使用相同的 texture 对象
		let DeepSkyBlue = RES.getRes("DeepSkyBlue_png");
		let DarkTurquoise = RES.getRes("DarkTurquoise_png");
		// 创建所有地图格子
		for(let i:number=0;i<MapData.maxRow;i++){
			for(let j:number=0;j<MapData.maxCol;j++){
				let grid = new egret.Shape();
				this.addChild(grid);
				// 设置格子图属性,格子图可以不对其设置锚点
				// 单数行和双数行分别设置不同的皮肤,类似于国际象棋的棋盘
				if((i%2==0&&j%2==0) || (i%2==1&&j%2==1)){
					grid.graphics.beginFill(0x00AEF8,0.5);
					grid.graphics.drawRect(MapData.gap+MapData.gridwidth*j, MapData.startY+MapData.gridwidth*i, MapData.gridwidth, MapData.gridwidth);
					grid.graphics.endFill();
				}
				else{
					grid.graphics.beginFill(0x4BC7FC,0.5);
					grid.graphics.drawRect(MapData.gap+MapData.gridwidth*j, MapData.startY+MapData.gridwidth*i, MapData.gridwidth, MapData.gridwidth);
					grid.graphics.endFill();
				}
			}
		}

		// 将所有的图片默认当成一张纹理来处理
		this.cacheAsBitmap = true;
	}

}