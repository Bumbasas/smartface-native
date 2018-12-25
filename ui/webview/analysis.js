/**
 * @class UI.WebView
 * @since 0.1
 * @extends UI.View
 * 
 * WebView shows web pages and displays custom html code. 
 * It also holds some of the common functionalities of browsers like refresh, go back and etc.
 * 
 *     @example
 *     const WebView = require('sf-core/ui/webview');
 *     const Flex = require('sf-core/ui/flexlayout')
 * 
 *     var myWebView = new WebView({
 *         left:10, top:10, right:10, bottom:10,
 *         positionType: Flex.PositionType.ABSOLUTE,
 *         onChangedURL: function(event) {
 *             console.log("Event Change URL: " + event.url);
 *         },
 *         onError: function(event) {
 *             console.log("Event Error : " + event.message + ", URL: " + event.url);
 *         },
 *         onLoad: function(event) {
 *             console.log("Event Load: " + event.url);
 *         },
 *         onShow: function(event) {
 *             console.log("Event Show: " + event.url);
 *         }
 *     });
 *     page.layout.addChild(myWebView);
 *     myWebView.loadURL('https://www.google.com');
 * 
 */
function WebView(params) {}

/**
 * Indicates whether the links clicked on the webview will be rendered inside the webview or not. 
 * Otherwise, the default browser of the device will handle that link.
 *
 * @property {Boolean} openLinkInside
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.openLinkInside = true;

/**
 * Sets/Gets the visibility of scrollbar.
 *
 * @property {Boolean} scrollEnabled
 * @android
 * @ios
 * @since 1.1.16
 */
WebView.prototype.scrollEnabled = true;

/**
 * Sets/Gets the visibility of scrollbar.
 *
 * @property {Boolean} scrollBarEnabled
 * @android
 * @ios
 * @since 1.1.12
 */
WebView.prototype.scrollBarEnabled = true;

/**
 * Gets/sets over-scroll mode for this view.
 *
 * @property {UI.Android.OverScrollMode} [overScrollMode = UI.Android.OverScrollMode.ALWAYS]
 * @android
 * @since 3.2.1
 */
WebView.prototype.overScrollMode = UI.Android.OverScrollMode.ALWAYS;

/**
 * Sets/Gets the bounce effect when scrolling.
 *
 * @property {Boolean} bounceEnabled
 * @deprecated 3.2.1 Use {@link UI.WebView#bounces} for iOS or Use {@link UI.WebView#overScrollMode} for Android.
 * @android
 * @ios
 * @since 1.1.12
 */
WebView.prototype.bounceEnabled = true;

/**
 * Sets/Gets the bounce effect when scrolling.
 *
 * @property {Boolean} bounces
 * @ios
 * @since 3.2.1
 */
WebView.prototype.bounces = true;

/**
 * Sets/Gets the current page which is contain webview.
 *
 * @property {UI.Page} page
 * @android
 * @since 2.0.10
 */
WebView.prototype.page = undefined;

/**
 * Reloads the current page.
 *
 * @method refresh
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.refresh = function() {};

/**
 * Goes back to the previous web page.
 *
 * @method goBack
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.goBack = function() {};

/**
 * Goes back to the next web page if there is any.
 *
 * @method goForward
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.goForward = function() {};

/**
 * Enables zoom on the web page with gestures.
 *
 * @property {Boolean} zoomEnabled
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.zoomEnabled = true;

/**
 * Loads the web page provided via the url.
 *
 * @method loadURL
 * @param {String} url
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.loadURL =  function(url) {};

/**
 * Loads the web page provided via html code.
 *
 * @method loadHTML
 * @param {String} htmlText
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.loadHTML = function(htmlText) {};

/**
 * Loads the web page provided via {@link IO.File}. You can load complete web page with 
 * this method by passing index.html as a file.
 *
 * @method loadFile
 * @param {IO.File} file
 * @android
 * @ios
 * @since 1.1.16
 */
WebView.prototype.loadFile = function(file) {};

