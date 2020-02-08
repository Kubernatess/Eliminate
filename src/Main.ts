/**
 * 编写资源加载相关代码
 * 加载顺序:舞台->配置文件->组资源
 */
class Main extends egret.Sprite {

    public constructor(){
        super();
        // 在引擎初始化的时候首先监听舞台初始化
        this.addEventListener(egret.Event.ADDED_TO_STAGE , this.onAddToStage , this);
    }

    // 舞台初始化响应函数
    private onAddToStage(evt:egret.EventDispatcher){
        // 监听配置文件加载的事件
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE , this.onConfigComplete , this);
        // 加载配置资源
        RES.loadConfig("resource/default.res.json","resource/");
    }

    // 配置资源加载响应函数
    private onConfigComplete(evt:RES.ResourceEvent){
        // 防止内存泄漏
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE , this.onConfigComplete , this);
        // 监听组加载
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE , this.onResourceLoadComplete , this);
        // 加载完配置资源后,加载组资源
        RES.loadGroup("preload");
    }

    // 组资源加载响应函数
    private onResourceLoadComplete(evt:RES.ResourceEvent){
        // 到这里所有资源加载完成,然后开始创建我们的游戏
        this.createGame();
    }

    private _gl:GameLogic;
    // 
    private createGame(){
        let gameLayer:egret.Sprite = new egret.Sprite();
        this.addChild(gameLayer);
        this._gl = new GameLogic(gameLayer);
    }
}