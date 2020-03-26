/**
 * 创建所有游戏相关的背景
 * 由于背景需要显示在显示列表当中,所以需要继承egret.Sprite类
 */
class GameBackground extends egret.Sprite {
	
	public constructor() {
		super();
		// 创建游戏背景
		let gameBackground = new egret.Bitmap();
		this.addChild(gameBackground);
		gameBackground.texture = RES.getRes("background_png");
		gameBackground.width = GameData.stageW;
		gameBackground.height = GameData.stageH;

		// 创建纯色层
		let pureColor = new egret.Bitmap();
		this.addChild(pureColor);
		pureColor.texture = RES.getRes("PureColor_png");
		pureColor.width = GameData.stageW;
		pureColor.height = pureColor.height*GameData.ratio;

		// 地图左右两边间隔
		let gap:number = 200*GameData.ratio;
		// 创建所有地图格子
		let len:number = GameData.maxRow*GameData.maxColumn;
		let gridwidth:number = (GameData.stageW-gap*2)/GameData.maxColumn;
		let startY:number = (GameData.stageH-gridwidth*GameData.maxColumn)/2;
		for(let i:number=0;i<GameData.maxRow;i++){
			for(let j:number=0;j<GameData.maxColumn;j++){
				let grid = new egret.Bitmap();
				this.addChild(grid);
				// 设置格子图属性,格子图可以不对其设置锚点
				grid.width = gridwidth;
				grid.height = gridwidth;
				grid.x = gap+gridwidth*j;
				grid.y = startY+gridwidth*i;
				// 单数行和双数行分别设置不同的皮肤,类似于国际象棋的棋盘
				if((i%2==0&&j%2==0) || (i%2==1&&j%2==1)){
					grid.texture = RES.getRes("DeepSkyBlue_png");
				}
				else{
					grid.texture = RES.getRes("DarkTurquoise_png");
				}
			}
		}

		// 将所有的图片默认当成一张纹理来处理
		this.cacheAsBitmap = true;
	}
	

}