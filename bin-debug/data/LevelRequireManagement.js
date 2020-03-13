var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 负责过关条件元素管理和操作
 */
var LevelRequireManagement = (function () {
    // 初始化操作
    function LevelRequireManagement() {
        this.levelRequiredElements = [];
    }
    // 获取多少种过关条件元素需要消除
    LevelRequireManagement.prototype.getLevelRequireNum = function () {
        return this.levelRequiredElements.length;
    };
    // 添加过关条件元素
    LevelRequireManagement.prototype.addElement = function (type, num) {
        // 先创建新的过关条件元素
        var ele = new LevelRequiredElement();
        ele.num = num;
        ele.type = type;
        // 然后添加到对象池中
        this.levelRequiredElements.push(ele);
    };
    // 每次完成一关卡后,需要清空过关条件元素对象池
    LevelRequireManagement.prototype.openChange = function () {
        this.levelRequiredElements = [];
    };
    // 减少其中一种过关条件元素的数量,其中num参数指的是需要消除的数量
    LevelRequireManagement.prototype.changeRequireNum = function (type, num) {
        var len = this.getLevelRequireNum();
        for (var i = 0; i < len; i++) {
            // 判断过关条件元素类型是否为传进来的参数类型
            if (this.levelRequiredElements[i].type == type) {
                this.levelRequiredElements[i].num -= num;
                // 结束当前循环
                return;
            }
        }
    };
    // 检测当前是否所有过关条件元素都被消除掉了
    LevelRequireManagement.prototype.isClear = function () {
        var len = this.getLevelRequireNum();
        for (var i = 0; i < len; i++) {
            // 如果发现某一个元素剩余的数量不为0,则返回false,还有未消除的元素
            if (this.levelRequiredElements[i].num > 0) {
                return false;
            }
        }
        // 返回true表示所有元素消除了
        return true;
    };
    return LevelRequireManagement;
}());
__reflect(LevelRequireManagement.prototype, "LevelRequireManagement");
//# sourceMappingURL=LevelRequireManagement.js.map