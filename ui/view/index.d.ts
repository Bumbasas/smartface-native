import Color = require("../color");
import FlexLayout = require("../flexlayout");
import ViewGroup = require("../viewgroup");
import { Point2D } from "sf-core/primitive/point2d";

export = View;
/**
 * @class UI.View
 * @since 0.1
 *
 * View class represents a rectangular area on the screen and it is responsible
 * for event handling. View is the base of all UI classes.
 *
 *     @example
 *     const View = require('sf-core/ui/view');
 *     const Color = require('sf-core/ui/color');
 *     var myView = new View();
 *     myView.width = 300;
 *     myView.height = 500;
 *     myView.top = 50;
 *     myView.left = 50;
 *     myView.backgroundColor = Color.RED;
 *
 */
declare class View extends NativeComponent {
	constructor(params?: any);
	/**
	 * Gets/sets foreground of the view for ripple effect. This property should be set before rippleColor.
	 * This property only supported for api level 23 and above.
	 *
	 * @property {Boolean} [useForeground = false]
	 * @android
	 * @member UI.View
	 * @since 4.0.2
	 */
	useForeground: boolean;
	/**
	 * Gets/sets ripple effect enabled for view. You should set {@link UI.View#rippleColor rippleColor}
	 * to see the effect.
	 *
	 * @property {Boolean} [rippleEnabled = false]
	 * @android
	 * @member UI.View
	 * @since 3.2.1
	 */
	rippleEnabled: boolean;
	/**
	 * Gets/sets ripple effect color for view.
	 *
	 * @property {UI.Color} rippleColor
	 * @android
	 * @member UI.View
	 * @since 3.2.1
	 */
	rippleColor: Color;
	/**
	 * Defines the opacity of a view. The value of this property is a float number
	 * between 0.0 and 1.0. 0 represents view is completely transparent and 1
	 * represents view is completely opaque.
	 *
	 * @property {Number} [alpha = 1]
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 0.1
	 */
	alpha: number;
	/**
	 * Gets/sets background color of a view. It allows setting background
	 * color with UI.Color instance.
	 *
	 * @property {UI.Color} [backgroundColor = UI.Color.WHITE]
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 0.1
	 */
	backgroundColor: Color;
	/**
	 * Sets/gets border color of bounded view.
	 *
	 * @property {UI.Color} [borderColor = UI.Color.BLACK]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	borderColor: Color;
	/**
	 * Sets/gets border thickness of bounded view. Accepts unsigned
	 * numbers, 0 means no border.
	 *
	 * @property {Number} [borderWidth = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	borderWidth: number;
	/**
	 * Sets/gets corner radius of a view. BorderRadius maximum value must be half of the shortest edge.
	 *
	 * @property {Number} [borderRadius = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	borderRadius: number;
	/**
	 * Gets/sets id of a view. It should be unique number for each object
	 * inside page. Id will be generated unique by default.
	 *
	 * @property {Number} id
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 0.1
	 */
	id: string;
	/**
	 * Gets/sets visibility of view. It is set to true as default.
	 *
	 * @property {Boolean} [visible = true]
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 0.1
	 */
	visible: boolean;
	/**
	 * Gets/sets the degrees that the view is rotated around the pivot point.
	 *
	 * @property {Number} [rotation = 0]
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 1.1.10
	 */
	rotation: number;
	/**
	 * Gets/sets the degrees that the view is rotated around the horizontal axis through the pivot point.
	 * RotationX works different for iOS and Android. Android gives perpective to the view but iOS doesn't.
	 * This will cause difference on user interface.
	 *
	 * @property {Number} [rotationX = 0]
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 1.1.10
	 */
	rotationX: number;
	/**
	 * Gets/sets the degrees that the view is rotated around the vertical axis through the pivot point.
	 * RotationY works different for iOS and Android. Android gives perpective to the view but iOS doesn't.
	 * This will cause difference on user interface.
	 *
	 * @property {Number} [rotationY = 0]
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 1.1.10
	 */
	rotationY: number;
	/**
	 * Enables/disables touches to view. When set to false events
	 * related to touches won't fire. It is set to true as default.
	 *
	 * @property {Boolean} [touchEnabled = true]
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 0.1
	 */
	touchEnabled: boolean;
	/**
	 * Gets/sets left position of a view relative to its parent.
	 *
	 * @property {Number} [left = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	left: number;
	/**
	 * Gets/sets top position of a view relative to its parent.
	 *
	 * @property {Number} [top = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	top: number;
	/**
	 * Gets/sets right position of a view relative to its parent. This property works only if
	 * view's positionType is UI.FlexLayout.PositionType.ABSOLUTE.
	 *
	 * @property {Number} [right = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	right: number;
	/**
	 * Gets/sets bottom position of a view relative to its parent. This property works only if
	 * view's positionType is UI.FlexLayout.PositionType.ABSOLUTE.
	 *
	 * @property {Number} [bottom = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	bottom: number;
	/**
	 * Gets/sets height of a view.
	 *
	 * @property {Number} [height = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	height: number;
	/**
	 * Gets/sets width of a view.
	 *
	 * @property {Number} [width = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	width: number;
	/**
	 * Gets/sets minimum width of a view.
	 *
	 * @property {Number} [minWidth = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	minWidth: number;
	/**
	 * Gets/sets minimum height of a view.
	 *
	 * @property {Number} [minHeight = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	minHeight: number;
	/**
	 * Gets/sets maximum width of a view.
	 *
	 * @property {Number} [maxWidth = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	maxWidth: number;
	/**
	 * Gets/sets maximum height of a view.
	 *
	 * @property {Number} [maxHeight = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	maxHeight: number;
	/**
	 * Gets/Sets the padding space on the top side of a view.
	 *
	 * @property {Number} [paddingTop = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	paddingTop: number;
	/**
	 * Gets/Sets the padding space on the bottom side of a view.
	 *
	 * @property {Number} [paddingBottom = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	paddingBottom: number;
	/**
	 * Gets/Sets the padding space on the left side of a view.
	 *
	 * @property {Number} [paddingLeft = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	paddingLeft: number;
	/**
	 * Gets/Sets the padding space on the right side of a view.
	 *
	 * @property {Number} [paddingRight = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	paddingRight: number;
	/**
	 * Gets/Sets the padding space on the all sides of a view.
	 *
	 * @property {Number} [padding = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	padding: number;
	/**
	 * Gets/Sets the margin space on the top side of a view.
	 *
	 * @property {Number} [marginTop = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	marginTop: number;
	/**
	 * Gets/Sets the margin space on the bottom side of a view.
	 *
	 * @property {Number} [marginBottom = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	marginBottom: number;
	/**
	 * Gets/Sets the margin space on the left side of a view.
	 *
	 * @property {Number} [marginLeft = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	marginLeft: number;
	/**
	 * Gets/Sets the margin space required on the right side of a view.
	 *
	 * @property {Number} [marginRight = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	marginRight: number;
	/**
	 * Gets/Sets the margin space required on the all sides of a view.
	 *
	 * @property {Number} [margin = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	margin: number;
	/**
	 * This property specifies the type of positioning method used for a view.
	 * To position a view relative to its parent with top,left,right and bottom
	 * properties you must set the position type to absolute.
	 *
	 * @property {UI.FlexLayout.PositionType} [positionType = UI.FlexLayout.PositionType.RELATIVE]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	positionType: FlexLayout.PositionType;
	/**
	 * This property specifies how much a view will grow relative to the other views inside the same {@link UI.FlexLayout FlexLayout}.
	 *
	 * @property {Number} [flexGrow = 0]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	flexGrow: number;
	/**
	 * AspectRatio keeps the ratio between the width and the height of a view. AspectRatio has higher priority than {@link UI.View#flexGrow flexGrow}.
	 *
	 * @property {Number} aspectRatio
	 * @android
	 * @ios
	 * @since 0.1
	 */
	aspectRatio: number;
	/**
	 * This property specifies how much a view will shrink relative to the other views inside the same {@link UI.FlexLayout FlexLayout}.
	 *
	 * @property {Number} [flexShrink = 1]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	flexShrink: number;
	/**
	 * This property specifies the initial length of a view in a {@link UI.FlexLayout FlexLayout}.
	 *
	 * @property {Number} [flexBasis = -1]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	flexBasis: number;
	/**
	 * This property sets the amount that the view is scaled in X & Y around the pivot point, as a proportion of the view's unscaled width. A value of 1 means that no scaling is applied.
	 * Actually {@link UI.flipVertically flipVertically} & {@link UI.flipHorizontally flipHorizontally} functions are assignes -1 to X & Y to mirror the view. So while using scale, need to
	 * consider these functions.
	 *
	 * @property {Object} scale
	 * @android
	 * @ios
	 * @since 4.0.1
	 */
	scale: Point2D;
	/**
	 * This property specifies how a child view aligns in the cross-axis.
	 * It overrides the {@link UI.FlexLayout.AlignItems FlexLayout.AlignItems} property of the parent.
	 *
	 * @property {UI.FlexLayout.AlignSelf} [alignSelf = UI.FlexLayout.AlignSelf.AUTO]
	 * @android
	 * @ios
	 * @since 0.1
	 */
	alignSelf: FlexLayout.AlignSelf;
	applyLayout():void;
	/**
	 * This method put a view to the top of other views in z-direction.
	 *
	 * @method bringToFront
	 * @android
	 * @ios
	 * @since 0.1
	 */
	bringToFront(): void;
	/**
	 * This method flips the view horizontally.
	 *
	 * @method flipHorizontally
	 * @android
	 * @ios
	 * @since 3.1.3
	 */
	flipHorizontally(): void;
	/**
	 * This method flips the view vertically.
	 *
	 * @method flipVertically
	 * @android
	 * @ios
	 * @since 3.1.3
	 */
	flipVertically(): void;
	/**
	 * This method returns an object that defines view location on screen.
	 * Do not use this method for invisible views in {@link UI.ListView ListView} and {@link UI.GridView GridView}.
	 *
	 * @method getScreenLocation
	 * @return {Object} location
	 * @return {Number} location.x
	 * @return {Number} location.y
	 * @android
	 * @ios
	 * @since 3.2.0
	 */

