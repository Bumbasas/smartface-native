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
ListView.prototype.onRowType = function onRowType(index) {};

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
ListView.prototype.onRowCreate = function onRowCreate(type) {};

/**
 * The behavior for determining the adjusted content offsets.
 *
 * @property {UI.iOS.ContentInsetAdjustment} [contentInsetAdjustmentBehavior = UI.iOS.ContentInsetAdjustment.NEVER]
 * @ios
 * @since 4.0.0
 */
ListView.prototype.contentInsetAdjustmentBehavior = UI.iOS.ContentInsetAdjustment.NEVER;

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
ListView.prototype.onRowHeight = function onRowHeight(index) {};

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
ListView.prototype.onRowBind = function onRowBind(listViewItem, index) {};

/**
 * This event is called when a scroll occurs. 
 *
 * @param {Object} params
 * @param {Number} distanceX The distance along the X axis that has been scrolled since the last scroll
 * @param {Number} distanceY The distance along the Y axis that has been scrolled since the last scroll
 * @return {Boolean} Return true if the event is consumed.
 * @event onGesture
 * @android
 * @since 4.0.0
 */
ListView.prototype.onGesture = function onGesture(params) {};

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
ListView.prototype.onRowSelected = function onRowSelected(listViewItem, index) {};

/**
 * This event is called when user long selects a row at specific index.
 *
 * @param {UI.ListViewItem} listViewItem
 * @param {Number} index
 * @event onRowLongSelected
 * @android
 * @since 2.0.4
 */
ListView.prototype.onRowLongSelected = function onRowLongSelected(listViewItem, index) {};

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
 * If the value of this property is YES , scrolling is enabled, and if it is NO , scrolling is disabled. The default is YES.
 *
 * @property {Boolean} [scrollEnabled = true]
 * @ios
 * @android
 * @since 3.2.0
 */
ListView.prototype.scrollEnabled = false;

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
 * Enables/disables drag & drop behavior. When rowMoveEnabled property is true, onRowSelected callback is not triggered for iOS.
 *
 * @property {Boolean} [rowMoveEnabled = false]
 * @android
 * @ios
 * @since 4.1.4
 */
ListView.prototype.rowMoveEnabled = true;

/**
 * When {UI.ListView#rowMoveEnabled rowMoveEnabled} is true, default value is true but you may want to disable this 
 * if you want to start dragging on a custom view touch using {UI.ListView#startDrag startDrag}.
 *
 * @property {Boolean} [longPressDragEnabled = false]
 * @android
 * @since 4.1.4
 */
ListView.prototype.longPressDragEnabled = true;


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
ListView.prototype.getFirstVisibleIndex = function() {};

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
ListView.prototype.getLastVisibleIndex = function() {};

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
ListView.prototype.setPullRefreshColors = function(colors) {};

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
ListView.prototype.refreshData = function() {};


/**
 * Starts dragging the provided ListViewItem. By default, ListView starts a drag when a ListViewItem is long pressed. 
 * You can disable that behavior by setting longPressDragEnabled.
 *
 * @method startDrag
 * @param {UI.ListViewItem} listViewItem
 * @android
 * @since 4.1.3
 */
ListView.prototype.startDrag = function(listViewItem) {};


/**
 * This method notify the ListView  that given range of items deleted. Must set the itemCount value to a changed number before calling this function.
 *
 * @method deleteRowRange
 * @param {Object} params 
 * @param {Number} params.positionStart Position of start item
 * @param {Number} params.itemCount  Number of items to be removed from the data set
 * @param {Number} params.ios iOS specific property
 * @param {UI.ListView.iOS.RowAnimation} [params.ios.animation = UI.ListView.iOS.RowAnimation.AUTOMATIC]  A constant that indicates how the deletion is to be animated, for example, fade out or slide out from the bottom.
 * @android
 * @ios
 * @since 4.1.4
 */
ListView.prototype.deleteRowRange = function(params) {};


/**
 * This method notify the ListView  that given range of items inserted. Must set the itemCount value to a changed number before calling this function.
 *
 * @method insertRowRange
 * @param {Object} params 
 * @param {Number} params.positionStart Position of start item
 * @param {Number} params.itemCount  Number of items to be inserted from the data set
 * @param {Number} params.ios iOS specific property
 * @param {UI.ListView.iOS.RowAnimation} [params.ios.animation = UI.ListView.iOS.RowAnimation.AUTOMATIC]  A constant that either specifies the kind of animation to perform when inserting the row or requests no animation.
 * @android
 * @ios
 * @since 4.1.4
 */
