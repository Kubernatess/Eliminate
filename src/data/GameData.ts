/**
 * 游戏基础数据封装,而且要保证这些数据是全局的
 * 相当于MVC设计模式中Model层
 */
class GameData {
	// 比率,用于自适应定位
	public static ratio:number;
	// 顶部的高度
	public static topHeight:number;
	// 底部的高度
	public static bottomHeight:number;
	// 当前关卡的步数
	public static stepNum:number = 20;
	// 游戏元素类型
	public static GameElementTypes:string[] = ["Egret-Android-Support","Egret-iOS-Support","EgretEngine","EgretWing","EgretFeather","DragonBones","EgretNative","ResDepot","EgretiaServer","EgretInspector","EgretPro","EgretUIEditor","Lakeshore","TextureMerger"];
	// 条件元素类型及其对应的数量
	public static RequiredElements = [
		{ "type":"Lakeshore" , "num":10 },
		{ "type":"EgretWing" , "num":14 },
		{ "type":"DragonBones" , "num":12 },
		{ "type":"EgretFeather" , "num":10 }
	];
	// 道具元素类型及其对应的数量
	public static PropElements = [
		{ "type":"single" , "num":5 },
		{ "type":"same" , "num":12 },
		{ "type":"column" , "num":5 },
		{ "type":"cross" , "num":10 },
		{ "type":"line" , "num":14 }
	];
	// 最大行数
	public static maxRow:number = 8;
	// 最大列数
	public static maxColumn:number = 8;
	// 获取Egret舞台宽度
	public static stageW:number;
	// 获取Egret舞台高度
	public static stageH:number;

}