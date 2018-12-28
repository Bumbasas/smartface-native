const Color = require("sf-core/ui/color");

/**
 * @class UI.QuickLook
 * @since 0.1
 *
 * Quick Look lets people preview Keynote, Numbers, Pages, and PDF documents,
 * as well as images and other types of files, even if your app doesn't support those file formats.
 * For further information: https://developer.apple.com/ios/human-interface-guidelines/features/quick-look/
 * This class works only for IOS.
 *
 *     @example
 *     const QuickLook = require('sf-core/ui/quicklook');
 *     var quickLook = new QuickLook();
 *     var testPDF = "assets://test.pdf";
 *     var testImage = "images://test.png";
 *     quickLook.document = [testPDF,testImage];
 *     quickLook.itemColor = Color.WHITE;
 *     quickLook.show(myPage);
 *
 */
function QuickLook(params) {}

/**
 * Gets/sets array of documents(paths) that will be shown on QuickLook.
 *
 *     @example
 *     const QuickLook = require('sf-core/ui/quicklook');
 *     var quicklook = new QuickLook();
 *     quicklook.document = ["images://.png","assests://.pdf"];
 *
 * @property {String[]} document
 * @ios
 * @since 0.1
 */
QuickLook.prototype.document = [];

/**
 * Gets/sets headerBar color of QuickLook View.
 *
 *     @example
 *     const QuickLook = require('sf-core/ui/quicklook');
 *     var quicklook = new QuickLook();
 *     quicklook.barColor = UI.Color.BLACK;
 *
 * @property {UI.Color} barColor
 * @removed
 * @ios
 * @since 0.1
 */
QuickLook.prototype.barColor = false;

/**
 * Gets/sets title color of QuickLook View.
 *
 *     @example
 *     const QuickLook = require('sf-core/ui/quicklook');
 *     var quicklook = new QuickLook();
 *     quicklook.titleColor = UI.Color.GREEN;
 *
 * @property {UI.Color} titleColor
 * @ios
 * @since 3.1.3
 */
QuickLook.prototype.titleColor = false;

/**
 * Gets/sets color of items on header & footer of QuickLook view.
 *
 *     @example
 *     const QuickLook = require('sf-core/ui/quicklook');
 *     var quicklook = new QuickLook();
 *     quicklook.itemColor = UI.Color.BLACK;
 *
 * @property {UI.Color} itemColor
 * @ios
 * @since 0.1
 */
QuickLook.prototype.itemColor = UI.Color.BLACK;

/**
 * Gets status bar object. This property is readonly, you can not set
 * status bar to a page but you can change properties of page's status bar.
 *
 * @property {UI.StatusBar} statusBar
 * @removed 4.0.0 Use {@link Application.statusBar} instead
 * @ios
 * @readonly
 * @since 0.1
 */
QuickLook.prototype.statusBar;

/**
 * This function shows QuickLook on the given UI.Page.
 *
 * @param {UI.Page} page This is the page that QuickLook will be shown.
 * @ios
 * @method show
 * @since 0.1
 */
QuickLook.prototype.show = function(Page) {};

module.exports = QuickLook;