ListView.prototype.insertRowRange = function(params) {};


/**
 * This method notify the ListView  that given range of items changed.
 *
 * @method refreshRowRange
 * @param {Object} params 
 * @param {Number} params.positionStart Position of start item
 * @param {Number} params.itemCount  Number of items to be changed from the data set
 * @param {Number} params.ios iOS specific property
 * @param {UI.ListView.iOS.RowAnimation} [params.ios.animation = UI.ListView.iOS.RowAnimation.AUTOMATIC]  A constant that indicates how the reloading is to be animated, for example, fade out or slide out from the bottom.
 * @android
 * @ios
 * @since 4.1.4
 */
ListView.prototype.refreshRowRange = function(params) {};



/**
 * Called when the ListView should save its layout state. This is a good time to save your scroll position, 
 * configuration and anything else that may be required to restore the same layout state if the ListView is recreated.
 *
 * @method saveInstanceState
 * @android
 * @return {Object}
 * @since 4.0.2
 */
ListView.prototype.saveInstanceState = function() {};


/**
 * Called when the ListView should restore its layout state. This is a good time to restore your scroll position, 
 * configuration and anything else that may be required to restore the same layout state if the ListView is recreated.
 *
 * @param {Object} state
 * @method restoreInstanceState
 * @android
 * @since 4.0.2
 */
ListView.prototype.restoreInstanceState = function(state) {};

/**
 * This method scrolls ListView to a specific index.
 *
 * @param {Number} index
 * @param {Boolean} [animated = true]
 * @method scrollTo
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.scrollTo = function(index, animated) {};

/**
 * Sets/Gets the bounce effect when scrolling.
 *
 * @property {Boolean} bounces
 * @ios
 * @since 3.2.1
 */
ListView.prototype.bounces = true;

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
ListView.prototype.stopRefresh = function() {};

/**
 * Gets contentOffset of the ListView.
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
ListView.prototype.contentOffset = {};

/**
 * This event is called when a ListView is scrolling. To remove this evet, set null.
 * For better performance, don't set any callback if does not
 * necessary
 *
 * @event onScroll
 * @param {Object} params
 * @param {Object} params.translation
 * @param {Number} params.translation.x
 * @param {Number} params.translation.y
 * @param {Object} params.contentOffset
 * @param {Number} params.contentOffset.x
 * @param {Number} params.contentOffset.y
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.onScroll = function onScroll() {}


/**
 * This event is called when a ListView's scroll state is changed. To remove this evet, set null.
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
ListView.prototype.onScrollStateChanged = function onScrollStateChanged() {}

/**
 * This event is called when user pulls down and releases a ListView
 * when scroll position is on the top.
 *
 * @event onPullRefresh
 * @android
 * @ios
 * @since 0.1
 */
ListView.prototype.onPullRefresh = function onPullRefresh() {}

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
ListView.prototype.ios.swipeItem = function(title, color, padding, action) {}

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
ListView.prototype.ios.onRowSwiped = function(swipeDirection, expansionSettings, index) {}

/**
 * Gets/Sets contentInset of the ListView.
 * 
 * @property {Object} [contentInset = {top: 0,bottom: 0}]
 * @property {Number} contentInset.top
 * @property {Number} contentInset.bottom
 * @android
 * @ios
 * @since 3.0.2
 */
ListView.prototype.contentInset = {
    top: 0,
    bottom: 0
};


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
ListView.createSwipeItem = function(title, color, padding, action, isAutoHide) {};

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
ListView.createSwipeItemWithIcon = function(title, icon, color, padding, action, isAutoHide) {};

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
ListView.prototype.listViewItemByIndex = function(index) {};


/**
 * This method returns ListViewItem's index.
 *
 * @return {Number} Returns the index of given {@link UI.ListViewItem listviewitem}.
 * @method indexByListViewItem
 * @param {UI.ListViewItem} 
 * @android
 * @ios
 * @since 4.1.4
 */
ListView.prototype.indexByListViewItem = function(listViewItem) {};

/**
 * This event is called when the list view is about to start scrolling the content.
 * 
 * @param {Object} contentOffset
 * @param {Number} contentOffset.x
 * @param {Number} contentOffset.y
 * @event onScrollBeginDragging
 * @ios
 * @since 3.2.1
 */
ListView.prototype.onScrollBeginDragging = function(contentOffset) {};

