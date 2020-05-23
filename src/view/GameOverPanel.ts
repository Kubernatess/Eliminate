/**
 * 封装游戏结束画面板的样式与行为
 */
class GameOverPanel extends egret.Sprite {
	public constructor() {
		super();
		// 设置贴图纹理
		let bitmap:egret.Bitmap = new egret.Bitmap();		
		this.addChild(bitmap);
		bitmap.texture = RES.getRes("game_over_panel_png");
		let ratio:number = bitmap.width/bitmap.height;
		bitmap.width = GameData.stageW/2;
		bitmap.height = bitmap.width/ratio;
		// 设置GameOver面板属性
		this.anchorOffsetX = this.width/2
		this.anchorOffsetY = this.height/2;
		this.x = GameData.stageW/2;
		this.y = -GameData.stageH/2;

		this.touchEnabled = true;
	}

	public show(){
		let tw:egret.Tween = egret.Tween.get(this);
		tw.to({y:GameData.stageH/2}, 700, egret.Ease.bounceOut);
	}

}