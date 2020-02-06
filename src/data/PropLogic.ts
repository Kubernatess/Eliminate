/**
 * 道具算法设计与实现
 */
class PropLogic {
	// 第一个参数为道具类型,第二个参数为用户点击卡片元素
	public static useProp(proptype:number , ellocation:number){
		switch(proptype){
			case 0:PropLogic.sameColor(ellocation);break;
			case 1:PropLogic.around(ellocation);break;
			case 2:PropLogic.wholeLine(ellocation);break;
			case 3:PropLogic.wholeColumn(ellocation);break;
			case 4:PropLogic.singleColor(ellocation);break;
		}
	}

	// 同色消除
	private static sameColor(loc:number){
		// 使用道具后,用于保存消除的元素
		LinkLogic.lines = [];
		let arr:number[] = [];
		// 获取当前卡片元素类型
		let type:string = GameData.elements[GameData.mapData[Math.floor(loc/GameData.MaxColumn)][loc%GameData.MaxRow]].type;
		// 循环判断,找出和type类型相同的元素
		for(let i=0;i<GameData.MaxRow;i++){
			for(let j=0;j<GameData.MaxColumn;j++){
				if(GameData.mapData[i][j]!=-1 && GameData.elements[GameData.mapData[i][j]].type==type){
					arr.push(GameData.mapData[i][j]);
				}
			}
		}
		LinkLogic.lines.push(arr);
	}

	// 消除一周
	private static around(loc:number){
		LinkLogic.lines = new Array();
		// 求得卡片元素的位置坐标
		let row:number = Math.floor(loc/GameData.MaxColumn);
		let col:number = loc%GameData.MaxRow;
		let arr:number[] = new Array();
		arr.push(GameData.elements[GameData.mapData[row][col]].id);
		// 寻找上边的卡片元素
		if(row>0 && GameData.mapData[row-1][col]!=-1){
			arr.push(GameData.elements[GameData.mapData[row-1][col]].id);
		}
		// 寻找下边的卡片元素
		if(row<(GameData.MaxRow-1) && GameData.mapData[row+1][col]!=-1){
			arr.push(GameData.elements[GameData.mapData[row+1][col]].id);
		}
		// 寻找左边的卡片元素
		if(col>0 && GameData.mapData[row][col-1]!=-1){
			arr.push(GameData.elements[GameData.mapData[row][col-1]].id);
		}
		// 寻找右边的卡片元素
		if(col<(GameData.MaxColumn-1) && GameData.mapData[row][col+1]!=-1){
			arr.push(GameData.elements[GameData.mapData[row][col+1]].id);
		}
	}

	// 消除整行
	private static wholeLine(loc:number){
		// 使用道具后,用于保存消除的元素
		LinkLogic.lines = new Array();
		let arr:number[] = new Array();
		// 获取行数据
		let row:number = Math.floor(loc/GameData.MaxColumn);
		for(let col=0;col<GameData.MaxColumn;col++){
			if(GameData.mapData[row][col]!=-1){
				arr.push(GameData.elements[GameData.mapData[row][col]].id);
			}
		}
		LinkLogic.lines.push(arr);
	}

	// 消除整列
	private static wholeColumn(loc:number){
		// 使用道具后,用于保存消除的元素
		LinkLogic.lines = new Array();
		let arr:number[] = new Array();
		// 获取列数据
		let col:number =loc%GameData.MaxRow;
		for(let row=0;row<GameData.MaxRow;row++){
			if(GameData.mapData[row][col]!=-1){
				arr.push(GameData.elements[GameData.mapData[row][col]].id);
			}
		}
		LinkLogic.lines.push(arr);
	}

	// 消除单一颜色
	private static singleColor(loc:number){
		LinkLogic.lines = new Array();
		let row:number = Math.floor(loc/GameData.MaxColumn);
		let col:number = loc%GameData.MaxRow;
		LinkLogic.lines.push([GameData.elements[GameData.mapData[row][col]].id]);
	}
}