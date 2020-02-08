/**
 * 道具管理器制作
 */
class PropViewManage {
	private _layer:egret.Sprite;
	public constructor(root:egret.Sprite) {
		this._layer = root;
		this.init();
	}

	private _props:PropView[];
	private init(){
		this._props = new Array();
		this.createData();
	}

	private createData(){
		for(let i=0;i<5;i++){
			let prop:PropView = new PropView(i);
			prop.x = 15+(prop.width+5)*i;
			prop.y = GameData.stageH-prop.height-10;
			this._layer.addChild(prop);
			this._props.push(prop);
			prop.num = Math.floor(Math.random()*5);
			prop.id = i;
			prop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
		}
	}

	private _currentID:number = -1;
	private click(evt:egret.TouchEvent){
		if(this._currentID!=-1){
			this._props[this._currentID].setFocus(false);
			if(this._currentID == (<PropView>evt.currentTarget).id){
				this._currentID = -1;
				PropViewManage.proptype = -1;
			}
			else{
				this._currentID == (<PropView>evt.currentTarget).id;
				this._props[this._currentID].setFocus(true);
				PropViewManage.proptype = this._props[this._currentID].proptype;
			}
		}
		else{
			this._currentID == (<PropView>evt.currentTarget).id;
			this._props[this._currentID].setFocus(true);
			PropViewManage.proptype = this._props[this._currentID].proptype;
		}
	}

	// 道具类型
	public static proptype:number = -1;

	public useProp(){
		this._props[this._currentID].num--;
		this._props[this._currentID].setFocus(false);
		this._currentID = -1;
		PropViewManage.proptype = -1;
	}
}