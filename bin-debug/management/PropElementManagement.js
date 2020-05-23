var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 道具控制器
 */
var PropElementManagement = (function () {
    function PropElementManagement(container) {
        this.currentTap = -1;
        this.container = container;
        // 创建所有道具元素
        for (var i = 0; i < 5; i++) {
            var element = new PropElement();
            this.container.addChildAt(element, i);
            element.touchEnabled = true;
            element.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }
        this.init();
    }
    // 初始化填充数据
    PropElementManagement.prototype.init = function () {
        for (var i = 0; i < 5; i++) {
            var element = this.container.getChildAt(i);
            element.setType(GameData.PropElements[i].type);
            element.setPropNum(GameData.PropElements[i].num);
            element.setX(i);
        }
    };
    PropElementManagement.prototype.onTouchTap = function (evt) {
        var element = evt.currentTarget;
        if (this.currentTap == this.container.getChildIndex(element)) {
            element.focusEffect(false);
            PropElementManagement.propType = "";
            this.currentTap = -1;
        }
        else {
            if (this.currentTap != -1) {
                this.container.getChildAt(this.currentTap).focusEffect(false);
            }
            element.focusEffect(true);
            this.currentTap = this.container.getChildIndex(element);
            PropElementManagement.propType = element.getType();
        }
    };
    PropElementManagement.prototype.useProp = function (gameElementManagement) {
        var element = this.container.getChildAt(this.currentTap);
        var num = element.getPropNum();
        if (num > 0) {
            element.setPropNum(num - 1);
        }
        element.focusEffect(false);
        // 执行不同的道具
        switch (PropElementManagement.propType) {
            case "same":
                this.samelyEliminate(gameElementManagement);
                break;
            case "cross":
                this.crosswiseEliminate(gameElementManagement);
                break;
            case "line":
                this.linelyEliminate(gameElementManagement);
                break;
            case "column":
                this.columnEliminate(gameElementManagement);
                break;
            case "single":
                this.singlyEliminate(gameElementManagement);
                break;
        }
        this.currentTap = -1;
        PropElementManagement.propType = "";
    };
    // 同色消除
    PropElementManagement.prototype.samelyEliminate = function (gameElementManagement) {
        var type = gameElementManagement.container.getChildAt(CustomizedEvent.currentTap).getType();
        var len = MapData.maxRow * MapData.maxCol;
        for (var i = 0; i < len; i++) {
            if (gameElementManagement.container.getChildAt(i).getType() == type) {
                gameElementManagement.eliminates.push(i);
            }
        }
    };
    // 消除一周
    PropElementManagement.prototype.crosswiseEliminate = function (gameElementManagement) {
        var row = Math.floor(CustomizedEvent.currentTap / MapData.maxCol);
        var col = CustomizedEvent.currentTap % MapData.maxRow;
        gameElementManagement.eliminates.push(row * MapData.maxRow + col);
        if (row > 0) {
            gameElementManagement.eliminates.push((row - 1) * MapData.maxRow + col);
        }
        if (row < (MapData.maxRow - 1)) {
            gameElementManagement.eliminates.push((row + 1) * MapData.maxRow + col);
        }
        if (col > 0) {
            gameElementManagement.eliminates.push(row * MapData.maxRow + col - 1);
        }
        if (col < (MapData.maxCol - 1)) {
            gameElementManagement.eliminates.push(row * MapData.maxRow + col + 1);
        }
    };
    // 消除整行
    PropElementManagement.prototype.linelyEliminate = function (gameElementManagement) {
        // 获取行数据
        var row = Math.floor(CustomizedEvent.currentTap / MapData.maxCol);
        for (var col = 0; col < MapData.maxCol; col++) {
            gameElementManagement.eliminates.push(row * MapData.maxRow + col);
        }
    };
    // 消除整列
    PropElementManagement.prototype.columnEliminate = function (gameElementManagement) {
        // 获取列数据
        var col = CustomizedEvent.currentTap % MapData.maxRow;
        for (var row = 0; row < MapData.maxRow; row++) {
            gameElementManagement.eliminates.push(row * MapData.maxRow + col);
        }
    };
    // 消除单一颜色
    PropElementManagement.prototype.singlyEliminate = function (gameElementManagement) {
        gameElementManagement.eliminates.push(CustomizedEvent.currentTap);
    };
    // 当前使用的道具元素
    PropElementManagement.propType = "";
    return PropElementManagement;
}());
__reflect(PropElementManagement.prototype, "PropElementManagement");
//# sourceMappingURL=PropElementManagement.js.map