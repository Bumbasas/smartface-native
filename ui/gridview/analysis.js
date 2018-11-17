const View = require('../view');
const extend = require('js-base/core/extend');
/**
 * @class UI.GridView
 * @since 3.0.2
 * @extends UI.View
 * GridView is a View that presents given items using customizable layouts.
 * 
 *      @example
 *      const Page = require("sf-core/ui/page");
 *      const extend = require("js-base/core/extend");
 *      const FlexLayout = require('sf-core/ui/flexlayout');
 *      const Color = require('sf-core/ui/color');
 *      const Label = require('sf-core/ui/label');
 *      const ScrollView = require('sf-core/ui/scrollview');
 *      const GridView = require("sf-core/ui/gridview");
 *      const GridViewItem = require("sf-core/ui/gridviewitem");
 *      const TextAlignment = require('sf-core/ui/textalignment');
 *      const LayoutManager = require('sf-core/ui/layoutmanager');
 *      
 *      var Page1 = extend(Page)(
 *          function(_super) {
 *              _super(this, {
 *                  onShow: function(params) {
 *                      this.statusBar.visible = false;
 *                      this.headerBar.visible = false;
 *                  },onLoad: function(){
 *                      var myDataSet = [];
 *              
 *                      for (var i = 0; i < 1000; i++) {
 *                          myDataSet.push({
 *                              title: 'Title ' + i,
 *                              backgroundColor: Color.create(Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1))
 *                          });
 *                      }
 *                      
 *                      var layoutManager = new LayoutManager({
 *                          spanCount: 2,
 *                          scrollDirection: LayoutManager.ScrollDirection.VERTICAL,
 *                          onItemLength: function(itemLength){return 100;}
 *                      });
 *                      
 *                      var gridView = new GridView({
 *                          layoutManager : layoutManager,
 *                          refreshEnabled : true,
 *                          backgroundColor: Color.TRANSPARENT,
 *                          flexGrow : 1,
 *                          itemCount : myDataSet.length,
 *                          scrollBarEnabled : false,
 *                          onItemCreate : function () {
 *                              var gridViewViewItem = new GridViewItem();
 *                              var myLabelTitle = new Label({
 *                                  flexGrow : 1,
 *                                  textAlignment : TextAlignment.MIDCENTER
 *                              });
 *                              gridViewViewItem.addChild(myLabelTitle);
 *                              gridViewViewItem.myLabelTitle = myLabelTitle;
 *                              gridViewViewItem.backgroundColor = Color.BLUE;
 *                              return gridViewViewItem;
 *                          },
 *                          onItemBind : function (gridViewItem, index) {
 *                              gridViewItem.myLabelTitle.text = myDataSet[index].title;
 *                              gridViewItem.myLabelTitle.backgroundColor = myDataSet[index].backgroundColor;
 *                          },
 *                          onItemSelected : function (gridViewItem, index) {
 *                              var item = gridViewItem.itemByIndex(index);
 *                              console.log("Item title : " + item.myLabelTitle.text);
 *                          },
 *                          onPullRefresh : function () {
 *                              console.log("GridView onPullRefresh..");
 *                          },
 *                          onScroll : function () {
 *                              // console.log("GridView onScroll..");
 *                          }
 *                      });
 *      
 *                      this.layout.addChild(gridView);
 *                  }
 *              });
 *          }
 *      );
 *      module.exports = Page1;
 */

function GridView(params) {}

/**
 * This event is called when a GridView starts to create a GridViewItem.
 * You can customize your UI(not data-binding) inside this callback.
 *
 * @event onItemCreate
 * @android
 * @ios
 * @param {Number} itemType
 * @return {UI.GridViewItem}
 * @since 3.0.2
 */
GridView.prototype.onItemCreate = function onItemCreate(type){};

/**
 * Gets/sets over-scroll mode for this view.
 *
 * @property {UI.Android.OverScrollMode} [overScrollMode = UI.Android.OverScrollMode.ALWAYS]
 * @android
 * @since 3.2.1
 */
GridView.prototype.overScrollMode = UI.Android.OverScrollMode.ALWAYS;

/**
 * This event is called when a UI.GridViewItem created at specified row index.
 * You can bind your data to row items inside this callback.
 *
 * @param {UI.GridViewItem} gridViewItem
 * @param {Number} index
 * @event onItemBind
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.onItemBind = function onItemBind(gridViewItem, index){};

/**
 * This event is called before onItemCreate callback. Returns item type you should use based on position.
 *
 * @event onItemType
 * @param {Number} index
 * @android
 * @ios
 * @return {Number}
 * @since 3.2.1
 */
GridView.prototype.onItemType = function onItemType(index){};

/**
 * This event is called when user selects a item at specific index.
 *
 * @param {UI.GridViewItem} gridViewItem
 * @param {Number} index
 * @event onItemSelected
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.onItemSelected = function onItemSelected(gridViewItem, index){};

/**
 * This event is called when user long selects a item at specific index.
 *
 * @param {UI.GridViewItem} gridViewItem
 * @param {Number} index
 * @event onItemLongSelected
 * @android
 * @since 3.0.2
 */
GridView.prototype.onItemLongSelected = function onItemLongSelected(gridViewItem, index){};

/**
 * If the value of this property is YES , scrolling is enabled, and if it is NO , scrolling is disabled. The default is YES. This property must be set after assigning layout manager.
 *
 * @property {Boolean} [scrollEnabled = true]
 * @ios
 * @android
 * @since 3.2.0
 */
GridView.prototype.scrollEnabled = false;

