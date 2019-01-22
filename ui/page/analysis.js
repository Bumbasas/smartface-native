/**
 * @class UI.Page
 * @since 0.1
 *
 * Page class stands for showing different user interfaces. Every page has its own lifecycle: load,
 * show and hide. Application should have at least one page otherwise what user will see is just
 * a black screen.
 *
 * Page has an embedded layout inside which you can use for adding views into page.
 *
 * Please refer to guides for best practices of page usages and page navigation.
 *
 *
 *     @example
 *     const extend = require("js-base/core/extend");
 *     const Page = require('sf-core/ui/page');
 *     var page1 = new extend(Page)(
 *         function(_super,params)
 *         {
 *             var self = this;
 *             _super(this,{
 *                 onShow: function() {
 *                     this.headerBar.title = "Smartface Page";
 *                 },
 *                 onLoad: function(){
 *                     const Button = require('sf-core/ui/button');
 *                     var myButton = new Button({
 *                         width: 150,
 *                         height: 80,
 *                         text: "Smartface Button"
 *                     });
 *                     this.layout.addChild(myButton);
 *                 }
 *             });
 *         }
 *     );
 * 
 * @see https://github.com/smartface/router#push-a-new-page
 */
function Page(params) {}

/**
 * This event is called once when page is created.
 * You can create views and add them to page in this callback.
 *
 * @event onLoad
 * @android
 * @ios
 */
Page.prototype.onLoad = function (){};

/**
 * Gets/sets custom transition views. Used with custom transitions to map a {@link UI.View View}
 * from a removed or hidden {@link UI.Page Page} to a {@link UI.View View} from a shown or added {@link UI.Page Page}.
 * 
 *     @example
 *     const Page = require('sf-core/ui/page');
 *     var myPage = new Page({
 *         var page = this;
 *         onShow: function() {
 *             page.headerBar.visible = true;
 * 
 *             page.imageView1.transitionID = "view1";
 *             page.imageView2.transitionID = "view2";
 * 
 *             page.transitionViews = [page.imageView1, page.imageView2];
 *         }
 *     });
 * 
 *     var myDetailPage = new Page({
 *         var page = this;
 *         onShow: function() {
 *             page.headerBar.visible = true;
 *         }
 * 
 *         page.imageView1.transitionID = "view2";
 *         page.imageView2.transitionID = "view1";
 *     });
 *
 * @property {UI.View[]} transitionViews
 * @android
 * @ios
 * @readonly
 * @since 3.2.0
 */
Page.prototype.transitionViews;

/**
 * Gets the main layout of Page which is an instance of UI.FlexLayout. You
 * should add views to the layout of the page.
 *
 * @property {UI.FlexLayout} layout
 * @android
 * @ios
 * @readonly
 * @since 0.1
 */
Page.prototype.layout;

/**
 * This event is called when a page appears on the screen (everytime).
 * It will be better to set headerBar and statusBar properties in this callback.
 *
 *     @example
 *     const Page = require('sf-core/ui/page');
 *     const Application = require('sf-core/application');
 *     var myPage = new Page({
 *         onShow: function() {
 *             this.headerBar.visible = true;
 *         }
 *         Application.statusBar.visible = true;
 *     });
 *
 * @event onShow
 * @param {Object} parameters Parameters passed from Router.go function
 * @android
 * @ios
 */
Page.prototype.onShow = function (parameters){};

/**
 * This event is called when a page disappears from the screen.
 *
 * @event onHide
 * @android
 * @ios
 */
Page.prototype.onHide = function (){};

Page.prototype.android = {};
/**
 * This event will be triggered when user clicks back button on the Device.
 *
 * @event onBackButtonPressed
 * @android
 * @since 0.1
 */
Page.prototype.android.onBackButtonPressed = function (){};

Page.prototype.ios = {};
/**
 * Sets padding values to page's layout.
 * This will override padding values of its layout. Padding values are defined by Apple for each orientation.
 * 
 * @ios
 * @since 0.1
 */
Page.prototype.ios.safeAreaLayoutMode = false;

/**
 * This event will be triggered when padding values of layout changed.
 *
 * @event onSafeAreaPaddingChange
 * @param {Object} paddingObject Includes top,left,right and bottom padding values. 
 * @ios
 * @since 0.1
 */
Page.prototype.ios.onSafeAreaPaddingChange = function (paddingObject){};


/**
 * This function shows up the pop-up page. Pop-up pages behave exactly as UI.Page .
 * 
 *     @example
 *     const self = this; //Current page 
 *     const Color = require('sf-core/ui/color');
 *
 *     var popuPage = new Page();
 *     popuPage.layout.backgroundColor = Color.BLUE;
 *
 *     const Button = require('sf-core/ui/button');
 *     var myButton = new Button({
 *     width: 150,
 *     height: 80,
 *     text: "Smartface Button",
 *     onPress: function() {
 *      self.dismiss(function() {
 *      console.log("dismiss")
 *      });
 *     }
 *     });
 *     popuPage.layout.addChild(myButton);
 *
 *     self.popupBtn.onPress = function() {
 *         self.present({ 
 *             controller: popuPage, 
 *             animated: true, 
 *             onComplete: function() { 
 *                 console.log("Page3 presented...");
 *             }; 
 *         });
 *     }
 * 
 *
 * @method present
 * @param {Object} params
 * @param {UI.Page|UI.NavigationController} params.controller
 * @param {Boolean} params.animated
 * @param {Function} params.onComplete
 * @android
 * @ios
 * @deprecated
 * @since 3.1.1
 *
 */
