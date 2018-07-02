const View = require('../view');
const extend = require('js-base/core/extend');
/**
 * @class UI.ListView
 * @since 0.1
 * @extends UI.View
 * ListView is a View that displays given items as a one-column vertical list.
 *
 *     @example
 *     const Color = require('sf-core/ui/color');
 *     const ListView = require('sf-core/ui/listview');
 *     const ListViewItem = require('sf-core/ui/listviewitem');
 *     const Label = require('sf-core/ui/label');
 *     const FlexLayout = require('sf-core/ui/flexlayout');
 *     const TextAlignment     = require("sf-core/ui/textalignment");
 *     
 *     var myDataSet = [
 *         {
 *             title: 'Title 0',
 *             backgroundColor: Color.RED
 *         },
 *         {
 *             title: 'Title 1',
 *             backgroundColor: Color.CYAN
 *         },
 *         {
 *             title: 'Title 2',
 *             backgroundColor: Color.YELLOW
 *         },
 *         {
 *             title: 'Title 3',
 *             backgroundColor: Color.GRAY
 *         }
 *     ];
 *     var myListView = new ListView({
 *         flexGrow:1,
 *         rowHeight: 60,
 *         backgroundColor: Color.LIGHTGRAY,
 *         itemCount: myDataSet.length,
 *     });
 *     myListView.onRowCreate = function(){
 *         var myListViewItem = new ListViewItem();
 *         var myLabelTitle = new Label({
 *             height: 40,
 *             width: 100,
 *             alignSelf: FlexLayout.AlignSelf.CENTER,
 *             textAlignment : TextAlignment.MIDCENTER
 *         });
 *         myListViewItem.addChild(myLabelTitle);
 *         myListViewItem.myLabelTitle = myLabelTitle;
 *         
 *         return myListViewItem;
 *     };
 *     myListView.onRowBind = function(listViewItem,index){
 *         listViewItem.myLabelTitle.text = myDataSet[index].title;
 *         listViewItem.myLabelTitle.backgroundColor = myDataSet[index].backgroundColor;
 *     };
 *     myListView.onRowSelected = function(listViewItem,index){
 *         console.log("selected index = " + index)
 *     };
 *     myListView.onPullRefresh = function(){
 *         myDataSet.push({
 *             title: 'Title '+ myDataSet.length,
 *             backgroundColor: Color.RED,
 *         })
 *         myListView.itemCount = myDataSet.length;
 *         myListView.refreshData();
 *         myListView.stopRefresh();
 *     };
 *      
 *     myListView.ios.leftToRightSwipeEnabled = true;
 *     myListView.ios.rightToLeftSwipeEnabled = true;
 *       
 *     myListView.ios.onRowSwiped = function(direction,expansionSettings,index){
 *        if (direction == ListView.iOS.SwipeDirection.LEFTTORIGHT) {
 *             //Expansion button index. Default value 0
 *             expansionSettings.buttonIndex = -1;
 *             
 *             var archiveSwipeItem = ListView.iOS.createSwipeItem("ARCHIVE",Color.GREEN,30,function(e){
 *                 console.log("Archive " + e.index);
 *             });
 *             
 *             return [archiveSwipeItem];
 *         } else if(direction == ListView.iOS.SwipeDirection.RIGHTTOLEFT){
 *             //Expansion button index. Default value 0
 *             expansionSettings.buttonIndex = 0;
 *             //Size proportional threshold to trigger the expansion button. Default value 1.5
 *             expansionSettings.threshold = 1; 
 *             
 *             var moreSwipeItem = ListView.iOS.createSwipeItem("MORE",Color.GRAY,30,function(e){
 *                 console.log("More "+ e.index);
 *             });
 *             
 *             var deleteSwipeItem = ListView.iOS.createSwipeItem("DELETE",Color.RED,30,function(e){
 *                 console.log("Delete "+ e.index);
 *             });
 *             
 *             return [deleteSwipeItem,moreSwipeItem];
 *         }
 *     }
 * 
 *
 */

function ListView(params) {}

/**
 * This event is called before onRowCreate callback. Returns item type you should use based on position.
 *
 * @event onRowType
 * @param {Number} index
 * @android
 * @ios
 * @return {Number}
 * @since 3.0.2
 */
ListView.prototype.onRowType = function onRowType(index){};

/**
 * This event is called when a ListView starts to create a ListViewItem.
 * You can customize your UI(not data-binding) inside this callback.
 *
 * @event onRowCreate
 * @param {Number} rowType
 * @android
 * @ios
 * @return {UI.ListViewItem}
 * @since 0.1
 */
ListView.prototype.onRowCreate = function onRowCreate(type){};


/**
 * Gets/sets over-scroll mode for this view.
 *
 * @property {UI.Android.OverScrollMode} [overScrollMode = UI.Android.OverScrollMode.ALWAYS]
 * @android
 * @since 3.0.2
 */