	getScreenLocation(): Point2D;
	/**
	 * Gets the parent view of a view.
	 *
	 *     @example
	 *     const FlexLayout = require('sf-core/ui/flexlayout');
	 *     const Label = require('sf-core/ui/label');
	 *
	 *     var myFlexLayout = new FlexLayout();
	 *     myFlexLayout.id = 5432;
	 *
	 *     var myLabel = new Label({
	 *          text: "Smartface Label"
	 *     });
	 *     myFlexLayout.addChild(myLabel);
	 *     var parentId = myLabel.getParent().id; //is equal to 5432.
	 *
	 * @return {UI.ViewGroup} Parent view of a view, null if not exists.
	 * @method getParent
	 * @android
	 * @ios
	 * @since 0.1
	 */
	getParent(): ViewGroup;
	/**
	 * This event is called when a touch screen motion event starts.
	 *
	 * @event onTouch
	 * @return {Boolean} True if the listener has consumed the event, false otherwise.
	 * @param {Object} motionEvent
	 * @param {Number} motionEvent.x
	 * @param {Number} motionEvent.y
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 0.1
	 */
	onTouch: (point: Point2D) => void;
	/**
	 * This event is called when a touch screen motion event ends. If touch position inside this view, isInside parameter will be true.
	 *
	 * @event onTouchEnded
	 * @return {Boolean} True if the listener has consumed the event, false otherwise.
	 * @param {Boolean} isInside This argument is deprecated. Use motionEvent's property.
	 * @param {Object} motionEvent
	 * @param {Boolean} motionEvent.isInside
	 * @param {Number} motionEvent.x
	 * @param {Number} motionEvent.y
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 0.1
	 */
	onTouchEnded: (isInside: boolean, point: Point2D) => void;
	/**
	 * This event is called when a parent view takes control of the touch events, like a ListView or ScrollView does when scrolling.
	 *
	 * @event onTouchCancelled
	 * @return {Boolean} True if the listener has consumed the event, false otherwise.
	 * @param {Object} motionEvent
	 * @param {Number} motionEvent.x
	 * @param {Number} motionEvent.y
	 * @android
	 * @ios
	 * @member UI.View
	 * @since 2.0.10
	 */
	onTouchCancelled: (point: Point2D) => void;
	onTouchMoved: (e: { isInside: boolean } & Point2D) => void;
	android: {
		/**
		 * Gets/Sets the elevation of the view. For the views that has
		 * StateListAnimator natively like Button, will lost its own
		 * StateListAnimation when elevation value changed.
		 * For details : https://developer.android.com/training/material/shadows-clipping.html
		 *
		 * @property {Number} elevation
		 * @android
		 * @member UI.View
		 * @see https://developer.android.com/training/material/shadows-clipping.html
		 * @see https://developer.android.com/reference/android/view/View.html#setStateListAnimator(android.animation.StateListAnimator)
		 * @since 1.1.12
		 */
		elevation: number;
		/**
		 * Gets/sets the depth location of the view relative to its elevation. To put view over button,
		 * you have to change zIndex value after Android Lollipop. On android, default elevation value of button is bigger than other view.
		 * This property affects after Android Lollipop. No-op before api level 21.
		 *
		 * @property {Number} zIndex
		 * @android
		 * @member UI.View
		 * @since 2.0.8
		 */
		zIndex: number;
	};
	ios: {
		/**
		 * Setting this property to TRUE causes the receiver to block the delivery of touch events to other views.
		 * The default value of this property is false
		 *
		 * @property {Boolean} [exclusiveTouch = false]
		 * @ios
		 * @since 2.0.10
		 */
		exclusiveTouch: boolean;
		/**
		 * A Boolean value that determines whether subviews are confined to the bounds of the view.
		 *
		 * @property {Boolean} [clipsToBounds = false]
		 * @ios
		 * @since 1.1.15
		 */
		clipsToBounds: number;
		/**
		 * The offset (in points) of the shadow. "ios.masksToBounds" property must be false for shadow.
		 *
		 *     @example
		 *     view.ios.masksToBounds = false;
		 *     view.ios.shadowOffset = {x:10,y:10};
		 *     view.ios.shadowRadius = 5;
		 *     view.ios.shadowOpacity = 0.5;
		 *     view.ios.shadowColor = Color.GRAY;
		 *
		 * @property {Object} [shadowOffset = {x: 0.0,y: -3.0}]
		 * @property {Number} shadowOffset.x
		 * @property {Number} shadowOffset.y
		 * @ios
		 * @since 2.0.6
		 */
		shadowOffset: Point2D;
		/**
		 * The blur radius (in points) used to render the shadow. "ios.masksToBounds" property must be false for shadow.
		 *
		 * @property {Number} [shadowRadius = 3]
		 * @ios
		 * @since 2.0.6
		 */
		shadowRadius: number;
		/**
		 * The value in this property must be in the range 0.0 (transparent) to 1.0 (opaque). "ios.masksToBounds" property must be false for shadow.
		 *
		 * @property {Number} [shadowOpacity = 0]
		 * @ios
		 * @since 2.0.6
		 */
		shadowOpacity: number;
		/**
		 * The color of the shadow. "ios.masksToBounds" property must be false for shadow.
		 *
		 * @property {UI.Color} [shadowColor = UI.Color.BLACK]
		 * @ios
		 * @since 2.0.6
		 */
		shadowColor: Color;
		/**
		 *
		 * Changes the direction of unreachable child views of all components. These components are HeaderBar, BottomBar, Material Textbox, Searchview, SwipeView etc.
		 *
		 * @property {UI.View.iOS.SemanticContentAttribute} [viewAppearanceSemanticContentAttribute = UI.View.iOS.SemanticContentAttribute.AUTO]
		 * @ios
		 * @static
		 * @since 3.1.3
		 */
		viewAppearanceSemanticContentAttribute: View.iOS.SemanticContentAttribute;
	};
	/**
	 * A Boolean indicating whether sublayers are clipped to the layer’s bounds. Android sublayers still overlaps the border's width and
	 * as known issue,if {@link UI.View#maskedBorders maskedBorders} is used then sublayer won't be clipped.
	 *
	 * @property {Boolean} [masksToBounds = true]
	 * @ios
	 * @android
	 * @since 4.1.4
	 */
	masksToBounds: boolean;
	/**
	 * Specified enums indicates that which corner of View will have radius.
	 *
	 * @property {UI.View.Border[]} [maskedBorders = [View.Border.TOP_LEFT, View.Border.TOP_RIGHT, View.Border.BOTTOM_RIGHT, View.Border.BOTTOM_LEFT]]
	 * @ios
	 * @android
	 * @since 4.1.4
	 */
	maskedBorders: View.Border[];

