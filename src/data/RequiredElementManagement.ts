/**
 * 负责要求元素的管理和操作
 */
class RequiredElementManagement {

	// 要求元素的对象池
	public elements:RequiredElement[];

	// 初始化操作
	public constructor() {
		this.elements = [];
	}

	// 获取多少种要求元素需要消除
	public getElementsNum():number {
		return this.elements.length;
	}

	// 添加要求元素
	public addElement(type:string , num:number) {
		// 先创建新的要求元素
		let element:RequiredElement = new RequiredElement();
		element.num = num;
		element.type = type;
		// 然后添加到对象池中
		this.elements.push(element);
	}

	// 每次完成一关卡后,需要清空要求元素对象池
	public clearElements() {
		this.elements = [];
	}

	// 减少其中一种要求元素的数量,其中num参数指的是需要消除的数量
	public changeRequireNum(type:string , subtrahend:number) {
		let len:number = this.getElementsNum();
		for(let i=0;i<len;i++){
			// 判断要求元素类型是否为传进来的参数类型
			if(this.elements[i].type == type) {
				this.elements[i].num -= subtrahend;
				// 结束当前循环
				return ;
			}
		}
	}

	// 检测当前是否所有要求元素都被消除掉了
	public isAllElementEliminated():boolean {
		let len:number = this.getElementsNum();
		for(let i=0;i<len;i++){
			// 如果发现某一个元素剩余的数量不为0,则返回false,还有未消除的元素
			if(this.elements[i].num>0){
				return false;
			}
		}
		// 返回true表示所有元素消除了
		return true;
	}
}