ListView.prototype.overScrollMode = UI.Android.OverScrollMode.ALWAYS;

/**
 * This event is called when a ListView starts to create a ListViewItem.
 * You can set different height to rows. If row Height property is assigned, this callback doesn't fire
 *
 * @param {Number} index
 * @event onRowHeight
 * @android
 * @ios
 * @return {Number}
 * @since 1.1.18
 */
ListView.prototype.onRowHeight = function onRowHeight(index){};

/**
 * This event is called when a UI.ListViewItem created at specified row index.
 * You can bind your data to row items inside this callback.
 *
 * @param {UI.ListViewItem} listViewItem
 * @param {Number} index
 * @event onRowBind
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.onRowBind = function onRowBind(listViewItem, index){};

/**
 * This event is called when user selects a row at specific index.
 *
 * @param {UI.ListViewItem} listViewItem
 * @param {Number} index
 * @event onRowSelected
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.onRowSelected = function onRowSelected(listViewItem, index){};

/**
 * This event is called when user long selects a row at specific index.
 *
 * @param {UI.ListViewItem} listViewItem
 * @param {Number} index
 * @event onRowLongSelected
 * @android
 * @since 2.0.4
 */
ListView.prototype.onRowLongSelected = function onRowLongSelected(listViewItem, index){};

/**
 * Gets/sets the number of rows that will be shown in a ListView.
 * You should update this property after each data operation.
 *
 * @property {Number} [itemCount = 0]
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.itemCount = 0;

/**
 * Gets/sets height of a row in a ListView. Once you created the ListView, 
 * you can't change row height.
 *
 *
 * @property {Number} rowHeight
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.rowHeight = 0;

/**
 * Gets/sets the visibility of vertical scroll bar of ListView.
 * If set to true, scroll bar will be shown otherwise
 * scroll bar will be hidden.
 *
 * @property {Boolean} [verticalScrollBarEnabled = false]
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.verticalScrollBarEnabled = false;

/**
 * Enables/disables the refresh function of ListView. If set to false
 * onPullRefresh events will not be called.
 *
 * @property {Boolean} [refreshEnabled = true]
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.refreshEnabled = true;

/**
 * This method returns the index of row which is visible at
 * the top of a ListView at a given time.
 *
 * @return {Number}
 * @method getFirstVisibleIndex
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.getFirstVisibleIndex = function(){};

/**
 * This method returns the index of row which is visible at
 * the bottom of a ListView at a given time.
 *
 * @return {Number}
 * @method getLastVisibleIndex
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.getLastVisibleIndex = function(){};

/**
 * Sets the colors used in the refresh animation. On Android the first color
 * will also be the color of the bar that grows in response to a
 * user swipe gesture. iOS uses only the first color of the array.
 *
 * @method setPullRefreshColors
 * @param {UI.Color[]} colors
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.setPullRefreshColors = function(colors){};

/**
 * This method notify ListView for data changes. After this method is called
 * ListView refreshes itself and recreates the rows. Do not forget to
 * update itemCount property after data changes.
 *
 * @method refreshData
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.refreshData = function(){};

/**
 * This method scrolls ListView to a specific index.
 *
 * @param {Number} index
 * @method scrollTo
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.scrollTo = function(index){};

/**
 * This method cancels refresh operation and stops the refresh
 * indicator on a ListView. You should call this method after
 * finishing event inside onPullRefresh otherwise refresh indicator
 * never stops.
 *
 * @method stopRefresh
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.stopRefresh = function(){};

/**
 * This event is called when a ListView is scrolling.
 * For better performance, don't set any callback if does not
 * necessary
 *
 * @event onScroll
 * @param {Object} translation
 * @param {Number} translation.x
 * @param {Number} translation.y
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.onScroll = function onScroll(){ }

/**
 * This event is called when user pulls down and releases a ListView
 * when scroll position is on the top.
 *
 * @event onPullRefresh
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.onPullRefresh = function onPullRefresh(){}

/**
 * @deprecated 1.1.14
 * 
 * @param {String} title
 * @param {UI.Color} color
 * @param {Number} padding
 * @param {Function} action Callback for button click action
 * This method is create swipe item
 *
 * @method swipeItem
 * @ios
 * @since 0.1
 */
ListView.prototype.ios.swipeItem = function(title,color,padding,action){}

