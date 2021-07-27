/**
 * @class UI.Animator
 * @since 0.1
 * 
 * Animator is used to change the appearance of the UI objects with animation.
 *
 *     @example
 *     const Color      = require('@smartface/native/ui/color');
 *     const View       = require('@smartface/native/ui/view');
 *     const System     = require('@smartface/native/device/system');
 *     const Button     = require('@smartface/native/ui/button');
 *     const Animator   = require('@smartface/native/ui/animator');
 *     const FlexLayout = require('@smartface/native/ui/flexlayout');
 * 
 *     var myView = new View({
 *         left: 10, top: 10, right: 10, height: 100,
 *         positionType: FlexLayout.PositionType.ABSOLUTE,
 *         backgroundColor: Color.GREEN
 *     });
 *     var myButton = new Button({
 *         text: 'Animate',
 *         left: 10, top: 150, right: 10, height: 65,
 *         positionType: FlexLayout.PositionType.ABSOLUTE,
 *         backgroundColor: Color.GRAY,
 *         onPress: function() {
 *             myView.backgroundColor = Color.RED;
 *             var animationRootView = System.OS === "iOS" ? myPage.layout : myView.parent;
 *             Animator.animate(animationRootView, 5000, function() {
 *                 myView.left = 150;
 *                 myView.right = 150;
 *             }).then(2500, function() {
 *                 myView.left = 10;
 *                 myView.right = 10;
 *             }).complete(function() {
 *                 myView.backgroundColor = Color.GREEN;
 *             });
 *         }
 *     });
 *     myPage.layout.addChild(myView);		        
 *     myPage.layout.addChild(myButton);
 *
 */
function Animator() {}

/**
 * Performs the changes declared in animFunction with animation.
 * Duration indicates how long the animation will take in milliseconds.
 *
 * @method then
 * @param {Number} duration
 * @param {Function} animFunction
 * @return {UI.Animator}
 * @android
 * @ios
 * @since 0.1
 */
Animator.prototype.then = function(duration, animFunction) {
    // do stuff
    return new Animator();
};

/** 
 * Runs the function provided after all animations are completed.
 * Note that: It does not perform any animations.
 * 
 * @method complete
 * @param {Function} completeFunction
 * @android
 * @ios
 * @since 0.1
 */
Animator.prototype.complete = function(completeFunction) {
    // do stuff
};

/** 
 * Performs the changes declared in animFunction with animation inside the layout provided.
 * Duration indicates how long the animation will take in milliseconds. 
 * For animation rootLayout you should choose parent layout for Android, you can choose page 
 * layout for iOS as shown in example.
 * While animating Textbox, you may see the hint of the Textbox disappear on Android. 
 * This is related with Android internal issue (same reason of Google Issue Tracker 38303812, 37048478). For getting over from this problem you should 
 * set empty text to the Textbox onComplete callback of animation.
 * @method animate
 * @param {UI.ViewGroup} rootLayout
 * @param {Number} duration
 * @param {Function} animFunction
 * @return {UI.Animator}
 * @static
 * @android
 * @ios
 * @since 0.1
 */
Animator.animate = function(rootLayout, duration, animFunction) {
    // do stuff
    return new Animator();
};

module.exports = Animator;