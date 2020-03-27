var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 道具控制器
 */
var PropElementManagement = (function () {
    function PropElementManagement(container) {
        this.container = container;
        // 创建所有道具元素
        for (var i = 0; i < 5; i++) {
            var element = new PropElement();
            this.container.addChild(element);
            element.type = GameData.PropElements[i].type;
            element.bitmap.texture = RES.getRes(element.type + "_png");
            element.numText.text = "x" + GameData.PropElements[i].num;
            // 道具元素之间的间隔为150像素
            var gap = 150 * GameData.ratio;
            element.x = gap + (gap + element.width) * i;
            //ele.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
        }
    }
    return PropElementManagement;
}());
__reflect(PropElementManagement.prototype, "PropElementManagement");
//# sourceMappingURL=PropElementManagement.js.map