Page.prototype.present = function(params){};


/**
 * This function dismiss presently shown pop-up page.
 *
 * @method dismiss
 * @param {Object} params
 * @param {Function} params.onComplete
 * @android
 * @ios
 * @since 3.1.1
 * @deprecated
 */
Page.prototype.dismiss = function(params){};

/**
 * Gets status bar object. This property is readonly, you can not set
 * status bar to a page but you can change properties of page's status bar.
 *
 * @property {UI.StatusBar} statusBar
 * @android
 * @ios
 * @readonly
 * @removed 4.0.0 Use {@link Application.statusBar} instead
 * @since 0.1
 */
Page.prototype.statusBar;

/**
 * Gets header bar object of a  page. This property is readonly, you can not
 * set header bar to a page but you can change properties of page's header bar.
 * In Android, header bar properties should be implemented in onLoad or onShow of page. 
 * Otherwise given settings might be losed.
 *
 * @property {UI.HeaderBar} headerBar
 * @android
 * @ios
 * @readonly
 * @since 0.1
 */
Page.prototype.headerBar;

/**
 * Gets/sets the orientation of the Page. This property must be set as constructor parameter. 
 * {@link UI.Page.Orientation Orientation} constants can use with bitwise or operator. The default value of the 
 * orientation defined in project.json.
 *     
 *     @example
 *     const Page = require('sf-core/ui/page');
 *     var myPage1 = new Page({
 *          orientation: Page.Orientation.LANDSCAPELEFT
 *     });
 * 
 * @property {UI.Page.Orientation} [orientation = UI.Page.Orientation.PORTRAIT]
 * @android
 * @ios
 * @since 0.1
 */
Page.prototype.orientation = UI.Page.Orientation.PORTRAIT;

/**
 * This event will be called when orientation of the Page changes.
 * iOS fires this event before orientation changed but Android fires after changed.
 * 
 *
 * @event onOrientationChange
 * @param {Object} e
 * @param {UI.Page.Orientation} e.orientation 
 * @android
 * @ios
 * @since 0.1
 */
Page.prototype.onOrientationChange = function (e){};

/**
 * @enum {Number} UI.Page.Orientation
 * @static
 * @since 0.1
 *
 * Orientation is an enum that defines page orientation.
 *
 */
Page.Orientation = {};

/**
 * Enum corresponding to portrait orientation. 
 * 
 * @property PORTRAIT
 * @android 
 * @ios
 * @readonly
 * @since 0.1
 */
Page.Orientation.PORTRAIT = 1;

/**
 * Enum corresponding to reverse portrait orientation (upside down).
 * 
 * @property UPSIDEDOWN
 * @android 
 * @ios
 * @readonly
 * @since 0.1
 */
Page.Orientation.UPSIDEDOWN = 2;

/**
 * Enum corresponding to both portrait orientation controlled by sensor.
 * 
 * @property AUTOPORTRAIT
 * @android 
 * @ios
 * @readonly
 * @since 0.1
 */
Page.Orientation.AUTOPORTRAIT = 3;

/**
 * Enum corresponding to landscape orientation (landspace left).
 * 
 * @property LANDSCAPELEFT
 * @android 
 * @ios
 * @readonly
 * @since 0.1
 */
Page.Orientation.LANDSCAPELEFT = 4;

/**
 * Enum corresponding to reverse landscape orientation (landspace right).
 * 
 * @property LANDSCAPERIGHT
 * @android 
 * @ios
 * @readonly
 * @since 0.1
 */
Page.Orientation.LANDSCAPERIGHT = 8;

/**
 * Enum corresponding to both landscape orientation controlled by sensor.
 * 
 * @property AUTOLANDSCAPE
 * @android 
 * @ios
 * @readonly
 * @since 0.1
 */
Page.Orientation.AUTOLANDSCAPE = 12;

/**
 * Enum corresponding all orientation controlled by sensor.
 * 
 * @property AUTO
 * @android 
 * @ios
 * @readonly
 * @since 0.1
 */
Page.Orientation.AUTO = 15;

/**
 * iOS Specific Properties.
 * @class UI.Page.iOS
 */
Page.iOS = {};

/**
 * @enum {Number} UI.Page.iOS.LargeTitleDisplayMode
 * @static
 *
 * LargeTitleDisplayMode is an enum that defines title style of header bar.
 *
 */
Page.iOS.LargeTitleDisplayMode = {};

/**
 * Sets the previous page's header bar title display mode.
 * 
 * @property AUTOMATIC
 * @ios
 * @readonly
 */
Page.iOS.LargeTitleDisplayMode.AUTOMATIC = 0;

/**
 * Always display large title mode.
 * 
 * @property ALWAYS
 * @ios
 * @readonly
 */
Page.iOS.LargeTitleDisplayMode.ALWAYS = 1;

/**
 * Never display large title mode.
 * 
 * @property NEVER
 * @ios
 * @readonly
 */
Page.iOS.LargeTitleDisplayMode.NEVER = 2;

module.exports = Page;