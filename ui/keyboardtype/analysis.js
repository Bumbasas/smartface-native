/**
 * @enum {Number} UI.KeyboardType
 * @static
 * @since 0.1
 *
 * KeyboardType is an enum. When user focused on the TextBox or TextArea keyboard appears 
 * with different layouts based on the KeyboardType such as number, email etc. Text based 
 * fields like TextBox or TextArea have different behaviors based on KeyboardType in iOS 
 * and Android. Android forces user to input data matched with KeyboardType but iOS doesn't.
 * For example with KeyboardType.DECIMAL user can't enter 5.1.1 for Android because it's not 
 * a decimal number but can enter this number for iOS.
 *  
 * Keyboard types will cause differences between iOS and Android due to native differences.
 *
 *     @example
 *     const TextBox = require('sf-core/ui/textbox');
 *     const KeyboardType = require('sf-core/ui/keyboardtype');
 *     var myTextBox = new TextBox({
 *         height: 75, 
 *         width: 100,
 *         hint: 'Smartface Hint',
 *         keyboardType: KeyboardType.NUMBER,
 *         isPassword: true
 *     });
 *
 */

var KeyboardType = {};
KeyboardType.ios = {};
KeyboardType.android = {};

/**
 * @property {Number} DEFAULT
 * Default keyboard appearance.
 * @static
 * @android
 * @ios
 * @readonly
 * @since 0.1
 */
KeyboardType.DEFAULT = 0;

/**
 * @property {Number} NUMBER
 * Numeric specific keyboard appearance.
 * @static
 * @android
 * @ios
 * @readonly
 * @since 0.1
 */
KeyboardType.NUMBER = 1;

/**
 * @property {Number} DECIMAL
 * Decimal specific keyboard appearance.
 * @static
 * @android
 * @ios
 * @since 0.1
 * @readonly
 */
KeyboardType.DECIMAL = 2;

/**
 * @property {Number} PHONE
 * Phone number specific keyboard appearance.
 * @static
 * @android
 * @ios
 * @since 0.1
 * @readonly
 */
KeyboardType.PHONE = 3;

/**
 * @property {Number} URL
 * URL address specific keyboard appearance
 * @static
 * @android
 * @ios
 * @since 0.1
 * @readonly
 */
KeyboardType.URL = 4;

/**
 * @property {Number} TWITTER
 * Twitter specific keyboard appearance. This keyboard type works only for iOS.
 * @static
 * @ios
 * @readonly
 * @since 0.1
 * @deprecated 3.2.0 {@link UI.KeyboardType.iOS.TWITTER} instead.
 */
KeyboardType.ios.TWITTER = 5;

/**
 * @property {Number} WEBSEARCH
 * Web search specific keyboard appearance. This keyboard type works only for iOS.
 * @static
 * @ios
 * @readonly
 * @since 0.1
 * @deprecated 3.2.0 {@link UI.KeyboardType.iOS.WEBSEARCH} instead.
 */
KeyboardType.ios.WEBSEARCH = 6;

/**
 * @property {Number} DATETIME
 * Date and time specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @readonly
 * @since 0.1
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.DATETIME} instead.
 */
KeyboardType.android.DATETIME = 7;

/**
 * @property {Number} SIGNEDNUMBER
 * Signed number specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.SIGNEDNUMBER} instead.
 */
KeyboardType.android.SIGNEDNUMBER = 8;

/**
 * @property {Number} SIGNEDDECIMAL
 * Signed decimal specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.SIGNEDDECIMAL} instead.
 */
KeyboardType.android.SIGNEDDECIMAL = 9;

/**
 * @property {Number} TEXTAUTOCOMPLETE
 * Auto complete text specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTAUTOCOMPLETE} instead.
 */
KeyboardType.android.TEXTAUTOCOMPLETE = 10;

/**
 * @property {Number} TEXTAUTOCORRECT
 * Auto correct text specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTAUTOCORRECT} instead.
 */
KeyboardType.android.TEXTAUTOCORRECT = 11;

/**
 * @property {Number} TEXTCAPCHARACTERS
 * Auto capitalized characters specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTCAPCHARACTERS} instead.
 */
KeyboardType.android.TEXTCAPCHARACTERS = 12;

/**
 * @property {Number} TEXTCAPSENTENCES
 * Auto capitalized sentences specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTCAPSENTENCES} instead.
 */
KeyboardType.android.TEXTCAPSENTENCES = 13;

