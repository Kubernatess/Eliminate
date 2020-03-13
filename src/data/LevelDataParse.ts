/**
 * 关卡数据解析
 */
class LevelDataParse {
	
	// 解析独立数据,当引擎加载完成level.json,引擎会把它转换为一个Object
	public static parseLevelData(obj:any) {
		GameData.surplusStep = obj.requiredStep;
		GameData.requiredStep = obj.requiredStep;
		GameData.GameElementTypes = obj.GameElementTypes;
		GameData.backgroundImageName = obj.backgroundImage;
		LevelDataParse.parseRequiredElements(obj.requiredElements);
	}

	// 解析要求元素
	private static parseRequiredElements(elements:any) {
		// 首先清空要求元素对象池
		GameData.requiredElementManagement.clearElements();
		// 循环添加要求元素
		let len:number = elements.length;
		for(let i=0;i<len;i++){
			GameData.requiredElementManagement.addElement(elements[i].type , elements[i].num);
		}
	}
}