	getPosition: () => {
		left: number;
		top: number;
		width: number;
		height: number;
	};
}
declare namespace View {
	/**
	 * @enum {Number} UI.View.Border
	 * @since 4.1.4
	 * @ios
	 * @android
	 *
	 * Includes enums of View's borders.
	 */
	enum Border {
		/**
		 * View's top-left border.
		 *
		 * @property {Number} TOP_LEFT
		 * @android
		 * @ios
		 * @static
		 * @readonly
		 * @since 4.1.4
		 */
		TOP_LEFT = 0,
		/**
		 * View's top-right border.
		 *
		 * @property {Number} TOP_RIGHT
		 * @android
		 * @ios
		 * @static
		 * @readonly
		 * @since 4.1.4
		 */
		TOP_RIGHT = 2,
		/**
		 * View's bottom-right border.
		 *
		 * @property {Number} BOTTOM_RIGHT
		 * @android
		 * @ios
		 * @static
		 * @readonly
		 * @since 4.1.4
		 */
		BOTTOM_RIGHT = 4,
		/**
		 * View's bottom-left border.
		 *
		 * @property {Number} BOTTOM_LEFT
		 * @android
		 * @ios
		 * @static
		 * @readonly
		 * @since 4.1.4
		 */
		BOTTOM_LEFT = 0
	}
	namespace ios {
		const viewAppearanceSemanticContentAttribute: iOS.SemanticContentAttribute;
	}
	/**
	 * iOS Specific Properties.
	 * @class UI.View.iOS
	 * @since 3.1.3
	 */
	namespace iOS {
		/**
		 * @enum {Number} UI.View.iOS.SemanticContentAttribute
		 * @since 3.1.3
		 * @ios
		 */
		enum SemanticContentAttribute {
			/**
			 * Layout direction will be the same as the device direction. You can use {@link Application#userInterfaceLayoutDirection userInterfaceLayoutDirection} property to check device direction.
			 *
			 * @property {Number} AUTO
			 * @static
			 * @ios
			 * @readonly
			 * @since 3.1.3
			 */
			AUTO = 0,
			/**
			 * Layout direction is always left to right.
			 *
			 * @property {Number} FORCELEFTTORIGHT
			 * @static
			 * @ios
			 * @readonly
			 * @since 3.1.3
			 */
			FORCELEFTTORIGHT = 3,
			/**
			 * Layout direction is always right to left.
			 *
			 * @property {Number} FORCERIGHTTOLEFT
			 * @static
			 * @ios
			 * @readonly
			 * @since 3.1.3
			 */
			FORCERIGHTTOLEFT = 4
		}
	}
}