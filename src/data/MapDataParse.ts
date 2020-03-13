/**
 * 解析地图数据
 */
class MapDataParse {

	// 参数为level.json文件传进来的空白地图格子属性
	public static parseMapData(blanks:number[]):void {
		let len:number = blanks.length;
		GameData.unmapNum = len;
		let location:number = 0;
		for(let i=0;i<len;i++){
			location = blanks[i];
			let row:number = Math.floor(location/GameData.maxColumn);
			let col:number = location % GameData.maxRow;
			// 对于一个地图上的元素,null表示当前这个地图区域没有地图块
			GameData.mapData[row][col] = null;
		}
		// 根据空白地图块数量,反过来求当前可用卡片元素数量
		//GameData.currentElementNum = GameData.maxRow * GameData.maxColumn - len;
	}
}