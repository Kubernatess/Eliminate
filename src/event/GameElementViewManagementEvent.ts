/**
 * 自定义事件管理类
 */
class GameElementViewManagementEvent extends egret.Event {
	public static TAP_TWO_ELEMENT:string = "tap_two_element";
	public static ELIMINATE_OVER:string = "eliminate_over";
	public static UPDATE_MAP:string = "update_map";
	public static UPDATE_VIEW_OVER:string = "update_view_over";
	public static USE_PROP_CLICK:string = "use_prop_click";

	// 使用道具时点击的元素位置
	public propToElementLocation:number = 0;
	// 第一个点击的元素
	public elementA:number = 0 ;
	// 第二个点击的元素
	public elementB:number = 0;

	public constructor(type:string , bubbles:boolean=false , cancelable:boolean=false){
		super(type,bubbles,cancelable);
	}
}