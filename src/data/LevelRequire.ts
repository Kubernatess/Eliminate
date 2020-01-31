/**
 * 负责过关条件管理和操作
 */
class LevelRequire {

	// 过关元素的对象池
	public reqElements:LevelRequireElement[];

	// 初始化操作
	public constructor() {
		this.reqElements = [];
	}

	// 获取过关条件多少种元素需要消除
	public getLevelReqNum():number {
		return this.reqElements.length;
	}

	// 添加通关关卡元素
	public addElement(type:string , num:number) {

	}
}