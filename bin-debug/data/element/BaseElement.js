var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BaseElement = (function () {
    function BaseElement() {
        /**
         * 类型字段用于判断是地图上的卡片元素还是过关条件元素
         * 同时,如果是卡片的话,对应的是哪一个种类的卡片
         */
        this.type = "";
    }
    return BaseElement;
}());
__reflect(BaseElement.prototype, "BaseElement");
//# sourceMappingURL=BaseElement.js.map