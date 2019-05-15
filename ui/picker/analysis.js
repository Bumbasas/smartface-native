/**
 * @class UI.Picker
 * @since 0.1
 *
 * Picker is a UIView that allows you to create a list which you can pick only one of them.
 * You can add Picker as a View to your layout. If you want to show Picker as a dialog,
 * you can call UI.Picker.show method.
 *
 *     @example
 *     const Picker = require("sf-core/ui/picker");
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
function Picker() {}

/**
 * Gets/sets items of the picker.
 *
 * @property {Array} items
 * @android
 * @ios
 * @since 0.1
 */
Picker.prototype.items = [];

/**
 * Enables/disables the Picker.
 *
 * @since 1.1.8
 * @property {Boolean} [enabled = true]
 * @android
 */
Picker.prototype.android = {};
Picker.prototype.android.enabled = true;

/**
 * Gets/sets current index of the picker.
 *
 * @property {Number} currentIndex
 * @android
 * @ios
 * @since 0.1
 */
Picker.prototype.currentIndex = 0;

/**
 * This event is called when scroll ends & an item is selected on a picker.
 *
 * @param {Number} index
 * @event onSelected
 * @android
 * @ios
 * @since 0.1
 */
Picker.prototype.onSelected = function onSelected(index) {};

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
Picker.prototype.show = function(ok, cancel) {};

/**
 * Gets/sets title of the picker. This property only works with show method. Must set before show method.
 *
 * @property {String} title
 * @android
 * @ios
 * @since 3.1.1
 */
Picker.prototype.title;

/**
 * Gets/sets titleColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} titleColor
 * @android
 * @ios
 * @since 3.1.1
 */
Picker.prototype.titleColor;

/**
 * Gets/sets titleFont of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Font} titleFont
 * @android
 * @ios
 * @since 3.1.1
 */
Picker.prototype.titleFont;

/**
 * Gets/sets cancelColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} cancelColor
 * @android
 * @ios
 * @since 3.1.1
 */
Picker.prototype.cancelColor;

/**
 * Gets/sets cancelHighlightedColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} cancelHighlightedColor
 * @ios
 * @since 3.1.1
 */
Picker.prototype.cancelHighlightedColor;

/**
 * Gets/sets cancelFont of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Font} cancelFont
 * @android
 * @ios
 * @since 3.1.1
 */
Picker.prototype.cancelFont;

/**
 * Gets/sets cancelText of the picker. This property only works with show method. Must set before show method.
 *
 * @property {String} cancelText
 * @android
 * @ios
 * @since 3.1.3
 */
Picker.prototype.cancelText;

/**
 * Gets/sets okColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} okColor
 * @android
 * @ios
 * @since 3.1.1
 */
Picker.prototype.okColor;

/**
 * Gets/sets okText of the picker. This property only works with show method. Must set before show method.
 *
 * @property {String} okText
 * @android
 * @ios
 * @since 3.1.3
 */
Picker.prototype.okText;

/**
 * Gets/sets okHighlightedColor of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Color} okHighlightedColor
 * @ios
 * @since 3.1.1
 */
Picker.prototype.okHighlightedColor;

/**
 * Gets/sets okFont of the picker. This property only works with show method. Must set before show method.
 *
 * @property {UI.Font} okFont
 * @android
 * @ios
 * @since 3.1.1
 */
Picker.prototype.okFont;

module.exports = Picker;