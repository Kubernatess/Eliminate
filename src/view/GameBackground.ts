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
		let topcolor = new egret.Bitmap(RES.getRes("DodgerBlue_png"));
		this.addChild(topcolor);
		topcolor.width = GameData.stageW;		
		topcolor.height *= GameData.ratio;
		GameBackground.topHeight = topcolor.height;

		// 创建底部纯色层
		let bottomColor = new egret.Bitmap(RES.getRes("LimeGreen_png"));
		this.addChild(bottomColor);
		bottomColor.width = GameData.stageW;
		bottomColor.height *= GameData.ratio;
		// 设置锚点,并添加到底部
		bottomColor.anchorOffsetY = bottomColor.height;
		bottomColor.y = GameData.stageH;
				
		// 多个显示对象可以使用相同的 texture 对象
		let DeepSkyBlue = RES.getRes("DeepSkyBlue_png");
		let DarkTurquoise = RES.getRes("DarkTurquoise_png");
		// 创建所有地图格子
		for(let i:number=0;i<MapData.maxRow;i++){
			for(let j:number=0;j<MapData.maxCol;j++){
				let grid = new egret.Bitmap();
				this.addChild(grid);
				// 设置格子图属性,格子图可以不对其设置锚点
				grid.width = MapData.gridwidth;
				grid.height = MapData.gridwidth;
				grid.x = MapData.gap+MapData.gridwidth*j;
				grid.y = MapData.startY+MapData.gridwidth*i;
				// 单数行和双数行分别设置不同的皮肤,类似于国际象棋的棋盘
				if((i%2==0&&j%2==0) || (i%2==1&&j%2==1)){
					grid.texture = DeepSkyBlue;
				}
				else{
					grid.texture = DarkTurquoise;
				}
			}
		}

		// 将所有的图片默认当成一张纹理来处理
		this.cacheAsBitmap = true;
	}

}