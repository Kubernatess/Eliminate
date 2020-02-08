var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BaseElement = (function () {
    function BaseElement() {
        // 类型字段用于判断过关条件的元素还是地图上的卡片元素还是道具元素
        this.type = "";
    }
    return BaseElement;
}());
__reflect(BaseElement.prototype, "BaseElement");
//# sourceMappingURL=BaseElement.js.map