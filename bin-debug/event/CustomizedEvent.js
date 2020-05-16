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
var CustomizedEvent = (function (_super) {
    __extends(CustomizedEvent, _super);
    function CustomizedEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        // 使用道具时点击的元素位置
        _this.propToElementLocation = 0;
        // 第一个点击的元素
        _this.currentTap = -1;
        // 第二个点击的元素
        _this.anotherTap = -1;
        return _this;
    }
    CustomizedEvent.TAP_TWO_ELEMENT = "tap_two_element";
    CustomizedEvent.ELIMINATE_OVER = "eliminate_over";
    CustomizedEvent.UPDATE_MAP = "update_map";
    CustomizedEvent.UPDATE_VIEW_OVER = "update_view_over";
    CustomizedEvent.USE_PROP_CLICK = "use_prop_click";
    return CustomizedEvent;
}(egret.Event));
__reflect(CustomizedEvent.prototype, "CustomizedEvent");
//# sourceMappingURL=CustomizedEvent.js.map