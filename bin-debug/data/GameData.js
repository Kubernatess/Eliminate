var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏基础数据封装,而且要保证这些数据是全局的
 * 相当于MVC设计模式中Model层
 */
var GameData = (function () {
    function GameData() {
    }
    ;
    // 游戏元素类型
    GameData.GameElementTypes = ["Egret-Android-Support", "Egret-iOS-Support", "EgretEngine", "EgretWing", "EgretFeather", "DragonBones", "EgretNative", "ResDepot", "EgretiaServer", "EgretInspector", "EgretPro", "EgretUIEditor", "Lakeshore", "TextureMerger"];
    // 条件元素类型及其对应的数量
    GameData.RequiredElements = [
        { "type": "Lakeshore", "num": 10 },
        { "type": "EgretWing", "num": 14 },
        { "type": "DragonBones", "num": 12 },
        { "type": "EgretFeather", "num": 10 }
    ];
    // 道具元素类型及其对应的数量
    GameData.PropElements = [
        { "type": "single", "num": 5 },
        { "type": "same", "num": 12 },
        { "type": "column", "num": 5 },
        { "type": "cross", "num": 10 },
        { "type": "line", "num": 14 }
    ];
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map