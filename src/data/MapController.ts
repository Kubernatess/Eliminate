/**
 * 地图数据控制器
 */
class MapController {
	public constructor() {
	}

	// 创建地图上所有的游戏元素
	public createElements(){
		//this.createAllMap();
		let type:string = "";
		let haveSeries:boolean = true;
		let id:number = 0;
		// 纵向类型
		let ztype:string = "";
		// 横向类型
		let htype:string = "";
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				// 确保游戏一开始不允许自动消除
				while(haveSeries){
					// 循环获取随机类型
					type = this.getRandomType();
					if(i>1 && GameData.mapData[i-1][j]!=null && GameData.mapData[i-2][j]!=null){
						// 在当前卡片元素上面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
						if(GameData.GameElements[GameData.mapData[i-1][j]].type == GameData.GameElements[GameData.mapData[i-2][j]].type){
							ztype = GameData.GameElements[GameData.mapData[i-1][j]].type;
						}
					}
					if(j>1 && GameData.mapData[i][j-1]!=null && GameData.mapData[i][j-2]!=null){
						// 在当前卡片元素前面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
						if(GameData.GameElements[GameData.mapData[i][j-1]].type == GameData.GameElements[GameData.mapData[i][j-2]].type){
							htype = GameData.GameElements[GameData.mapData[i][j-1]].type;
						}
					}
					// 此时保证游戏一开始没有三个消除的元素
					if(type!=ztype && type!=htype){
						haveSeries = false;
					}
				}
				// 初始化数据
				//id = GameData.unusedElements[0];
				id = i*GameData.maxRow+j;
				GameData.GameElements[id].type = type;
				GameData.GameElements[id].location = i*GameData.maxRow + j;
				GameData.mapData[i][j] = id;
				// 因为每次循环获取第一个未使用卡片元素,所以获取之后记得移除对象池的第一个未使用卡片元素
				//GameData.unusedElements.shift();
				// 重置一些属性的默认值
				haveSeries = true;
				ztype = "";
				htype = "";
			}
		}
	}

	/*private createAllMap(){
		let len:number = GameData.maxRow * GameData.maxColumn;
		let type:string = "";
		let havelink:boolean = true;
		let id:number = 0;
		// 纵向类型
		let ztype:string = "";
		// 横向类型
		let htype:string = "";
		for(let i=0;i<GameData.maxRow;i++){
			for(let j=0;j<GameData.maxColumn;j++){
				// 确保游戏一开始不允许自动消除
				while(havelink){
					// 循环获取随机类型
					type = this.createType();
					if(i>1 && GameData.mapData[i-1][j]!=null && GameData.mapData[i-2][j]!=null){
						// 在当前卡片元素上面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
						if(GameData.mappedElements[GameData.mapData[i-1][j]].type == GameData.mappedElements[GameData.mapData[i-2][j]].type){
							ztype = GameData.mappedElements[GameData.mapData[i-1][j]].type;
						}
					}
					if(j>1 && GameData.mapData[i][j-1]!=-1 && GameData.mapData[i][j-2]!=-1){
						// 在当前卡片元素前面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
						if(GameData.elements[GameData.mapData[i][j-1]].type == GameData.elements[GameData.mapData[i][j-2]].type){
							htype = GameData.elements[GameData.mapData[i][j-1]].type;
						}
					}
					// 此时保证游戏一开始没有三个消除的元素
					if(type!=ztype && type!=htype){
						havelink = false;
					}
				}
				// 初始化数据
				id = GameData.unusedElements[0];
				GameData.elements[id].type = type;
				GameData.elements[id].location = i*GameData.maxRow + j;
				GameData.mapData[i][j] = id;
				// 因为每次循环获取第一个未使用卡片元素,所以获取之后记得移除对象池的第一个未使用卡片元素
				GameData.unusedElements.shift();
				// 重置一些属性的默认值
				havelink = true;
				ztype = "";
				htype = "";
			}
		}
	}*/

	// 随机生成地图元素的类型
	private getRandomType():string {
		let rand = Math.floor(Math.random()*GameData.GameElementTypes.length);
		return GameData.GameElementTypes[rand];
	}

	// 创建任意数量的随机类型
	public getAnyRandomTypes(num:number):string[] {
		let types:string[] = [];
		for(let i=0;i<num;i++){
			types.push(this.getRandomType());
		}
		return types;
	}

	// 对某一个卡片元素,更新它的类型
	public changeTypeByID(id:number){
		GameData.GameElements[id].type = this.getRandomType();
	}

	// 根据当前删除的地图元素,刷新所有的元素位置
	// 例如,如果消除了三个卡片元素,那么这三个元素的位置要重新排列,同时它们上方的元素要向下移动
	public updateMap(){
		// 将LinkLogic.eliminates二维数组的数据转换为一维数组,存储在ids[]
		let ids:number[] = [];
		let len:number = EliminateLogic.eliminates.length;
		for(let i=0;i<len;i++){
			let l:number = EliminateLogic.eliminates[i].length;
			for(let j=0;j<l;j++){
				if(ids.indexOf(EliminateLogic.eliminates[i][j]) == -1){
					// 针对这些已经被消除的元素,需要对其重新设置类型
					this.changeTypeByID(EliminateLogic.eliminates[i][j]);
					// ids存储的都是一些没有重复出现过的卡片元素,一般在十字消除的时候会出现重复元素
					ids.push(EliminateLogic.eliminates[i][j]);
				}
			}
		}

		len = ids.length;
		// 记录每一个被消除元素当前的列编号
		let colarr:number[] = [];
		for(let i=0;i<len;i++){
			// 同上面一样,colarr只存放不重复的列编号
			if(colarr.indexOf(GameData.GameElements[ids[i]].location%GameData.maxRow) == -1){
				colarr.push(GameData.GameElements[ids[i]].location%GameData.maxRow);
			}
		}

		// 循环对每一列进行调整
		len = colarr.length;
		for(let i=0;i<len;i++){
			// 当一些元素被消除,上面的整列元素准备要下来,newcolids就是用来存放这些正准备下落的又不是新出现的卡片元素
			let newcolids:number[] = [];
			// 保存那些被消除的元素,但是与ids不同,removeids只是其中一列
			let removeids:number[] = [];
			for(let j=GameData.maxRow-1;j>=0;j--){
				if(ids.indexOf(GameData.mapData[j][colarr[i]]) == -1){
					if(GameData.mapData[j][colarr[i]] != null){
						newcolids.push(GameData.mapData[j][colarr[i]]);
					}
				}
				else{
					removeids.push(GameData.mapData[j][colarr[i]]);
				}
			}

			// 虽然上面把newcolids和removeids拆分开来,现在又把它们两个再次合并,但是合并结果不一样,removeids拼接在newcolids的后面
			newcolids = newcolids.concat(removeids);
			for(let j=GameData.maxRow-1; j>=0; j--){
				if(GameData.mapData[j][colarr[i]] != null){
					// 最后重新调整位置之后,被消除的卡片元素的id会放在上面依次排列
					GameData.mapData[j][colarr[i]] = newcolids[0];
					GameData.GameElements[newcolids[0]].location = j*GameData.maxRow+colarr[i];
					newcolids.shift();
				}
			}
		}
	}
}