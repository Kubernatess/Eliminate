var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 编写资源加载相关代码
 * 加载顺序:舞台->配置文件->组资源
 * 游戏入口文件
 */
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        // 在引擎初始化的时候首先监听舞台初始化
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    // 舞台初始化响应函数
    Main.prototype.onAddToStage = function (evt) {
        // 监听配置文件加载事件
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // 加载配置资源
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    // 配置资源加载响应函数
    Main.prototype.onConfigComplete = function (evt) {
        // 防止内存泄漏
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // 监听组加载事件
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        // 加载完配置资源后,加载组资源
        RES.loadGroup("preload");
    };
    // 组资源加载响应函数
    Main.prototype.onResourceLoadComplete = function (evt) {
        // 到这里所有资源加载完成,然后开始创建我们的游戏
        this.createGame();
    };
    // 
    Main.prototype.createGame = function () {
        var gameLayer = new egret.Sprite();
        this.addChild(gameLayer);
        this._gl = new GameLogic(gameLayer);
    };
    return Main;
}(egret.Sprite));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map