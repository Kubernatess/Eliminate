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
            var ele = new RequiredElement();
            this.container.addChild(ele);
            // 将模型数据填充到视图
            ele.type = GameData.RequiredElements[i].type;
            ele.bitmap.texture = RES.getRes(ele.type + "_png");
            ele.textInfo.text = "×" + GameData.RequiredElements[i].num;
            // 条件元素左右两边间隔,锚点在左上角
            var gap = 80 * GameData.ratio;
            ele.x = gap + (gap + ele.width) * i;
            ele.y = gap;
        }
    }
    // 检测当前是否所有要求元素都被消除掉了
    RequiredElementManagement.prototype.isAllElementEliminated = function () {
        var len = this.container.numChildren;
        for (var i = 0; i < len; i++) {
            // 如果发现某一个元素剩余的数量不为0,则返回false,还有未消除的元素
            if (Number(this.container.getChildAt(i).textInfo.text) > 0) {
                return false;
            }
        }
        // 返回true表示所有元素消除了
        return true;
    };
    // 判断是否为指定类型
    RequiredElementManagement.prototype.isRequiredElementType = function (type) {
        var len = this.container.numChildren;
        for (var i = 0; i < len; i++) {
            if (this.container.getChildAt(i).type == type) {
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
            if (this.container.getChildAt(i).type == type) {
                /* 建议这里改变一下条件元素的锚点 */
                point.x = this.container.getChildAt(i).x + this.container.getChildAt(i).width / 2;
                point.y = this.container.getChildAt(i).y + this.container.getChildAt(i).height / 2;
            }
        }
        return point;
    };
    // 减少其中一种条件元素的数量,其中subtrahend参数指的是需要消除的数量
    RequiredElementManagement.prototype.updateNumText = function (type, subtrahend) {
        var len = this.container.numChildren;
        for (var i = 0; i < len; i++) {
            if (this.container.getChildAt(i).type == type) {
                var num = Number(this.container.getChildAt(i).textInfo.text);
                this.container.getChildAt(i).textInfo.text = (num - subtrahend).toString();
                return;
            }
        }
    };
    // 重置条件元素数量
    RequiredElementManagement.prototype.updateElementsNum = function () {
        var len = this.container.numChildren;
        for (var i = 0; i < len; i++) {
            this.container.getChildAt(i).textInfo.text = "×" + GameData.RequiredElements[i].num;
        }
    };
    return RequiredElementManagement;
}());
__reflect(RequiredElementManagement.prototype, "RequiredElementManagement");
//# sourceMappingURL=RequiredElementManagement.js.map