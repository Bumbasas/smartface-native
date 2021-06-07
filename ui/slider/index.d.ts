import Color from "../color";
import Image from "../image";
import View from "../view";
/**
 * @class UI.Slider
 * @since 0.1
 * @extends UI.View
 *
 * Slider can be used to select a value from a range of values by moving the slider thumb along the track.
 *
 *     @example
 *     var Color = require('sf-core/ui/color');
 *     const Slider = require('sf-core/ui/slider');
 *     var mySlider = new Slider({
 *         width: 200,
 *         maxValue: 100,
 *         minValue: 0,
 *         value: 40,
 *         minTrackColor: Color.RED,
 *         thumbColor: Color.BLUE,
 *         onValueChange: function() {
 *             console.log("Slider's value: " + mySlider.value);
 *         }
 *     });
 *
 */
declare class Slider extends View {
/**
 * Gets/sets color of the thumb.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var Color = require('sf-core/ui/color');
 *     var mySlider = new Slider();
 *     mySlider.thumbColor = Color.GRAY;
 *
 * @property {UI.Color} [thumbColor = UI.Color.GRAY]
 * @android
 * @ios
 * @since 0.1
 */
  thumbColor: Color;
/**
 * Gets/sets image of the thumb.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var mySlider = new Slider();
 *     mySlider.thumbImage = Image.createFromFile("images://smartface.png");
 *
 * @property {UI.Image} thumbImage
 * @android
 * @ios
 * @since 0.1
 */
  thumbImage: Image;
/**
 * Gets/sets color of the thumb's minimum track color.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var Color = require('sf-core/ui/color');
 *     var mySlider = new Slider();
 *     mySlider.minTrackColor = Color.BLUE;
 *
 * @property {UI.Color} [minTrackColor = UI.Color.DARKGRAY]
 * @android
 * @ios
 * @since 0.1
 */
  minTrackColor: Color;
/**
 * Gets/sets color of the thumb's maximum track color.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var Color = require('sf-core/ui/color');
 *     var mySlider = new Slider();
 *     mySlider.maxTrackColor = Color.GREEN;
 *
 * @property {UI.Color} [maxTrackColor = UI.Color.GREEN]
 * @android
 * @ios
 * @since 0.1
 */
  maxTrackColor: Color;
/**
 * Gets/sets value of the slider. This value should be less or equals to maxValue,
 * greater or equals to minValue.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var mySlider = new Slider();
 *     mySlider.value = 30;
 *
 * @property {Number} [value = 0]
 * @android
 * @ios
 * @since 0.1
 */
  value: number;
/**
 * Gets/sets minimum value of the slider.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var mySlider = new Slider();
 *     mySlider.minValue = 0;
 *
 * @property {Number} [minValue = 0]
 * @android
 * @ios
 * @since 0.1
 */
  minValue: number;
/**
 * Gets/sets maximum value of the slider.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var mySlider = new Slider();
 *     mySlider.maxValue = 100;
 *
 * @property {Number} [maxValue = 100]
 * @android
 * @ios
 * @since 0.1
 */
  maxValue: number;
/**
 * Enables/disables the slider.
 *
 * @since 1.1.8
 * @property {Boolean} [enabled = true]
 * @android
 * @ios
 */
  enabled: boolean;
/**
 * This event is called when slider value changes.
 *
 *     @example
 *     const Slider = require('sf-core/ui/slider');
 *     var mySlider = new Slider();
 *     mySlider.onValueChange = valueChanged;
 *     mySlider.value = 40;
 *
 *     function valueChanged() {
 *         console.log("New value is: " + mySlider.value);
 *     }
 *
 * @event onValueChange
 * @android
 * @ios
 * @since 0.1
 */
  onValueChange: () => void;
}
export = Slider;
