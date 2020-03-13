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
 * 过关条件的元素类
 */
var RequiredElement = (function (_super) {
    __extends(RequiredElement, _super);
    function RequiredElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 表示某种类型元素需要消除多少个
        _this.num = 0;
        return _this;
    }
    return RequiredElement;
}(BaseElement));
__reflect(RequiredElement.prototype, "RequiredElement");
//# sourceMappingURL=LevelRequireElement.js.map