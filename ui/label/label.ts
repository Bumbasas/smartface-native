import TextDirection from '../android/textdirection';
import Color from '../color';
import EllipsizeMode from '../ellipsizemode';
import Font from '../font';
import TextAlignment from '../textalignment';
import IView, { AbstractView } from '../view/view';
import { ViewEvents } from '../view/view-event';

interface ILabelAndroid {
  /**
   * Gets/sets adjustable-font step granularity. It is used in conjunction with the minimum and maximum text size in order to build the set of text sizes the system uses to choose from when auto-sizing
   *
   * @android
   * @since 4.2.2
   */
  adjustableFontSizeStep: number;
  /**
   * Gets/sets the text direction.
   *
   * @property {UI.Android.TextDirection} textDirection
   * @android
   * @since 4.0.2
   */
  textDirection: TextDirection;
}

export declare interface ILabel<TEvent extends string = ViewEvents, TIOS = {}, TAND = ILabelAndroid> extends IView<TEvent, TIOS, TAND> {
  /**
   * Gets/sets font of a Label. When set to null label uses system font.
   * It is set to null by default.
   *
   *     @example
   *     import Label from '@smartface/native/ui/label';
   *     import Font from '@smartface/native/ui/font';
   *     const myLabel = new Label({
   *         text: "This is my label",
   *         visible: true
   *     });
   *     myLabel.font = Font.create("Arial", 16, Font.BOLD);
   *
   * @android
   * @ios
   * @since 0.1
   */
  font: Font;
  /**
   * Enables/disables multiple line property of a Label. If set to true
   * and the text is long enough, text will be shown in multiline. Setting multiline will override the {@link UI.Label#ellipsizeMode ellipsizeMode} prop.
   *
   * @default false
   * @android
   * @ios
   * @since 0.1
   * @deprecated 4.0.2 Use {@link UI.Label#maxLines maxLines} instead
   */
  multiline: boolean;
  /**
   * Sets the height of the Label to be at most maxLines tall. Setting 0 indicates that maxLines will be as much as given content.
   *
   * @android
   * @ios
   * @since 4.0.2
   */
  maxLines: number;
  /**
   * Causes words in the text that are longer than the view's width to be ellipsized instead of broken in the middle. If {@link UI.Label#maxLines maxLines} has been used to set two or more lines, only {@link UI.EllipsizeMode#END EllipsizeMode.END} is supported
   *
   * @property {UI.EllipsizeMode} ellipsizeMode
   * @android
   * @ios
   * @since 4.0.2
   */
  ellipsizeMode: EllipsizeMode;
  /**
   * Gets/sets text on Label.
   *
   * @property {String} [text = ""]
   * @android
   * @ios
   * @since 0.1
   */
  text: string;
  /**
   * Gets/sets text alignment of a Label. UI.TextAlignment constants
   * can be used. Label textAlignment property only supports UI.TextAlignment.MIDLEFT, UI.TextAlignment.MIDCENTER, UI.TextAlignment.MIDRIGHT.
   *
   *     @example
   *     const Label = require('@smartface/native/ui/label');
   *     const TextAlignment = require('@smartface/native/ui/textalignment');
   *     var myLabel = new Label();
   *     myLabel.textAlignment = TextAlignment.MIDCENTER;
   *
   * @property {UI.TextAlignment} [textAlignment = UI.TextAlignment.MIDLEFT]
   * @android
   * @ios
   * @since 0.1
   */
  textAlignment: TextAlignment;
  /**
   * Gets/sets text color of Label.
   *
   * @property {UI.Color} [textColor = UI.Color.BLACK]
   * @android
   * @ios
   * @since 0.1
   */
  textColor: Color | Record<string, Color>;

  /**
   * This property adjusts font size according to view's fixed width. The adjustment of font size happens according to {@link UI.Label#minimumFontSize minimumFontSize} , maximum font size (which is current label font size) & {@link UI.Label#adjustableFontSizeStep adjustableFontSizeStep}(just Android)
   *
   * @property {Boolean} [adjustFontSizeToFit = false]
   * @ios
   * @android
   * @since 4.2.2
   * @see {@link UI.Label#minimumFontSize minimumFontSize}
   * @see {@link UI.Label#adjustableFontSizeStep adjustableFontSizeStep}
   */
  adjustFontSizeToFit: boolean;

  /**
   * Gets/sets minimum font size of Label.
   *
   * @property {Number} [minimumFontSize = 1]
   * @ios
   * @android
   * @since 4.2.2
   */
  minimumFontSize: number;
}

export declare class AbstractLabel<TEvent extends string = ViewEvents> extends AbstractView<TEvent> implements ILabel<TEvent> {
  constructor(params?: Partial<AbstractLabel>);
  font: Font;
  multiline: boolean;
  maxLines: number;
  ellipsizeMode: EllipsizeMode;
  text: string;
  textAlignment: TextAlignment;
  textColor: Color | Record<string, Color>;
  adjustFontSizeToFit: boolean;
  minimumFontSize: number;
}