/**
 * This event is called when the list view is starting to decelerate the scrolling movement.
 * 
 * @param {Object} contentOffset
 * @param {Number} contentOffset.x
 * @param {Number} contentOffset.y
 * @event onScrollBeginDecelerating
 * @ios
 * @since 3.2.1
 */
ListView.prototype.onScrollBeginDecelerating = function(contentOffset) {};

/**
 * This event is called when the list view has ended decelerating the scrolling movement.
 * 
 * @param {Object} contentOffset
 * @param {Number} contentOffset.x
 * @param {Number} contentOffset.y
 * @event onScrollEndDecelerating
 * @ios
 * @since 3.2.1
 */
ListView.prototype.onScrollEndDecelerating = function(contentOffset) {};

/**
 * This event is called when dragging ended in the list view.
 * 
 * @param {Object} contentOffset
 * @param {Number} contentOffset.x
 * @param {Number} contentOffset.y
 * @param {Boolean} decelerate
 * @event onScrollEndDraggingWillDecelerate
 * @ios
 * @since 3.2.1
 */
ListView.prototype.onScrollEndDraggingWillDecelerate = function(contentOffset, decelerate) {};

/**
 * This event is called when the user finishes scrolling the content.
 * 
 * @param {Object} contentOffset
 * @param {Number} contentOffset.x
 * @param {Number} contentOffset.y
 * @param {Object} velocity
 * @param {Number} velocity.x
 * @param {Number} velocity.y
 * @param {Object} targetContentOffset
 * @param {Number} targetContentOffset.x
 * @param {Number} targetContentOffset.y
 * @event onScrollEndDraggingWithVelocityTargetContentOffset
 * @ios
 * @since 3.2.1
 */
ListView.prototype.onScrollEndDraggingWithVelocityTargetContentOffset = function(contentOffset, velocity, targetContentOffset) {};


/**
 * This event is called when the view is attached to a window. At this point it has a Surface and will start drawing. 
 * 
 * @event onAttachedToWindow
 * @android
 * @since 4.0.2
 */
ListView.prototype.onAttachedToWindow = function() {};

/**
 * This event is called when the view is detached to a window. At this point it no longer has a surface for drawing.
 * 
 * @event onDetachedFromWindow
 * @android
 * @since 4.0.2
 */
ListView.prototype.onDetachedFromWindow = function() {};



/**
 * This event is called when dragged item reordered in the list view. 
 * 
 * @param {Number} source
 * @param {Number} destination
 * @event onRowMoved
 * @ios
 * @android
 * @since 4.1.4
 */
ListView.prototype.onRowMoved = function(source, destination) {};


/**
 * This event is called when dragged item before reordered in the list view. 
 * 
 * @param {Number} source
 * @param {Number} destination
 * @event onRowMove
 * @return {Boolean} Return true if source index can be reordered by destination index.
 * @ios
 * @android
 * @since 4.1.4
 */
ListView.prototype.onRowMove = function(source, destination) {};


/**
 * By default all the items are draggable if {UI.ListView#rowMoveEnabled rowMoveEnabled} is true, to restrict some rows set this method and change return value
 * by specific condition.
 * 
 * @param {Number} index
 * @event onRowCanMove 
 * @return {Boolean} Return true if index can be draggable 
 * @ios
 * @android
 * @since 4.1.4
 */
ListView.prototype.onRowCanMove = function(index) {};


/**
 * iOS Specific Properties.
 * @class UI.ListView.iOS
 */
ListView.iOS = {};

/**
 * Bar style that specifies the search bar’s appearance.
 * @enum UI.ListView.iOS.SwipeDirection
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

/**
 * The type of animation to use when rows are inserted or deleted or reloaded.
 * @enum UI.ListView.iOS.RowAnimation
 * @readonly
 * @ios
 * @since 4.1.4
 */
ListView.iOS.RowAnimation = {};

/**
 * @property {Number} FADE
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.FADE = 0;

/**
 * @property {Number} RIGHT
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.RIGHT = 1;

/**
 * @property {Number} LEFT
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.LEFT = 2;

/**
 * @property {Number} TOP
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.TOP = 3;

/**
 * @property {Number} BOTTOM
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.BOTTOM = 4;

/**
 * @property {Number} NONE
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.NONE = 5;

/**
 * @property {Number} MIDDLE
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.MIDDLE = 6;

/**
 * @property {Number} AUTOMATIC
 * @ios
 * @static
 * @readonly
 * @since 4.1.4
 */
ListView.iOS.RowAnimation.AUTOMATIC = 100;

module.exports = ListView;