/**
 * Runs a javascript code. Return value must be inside a function.
 * 
 *     @example
 *     const WebView = require('sf-core/ui/webview');
 *     const Flex = require('sf-core/ui/flexlayout');
 *     
 *     var myScript = `
 *         function doSomething() {
 *             return "value";
 *         }
 *         doSomething();
 *     `;
 * 
 *     var myWebView = new WebView({
 *         left:10, top:10, right:10, bottom:10,
 *         positionType: Flex.PositionType.ABSOLUTE
 *         onShow: function(event) {
 *             myWebView.evaluateJS(myScript, function(value) {
 *                 console.log("Result " + value);
 *             });
 *         }
 *     });
 *     page.layout.addChild(myWebView);
 *     myWebView.loadURL('https://www.google.com');
 *
 * @method evaluateJS
 * @param {String} javascript
 * @param {Function} onReceive
 * @param {String} onReceive.value
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.evaluateJS = function(javascript,onReceive) {};

/**
 * Callback triggered when the url is changed. If it returns false, cannot navigate to the url.
 *
 * @event onChangedURL
 * @param {Object} event
 * @param {String} event.url
 * @return {Boolean}
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.onChangedURL = function(event) {};

/**
 * This event will be triggered when user clicks back button on the Device. WebView is focusable view. When it gains focus, this
 * event begin to trigger. The purpose of using this event might be
 * navigating back to pervious web pages.
 *
 * @event onBackButtonPressed
 * @android
 * @since 3.2.1
 */
WebView.prototype.onBackButtonPressed = function (){};

/**
 * Callback triggered when the web page is loaded.
 *
 * @event onLoad
 * @param {Object} event
 * @param {String} event.url
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.onLoad = function(event) {};

/**
 * Callback triggered when an error occured while loading a web page.
 *
 * @event onError
 * @param {Object} event
 * @param {String} event.url
 * @param {Number} event.code
 * @param {String} event.message
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.onError = function(event) {};

/**
 * Callback triggered when a web page is loaded and displayed on the webview.
 *
 * @event onShow
 * @param {Object} event
 * @param {String} event.url
 * @android
 * @ios
 * @since 0.1
 */
WebView.prototype.onShow = function(event) {};

/**
 * Clears the resource cache.
 *
 * @method clearCache
 * @param {Boolean} deleteDiskFiles
 * @android
 * @ios
 * @since 2.0.7
 */
WebView.prototype.clearCache = function(deleteDiskFiles) {};

/**
 * Removes the autocomplete popup from the currently focused form field, if present.
 *
 * @method clearFormData
 * @android
 * @since 2.0.7
 */
WebView.prototype.clearFormData = function() {};

/**
 * Tells this WebView to clear its internal back/forward list.
 *
 * @method clearHistory
 * @android
 * @since 2.0.7
 */
WebView.prototype.clearHistory = function() {};

/**
 * This event is triggered more than once to get safeAreaInsets.
 *
 * @event safeAreaInsets
 * @param {Object} systemSafeAreaInsets
 * @param {Number} systemSafeAreaInsets.top
 * @param {Number} systemSafeAreaInsets.bottom
 * @param {Number} systemSafeAreaInsets.right
 * @param {Number} systemSafeAreaInsets.left
 * @return {Object} safeAreaInsets
 * @return {Number} return.top
 * @return {Number} return.bottom
 * @return {Number} return.right
 * @return {Number} return.left
 * @ios
 * @since 3.2.1
 */
WebView.prototype.safeAreaInsets = function(systemSafeAreaInsets) {};

/**
 * Tells this WebView to clear its Cookie.
 *
 * @method clearCookie
 * @android
 * @ios
 * @since 2.0.7
 */
WebView.prototype.clearCookie = function() {};

/**
 * This method clear all data from webview.
 *
 * @method clearAllData
 * @android
 * @ios
 * @since 2.0.7
 */
WebView.prototype.clearAllData = function() {};

/**
 * The behavior for determining the adjusted content offsets.
 *
 * @property {UI.iOS.ContentInsetAdjustment} [contentInsetAdjustmentBehavior = UI.iOS.ContentInsetAdjustment.NEVER]
 * @ios
 * @since 4.0.0
 */
WebView.prototype.contentInsetAdjustmentBehavior = UI.iOS.ContentInsetAdjustment.NEVER;

module.exports = WebView;