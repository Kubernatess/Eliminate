var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 负责过关条件管理和操作
 */
var LevelRequire = (function () {
    // 初始化操作
    function LevelRequire() {
        this.reqElements = [];
    }
    // 获取过关条件多少种元素需要消除
    LevelRequire.prototype.getLevelReqNum = function () {
        return this.reqElements.length;
    };
    // 添加通关关卡元素
    LevelRequire.prototype.addElement = function (type, num) {
        var ele = new LevelRequireElement();
        ele.num = num;
        ele.type = type;
        this.reqElements.push(ele);
    };
    // 清空关卡元素
    LevelRequire.prototype.openChange = function () {
        this.reqElements = [];
    };
    // 减少关卡元素数量
    LevelRequire.prototype.changeReqNum = function (type, num) {
        var len = this.getLevelReqNum();
        for (var i = 0; i < len; i++) {
            if (this.reqElements[i].type == type) {
                this.reqElements[i].num -= num;
                return;
            }
        }
    };
    // 检测当前是否完成所有关卡
    LevelRequire.prototype.isClear = function () {
        var len = this.getLevelReqNum();
        for (var i = 0; i < len; i++) {
            if (this.reqElements[i].num > 0) {
                return false;
            }
        }
        return true;
    };
    return LevelRequire;
}());
__reflect(LevelRequire.prototype, "LevelRequire");
//# sourceMappingURL=LevelRequire.js.map