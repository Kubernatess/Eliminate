class StepNumText {

	private container:egret.DisplayObjectContainer;
	
	// 当前剩余步数文本
	public stepText:egret.TextField;

	public constructor(container:egret.DisplayObjectContainer) {
		this.container = container;
		
		// 剩余步数文本左右两边间隔
		let gap:number = 100*GameData.stageW/2024;
		// 设置文本属性
		let movesText = new egret.TextField();
		this.container.addChild(movesText);
		movesText.textColor = 0xFFFF00;
		movesText.fontFamily = "方正大黑简体";
		movesText.x = (GameData.stageW/2)+gap*2;
		movesText.y = gap;
		movesText.size = 140*GameData.stageW/2024;
		movesText.text = "Moves";
		// 设置剩余步数
		this.stepText = new egret.TextField();
		this.container.addChild(this.stepText);
		this.stepText.fontFamily = "方正大黑简体";
		this.stepText.size = 140*GameData.stageW/2024;
		this.stepText.x = movesText.x+movesText.width;
		this.stepText.y = gap;
		this.stepText.text = "×"+GameData.stepNum;
	}

}