var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 道具控制器
 */
var PropViewManagement = (function () {
    function PropViewManagement(root) {
        // 当前焦点道具元素
        this._currentID = -1;
        this.layer = root;
        this.init();
    }
    PropViewManagement.prototype.init = function () {
        this.propElements = new Array();
        this.createData();
    };
    PropViewManagement.prototype.createData = function () {
        for (var i = 0; i < 5; i++) {
            var prop = new PropView(i);
            prop.x = 15 + (prop.width + 5) * i;
            prop.y = GameData.stageH - prop.height - 10;
            this.layer.addChild(prop);
            this.propElements.push(prop);
            prop.num = Math.floor(Math.random() * 5);
            prop.id = i;
            prop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        }
    };
    PropViewManagement.prototype.click = function (evt) {
        if (this._currentID != -1) {
            if (this._currentID == evt.currentTarget.id) {
                this.propElements[this._currentID].setFocus(false);
                this._currentID = -1;
                PropViewManagement.proptype = -1;
            }
            else {
                this._currentID == evt.currentTarget.id;
                this.propElements[this._currentID].setFocus(true);
                PropViewManagement.proptype = this.propElements[this._currentID].proptype;
            }
        }
        else {
            this._currentID == evt.currentTarget.id;
            this.propElements[this._currentID].setFocus(true);
            PropViewManagement.proptype = this.propElements[this._currentID].proptype;
        }
    };
    PropViewManagement.prototype.useProp = function () {
        this.propElements[this._currentID].num--;
        this.propElements[this._currentID].setFocus(false);
        this._currentID = -1;
        PropViewManagement.proptype = -1;
    };
    // 道具类型
    PropViewManagement.proptype = -1;
    return PropViewManagement;
}());
__reflect(PropViewManagement.prototype, "PropViewManagement");
//# sourceMappingURL=PropViewManagement.js.map