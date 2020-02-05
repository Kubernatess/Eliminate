/**
 * 游戏运行时必要的数据
 */
class GameData {
	// 空白地图块的数量
	public static unmapnum:number = 0;
	// 存放卡片元素的id
	public static mapData:number[][];
	// 当前玩家剩余的步数
	public static stepNum:number = 0;
	// 当前关卡要求的步数
	public static levelStepNum:number = 0;
	// 当前关卡出现的卡片元素类型
	public static elementTypes:number[];
	// 过关条件操作和管理类
	public static levelreq:LevelRequire;
	// 地图上卡片元素对象池
	public static elements:GameElement[];
	// 地图上未使用的卡片元素id对象池
	public static unusedElements:number[];
	// 当前关卡背景图
	public static levelBackgroundImageName:string = "";
	// 最大行数
	public static MaxRow:number = 8;
	// 最大列数
	public static MaxColumn:number = 8;
	// 当前可用地图块的数量
	public static currentElementNum:number = 0;
	// 获取Egret舞台宽度
	public static stageW:number = 0;
	// 获取Egret舞台高度
	public static stageH:number = 0;

	// 初始化方法
	public static initData() {
		// 填充地图数据
		GameData.mapData = [];
		for(let i=0;i<GameData.MaxRow;i++){
			let arr:number[] = [];
			for(let j=0;j<GameData.MaxColumn;j++){
				// 对于一个地图上的元素,-1表示当前地图块无法使用
				// -2表示当前地图块是空的,可以使用,但是没有放置任何元素id
				GameData.mapData[j].push(-2);
			}
		}

		// 初始化关卡管理和操作类
		GameData.levelreq = new LevelRequire();

		// 循环填充元素
		GameData.elements = [];
		GameData.unusedElements = [];
		let len:number = GameData.MaxRow * GameData.MaxColumn;
		for(let k=0;k<len;k++){
			let ele:GameElement = new GameElement();
			ele.id = k;
			GameData.elements.push(ele);
			GameData.unusedElements.push(k);
		}

		// 初始化Egret舞台宽高
		GameData.stageW = egret.MainContext.instance.stage.stageWidth;
		GameData.stageH = egret.MainContext.instance.stage.stageHeight;
	}
}