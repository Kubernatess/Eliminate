var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 所有连线消除的算法
 */
var LinkLogic = (function () {
    function LinkLogic() {
    }
    // 在交换卡片元素之后,全局判断是否有连线消除
    LinkLogic.isHaveLine = function () {
        LinkLogic.eliminates = [];
        // 记录当前类型的一个指针
        var currentType = "";
        // 当前检索类型的数量
        var typeNum = 0;
        // 横向循环判断
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                // !=-1表示地图块可用,地图块上可能有卡片元素,但也可能还没有放置卡片元素
                if (GameData.mapData[i][j] != -1) {
                    // 如果当前的类型与对象池存放的卡片元素类型不同,表明上一组的检测结束了
                    if (currentType != GameData.elements[GameData.mapData[i][j]].type) {
                        // 如果上一次的检索类型数量大于等于3,把这组可消除元素全部存起来
                        if (typeNum >= 3) {
                            var arr = [];
                            for (var k = 0; k < typeNum; k++) {
                                arr.push(GameData.mapData[i][j - k - 1]);
                            }
                            LinkLogic.eliminates.push(arr);
                        }
                        // 重置当前类型和检索类型计数器
                        currentType = GameData.elements[GameData.mapData[i][j]].type;
                        typeNum = 1;
                    }
                    else {
                        typeNum++;
                    }
                }
                else {
                    if (typeNum >= 3) {
                        var arr = [];
                        for (var k = 0; k < typeNum; k++) {
                            arr.push(GameData.mapData[i][j - k - 1]);
                        }
                        LinkLogic.eliminates.push(arr);
                    }
                    // 把当前类型和检索类型计数器纸为空
                    currentType = "";
                    typeNum = 0;
                }
            }
            // 最后行结尾还要再统计一次typeNum
            if (typeNum >= 3) {
                var arr = [];
                for (var k = 0; k < typeNum; k++) {
                    arr.push(GameData.mapData[i][GameData.maxColumn - k - 1]);
                }
                LinkLogic.eliminates.push(arr);
            }
            // 把当前类型和检索类型计数器纸为空
            currentType = "";
            typeNum = 0;
        }
        // 纵向循环判断,方法同上
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                if (GameData.mapData[j][i] != -1) {
                    if (currentType != GameData.elements[GameData.mapData[j][i]].type) {
                        if (typeNum >= 3) {
                            var arr = [];
                            for (var k = 0; k < typeNum; k++) {
                                arr.push(GameData.mapData[j - k - 1][i]);
                            }
                            LinkLogic.eliminates.push(arr);
                        }
                        currentType = GameData.elements[GameData.mapData[j][i]].type;
                        typeNum = 1;
                    }
                    else {
                        typeNum++;
                    }
                }
                else {
                    if (typeNum >= 3) {
                        var arr = [];
                        for (var k = 0; k < typeNum; k++) {
                            arr.push(GameData.mapData[j - k - 1][i]);
                        }
                        LinkLogic.eliminates.push(arr);
                    }
                    currentType = "";
                    typeNum = 0;
                }
            }
            // 列末尾判断
            if (typeNum >= 3) {
                var arr = [];
                for (var k = 0; k < typeNum; k++) {
                    arr.push(GameData.mapData[GameData.maxRow - k - 1][i]);
                }
                LinkLogic.eliminates.push(arr);
            }
            currentType = "";
            typeNum = 0;
        }
        // 返回最终结果
        if (LinkLogic.eliminates.length != 0) {
            return true;
        }
        return false;
    };
    // 在游戏开始之前,全局判断能否移动其中一个元素之后可以形成连线消除
    // 如果能够形成连线消除,则继续游戏,否则,打乱所有元素的顺序
    LinkLogic.isHaveNextLine = function () {
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                // 前提条件是当前这地图块必须可用,mapData[i][j]表示当前地图块
                if (GameData.mapData[i][j] != -1) {
                    // 第一种情况,有两个类型相同的相邻的卡片元素横向排列,寻找它周围的六个元素(先不考虑极限值的情况下)
                    if (j < (GameData.maxColumn - 1) && GameData.mapData[i][j + 1] && GameData.mapData[i][j + 1] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i][j + 1]].type) {
                        // 寻找周围六个元素,同样先保证地图块可用,先寻找左侧三个元素
                        if (j > 0 && GameData.mapData[i][j - 1] != -1) {
                            // 判断左上角
                            if (i > 0 && j > 0 && GameData.mapData[i - 1][j - 1] && GameData.mapData[i - 1][j - 1] != -1 && GameData.elements[GameData.mapData[i - 1][j - 1]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断左下角
                            if (i < (GameData.MaxRow - 1) && j > 0 && GameData.mapData[i + 1][j - 1] && GameData.mapData[i + 1][j - 1] != -1 && GameData.elements[GameData.mapData[i + 1][j - 1]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断左侧跳格
                            if (j > 1 && GameData.mapData[i][j - 2] && GameData.mapData[i][j - 2] != -1 && GameData.elements[GameData.mapData[i][j - 2]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                        }
                        // 寻找右侧三个元素,以当前地图块为准,以相隔右侧一个地图块作为中心点,去寻找右侧三个元素
                        if (j < (GameData.MaxColumn - 2) && GameData.mapData[i][j + 2] != -1) {
                            // 判断右上角
                            if (j < (GameData.MaxColumn - 2) && i > 0 && GameData.mapData[i - 1][j + 2] && GameData.mapData[i - 1][j + 2] != -1 && GameData.elements[GameData.mapData[i - 1][j + 2]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断右下角
                            if (j < (GameData.MaxColumn - 2) && i < (GameData.MaxRow - 1) && GameData.mapData[i + 1][j + 2] && GameData.mapData[i + 1][j + 2] != -1 && GameData.elements[GameData.mapData[i + 1][j + 2]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断右侧跳格
                            if (j < (GameData.MaxColumn - 3) && GameData.mapData[i][j + 3] && GameData.mapData[i][j + 3] != -1 && GameData.elements[GameData.mapData[i][j + 3]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                        }
                    }
                    // 同样是第一种情况,只是纵向排列(也是不考虑极限值的情况下)
                    if (i < (GameData.maxRow - 1) && GameData.mapData[i + 1][j] && GameData.mapData[i + 1][j] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i + 1][j]].type) {
                        // 寻找周围六个元素,同样先保证地图块可用,先寻找上侧三个元素
                        if (i > 0 && GameData.mapData[i - 1][j] != -1) {
                            // 判断左上角
                            if (i > 0 && j > 0 && GameData.mapData[i - 1][j - 1] && GameData.mapData[i - 1][j - 1] != -1 && GameData.elements[GameData.mapData[i - 1][j - 1]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断右上角
                            if (j < (GameData.MaxColumn - 1) && i > 0 && GameData.mapData[i - 1][j + 1] && GameData.mapData[i - 1][j + 1] != -1 && GameData.elements[GameData.mapData[i - 1][j + 1]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断上方跳格
                            if (i > 1 && GameData.mapData[i - 2][j] && GameData.mapData[i - 2][j] != -1 && GameData.elements[GameData.mapData[i - 2][j]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                        }
                        // 寻找下方三个元素,以当前地图块为准,以相隔下方一个地图块作为中心点,去寻找下方三个元素
                        if (i < (GameData.MaxRow - 2) && GameData.mapData[i + 2][j] != -1) {
                            // 判断左下角
                            if (i < (GameData.MaxRow - 2) && j > 0 && GameData.mapData[i + 2][j - 1] && GameData.mapData[i + 2][j - 1] != -1 && GameData.elements[GameData.mapData[i + 2][j - 1]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断右下角
                            if (i < (GameData.MaxRow - 2) && j < (GameData.MaxColumn - 1) && GameData.mapData[i + 2][j + 1] && GameData.mapData[i + 2][j + 1] != -1 && GameData.elements[GameData.mapData[i + 2][j + 1]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                            // 判断下方跳格
                            if (i < (GameData.MaxRow - 3) && GameData.mapData[i + 3][j] && GameData.mapData[i + 3][j] != -1 && GameData.elements[GameData.mapData[i + 3][j]].type == GameData.elements[GameData.mapData[i][j]].type) {
                                return true;
                            }
                        }
                    }
                    // 第二种情况,有两个类型相同的卡片元素横向相隔地排列,中间隔了两个元素(先不考虑极限值的情况下)
                    if (j < (GameData.maxColumn - 2) && GameData.mapData[i][j + 2] && GameData.mapData[i][j + 2] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i][j + 2]].type) {
                        if (GameData.mapData[i][j + 1] != -1) {
                            // 判断正上方
                            if (i > 0 && GameData.mapData[i - 1][j + 1] && GameData.mapData[i - 1][j + 1] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i - 1][j + 1]].type) {
                                return true;
                            }
                            // 判断正下方
                            if (i < (GameData.MaxRow - 1) && GameData.mapData[i + 1][j + 1] && GameData.mapData[i + 1][j + 1] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i + 1][j + 1]].type) {
                                return true;
                            }
                        }
                    }
                    // 第二种情况,有两个类型相同的卡片元素纵向相隔地排列,中间隔了两个元素(也是先不考虑极限值的情况下)
                    if (i < (GameData.maxRow - 2) && GameData.mapData[i + 2][j] && GameData.mapData[i + 2][j] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i + 2][j]].type) {
                        if (GameData.mapData[i + 1][j] != -1) {
                            // 判断左格子
                            if (j > 0 && GameData.mapData[i + 1][j - 1] && GameData.mapData[i + 1][j - 1] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i + 1][j - 1]].type) {
                                return true;
                            }
                            // 判断右格子
                            if (j < (GameData.MaxColumn - 1) && GameData.mapData[i + 1][j + 1] && GameData.mapData[i + 1][j + 1] != -1 && GameData.elements[GameData.mapData[i][j]].type == GameData.elements[GameData.mapData[i + 1][j + 1]].type) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    };
    // 交换两个元素并判断是否可以形成连线消除,其中p1、p2指的是交换的两个元素的location
    LinkLogic.isHaveLineByIndex = function (p1, p2) {
        // 定义两个暂存变量
        var p1n = p1;
        var p2n = p2;
        // 获取两个卡片元素的id
        var p1id = GameData.mapData[Math.floor(p1 / GameData.maxColumn)][p1 % GameData.maxRow];
        var p2id = GameData.mapData[Math.floor(p2 / GameData.maxColumn)][p2 % GameData.maxRow];
        // 交换两个卡片元素的id
        GameData.mapData[Math.floor(p1 / GameData.maxColumn)][p1 % GameData.maxRow] = p2id;
        GameData.mapData[Math.floor(p2 / GameData.maxColumn)][p2 % GameData.maxRow] = p1id;
        // 判断交换之后是否可以消除元素
        var rel = LinkLogic.isHaveLine();
        if (rel) {
            // 如果交换元素后可以形成连线消除,则p1、p2交换成功,并重新设置location属性
            GameData.elements[p1id].location = p2;
            GameData.elements[p2id].location = p1;
            return true;
        }
        else {
            // 否则把p1id和p2id互换回来
            GameData.mapData[Math.floor(p1 / GameData.maxColumn)][p1 % GameData.maxRow] = p1id;
            GameData.mapData[Math.floor(p2 / GameData.maxColumn)][p2 % GameData.maxRow] = p2id;
        }
        return false;
    };
    return LinkLogic;
}());
__reflect(LinkLogic.prototype, "LinkLogic");
//# sourceMappingURL=LinkLogic.js.map