declare class Color extends NativeComponent {
    isGradient?: any;
    colors?: Color[];
    direction: Color.GradientDirection;
}
/**
 * @class UI.Color
 * @since 0.1
 * Color is used to color UI objects and its elements. A Color instance is created by
 * passing RGB-ARGB values or hexadecimal string. There are constant and predefined colors as well.
 *
 *     @example
 *     const Color = require('@smartface/native/ui/color');
 *     var myRedColor = Color.create(255, 0, 0);
 *     var myBlueColorWithAlpha = Color.create(100, 0, 0, 255);
 *     var myHEXColor = Color.create("#FFAACC");
 */
declare namespace Color {
    /**
     * @enum UI.Color.GradientDirection
     *
     * This enumeration describes allowed direction types for gradient color.
     */
    enum GradientDirection {
        /**
         * Indicates gradient color will start from top point with startColor and
         * will end at bottom point with endColor.
         *
         * @property {UI.Color.GradientDirection} [VERTICAL = 0]
         * @android
         * @ios
         * @static
         * @readonly
         * @since 0.1
         */
        VERTICAL = 0,
        /**
         * Indicates gradient color will start from left point with startColor and
         * will end at right point with endColor.
         *
         * @property {UI.Color.GradientDirection} [HORIZONTAL = 1]
         * @android
         * @ios
         * @static
         * @readonly
         * @since 0.1
         */
        HORIZONTAL = 1,
        /**
         * Indicates gradient color will start from top-left point with startColor and
         * will end at bottom-right point with endColor.
         *
         * @property {UI.Color.GradientDirection} [DIAGONAL_LEFT = 2]
         * @android
         * @ios
         * @static
         * @readonly
         * @since 0.1
         */
        DIAGONAL_LEFT = 2,
        /**
         * Indicates gradient color will start from top-right point with startColor and
         * will end at bottom-left point with endColor.
         *
         * @property {UI.Color.GradientDirection} [DIAGONAL_RIGHT = 3]
         * @android
         * @ios
         * @static
         * @readonly
         * @since 0.1
         */
        DIAGONAL_RIGHT = 3
    }
    /**
     * @property {UI.Color} BLACK
     * @android
     * @ios
     * @since 0.1
     * @readonly
     * @static
     */
    const BLACK: Color;
    /**
     * @property {UI.Color} BLUE
     * @android
     * @ios
     * @since 0.1
     * @readonly
     * @static
     */
    const BLUE: Color;
    /**
     * @property {UI.Color} CYAN
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const CYAN: Color;
    /**
     * @property {UI.Color} DARKGRAY
     * @android
     * @ios
     * @since 0.1
     * @readonly
     * @static
     */
    const DARKGRAY: Color;
    /**
     * @property {UI.Color} GRAY
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const GRAY: Color;
    /**
     * @property {UI.Color} GREEN
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const GREEN: Color;
    /**
     * @property {UI.Color} LIGHTGRAY
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const LIGHTGRAY: Color;
    /**
     * @property {UI.Color} MAGENTA
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const MAGENTA: Color;
    /**
     * @property {UI.Color} RED
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const RED: Color;
    /**
     * @property {UI.Color} TRANSPARENT
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const TRANSPARENT: Color;
    /**
     * @property {UI.Color} YELLOW
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const YELLOW: Color;
    /**
     * @property {UI.Color} WHITE
     * @android
     * @ios
     * @readonly
     * @since 0.1
     * @static
     */
    const WHITE: Color;
    /**
     * Creates a new color with RGB-ARGB or hexadecimal parameters
     *
     *     @example
     *     const Color = require('@smartface/native/ui/color');
     *     var myARGBColor = Color.create(0, 0, 0, 255);
     *     var myRGBColor = Color.create(255, 255, 255);
     *     var myHexColor = Color.create("#ff0000");
     *
     * @param {Mixed} parameters RGB-ARGB sequence or Hexadecimal string
     * @return {UI.Color} A color instance.
     * @static
     * @method create
     * @android
     * @ios
     * @since 0.1
     */
    function create(
        alpha: number,
        red: number,
        green: number,
        blue: number
    ): Color;
    function create(red: number, green: number, blue: number): Color;
    function create(color: string): Color;
    /**
     * @method createGradient
     * @android
     * @ios
     *
     * Creates a gradient color that can be assigned to view's backgroundColor. You
     * can specify start-end colors and direction of gradient.
     *
     * @param {Object} params
     * @param {UI.Color.GradientDirection} params.direction Direction of gradient
     * @param {UI.Color} params.startColor Start color of gradient
     * @param {UI.Color} params.endColor End color of gradient
     * @static
     * @since 0.1
     */
    function createGradient(params: {
        direction: GradientDirection;
        startColor: Color;
        endColor: Color;
    }): Color;
    /**
     * Returns the red value of a color instance.
     *
     *     @example
     *     const Color = require('@smartface/native/ui/color');
     *     var myRGBColor = Color.create(99, 0, 0);
     *     var red = Color.red(myRGBColor);
     *     console.log("" + red);
     *
     * @param {UI.Color} color A color instance.
     * @return {Number} An integer between 0-255.
     * @static
     * @method red
     * @android
     * @ios
     * @since 0.1
     */
    function red(color: Color): number;
    /**
     * Returns the green value of a color instance.
     *
     *     @example
     *     const Color = require('@smartface/native/ui/color');
     *     var myRGBColor = Color.create(0, 171, 0);
     *     var green = Color.green(myRGBColor);
     *     console.log("" + green);
     *
     * @param {UI.Color} color A color instance.
     * @return {Number} An integer between 0-255.
     * @static
     * @method green
     * @android
     * @ios
     * @since 0.1
     */
    function green(color: Color): number;
    /**
     * Returns the blue value of a color instance.
     *
     *     @example
     *     const Color = require('@smartface/native/ui/color');
     *     var myRGBColor = Color.create(0, 0, 155);
     *     var blue = Color.blue(myRGBColor);
     *     console.log("" + blue);
     *
     * @param {UI.Color} color A color instance.
     * @return {Number} An integer between 0-255.
     * @static
     * @method blue
     * @android
     * @ios
     * @since 0.1
     */
    function blue(color: Color): number;

    /**
     * Returns the alpha value of a color instance.
     *
     *     @example
     *     const Color = require('@smartface/native/ui/color');
     *     var myARGBColor = Color.create(42, 0, 0, 255);
     *     var alpha = Color.alpha(myARGBColor);
     *     console.log(alpha);
     *
     * @param {UI.Color} color A color instance.
     * @return {Number} An integer between 0-100.
     * @static
     * @method alpha
     * @android
     * @ios
     * @since 0.1
     */
    function alpha(color: Color): number;
}

export = Color;
