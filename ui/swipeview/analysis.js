const View = require('../view');
const extend = require('js-base/core/extend');
/**
 * @class UI.SwipeView
 * @since 1.1.10
 * @extends UI.View
 * SwipeView holds page classes provided inside an array. These pages can be traversed horizontally via gesture
 * actions. 
 *
 *     @example
 *     const SwipeView = require('sf-core/ui/swipeview');
 *     var swipeView = new SwipeView({
 *       page: currentPage,
 *       width:300, height:300,
 *       pages: [require("../ui/ui_swipePage1"), require("../ui/ui_swipePage2"), require("../ui/ui_swipePage3")],
 *       onPageSelected: function(index,page) {
 *         console.log("Selected Page Index : " + index);
 *         console.log("Selected Page Instance : " + page);
 *       },
 *       onStateChanged: function(state) {
 *         if (SwipeView.State.DRAGGING === state) {
 *           console.log("Dragging");
 *         } else {
 *           console.log("Idle");
 *         }
 *       }
 *     });
 * 
 * @constructor
 * @param {Object} object
 * @param {UI.Page} object.page
 * It is required to pass the current page to swipeview.
 * 
 */
function SwipeView() {
    /**
     * Gets/Sets the array of the page classes will be displayed inside SwipeView. Pages parameter cannot be empty.
     *
     * @property {Array} pages
     * @android
     * @ios
     * @since 1.1.10
     */
    this.pages = [];
    /**
     * Gets/Sets the callback triggered when a page is selected after a swipe action.
     *
     * @event onPageSelected
     * @param index
     * @param page Selected page instance
     * @android
     * @ios
     * @since 1.1.10
     */
    this.onPageSelected = function(index, page) {};
    /**
     * Gets/Sets the callback triggered when a page is scrolling. When call swipeToIndex function, onPageScrolled will behave differently on iOS and Android.
     * Click this link for SwipeToIndex and onPageScrolled use together: "https://developer.smartface.io/docs/swipeview-onpagescrolled-and-swipetoindex-together-usage"
     *
     * @event onPageScrolled
     * @param index  Index of the first page from the left that is currently visible.
     * @param offset Indicating the offset from index. Value from range [0, width of swipeview].
     * @android
     * @ios
     * @since 2.0.9
     */
    this.onPageScrolled = function(index, offset) {};
    /**
     * Gets/Sets the callback triggered during swipe actions.
     *
     * @event onStateChanged
     * @param {UI.SwipeView.State} state
     * @android
     * @ios
     * @since 1.1.10
     */
    this.onStateChanged = function(state) {};
    /**
     * Gets the currently displayed page's index inside the page array.
     *
     * @property {Number} currentIndex
     * @android
     * @ios
     * @readonly
     * @since 1.1.10
     */
    this.currentIndex = -1;

     /**
     * Enables/Disables paging behavior.
     *
     * @property {Boolean} [pagingEnabled = true]
     * @android
     * @ios
     * @since 4.3.2
     */
    this.pagingEnabled = true;

    /**
     * Swipes to the page inside the index of the array.
     *
     * @method swipeToIndex
     * @param {Number} index
     * @param {Boolean} [animated=false]
     * @android
     * @ios
     * @since 1.1.10
     */
    this.swipeToIndex = function(index, animated) {};
};


/**
 * Gets/sets over-scroll mode for this view.
 *
 * @property {UI.Android.OverScrollMode} [overScrollMode = UI.Android.OverScrollMode.ALWAYS]
 * @android
 * @since 3.0.2
 */
SwipeView.prototype.overScrollMode = UI.Android.OverScrollMode.ALWAYS;

/**
 * @enum UI.SwipeView.State
 * @static
 * @readonly
 * @since 1.1.10
 *
 */
SwipeView.State = {};

/**
 * @property {Number} [IDLE = 0]
 * @android
 * @ios
 * @static
 * @readonly
 * @since 1.1.10
 */
SwipeView.State.IDLE = 0;

/**
 * @property {Number} [DRAGGING = 1]
 * @android
 * @ios
 * @static
 * @readonly
 * @since 1.1.10
 */
SwipeView.State.DRAGGING = 1;