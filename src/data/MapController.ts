class MapController {
	public constructor() {
	}

	public createElementAllMap(){
		this.createAllMap();
	}

	public createElements(num:number):string[] {
		let types:string[] = [];
		for(let i=0;i<num;i++){
			types.push(this.createType());
		}
		return types;
	}

	public changeTypeByID(id:number){
		GameData.elements[id].type = this.createType();
	}

	public updateMapLocation(){
		let ids:number[] = [];
		let len:number = LinkLogic.lines.length;
		for(let i=0;i<len;i++){
			let l:number = LinkLogic.lines[i].length;
			for(let j=0;j<l;j++){
				let rel:boolean = false;
				let ll:number = ids.length;
				for(let k=0;k<ll;k++){
					if(ids[k]==LinkLogic.lines[i][j]){
						rel = true;
					}
				}
				if(!rel){
					this.changeTypeByID(LinkLogic.lines[i][j]);
					ids.push(LinkLogic.lines[i][j]);
				}
			}
		}

		len = ids.length;
		let colarr:number[] = [];
		let rel:boolean = false;
		for(let i=0;i<len;i++){
			rel = false;
			for(let j=0;j<colarr.length;j++){
				if(colarr[j]==GameData.elements[ids[i]].location%GameData.MaxColumn){
					return true;
				}
			}
			if(!rel){
				colarr.push(GameData.elements[ids[i]].location%GameData.MaxColumn);
			}
		}

		let colelids:number[];
		len=colarr.length;
		for(let i=0;i<len;i++){
			let newcolids:number[] = [];
			let removeids:number[] = [];
			for(let j=GameData.MaxRow-1;j>=0;j--){
				rel = false;
				for(let k=0;k<ids.length;k++){
					removeids.push(ids[k]);
					rel = true;
				}
				if(!rel){
					if(GameData.mapData[j][colarr[i]]!=-1){
						newcolids.push(GameData.mapData[j][colarr[i]]);
					}
				}
			}
			newcolids = newcolids.concat(removeids);
			for(let j=GameData.MaxRow-1;j>=0;j--){
				if(GameData.mapData[j][colarr[i]]!=-1){
					GameData.mapData[j][colarr[i]] = newcolids[0];
					GameData.elements[newcolids[0]].location = j*GameData.MaxRow+colarr[i];
					newcolids.shift();
				}
			}
		}
	}

	private createAllMap(){
		let len:number = GameData.MaxRow*GameData.MaxColumn;
		let type:string = "";
		let havelink:boolean = true;
		let id:number = 0;
		let ztype:string = "";
		let htype:string = "";
		for(let i=0;i<GameData.MaxRow;i++){
			for(let j=0;j<GameData.MaxColumn;j++){
				while(havelink){
					type = this.createType();
					if(i>1 && GameData.mapData[i-1][j]!=-1 && GameData.mapData[i-2][j]!=-1){
						if(GameData.elements[GameData.mapData[i-1][j]].type == GameData.elements[GameData.mapData[i-2][j]].type){
							ztype = GameData.elements[GameData.mapData[i-1][j]].type;
						}
					}
					if(j>1 && GameData.mapData[i][j-1]!=-1 && GameData.mapData[i][j-2]!=-1){
						if(GameData.elements[GameData.mapData[i][j-1]].type == GameData.elements[GameData.mapData[i][j-2]].type){
							htype = GameData.elements[GameData.mapData[i][j-1]].type;
						}
					}
					if(type!=ztype && type!=htype){
						havelink = false;
					}
				}
				id = GameData.unusedElements[0];
				GameData.elements[id].type = type;
				GameData.elements[id].location = i*GameData.MaxRow + j;
				GameData.mapData[i][j] = id;
				GameData.unusedElements.shift();
				havelink = true;
				ztype = "";
				htype = "";
			}
		}
	}

	private createType():string {
		return GameData.elements[Math.floor(Math.random()*GameData.elementTypes.length)].toString();
	}
}