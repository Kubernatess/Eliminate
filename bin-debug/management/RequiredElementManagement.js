var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 负责条件元素的管理和操作
 */
var RequiredElementManagement = (function () {
    function RequiredElementManagement(container) {
        this.container = container;
        // 创建条件元素并添加到显示列表
        for (var i = 0; i < GameData.RequiredElements.length; i++) {
            var element = new RequiredElement();
            this.container.addChildAt(element, i);
        }
        this.init();
    }
    // 将模型数据填充到视图
    RequiredElementManagement.prototype.init = function () {
        for (var i = 0; i < GameData.RequiredElements.length; i++) {
            var element = this.container.getChildAt(i);
            element.setType(GameData.RequiredElements[i].type);
            element.setReqNum(GameData.RequiredElements[i].num);
            element.setX(i);
        }
    };
    // 判断是否为指定类型
    RequiredElementManagement.prototype.isRequiredElementType = function (type) {
        var len = this.container.numChildren;
        for (var i = 0; i < len; i++) {
            if (this.container.getChildAt(i).getType() == type) {
                return true;
            }
        }
        return false;
    };
    // 通过类型获取当前条件元素在视图中的位置信息
    RequiredElementManagement.prototype.getPointByType = function (type) {
        var point = new egret.Point();
        var len = this.container.numChildren;
        for (var i = 0; i < len; i++) {
            if (this.container.getChildAt(i).getType() == type) {
                point.x = this.container.getChildAt(i).x + this.container.getChildAt(i).width / 2;
                point.y = this.container.getChildAt(i).y;
                return point;
            }
        }
    };
    // 减少其中一种条件元素的数量,其中subtrahend参数指的是需要消除的数量
    RequiredElementManagement.prototype.updateNumText = function (type, subtrahend) {
        for (var i = 0; i < this.container.numChildren; i++) {
            if (this.container.getChildAt(i).getType() == type) {
                var num = this.container.getChildAt(i).getReqNum();
                if (num - subtrahend <= 0) {
                    this.container.getChildAt(i).setReqNum(0);
                }
                else {
                    this.container.getChildAt(i).setReqNum(num - subtrahend);
                }
                break;
            }
        }
    };
    // 检测当前是否所有条件元素都被消除掉了
    RequiredElementManagement.prototype.isAllElementEliminated = function () {
        var len = this.container.numChildren;
        for (var i = 0; i < len; i++) {
            // 如果发现某一个元素剩余的数量不为0,则返回false,还有未消除的元素
            if (this.container.getChildAt(i).getReqNum() > 0) {
                return false;
            }
        }
        // 返回true表示所有元素消除了
        return true;
    };
    return RequiredElementManagement;
}());
__reflect(RequiredElementManagement.prototype, "RequiredElementManagement");
