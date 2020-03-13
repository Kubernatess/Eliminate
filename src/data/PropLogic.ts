/**
 * 道具算法设计与实现
 */
class PropLogic {
	// 第一个参数为道具类型,第二个参数为用户点击的卡片元素位置
	public static useProp(propType:string,location:number){
		switch(propType){
			case "same":PropLogic.samelyEliminate(location);break;
			case "cross":PropLogic.crosswiseEliminate(location);break;
			case "line":PropLogic.linelyEliminate(location);break;
			case "column":PropLogic.columnEliminate(location);break;
			case "single":PropLogic.singlyEliminate(location);break;
		}
	}

	// 同色消除
	private static samelyEliminate(location:number){
		// 使用道具后,用于保存消除的元素
		EliminateLogic.eliminates = [];
		let eliminate:number[] = [];
		// 获取当前卡片元素类型
		let row:number = Math.floor(location/GameData.maxColumn);
		let col:number = location%GameData.maxRow;
		let type:string = GameData.GameElements[GameData.mapData[row][col]].type;
		// 循环判断,找出和type类型相同的元素
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				if(GameData.mapData[i][j]!=null && GameData.GameElements[GameData.mapData[i][j]].type==type){
					eliminate.push(GameData.mapData[i][j]);
				}
			}
		}
		EliminateLogic.eliminates.push(eliminate);
	}

	// 消除一周
	private static crosswiseEliminate(location:number){
		EliminateLogic.eliminates = new Array();
		let eliminate:number[] = new Array();
		// 求得卡片元素的位置坐标
		let row:number = Math.floor(location/GameData.maxColumn);
		let col:number = location%GameData.maxRow;
		// 添加当前点击的这个卡片元素
		eliminate.push(GameData.mapData[row][col]);
		// 添加上边的卡片元素
		if(row>0 && GameData.mapData[row-1][col]!=null){
			eliminate.push(GameData.mapData[row-1][col]);
		}
		// 添加下边的卡片元素
		if(row<(GameData.maxRow-1) && GameData.mapData[row+1][col]!=null){
			eliminate.push(GameData.mapData[row+1][col]);
		}
		// 添加左边的卡片元素
		if(col>0 && GameData.mapData[row][col-1]!=null){
			eliminate.push(GameData.mapData[row][col-1]);
		}
		// 添加右边的卡片元素
		if(col<(GameData.maxColumn-1) && GameData.mapData[row][col+1]!=null){
			eliminate.push(GameData.mapData[row][col+1]);
		}
	}

	// 消除整行
	private static linelyEliminate(location:number){
		// 使用道具后,用于保存消除的元素
		EliminateLogic.eliminates = new Array();
		let eliminate:number[] = new Array();
		// 获取行数据
		let row:number = Math.floor(location/GameData.maxColumn);
		for(let col=0;col<GameData.maxColumn;col++){
			if(GameData.mapData[row][col]!=null){
				eliminate.push(GameData.mapData[row][col]);
			}
		}
		EliminateLogic.eliminates.push(eliminate);
	}

	// 消除整列
	private static columnEliminate(location:number){
		// 使用道具后,用于保存消除的元素
		EliminateLogic.eliminates = new Array();
		let eliminate:number[] = new Array();
		// 获取列数据
		let col:number = location%GameData.maxRow;
		for(let row=0;row<GameData.maxRow;row++){
			if(GameData.mapData[row][col]!=null){
				eliminate.push(GameData.mapData[row][col]);
			}
		}
		EliminateLogic.eliminates.push(eliminate);
	}

	// 消除单一颜色
	private static singlyEliminate(location:number){
		EliminateLogic.eliminates = new Array();
		let row:number = Math.floor(location/GameData.maxColumn);
		let col:number = location%GameData.maxRow;
		EliminateLogic.eliminates.push([GameData.mapData[row][col]]);
	}
}