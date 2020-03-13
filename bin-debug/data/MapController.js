var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 地图数据控制器
 */
var MapController = (function () {
    function MapController() {
    }
    // 创建全地图元素
    MapController.prototype.createElementAllMap = function () {
        this.createAllMap();
    };
    MapController.prototype.createAllMap = function () {
        var len = GameData.maxRow * GameData.maxColumn;
        var type = "";
        var havelink = true;
        var id = 0;
        // 纵向类型
        var ztype = "";
        // 横向类型
        var htype = "";
        for (var i = 0; i < GameData.maxRow; i++) {
            for (var j = 0; j < GameData.maxColumn; j++) {
                // 确保游戏一开始不允许自动消除
                while (havelink) {
                    // 循环获取随机类型
                    type = this.createType();
                    if (i > 1 && GameData.mapData[i - 1][j] != -1 && GameData.mapData[i - 2][j] != -1) {
                        // 在当前卡片元素上面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
                        if (GameData.elements[GameData.mapData[i - 1][j]].type == GameData.elements[GameData.mapData[i - 2][j]].type) {
                            ztype = GameData.elements[GameData.mapData[i - 1][j]].type;
                        }
                    }
                    if (j > 1 && GameData.mapData[i][j - 1] != -1 && GameData.mapData[i][j - 2] != -1) {
                        // 在当前卡片元素前面的两个相邻的元素,如果类型相同,则把这个类型值存起来,以便后面比对
                        if (GameData.elements[GameData.mapData[i][j - 1]].type == GameData.elements[GameData.mapData[i][j - 2]].type) {
                            htype = GameData.elements[GameData.mapData[i][j - 1]].type;
                        }
                    }
                    // 此时保证游戏一开始没有三个消除的元素
                    if (type != ztype && type != htype) {
                        havelink = false;
                    }
                }
                // 初始化数据
                id = GameData.unusedElements[0];
                GameData.elements[id].type = type;
                GameData.elements[id].location = i * GameData.maxRow + j;
                GameData.mapData[i][j] = id;
                // 因为每次循环获取第一个未使用卡片元素,所以获取之后记得移除对象池的第一个未使用卡片元素
                GameData.unusedElements.shift();
                // 重置一些属性的默认值
                havelink = true;
                ztype = "";
                htype = "";
            }
        }
    };
    // 随机生成卡片元素的类型
    MapController.prototype.createType = function () {
        var rand = Math.floor(Math.random() * GameData.elementTypes.length);
        return GameData.elementTypes[rand].toString();
    };
    // 创建任意数量的随机类型
    MapController.prototype.createElements = function (num) {
        var types = [];
        for (var i = 0; i < num; i++) {
            types.push(this.createType());
        }
        return types;
    };
    // 对某一个卡片元素,更新它的类型
    MapController.prototype.changeTypeByID = function (id) {
        GameData.elements[id].type = this.createType();
    };
    // 根据当前删除的地图元素,刷新所有的元素位置
    // 例如,如果消除了三个卡片元素,那么这三个元素的位置要重新排列,同时它们上方的元素要向下移动
    MapController.prototype.updateMapLocation = function () {
        // 将LinkLogic.eliminates二维数组的数据转换为一维数组,存储在ids[]
        var ids = [];
        var len = LinkLogic.eliminates.length;
        for (var i = 0; i < len; i++) {
            var l = LinkLogic.eliminates[i].length;
            for (var j = 0; j < l; j++) {
                // rel=true表示当前元素重复出现了,rel=false表示当前元素还没有出现过
                var rel = false;
                var ll = ids.length;
                for (var k = 0; k < ll; k++) {
                    // 如果ids[k]有一个元素和当前eliminates[i][j]的一个元素id相同,说明有重复元素出现
                    // 有元素重复出现,这种情况一般出现在十字消除算法
                    if (ids[k] == LinkLogic.eliminates[i][j]) {
                        rel = true;
                    }
                }
                if (!rel) {
                    // 针对这些已经被消除的卡片元素,需要对其重新设置类型
                    this.changeTypeByID(LinkLogic.eliminates[i][j]);
                    // ids存储的都是一些没有重复出现过的卡片元素
                    ids.push(LinkLogic.eliminates[i][j]);
                }
            }
        }
        len = ids.length;
        // 记录每一个被消除元素当前的列编号
        var colarr = [];
        for (var i = 0; i < len; i++) {
            var rel = false;
            for (var j = 0; j < colarr.length; j++) {
                if (colarr[j] == GameData.elements[ids[i]].location % GameData.maxRow) {
                    rel = true;
                }
            }
            // 同上面一样,colarr只存放不重复的列编号
            if (!rel) {
                colarr.push(GameData.elements[ids[i]].location % GameData.maxRow);
            }
        }
        // 循环对每一列进行调整
        len = colarr.length;
        for (var i = 0; i < len; i++) {
            // 当一些元素被消除,上面的整列元素准备要下来,newcolids就是用来存放这些正准备下落的又不是新出现的卡片元素
            var newcolids = [];
            // 保存那些被消除的元素,但是与ids不同,removeids只是其中一列
            var removeids = [];
            for (var j = GameData.maxRow - 1; j >= 0; j--) {
                var rel = false;
                for (var k = 0; k < ids.length; k++) {
                    if (ids[k] == GameData.mapData[j][colarr[i]]) {
                        removeids.push(GameData.mapData[j][colarr[i]]);
                        rel = true;
                    }
                }
                if (!rel) {
                    if (GameData.mapData[j][colarr[i]] != -1) {
                        newcolids.push(GameData.mapData[j][colarr[i]]);
                    }
                }
            }
            // 虽然上面把newcolids和removeids拆分开来,现在又把它们两个再次合并,但是合并结果不一样,removeids拼接在newcolids的后面
            newcolids = newcolids.concat(removeids);
            for (var j = GameData.maxRow - 1; j >= 0; j--) {
                if (GameData.mapData[j][colarr[i]] != -1) {
                    // 最后重新调整位置之后,被消除的卡片元素的id会放在上面依次排列
                    GameData.mapData[j][colarr[i]] = newcolids[0];
                    GameData.elements[newcolids[0]].location = j * GameData.maxRow + colarr[i];
                    newcolids.shift();
                }
            }
        }
    };
    return MapController;
}());
__reflect(MapController.prototype, "MapController");
//# sourceMappingURL=MapController.js.map