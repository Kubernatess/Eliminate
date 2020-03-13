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
 * 自定义事件管理类
 */
var ElementViewManagementEvent = (function (_super) {
    __extends(ElementViewManagementEvent, _super);
    function ElementViewManagementEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        // 使用道具时点击的元素位置
        _this.propToElementLocation = 0;
        // 第一个点击的元素
        _this.elementA = 0;
        // 第二个点击的元素
        _this.elementB = 0;
        return _this;
    }
    ElementViewManagementEvent.TAP_TWO_ELEMENT = "tap_two_element";
    ElementViewManagementEvent.REMOVE_ANIMATION_OVER = "remove_animation_over";
    ElementViewManagementEvent.UPDATE_MAP = "update_map";
    ElementViewManagementEvent.UPDATE_VIEW_OVER = "update_view_over";
    ElementViewManagementEvent.USE_PROP_CLICK = "use_prop_click";
    return ElementViewManagementEvent;
}(egret.Event));
__reflect(ElementViewManagementEvent.prototype, "ElementViewManagementEvent");
//# sourceMappingURL=ElementViewManagementEvent.js.map