/**
 * @property {Number} TEXTCAPWORDS
 * Auto capitalized word specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTCAPWORDS} instead.
 */
KeyboardType.android.TEXTCAPWORDS = 14;

/**
 * @property {Number} TEXTEMAILSUBJECT
 * Email subject specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTEMAILSUBJECT} instead.
 */
KeyboardType.android.TEXTEMAILSUBJECT = 15;

/**
 * @property {Number} TEXTLONGMESSAGE
 * Long message specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTLONGMESSAGE} instead.
 */
KeyboardType.android.TEXTLONGMESSAGE = 16;

/**
 * @property {Number} TEXTNOSUGGESTIONS
 * Text with no suggestion keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTNOSUGGESTIONS} instead.
 */
KeyboardType.android.TEXTNOSUGGESTIONS = 17;

/**
 * @property {Number} TEXTPERSONNAME
 * Person name specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTPERSONNAME} instead.
 */
KeyboardType.android.TEXTPERSONNAME = 18;

/**
 * @property {Number} TEXTSHORTMESSAGE
 * Short message specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TEXTSHORTMESSAGE} instead.
 */
KeyboardType.android.TEXTSHORTMESSAGE = 19;

/**
 * @property {Number} TIME
 * Time specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 0.1
 * @readonly
 * @deprecated 3.2.0 {@link UI.KeyboardType.Android.TIME} instead.
 */
KeyboardType.android.TIME = 20;

/**
 * @property {Number} EMAILADDRESS
 * Email address specific keyboard appearance.
 * @static
 * @android
 * @ios
 * @since 0.1
 * @readonly
 */
KeyboardType.EMAILADDRESS = 21;


/** 
 * @enum UI.KeyboardType.Android 
 * @since 3.2.0
 * 
 * These are android specific enums.
 */
KeyboardType.Android = {};


/**
 * @property {Number} DATETIME
 * Date and time specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @readonly
 * @since 3.2.1
 */
KeyboardType.Android.DATETIME = 7;

/**
 * @property {Number} SIGNEDNUMBER
 * Signed number specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.SIGNEDNUMBER = 8;

/**
 * @property {Number} SIGNEDDECIMAL
 * Signed decimal specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.SIGNEDDECIMAL = 9;

/**
 * @property {Number} TEXTAUTOCOMPLETE
 * Auto complete text specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTAUTOCOMPLETE = 10;

/**
 * @property {Number} TEXTAUTOCORRECT
 * Auto correct text specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTAUTOCORRECT = 11;

/**
 * @property {Number} TEXTCAPCHARACTERS
 * Auto capitalized characters specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTCAPCHARACTERS = 12;

/**
 * @property {Number} TEXTCAPSENTENCES
 * Auto capitalized sentences specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTCAPSENTENCES = 13;

/**
 * @property {Number} TEXTCAPWORDS
 * Auto capitalized word specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTCAPWORDS = 14;

/**
 * @property {Number} TEXTEMAILSUBJECT
 * Email subject specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTEMAILSUBJECT = 15;

/**
 * @property {Number} TEXTLONGMESSAGE
 * Long message specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTLONGMESSAGE = 16;

/**
 * @property {Number} TEXTNOSUGGESTIONS
 * Text with no suggestion keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTNOSUGGESTIONS = 17;

/**
 * @property {Number} TEXTPERSONNAME
 * Person name specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTPERSONNAME = 18;

/**
 * @property {Number} TEXTSHORTMESSAGE
 * Short message specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TEXTSHORTMESSAGE = 19;

/**
 * @property {Number} TIME
 * Time specific keyboard appearance. This keyboard type works only for Android.
 * @static
 * @android
 * @since 3.2.1
 * @readonly
 */
KeyboardType.Android.TIME = 20;


/** 
 * @enum UI.KeyboardType.iOS 
 * @since 3.2.0
 * 
 * These are ios specific enums.
 */
KeyboardType.iOS = {};


/**
 * @property {Number} TWITTER
 * Twitter specific keyboard appearance. This keyboard type works only for iOS.
 * @static
 * @ios
 * @readonly
 * @since 3.2.1
 */
KeyboardType.iOS.TWITTER = 5;

/**
 * @property {Number} WEBSEARCH
 * Web search specific keyboard appearance. This keyboard type works only for iOS.
 * @static
 * @ios
 * @readonly
 * @since 3.2.1
 */
KeyboardType.iOS.WEBSEARCH = 6;
