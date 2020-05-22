var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 道具控制器
 */
var PropElementManagement = (function () {
    function PropElementManagement(container) {
        this.container = container;
        // 创建所有道具元素
        for (var i = 0; i < 5; i++) {
            var element = new PropElement();
            this.container.addChildAt(element, i);
            //ele.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
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
            //ele.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
        }
    };
    // 当前焦点道具元素
    /*private currentType:string = "";
    private onTouchTap(evt:egret.TouchEvent){
        let ele:PropElement = <PropElement>evt.currentTarget;
        if(this.currentType == ele.type){
            ele.setFocus(false);
            this.currentType = "";
            PropElementManagement.propType = null;

        }
        else{
            this.currentType == ele.type;
            ele.setFocus(true);
            PropElementManagement.propType = this.propElements[this._currentID].propType;
        }
    }*/
    // 道具类型
    PropElementManagement.propType = "";
    return PropElementManagement;
}());
__reflect(PropElementManagement.prototype, "PropElementManagement");
//# sourceMappingURL=PropElementManagement.js.map