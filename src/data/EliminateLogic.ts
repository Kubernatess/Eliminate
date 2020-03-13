/**
 * 所有连线消除的算法
 */
class EliminateLogic {
	
	//把所有可消除元素的组合保存在二维数组,二维数组存储的值是消除元素的id
	public static eliminates:number[][];

	// 在交换卡片元素之后,全局判断是否有连线消除
	public static isHaveSeries():boolean {

		EliminateLogic.eliminates = [];

		// 记录当前类型的一个指针
		let currentType:string = "";
		// 当前检索类型的数量
		let count:number = 0;

		// 横向循环判断
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				// !=null表示地图块可用,地图块上可能有消除元素,但也可能还没有放置消除元素
				if(GameData.mapData[i][j] != null){
					// 如果当前的类型与对象池存放的游戏元素类型不同,表明上一组的检测结束了
					if(currentType != GameData.GameElements[GameData.mapData[i][j]].type){
						// 如果上一次的检索类型数量大于等于3,把这组可消除元素全部存起来
						if(count >= 3){
							let eliminate:number[] = [];
							for(let k=0; k<count; k++){
								eliminate.push(GameData.mapData[i][j-k-1]);
							}
							EliminateLogic.eliminates.push(eliminate);
						}
						// 重置当前类型和检索类型计数器
						currentType = GameData.GameElements[GameData.mapData[i][j]].type;
						count = 1;
					}
					else {
						count++;
					}
				}
				// 否则mapData[i][j]==null,表示这个地图区域没有地图块,相当于把数据截断了,所以这时候要统计一下typeNum
				else {
					if(count >= 3){
						let eliminate:number[] = [];
						for(let k=0; k<count; k++){
							eliminate.push(GameData.mapData[i][j-k-1]);
						}
						EliminateLogic.eliminates.push(eliminate);
					}
					// 把当前类型和检索类型计数器纸为空
					currentType = "";
					count = 0;
				}
			}
			// 最后行结尾还要再统计一次typeNum
			if(count >= 3){
				let eliminate:number[] = [];
				for(let k=0; k<count; k++){
					eliminate.push(GameData.mapData[i][GameData.maxColumn-k-1]);
				}
				EliminateLogic.eliminates.push(eliminate);
			}
			// 把当前类型和检索类型计数器纸为空
			currentType = "";
			count = 0;
		}
		
		// 纵向循环判断,方法同上
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				if(GameData.mapData[j][i] != -1){
					if(currentType != GameData.GameElements[GameData.mapData[j][i]].type){
						if(count >= 3){
							let eliminate:number[] = [];
							for(let k=0; k<count; k++){
								eliminate.push(GameData.mapData[j-k-1][i]);
							}
							EliminateLogic.eliminates.push(eliminate);
						}
						currentType = GameData.GameElements[GameData.mapData[j][i]].type;
						count = 1;
					}
					else {
						count++;
					}
				}
				else {
					if(count >= 3){
					let eliminate:number[] = [];
					for(let k=0; k<count; k++){
						eliminate.push(GameData.mapData[j-k-1][i]);
					}
					EliminateLogic.eliminates.push(eliminate);
				}
				currentType = "";
				count = 0;
				}
			}
			// 列末尾判断
			if(count >= 3){
				let eliminate:number[] = [];
				for(let k=0; k<count; k++){
					eliminate.push(GameData.mapData[GameData.maxRow-k-1][i]);
				}
				EliminateLogic.eliminates.push(eliminate);
			}
			currentType = "";
			count = 0;
		}
		// 返回最终结果
		if(EliminateLogic.eliminates.length != 0){
			return true;
		}
		return false;
	}

	// 在游戏开始之前,全局判断能否移动其中一个元素之后可以形成连线消除
	// 如果能够形成连线消除,则继续游戏,否则,打乱所有元素的顺序
	public static isHaveFormedSeries():boolean {
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				// 前提条件是当前这地图块必须可用
				if(GameData.mapData[i][j]!=null){
					// 表示当前地图元素
					let gameElement = GameData.GameElements[GameData.mapData[i][j]];
					// 第一种情况,有两个类型相同的相邻的卡片元素横向排列,寻找它周围的六个元素(先不考虑极限值的情况下)
					if(j<(GameData.maxColumn-1)  && GameData.mapData[i][j+1]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i][j+1]].type){
						// 寻找周围六个元素,同样先保证地图块可用,先寻找左侧三个元素
						if(j>0 && GameData.mapData[i][j-1]!=null){
							// 判断左上角
							if(i>0 && j>0 && GameData.mapData[i-1][j-1]!=null && GameData.GameElements[GameData.mapData[i-1][j-1]].type==gameElement.type){
								return true;
							}
							// 判断左下角
							if(i<(GameData.maxRow-1) && j>0 && GameData.mapData[i+1][j-1]!=null && GameData.GameElements[GameData.mapData[i+1][j-1]].type==gameElement.type){
								return true;
							}
							// 判断左侧跳格
							if(j>1 && GameData.mapData[i][j-2]!=null && GameData.GameElements[GameData.mapData[i][j-2]].type==gameElement.type){
								return true;
							}
						}
						// 寻找右侧三个元素,以当前地图块为准,以相隔右侧一个地图块作为中心点,去寻找右侧三个元素
						if(j<(GameData.maxColumn-2) && GameData.mapData[i][j+2]!=null){
							// 判断右上角
							if(j<(GameData.maxColumn-2) && i>0 && GameData.mapData[i-1][j+2]!=null && GameData.GameElements[GameData.mapData[i-1][j+2]].type==gameElement.type){
								return true;
							}
							// 判断右下角
							if(j<(GameData.maxColumn-2) && i<(GameData.maxRow-1) && GameData.mapData[i+1][j+2]!=null && GameData.GameElements[GameData.mapData[i+1][j+2]].type==gameElement.type){
								return true;
							}
							// 判断右侧跳格
							if(j<(GameData.maxColumn-3) && GameData.mapData[i][j+3]!=null && GameData.GameElements[GameData.mapData[i][j+3]].type==gameElement.type){
								return true;
							}
						}
					}

					// 同样是第一种情况,只是纵向排列(也是不考虑极限值的情况下)
					if(i<(GameData.maxRow-1) && GameData.mapData[i+1][j]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i+1][j]].type){
						// 寻找周围六个元素,同样先保证地图块可用,先寻找上侧三个元素
						if(i>0 && GameData.mapData[i-1][j]!=null){
							// 判断左上角
							if(i>0 && j>0 && GameData.mapData[i-1][j-1]!=null && GameData.GameElements[GameData.mapData[i-1][j-1]].type==gameElement.type){
								return true;
							}
							// 判断右上角
							if(j<(GameData.maxColumn-1) && i>0 && GameData.mapData[i-1][j+1]!=null && GameData.GameElements[GameData.mapData[i-1][j+1]].type==gameElement.type){
								return true;
							}
							// 判断上方跳格
							if(i>1 && GameData.mapData[i-2][j]!=null && GameData.GameElements[GameData.mapData[i-2][j]].type==gameElement.type){
								return true;
							}
						}
						// 寻找下方三个元素,以当前地图块为准,以相隔下方一个地图块作为中心点,去寻找下方三个元素
						if(i<(GameData.maxRow-2) && GameData.mapData[i+2][j]!=null){
							// 判断左下角
							if(i<(GameData.maxRow-2) && j>0 && GameData.mapData[i+2][j-1]!=null && GameData.GameElements[GameData.mapData[i+2][j-1]].type==gameElement.type){
								return true;
							}
							// 判断右下角
							if(i<(GameData.maxRow-2) && j<(GameData.maxColumn-1) && GameData.mapData[i+2][j+1]!=null && GameData.GameElements[GameData.mapData[i+2][j+1]].type==gameElement.type){
								return true;
							}
							// 判断下方跳格
							if(i<(GameData.maxRow-3) && GameData.mapData[i+3][j]!=null && GameData.GameElements[GameData.mapData[i+3][j]].type==gameElement.type){
								return true;
							}
						}
					}

					// 第二种情况,有两个类型相同的卡片元素横向相隔地排列,中间隔了两个元素(先不考虑极限值的情况下)
					if(j<(GameData.maxColumn-2) && GameData.mapData[i][j+2]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i][j+2]].type){
						if(GameData.mapData[i][j+1]!=-1){
							// 判断正上方
							if(i>0 && GameData.mapData[i-1][j+1]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i-1][j+1]].type){
								return true;
							}
							// 判断正下方
							if(i<(GameData.maxRow-1) && GameData.mapData[i+1][j+1]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i+1][j+1]].type){
								return true;
							}
						}
					}

					// 第二种情况,有两个类型相同的卡片元素纵向相隔地排列,中间隔了两个元素(也是先不考虑极限值的情况下)
					if(i<(GameData.maxRow-2) && GameData.mapData[i+2][j]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i+2][j]].type){
						if(GameData.mapData[i+1][j]!=-1){
							// 判断左格子
							if(j>0 && GameData.mapData[i+1][j-1]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i+1][j-1]].type){
								return true;
							}
							// 判断右格子
							if(j<(GameData.maxColumn-1) && GameData.mapData[i+1][j+1]!=null && gameElement.type==GameData.GameElements[GameData.mapData[i+1][j+1]].type){
								return true;
							}
						}
					}
				}	
			}
		}
		return false;
	}

	// 交换两个元素并判断是否可以形成连线消除
	public static isEliminated(locationA:number , locationB:number):boolean {
		// 获取两个地图元素的id
		let identityA:number = GameData.mapData[Math.floor(locationA/GameData.maxColumn)][locationA%GameData.maxRow];
		let identityB:number = GameData.mapData[Math.floor(locationB/GameData.maxColumn)][locationB%GameData.maxRow];
		// 交换两个地图元素的id
		GameData.mapData[Math.floor(locationA/GameData.maxColumn)][locationA%GameData.maxRow] = identityB;
		GameData.mapData[Math.floor(locationB/GameData.maxColumn)][locationB%GameData.maxRow] = identityA;
		// 判断交换之后是否可以消除元素
		let rel:boolean = EliminateLogic.isHaveSeries();
		if(rel){
			// 如果交换元素后可以形成连线消除,则两个元素交换成功,并重新设置location属性
			GameData.GameElements[identityA].location = locationB;
			GameData.GameElements[identityB].location = locationA;
			return true;
		}
		else {
			// 否则把两个元素互换回来
			GameData.mapData[Math.floor(locationA/GameData.maxColumn)][locationA%GameData.maxRow] = identityA;
			GameData.mapData[Math.floor(locationB/GameData.maxColumn)][locationB%GameData.maxRow] = identityB;
		}
		return false;
	}
}