/**
 * 封装游戏结束画面板的样式与行为
 */
class GameOverPanel extends egret.Sprite {
	public constructor() {
		super();
	}

	private _view:egret.Bitmap;
	private _issuccess:boolean = false;
	public show(issuccess:boolean){
		this._issuccess = issuccess;
		this._view = new egret.Bitmap();
		this._view.texture = RES.getRes("levelreqbg_png");
		this._view.width = GameData.stageW-30;
		this._view.height = GameData.stageH/2;
		this._view.x = this._view.width/-2;
		this._view.y = this._view.height/-2;
		this.addChild(this._view);

		this.x = GameData.stageW/2;
		this.y = GameData.stageH/2;
		this.scaleX = 0.1;
		this.scaleY = 0.1;
		let tw = egret.Tween.get(this);
		tw.to({scaleX:1,scaleY:1},700,egret.Ease.bounceOut).call(this.playStarAni,this);
	}

	private playStarAni(){
		let gameover:egret.Bitmap = new egret.Bitmap();
		gameover.texture = RES.getRes("gameovertitle_png");
		gameover.width = this._view.width/2;
		gameover.height = 60;
		gameover.x = this._view.x+(this._view.width-gameover.width)/2;
		gameover.y = this._view.y-10;
		gameover.scaleX = 0;
		gameover.scaleY = 0;
		this.addChild(gameover);
		let tw = egret.Tween.get(gameover);
		tw.to({scaleX:1,scaleY:1},700,egret.Ease.bounceOut);

		console.log("播放失败动画");
		if(this._issuccess){
			// 成功动画
			let chengzi:egret.Bitmap = new egret.Bitmap();
			chengzi.texture = RES.getRes("chengzi_png");
			chengzi.width = (this._view.width-50)/3;
			chengzi.height = chengzi.width;
			chengzi.x = (GameData.stageW-chengzi.width*2)/3+this._view.x;
			chengzi.y = 150+this._view.y;
			chengzi.scaleX = 1.5;
			chengzi.scaleY = 1.5;
			chengzi.alpha = 0;
			this.addChild(chengzi);
			let tw = egret.Tween.get(chengzi);
			tw.to({scaleX:1,scaleY:1,alpha:1},700,egret.Ease.cubicIn);

			let gongzi:egret.Bitmap = new egret.Bitmap();
			gongzi.texture = RES.getRes("gongzi_png");
			gongzi.width = (this._view.width-50)/3;
			gongzi.height = gongzi.width;
			gongzi.x = (GameData.stageW-baizi.width*2)/3*2+gongzi.width+this._view.width;
			gongzi.y = 150+this._view.y;
			gongzi.scaleX = 1.5;
			gongzi.scaleY = 1.5;
			gongzi.alpha = 0;
			this.addChild(gongzi);
			egret.Tween.get(gongzi).wait(400).to({scaleX:1,scaleY:1,alpha:1},700,egret.Ease.circIn);
		}
		else{
			// 失败动画
			let shizi:egret.Bitmap = new egret.Bitmap();
			shizi.texture = RES.getRes("shizi_png");
			shizi.width = (this._view.width-50)/3;
			shizi.height = shizi.width;
			shizi.x = (GameData.stageW-shizi.width*2)/3+this._view.x;
			shizi.y = 150+this._view.y;
			shizi.scaleX = 1.5;
			shizi.scaleY = 1.5;
			shizi.alpha = 0;
			this.addChild(shizi);
			egret.Tween.get(shizi).wait(400).to({scaleX:1,scaleY:1,alpha:1},700,egret.Ease.circIn);
		}
	}
}