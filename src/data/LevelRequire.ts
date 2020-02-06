/**
 * 负责关卡元素管理和操作
 */
class LevelRequire {

	// 关卡元素的对象池
	public reqElements:LevelRequireElement[];

	// 初始化操作
	public constructor() {
		this.reqElements = [];
	}

	// 获取多少种关卡元素需要消除
	public getLevelReqNum():number {
		return this.reqElements.length;
	}

	// 添加关卡元素
	public addElement(type:string , num:number) {
		let ele:LevelRequireElement = new LevelRequireElement();
		ele.num = num;
		ele.type = type;
		// 添加到对象池中
		this.reqElements.push(ele);
	}

	// 清空关卡元素对象池
	public openChange() {
		this.reqElements = [];
	}

	// 减少关卡元素数量
	public changeReqNum(type:string , num:number) {
		let len:number = this.getLevelReqNum();
		for(let i=0;i<len;i++){
			if(this.reqElements[i].type==type) {
				this.reqElements[i].num -= num;
				// 结束当前循环
				return ;
			}
		}
	}

	// 检测当前是否完成所有关卡
	public isClear():boolean {
		let len:number = this.getLevelReqNum();
		for(let i=0;i<len;i++){
			if(this.reqElements[i].num>0){
				// 如果发现某一个元素剩余的数量不为0,则返回false,继续游戏
				return false;
			}
		}
		// 返回true表示顺利通关
		return true;
	}
}