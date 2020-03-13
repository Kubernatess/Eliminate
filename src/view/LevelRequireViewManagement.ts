/**
 * 关卡元素管理器制作
 */
class LevelRequireViewManagement {

	// 过关条件元素显示容器
	private layer:egret.Sprite;

	public constructor(layer:egret.Sprite) {
		this.layer = layer;
		this.init();
	}

	// 过关条件元素对象池
	private levelRequireElements:LevelRequireElementView[];

	private init(){
		this.levelRequireElements = new Array();
	}

	// 当前剩余的步数
	private stepNumText:egret.BitmapText;

	// 创建所有的过关条件元素
	public createCurrentLevelReq(){
		// 获取过关条件元素的数量
		let len:number = GameData.levelRequireManagement.getLevelRequireNum();
		let el:LevelRequireElementView;
		for(let i=0;i<len;i++){
			// 循环创建过关条件元素
			if(this.levelRequireElements.length <= i){
				el = new LevelRequireElementView();
				this.levelRequireElements.push(el);
			}
			else{
				el = this.levelRequireElements[i];
			}
			el.eltype = GameData.levelRequireManagement.levelRequiredElements[i].type;
			el.setTexture("e"+el.eltype+"_png");
			el.x = 43+(5+el.width)*i;
			el.y = 95;
			el.num = GameData.levelRequireManagement.levelRequiredElements[i].num;
			this.layer.addChild(el);
		}

		// 设置剩余步数
		if(!this.stepNumText){
			this.stepNumText = new egret.BitmapText();
			this.stepNumText.font = RES.getRes("number_fnt");
			this.stepNumText.x = GameData.stageW-95;
			this.stepNumText.y = 90;
			this.stepNumText.scaleX = 1.5;
			this.stepNumText.scaleY = 1.5;
			this.layer.addChild(this.stepNumText);
			this.stepNumText.text = GameData.remainingStep.toString();
		}
	}

	// 判断是否有指定类型
	public haveRequiredType(type:string):boolean {
		let l:number = GameData.elements.length;
		for(let i=0;i<l;i++){
			if(this.levelRequireElements[i].eltype == type){
				return true;
			}
		}
		return false;
	}

	// 通过类型获取当前过关条件元素在视图中的位置信息
	public getPointByType(type:string):egret.Point {
		let p:egret.Point = new egret.Point();
		let l:number = GameData.elements.length;
		for(let i=0;i<l;i++){
			if(this.levelRequireElements[i].eltype == type){
				p.x = this.levelRequireElements[i].x+this.levelRequireElements[i].width/2;
				p.y = this.levelRequireElements[i].y+this.levelRequireElements[i].height/2;
			}
		}
		return p;
	}

	// 更新数据
	public update(){
		let len:number = GameData.levelRequireManagement.getLevelRequireNum();
		for(let i=0;i<len;i++){
			this.levelRequireElements[i].num = GameData.levelRequireManagement.levelRequiredElements[i].num;
		}
	}

	// 更新步数信息
	public updateStep(){
		this.stepNumText.text = GameData.remainingStep.toString();
	}
}