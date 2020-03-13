/**
 * 道具控制器
 */
class PropViewManagement {
	private layer:egret.Sprite;
	public constructor(root:egret.Sprite) {
		this.layer = root;
		this.init();
	}

	private propElements:PropView[];
	private init(){
		this.propElements = new Array();
		this.createData();
	}

	private createData(){
		for(let i=0;i<5;i++){
			let prop:PropView = new PropView(i);
			prop.x = 15+(prop.width+5)*i;
			prop.y = GameData.stageH-prop.height-10;
			this.layer.addChild(prop);
			this.propElements.push(prop);
			prop.num = Math.floor(Math.random()*5);
			prop.id = i;
			prop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
		}
	}

	// 当前焦点道具元素
	private _currentID:number = -1;
	private click(evt:egret.TouchEvent){
		if(this._currentID!=-1){
			if(this._currentID == (<PropView>evt.currentTarget).id){
				this.propElements[this._currentID].setFocus(false);
				this._currentID = -1;
				PropViewManagement.proptype = -1;
			}
			else{
				this._currentID == (<PropView>evt.currentTarget).id;
				this.propElements[this._currentID].setFocus(true);
				PropViewManagement.proptype = this.propElements[this._currentID].proptype;
			}
		}
		else{
			this._currentID == (<PropView>evt.currentTarget).id;
			this.propElements[this._currentID].setFocus(true);
			PropViewManagement.proptype = this.propElements[this._currentID].proptype;
		}
	}

	// 道具类型
	public static proptype:number = -1;

	public useProp(){
		this.propElements[this._currentID].num--;
		this.propElements[this._currentID].setFocus(false);
		this._currentID = -1;
		PropViewManagement.proptype = -1;
	}
}