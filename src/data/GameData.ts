/**
 * 游戏基础数据封装,而且要保证这些数据是全局的
 * 相当于MVC设计模式中Model层
 */
class GameData {	
	// 游戏元素类型
	public static GameElementTypes:string[] = ["Egret-iOS-Support","EgretEngine","EgretWing","EgretFeather","DragonBones","EgretNative","Lakeshore"];
	// 条件元素类型及其对应的数量
	public static RequiredElements = [
		{ "type":"EgretNative" , "num":10 },
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
	// 舞台的宽度
	public static stageW:number;
	// 舞台的高度
	public static stageH:number;
	// 比率,用于自适应定位
	public static ratio:number;	
}