/**
 * This event is called when user swipe listview row
 * 
 *     @example
 *     myListView.ios.leftToRightSwipeEnabled = true;
 *     myListView.ios.rightToLeftSwipeEnabled = true;
 *     
 *     myListView.ios.onRowSwiped = function(direction,expansionSettings,index){
 *        if (direction == ListView.iOS.SwipeDirection.LEFTTORIGHT) {
 *             //Expansion button index. Default value 0
 *             expansionSettings.buttonIndex = -1;
 *             
 *             var archiveSwipeItem = ListView.iOS.createSwipeItem("ARCHIVE",Color.GREEN,30,function(e){
 *                 console.log("Archive " + e.index);
 *             });
 *             
 *             return [archiveSwipeItem];
 *         } else if(direction == ListView.iOS.SwipeDirection.RIGHTTOLEFT){
 *             //Expansion button index. Default value 0
 *             expansionSettings.buttonIndex = 0;
 *             //Size proportional threshold to trigger the expansion button. Default value 1.5
 *             expansionSettings.threshold = 1; 
 *             
 *             var moreSwipeItem = ListView.iOS.createSwipeItem("MORE",Color.GRAY,30,function(e){
 *                 console.log("More "+ e.index);
 *             });
 *             
 *             var deleteSwipeItem = ListView.iOS.createSwipeItem("DELETE",Color.RED,30,function(e){
 *                 console.log("Delete "+ e.index);
 *             });
 *             
 *             return [deleteSwipeItem,moreSwipeItem];
 *         }
 *     } 
 * 
 * @event onRowSwiped
 * @param {UI.ListView.iOS.SwipeDirection} swipeDirection
 * @param {Object} expansionSettings 
 * @param {Number} expansionSettings.buttonIndex Index of the expandable button (If you do not want any buttons to be expandable, set buttonIndex to -1.)
 * @param {Boolean} expansionSettings.fillOnTrigger if true the button fills the cell on trigger, else it bounces back to its initial position
 * @param {Number} expansionSettings.threshold Size proportional threshold to trigger the expansion button. Default value 1.5
 * @param {Number} index
 * @ios
 * @since 0.1
 * 
 */
ListView.prototype.ios.onRowSwiped  = function(swipeDirection,expansionSettings,index){}

/**
 * Gets/sets leftToRightSwipeEnabled
 *
 * @property {Boolean} [leftToRightSwipeEnabled = false]
 * @ios
 * @since 0.1
 */
ListView.prototype.ios.leftToRightSwipeEnabled = false;

/**
 * Gets/sets rightToLeftSwipeEnabled
 *
 * @property {Boolean} [rightToLeftSwipeEnabled = false]
 * @ios
 * @since 0.1
 */
ListView.prototype.ios.rightToLeftSwipeEnabled = false;

/**
 * 
 * This method is create swipe item
 * 
 *      @example
 *      var moreSwipeItem = ListView.iOS.createSwipeItem("MORE",Color.GRAY,30,function(e){
 *          console.log("More "+ e.index);
 *      });
 * 
 * @param {String} title
 * @param {UI.Color} color
 * @param {Number} padding
 * @param {Function} action Callback for button click action
 * @param {Boolean} isAutoHide Set false to doesn't autohide the SwipeItem. Default true.
 * 
 * @method createSwipeItem
 * @static
 * @ios
 * @since 1.1.14
 * 
 
 */
ListView.createSwipeItem = function(title,color,padding,action,isAutoHide){};

/**
 * 
 * This method is create swipe item with icon
 * 
 *      @example
 *      var iconSwipeItem = ListView.iOS.createSwipeItemWithIcon(undefined,Image.createFromFile("images://icon.png"),Color.RED,30,function(e){
 *          console.log("Icon "+ e.index);
 *      });
 * 
 * @param {String} title
 * @param {UI.Image} icon
 * @param {UI.Color} color
 * @param {Number} padding
 * @param {Function} action Callback for button click action
 * @param {Boolean} isAutoHide Set false to doesn't autohide the SwipeItem. Default true.
 * 
 * @method createSwipeItemWithIcon
 * @static
 * @ios
 * @since 2.0.4
 * 
 
 */
ListView.createSwipeItemWithIcon = function(title,icon,color,padding,action,isAutoHide){};

/**
 * This method returns ListViewItem
 *
 * @return {UI.ListViewItem}
 * @method listViewItemByIndex
 * @param {Number} index
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.listViewItemByIndex = function(index){};

/**
 * iOS Specific Properties.
 * @class UI.ListView.iOS
 */
ListView.iOS = {};

/**
 * Bar style that specifies the search bar’s appearance.
 * @class UI.ListView.iOS.SwipeDirection
 * @readonly
 * @ios
 * @since 1.1.14
 */
ListView.iOS.SwipeDirection = {};

/**
 * @property {Number} LEFTTORIGHT
 * @ios
 * @static
 * @readonly
 * @since 1.1.14
 */
ListView.iOS.SwipeDirection.LEFTTORIGHT = 0;

/**
 * @property {Number} RIGHTTOLEFT
 * @ios
 * @static
 * @readonly
 * @since 1.1.14
 */
ListView.iOS.SwipeDirection.RIGHTTOLEFT = 1;

module.exports = ListView;
