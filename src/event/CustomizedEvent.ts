/**
 * 自定义事件管理类
 */
class CustomizedEvent extends egret.Event {
	public static TAP_TWO_ELEMENT:string = "tap_two_element";
	public static SWAP_ELEMENT:string = "swap_element";
	public static ELIMINATE_OVER:string = "eliminate_over";
	public static AUTO_ELIMINATE:string = "auto_eliminate";
	//public static UPDATE_VIEW_OVER:string = "update_view_over";
	public static USE_PROP_CLICK:string = "use_prop_click";
		
	// 使用道具时点击的元素位置
	public static propToElement:number = 0;
	// 第一个点击的元素
	public static currentTap:number = -1;
	// 第二个点击的元素
	public static anotherTap:number = -1;

	public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
		super(type,bubbles,cancelable);
	}
}