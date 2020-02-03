/**
 * 地图相关的算法
 */
class LinkLogic {
	// 用于存放可消除的元素id
	public static lines:number[][];

	// 交换卡片元素后,检查是否有可消除的一行或一列元素
	public static isHaveLine():boolean {
		LinkLogic.lines = [];
		// 记录当前类型的一个指针
		let currentType:string = "";
		// 当前检索类型的数量
		let typeNum:number = 0;
		// 横向循环判断
		for(let i=0;i<GameData.MaxRow;i++){
			for(let j=0;j<GameData.MaxColumn;j++){
				// !=-1表示地图块可用,地图块上可能有卡片元素,但也可能没有卡片元素
				if(GameData.mapData[i][j] != -1){
					// 如果当前的类型与对象池存放的卡片元素类型不同,表明上一组的检测结束了
					if(currentType != GameData.elements[GameData.mapData[i][j]].type){
						// 如果上一次的检索类型数量大于等于3,把所有可消除元素全部存起来
						if(typeNum >= 3){
							let arr:number[] = [];
							for(let k=0;k<typeNum;k++){
								arr.push(GameData.mapData[i][j-k-1]]);
							}
							LinkLogic.lines.push(arr);
						}
						// 重置当前类型和检索类型计数器
						currentType = GameData.elements[GameData.mapData[i][j]].type;
						typeNum = 1;
					}
					else {
						typeNum++;
					}
				}
				// 否则mapData[i][j]==-1,表示地图块不可使用,相当于把数据截断了
				else {
					if(typeNum >= 3){
						let arr:number[] = [];
						for(let k=0;k<typeNum;k++){
							arr.push(GameData.mapData[i][j-k-1]);
						}
						LinkLogic.lines.push(arr);
					}
					// 把当前类型和检索类型计数器纸为空
					currentType = "";
					typeNum = 0;
				}
			}
			// 行结尾判断
			if(typeNum >= 3){
				let arr:number[] = [];
				for(let k=0;k<typeNum;k++){
					arr.push(GameData.mapData[i][j-k-1]]);
				}
				LinkLogic.lines.push(arr);
			}
			// 把当前类型和检索类型计数器纸为空
			currentType = "";
			typeNum = 0;
		}
		// 纵向循环判断,方法同上
		for(let i=0;i<GameData.MaxRow;i++){
			for(let j=0;j<GameData.MaxColumn;j++){
				if(GameData.mapData[j][i] != -1){
					if(currentType != GameData.elements[GameData.mapData[j][i]].type){
						if(typeNum >= 3){
							let arr:number[] = [];
							for(let k=0;k<typeNum;k++){
								arr.push(GameData.mapData[j-k-1][i]);
							}
							LinkLogic.lines.push(arr);
						}
						currentType = GameData.elements[GameData.mapData[j][i]].type;
						typeNum = 1;
					}
					else {
						typeNum++;
					}
				}
				else {
					if(typeNum >= 3){
					let arr:number[] = [];
					for(let k=0;k<typeNum;k++){
						arr.push(GameData.mapData[j-k-1][i]);
					}
					LinkLogic.lines.push(arr);
				}
				currentType = "";
				typeNum = 0;
				}
			}
			// 列末尾判断
			if(typeNum >= 3){
				let arr:number[] = [];
				for(let k=0;k<typeNum;k++){
					arr.push(GameData.mapData[j-k-1][i]);
				}
				LinkLogic.lines.push(arr);
			}
			currentType = "";
			typeNum = 0;
		}
		// 返回最终结果
		if(LinkLogic.lines.length != 0){
			return true;
		}
		return false;
	}

	// 全局地预检索可消除元素,如果有可消除元素,则继续游戏,如果没有,则打乱所有元素的顺序
	public static isNextHaveLine():boolean {
		for(let i=0;i<GameData.MaxRow;i++){
			for(let j=0;j<GameData.MaxColumn;j++){
				// mapData[i][j]表示当前地图块,前提条件是当前这地图块必须可用
				if(GameData.mapData[i][j]!=-1){
					// 先考虑横向的情况,先考虑不在极限值的情况下,找到两个相同类型的相邻排列的卡片元素
					if(j<(GameData.MaxColumn-1) && GameData.mapData[i][j+1]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i][j+1]].type){
						// 寻找周围六个元素,同样先保证地图块可用,先寻找左侧三个元素
						if(j>0 && GameData.mapData[i][j-1]!=-1){
							// 判断左上角,保证相邻的这两个元素不越界
							if(i>0 && j>0 && GameData.mapData[i-1][j-1] && GameData.mapData[i-1][j-1]!=-1 && GameData.elements[GameData.mapData[i-1][j-1]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断左下角
							if(i<(GameData.MaxRow-1) && j>0 && GameData.mapData[i+1][j-1] && GameData.mapData[i+1][j-1]!=-1 && GameData.elements[GameData.mapData[i+1][j-1]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断左侧跳格
							if(j>1 && GameData.mapData[i][j-2] && GameData.mapData[i][j-2]!=-1 && GameData.elements[GameData.mapData[i][j-2]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
						}
						// 寻找右侧三个元素,以当前地图块为准,以相隔右侧一个地图块作为中心点,去寻找右侧三个元素
						if(j<(GameData.MaxColumn-1) && GameData.mapData[i][j+2]!=-1){
							// 判断右上角
							if(j<(GameData.MaxColumn-2) && i>0 && GameData.mapData[i-1][j+2] && GameData.mapData[i-1][j+2]!=-1 && GameData.elements[GameData.mapData[i-1][j+2]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断右下角
							if(j<(GameData.MaxColumn-2) && i<(GameData.MaxRow-1) && GameData.mapData[i+1][j+2] && GameData.mapData[i+1][j+2]!=-1 && GameData.elements[GameData.mapData[i+1][j+2]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断右侧跳格
							if(j<(GameData.MaxColumn-3) && GameData.mapData[i][j+3] && GameData.mapData[i][j+3]!=-1 && GameData.elements[GameData.mapData[i][j+3]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
						}
					}
					// 考虑纵向的情况,同样也是不考虑极限值的情况,找到两个相同类型的相邻纵向排列的卡片元素
					if(i<(GameData.MaxRow-1) && GameData.mapData[i+1][j]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i+1][j]].type){
						// 寻找周围六个元素,同样先保证地图块可用,先寻找上侧三个元素
						if(i>0 && GameData.mapData[i-1][j]!=-1){
							// 判断左上角
							if(i>0 && j>0 && GameData.mapData[i-1][j-1] && GameData.mapData[i-1][j-1]!=-1 && GameData.elements[GameData.mapData[i-1][j-1]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断右上角
							if(j<(GameData.MaxColumn-1) && i>0 && GameData.mapData[i-1][j+1] && GameData.mapData[i-1][j+1]!=-1 && GameData.elements[GameData.mapData[i-1][j+1]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断上方跳格
							if(i>1 && GameData.mapData[i-2][j] && GameData.mapData[i-2][j]!=-1 && GameData.elements[GameData.mapData[i-2][j]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
						}
						// 寻找下方三个元素,以当前地图块为准,以相隔下方一个地图块作为中心点,去寻找下方三个元素
						if(i<(GameData.MaxRow-2) && GameData.mapData[i+2][j]!=-1){
							// 判断左下角
							if(j>0 && GameData.mapData[i+2][j-1] && GameData.mapData[i+2][j-1]!=-1 && GameData.elements[GameData.mapData[i+2][j-1]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断右下角
							if(j<(GameData.MaxColumn-2) && GameData.mapData[i+2][j+1] && GameData.mapData[i+2][j+1]!=-1 && GameData.elements[GameData.mapData[i+2][j+1]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
							// 判断下方跳格
							if(i<(GameData.MaxRow-3) && GameData.mapData[i+3][j] && GameData.mapData[i+3][j]!=-1 && GameData.elements[GameData.mapData[i+3][j]].type==GameData.elements[GameData.mapData[i][j]].type){
								return true;
							}
						}
					}
					// 方式2横向情况
					if(j<(GameData.MaxColumn-2) && GameData.mapData[i][j+2]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i][j+2]].type){
						if(GameData.mapData[i][j+1]!=-1){
							if(i>0 && GameData.mapData[i-1][j+1] && GameData.mapData[i-1][j+1]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i-1][j+1]].type){
								return true;
							}
							if(i<(GameData.MaxRow-1) && GameData.mapData[i+1][j+1] && GameData.mapData[i+1][j+1]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i+1][j+1]].type){
								return true;
							}
						}
					}
					// 方式2纵向情况
					if(i<(GameData.MaxRow-2) && GameData.mapData[i+2][j]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i+2][j]].type){
						if(GameData.mapData[i+1][j]!=-1){
							if(j<(GameData.MaxColumn-1) && GameData.mapData[i+1][j+1] && GameData.mapData[i+1][j+1]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i+1][j+1]].type){
								return true;
							}
							if(i<(GameData.MaxRow-1) && j>0 && GameData.mapData[i+1][j-1] && GameData.mapData[i+1][j-1]!=-1 && GameData.elements[GameData.mapData[i][j]].type==GameData.elements[GameData.mapData[i+1][j-1]].type){
								return true;
							}
						}
					}
				}	
			}
		}
		return false;
	}
}