/**
 * Gets contentOffset of the GridView.
 * 
 * @property contentOffset
 * @android
 * @ios
 * @readonly
 * @return {Object}
 * @return {Number} return.x
 * @return {Number} return.y
 * @since 3.1.3
 */
GridView.prototype.contentOffset = {};

/**
 * Gets/sets the number of items that will be shown in a GridView.
 * You should update this property after each data operation.
 *
 * @property {Number} [itemCount = 0]
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.itemCount = 0;

/**
 * Sets/Gets the bounce effect when scrolling.
 *
 * @property {Boolean} bounces
 * @ios
 * @since 3.2.1
 */
GridView.prototype.bounces = true;

/**
 * Class for GridView layout calculation.
 * The layoutManager used to organize the collected view’s items.
 *
 * @property {UI.LayoutManager} layoutManager
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.layoutManager;

/**
 * Gets/sets the visibility of scroll bar of GridView.
 * If set to true, vertical or horizontal scroll bar will be shown depending on gridview's
 * scroll direction.
 *
 * @property {Boolean} [scrollBarEnabled = false]
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.scrollBarEnabled = false;

/**
 * Enables/disables the refresh function of GridView. If set to false
 * onPullRefresh events will not be called.
 *
 * @property {Boolean} [refreshEnabled = true]
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.refreshEnabled = true;

/**
 * This property supportes pager style snapping in either vertical or horizontal orientation. For iOS, prefer to UI.LayoutManager.targetContentOffset
 *
 * @property {UI.GridView.Android.SnapAlignment} [snapToAlignment = UI.GridView.Android.SnapAlignment.SNAPTO_START]
 * @android
 * @since 3.2.0
 */
GridView.prototype.snapToAlignment;

/**
 * This property allows snapping to behave as pager  or linear. 
 *
 * @property {Boolean} [paginationEnabled = true]
 * @android
 * @since 3.2.0
 */
GridView.prototype.paginationEnabled;

/**
 * This method returns the index of item which is visible at
 * the top of a GridView at a given time.
 *
 * @return {Number}
 * @method getFirstVisibleIndex
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.getFirstVisibleIndex = function(){};

/**
 * This method returns the index of item which is visible at
 * the bottom of a GridView at a given time.
 *
 * @return {Number}
 * @method getLastVisibleIndex
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.getLastVisibleIndex = function(){};

/**
 * Sets the colors used in the refresh animation. On Android the first color
 * will also be the color of the bar that grows in response to a
 * user swipe gesture. iOS uses only the first color of the array.
 *
 * @method setPullRefreshColors
 * @param {UI.Color[]} colors
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.setPullRefreshColors = function(colors){};

/**
 * This method notify GridView for data changes. After this method is called
 * GridView refreshes itself and recreates the items. Do not forget to
 * update itemCount property after data changes.
 *
 * @method refreshData
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.refreshData = function(){};

/**
 * This method scrolls GridView to a specific index.
 *
 * @param {Number} index
 * @param {Boolean} [animated = true]
 * @method scrollTo
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.scrollTo = function(index,animated){};

/**
 * This method cancels refresh operation and stops the refresh
 * indicator on a GridView. You should call this method after
 * finishing event inside onPullRefresh otherwise refresh indicator
 * never stops.
 *
 * @method stopRefresh
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.stopRefresh = function(){};

/**
 * This event is called when a GridView is scrolling. To remove this evet, set null.
 * For better performance, don't set any callback if does not
 * necessary
 *
 * @event onScroll
 * @param {Object} params
 * @param {Object} params.contentOffset
 * @param {Number} params.contentOffset.x
 * @param {Number} params.contentOffset.y
 * @android
 * @ios
 * @since 3.1.3
 */
GridView.prototype.onScroll = function onScroll(){ }

/**
 * This event is called when a GridView's scroll state is changed. To remove this evet, set null.
 * For better performance, don't set any callback if does not
 * necessary
 *
 * @event onScrollStateChanged
 * @param {UI.Android.ScrollState} newState
 * @param {Object} contentOffset
 * @param {Number} contentOffset.x
 * @param {Number} contentOffset.y
 * @android
 * @since 3.2.1
 */
GridView.prototype.onScrollStateChanged = function onScrollStateChanged(){}

/**
 * This event is called when user pulls down and releases a GridView
 * when scroll position is on the top.
 *
 * @event onPullRefresh
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.onPullRefresh = function onPullRefresh(){}

/**
 * This method returns GridViewItem
 *
 * @return {UI.GridViewItem}
 * @method itemByIndex
 * @param {Number} index
 * @android
 * @ios
 * @since 3.0.2
 */
GridView.prototype.itemByIndex = function(index){};

/**
 * Android Specific Properties.
 * @class UI.GridView.Android
 * @since 3.2.0
 */
GridView.Android = {};

/** 
 * @enum UI.GridView.Android.SnapAlignment
 * @since 1.1.16
 * 
 * This enum class used to specify your alignment of snapping. 
 */
GridView.Android.SnapAlignment ={};


/**
 * This property will align the snap at the left (horizontal) or top (vertical).
 *
 * @property SNAPTO_START
 * @static
 * @readonly
 * @since 3.2.0
 */
GridView.Android.SnapAlignment.SNAPTO_START;


/**
 * This property will align the snap in the center.
 *
 * @property SNAPTO_CENTER
 * @static
 * @readonly
 * @since 3.2.0
 */
GridView.Android.SnapAlignment.SNAPTO_CENTER;

/**
 * This property  will align the snap at the right (horizontal) or bottom (vertical).
 *
 * @property SNAPTO_END
 * @static
 * @readonly
 * @since 3.2.0
 */
GridView.Android.SnapAlignment.SNAPTO_END;

module.exports = GridView;
