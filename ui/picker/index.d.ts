import Color from "../color";
import Font from "../font";
import View from "../view";

declare enum PickerEvents {
  /**
   * This event is called when scroll ends & an item is selected on a picker.
   *
   * @param {Number} index
   * @event onSelected
   * @android
   * @ios
   * @since 0.1
   */
  Selected = "selected"
}
declare namespace Picker {
  const Events: typeof PickerEvents & typeof View.Events
  type Events = typeof Events
}

/**
 * @class UI.Picker
 * @since 0.1
 *
 * Picker is a UIView that allows you to create a list which you can pick only one of them.
 * You can add Picker as a View to your layout. If you want to show Picker as a dialog,
 * you can call UI.Picker.show method.
 *
 *     @example
 *     const Picker = require("@smartface/native/ui/picker");
 *     var items = [
 *         "item 1",
 *         "item 2",
 *         "item 3",
 *         "item 4",
 *         "item 5"
 *     ];
 *     var myPicker = new Picker({
 *         items: items,
 *         currentIndex: 2
 *     });
 *
 *     var okCallback = function(params) {
 *         console.log('Selected index: ' + params.index);
 *     }
 *     var cancelCallback = function() {
 *         console.log('Canceled');
 *     }
 *     myPicker.show(okCallback,cancelCallback);
 */
declare class Picker extends View<PickerEvents> {
/**
 * Gets/sets items of the picker.
 *
 * @property {Array|String} items
 * @android
 * @ios
 * @since 0.1
 */
  items: string[];
/**
 * Gets/sets current index of the picker.
 *
 * @property {Number} currentIndex
 * @android
 * @ios
 * @since 0.1
 */
  currentIndex: number;
/**
 * Enables/disables the Picker.
 *
 * @since 1.1.8
 * @property {Boolean} [enabled = true]
 * @android
 */
  android: View['android'] & {
    enabled: boolean;
  }
  ios: View['ios'] & {
    /**
     * Gets/sets cancelHighlightedColor of the picker. This property only works with show method. Must set before show method.
     *
     * @property {UI.Color} cancelHighlightedColor
     * @ios
     * @since 3.1.1
     */
    cancelHighlightedColor: Color;
    /** 
     * Gets/sets okHighlightedColor of the picker. This property only works with show method. Must set before show method.
     *
     * @property {UI.Color} okHighlightedColor
     * @ios
     * @since 3.1.1
     */
    okHighlightedColor: Color;
    /**
     * Gets/sets dialogLineColor of Picker.
     *
     * @property {UI.Color} dialogLineColor
     * @ios
     * @since 4.2.3
     */
    dialogLineColor: Color;
  }
/**
 * Gets/sets textColor of Picker.
 *
 * @property {UI.Color} textColor
 * @android
 * @ios
 * @since 4.2.3
 */
textColor?: Color;
/**
 * Gets/sets dialogBackgroundColor of Picker.
 *
 * @property {UI.Color} dialogBackgroundColor
 * @android
 * @ios
 * @since 4.2.3
 */
dialogBackgroundColor: Color;
/**
 * This event is called when scroll ends & an item is selected on a picker.
 *
 * @param {Number} index
 * @event onSelected
 * @deprecated
 * @android
 * @ios
 * @since 0.1
 * @example
 * ````
 * import Picker from '@smartface/native/ui/picker';
 * 
 * const picker = new Picker();
 * picker.on(Picker.Events.Selected, (params) => {
 *  console.info('onSelected', params);
 * });
 * ````
 */
  onSelected: (index: number) => void;
/**
 * This function shows picker in a dialog.
 *
 * @param {Function} ok This event is called when user clicks ok button.
 * @param {Object} ok.param
 * @param {Number} ok.param.index
 * @param {Function} cancel This event is called when user clicks cancel button.
 * @method show
 * @android
 * @ios
 * @since 0.1
 */
  show(ok: (param: { index: number }) => void, cancel: () => void):void;
/**
 * Gets/sets title of the picker. This property only works with show method. Must set before show method.
 *
 * @property {String} title
 * @android
 * @ios
 * @since 3.1.1
 */
  title: string;
/**
 * Gets/sets titleColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} titleColor
 * @android
 * @ios
 * @since 3.1.1
 */
  titleColor: Color;
/**
 * Gets/sets titleFont of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Font} titleFont
 * @android
 * @ios
 * @since 3.1.1
 */
  titleFont: Font;
/**
 * Gets/sets cancelColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} cancelColor
 * @android
 * @ios
 * @since 3.1.1
 */
  cancelColor: Color;
/**
 * Gets/sets cancelFont of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Font} cancelFont
 * @android
 * @ios
 * @since 3.1.1
 */
  cancelFont: Font;
/**
 * Gets/sets cancelText of the picker. This property only works with show method. Must set before show method.
 *
 * @property {String} cancelText
 * @android
 * @ios
 * @since 3.1.3
 */
  cancelText: string;
/**
 * Gets/sets okColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} okColor
 * @android
 * @ios
 * @since 3.1.1
 */
  okColor: Color;
/**
 * Gets/sets okText of the picker. This property only works with show method. Must set before show method.
 *
 * @property {String} okText
 * @android
 * @ios
 * @since 3.1.3
 */
  okText: string;
/**
 * Gets/sets okFont of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Font} okFont
 * @android
 * @ios
 * @since 3.1.1
 */
  okFont: Font;
}
export = Picker;
