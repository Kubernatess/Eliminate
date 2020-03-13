var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 道具算法设计与实现
 */
var PropLogic = (function () {
    function PropLogic() {
    }
    // 第一个参数为道具类型,第二个参数为用户点击的卡片元素位置
    PropLogic.useProp = function (propType, elementLocation) {
        switch (propType) {
            case 0:
                PropLogic.sameColor(elementLocation);
                break;
            case 1:
                PropLogic.around(elementLocation);
                break;
            case 2:
                PropLogic.wholeLine(elementLocation);
                break;
            case 3:
                PropLogic.wholeColumn(elementLocation);
                break;
            case 4:
                PropLogic.singleColor(elementLocation);
                break;
        }
    };
    // 同色消除
    PropLogic.sameColor = function (location) {
        // 使用道具后,用于保存消除的元素
        LinkLogic.eliminates = [];
        var arr = [];
        // 获取当前卡片元素类型
        var row = Math.floor(location / GameData.maxColumn);
        var col = location % GameData.maxRow;
        var type = GameData.elements[GameData.mapData[row][col]].type;
        // 循环判断,找出和type类型相同的元素
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                if (GameData.mapData[i][j] != -1 && GameData.elements[GameData.mapData[i][j]].type == type) {
                    arr.push(GameData.mapData[i][j]);
                }
            }
        }
        LinkLogic.eliminates.push(arr);
    };
    // 消除一周
    PropLogic.around = function (location) {
        LinkLogic.eliminates = new Array();
        var arr = new Array();
        // 求得卡片元素的位置坐标
        var row = Math.floor(location / GameData.maxColumn);
        var col = location % GameData.maxRow;
        // 添加当前点击的这个卡片元素
        arr.push(GameData.mapData[row][col]);
        // 添加上边的卡片元素
        if (row > 0 && GameData.mapData[row - 1][col] != -1) {
            arr.push(GameData.mapData[row - 1][col]);
        }
        // 添加下边的卡片元素
        if (row < (GameData.maxRow - 1) && GameData.mapData[row + 1][col] != -1) {
            arr.push(GameData.mapData[row + 1][col]);
        }
        // 添加左边的卡片元素
        if (col > 0 && GameData.mapData[row][col - 1] != -1) {
            arr.push(GameData.mapData[row][col - 1]);
        }
        // 添加右边的卡片元素
        if (col < (GameData.maxColumn - 1) && GameData.mapData[row][col + 1] != -1) {
            arr.push(GameData.mapData[row][col + 1]);
        }
    };
    // 消除整行
    PropLogic.wholeLine = function (location) {
        // 使用道具后,用于保存消除的元素
        LinkLogic.eliminates = new Array();
        var arr = new Array();
        // 获取行数据
        var row = Math.floor(location / GameData.maxColumn);
        for (var col = 0; col < GameData.maxColumn; col++) {
            if (GameData.mapData[row][col] != -1) {
                arr.push(GameData.mapData[row][col]);
            }
        }
        LinkLogic.eliminates.push(arr);
    };
    // 消除整列
    PropLogic.wholeColumn = function (location) {
        // 使用道具后,用于保存消除的元素
        LinkLogic.eliminates = new Array();
        var arr = new Array();
        // 获取列数据
        var col = location % GameData.maxRow;
        for (var row = 0; row < GameData.maxRow; row++) {
            if (GameData.mapData[row][col] != -1) {
                arr.push(GameData.mapData[row][col]);
            }
        }
        LinkLogic.eliminates.push(arr);
    };
    // 消除单一颜色
    PropLogic.singleColor = function (location) {
        LinkLogic.eliminates = new Array();
        var row = Math.floor(location / GameData.maxColumn);
        var col = location % GameData.maxRow;
        LinkLogic.eliminates.push([GameData.mapData[row][col]]);
    };
    return PropLogic;
}());
__reflect(PropLogic.prototype, "PropLogic");
//# sourceMappingURL=PropLogic.js.map