/**
 * 解析地图数据
 */
class MapDataParse {
	public static createMapData(val:number[]):void {
		let len:number = val.length;
		GameData.unmapnum = len;
		let index:number = 0;
		for(let i=0;i<len;i++){
			index = val[i];
			let row:number = Math.floor(index/GameData.MaxColumn);
			let col:number = index % GameData.MaxRow;
			// 对于一个地图上的元素,-1表示当前地图块无法使用
			// -2表示当前地图块是空的,可以使用,但是没有放置任何元素id
			GameData.mapData[row][col] = -1;
		}
		GameData.currentElementNum = GameData.MaxRow * GameData.MaxColumn - len;
	}
}