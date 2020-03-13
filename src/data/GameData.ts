/**
 * 游戏基础数据封装,而且要保证这些数据是全局的
 * 相当于MVC设计模式中Model层
 */
class GameData {
	// 空白地图块的数量
	public static unmapNum:number = 0;
	// 地图块数据,存放的是游戏元素id
	public static mapData:number[][];
	// 当前玩家剩余的步数
	public static surplusStep:number = 0;
	// 当前关卡要求的步数
	public static requiredStep:number = 0;
	// 游戏元素类型
	public static GameElementTypes:string[];
	// 条件元素的操作和管理类
	public static requiredElementManagement:RequiredElementManagement;
	// 游戏元素对象池,这个数组长度最长是64
	// 游戏元素对象池的下标值相当于游戏元素对象的id属性
	public static GameElements:GameElement[];
	// 存放未使用的卡片元素id对象池
	//public static unusedElements:number[];
	// 背景图名称是一个唯一标识
	public static gameBackground:string = "";
	// 最大行数
	public static maxRow:number = 8;
	// 最大列数
	public static maxColumn:number = 8;
	// 当前可用的卡片元素数量,这个数量取决于可用地图块的数量
	//public static currentElementNum:number = 0;
	// 获取Egret舞台宽度
	public static stageW:number = 0;
	// 获取Egret舞台高度
	public static stageH:number = 0;

	// 初始化方法
	public static init() {
		// 填充地图数据
		GameData.mapData = [];
		/*for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				// 对于一个地图上的元素,null表示当前这个地图区域没有地图块
				// -2表示当前地图块是空的,可以使用,但是没有放置任何消除元素
				GameData.mapData[i].push(-2);
			}
		}*/

		// 初始化条件元素管理和操作类
		GameData.requiredElementManagement = new RequiredElementManagement();

		// 初始化游戏元素对象池
		GameData.GameElements = [];
		//GameData.unusedElements = [];
		let len:number = GameData.maxRow * GameData.maxColumn;
		for(let k=0; k<len; k++){
			let element:GameElement = new GameElement();
			element.id = k;
			GameData.GameElements.push(element);
			// 当前游戏未开始的时候,所有的卡片元素都没有使用
			//GameData.unusedElements.push(k);
		}

		// 初始化Egret舞台宽高
		GameData.stageW = egret.MainContext.instance.stage.stageWidth;
		GameData.stageH = egret.MainContext.instance.stage.stageHeight;
	}
}