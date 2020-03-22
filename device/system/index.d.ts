export = System;
/**
 * @class Device.System
 * @since 0.1
 *
 * System provides operating system specific information of the device.
 *
 *     @example
 *     const System = require('sf-core/device/system');
 *     console.log("Device.System.OS: "                             + System.OS);
 *     console.log("Device.System.OSVersion: "                      + System.OSVersion);
 *     console.log("Device.System.android.apiLevel: "               + System.android.apiLevel);
 *     console.log("Device.System.batteryLevel: "                   + System.batteryLevel);
 *     console.log("Device.System.isBatteryCharged: "               + System.isBatteryCharged);
 *     console.log("Device.System.clipboard: "                      + System.clipboard);
 *     console.log("Device.System.language: "                       + System.language);
 *     console.log("Device.System.region: "                         + System.region);
 *     console.log("Device.System.android.isApplicationInstalled: " + System.android.isApplicationInstalled('io.smartface.SmartfaceApp'));
 *     console.log("Device.System.vibrate(): "                      + System.vibrate());
 *     console.log("Device.System.android.menuKeyAvaliable: "       + System.android.menuKeyAvaliable);
 *     console.log("Device.System.fingerPrintAvailable: "           + System.fingerPrintAvailable);
 *
 */
declare class System {
	/**
	 *
	 * Returns the device's current language set.
	 * @property {String} language
	 * @readonly
	 * @static
	 * @android
	 * @ios
	 * @since 0.1
	 */
	static language: string;
	/**
	 *
	 * Returns the device's current region.
	 * @property {String} region
	 * @readonly
	 * @static
	 * @android
	 * @ios
	 * @since 2.0.7
	 */
	static region: string;
	/**
	 *
	 * Returns the battery level of the device in percentage.
	 * @property {Number} batteryLevel
	 * @readonly
	 * @static
	 * @android
	 * @ios
	 * @since 0.1
	 */
	static batteryLevel: string;
	/**
	 *
	 * Indicates whether the device is charged or not.
	 * @property {Boolean} isBatteryCharged
	 * @readonly
	 * @android
	 * @ios
	 * @static
	 * @since 0.1
	 */
	static isBatteryCharged: boolean;
	/**
	 *
	 * Returns the operating system version of the device.
	 * @property {String} OSVersion
	 * @readonly
	 * @android
	 * @ios
	 * @static
	 * @since 0.1
	 */
	static OSVersion: string;
	/**
	 *
	 * Returns the type of biometric authentication supported by the device. Works on iOS 11.0+.
	 * @property {Device.System.LABiometryType} LAContextBiometricType
	 * @readonly
	 * @ios
	 * @static
	 * @since 3.0.2
	 */
	static LAContextBiometricType: System.LABiometryType;
	static android: {
		/**
		 *
		 * Returns the api level of the Android system.
		 * @property {Number} apiLevel
		 * @readonly
		 * @android
		 * @static
		 * @since 0.1
		 */
		apiLevel?: number;
		/**
		 *
		 * Indicates whether there is the menu key or not on the device.
		 * @property {Boolean} menuKeyAvaliable
		 * @readonly
		 * @static
		 * @android
		 * @since 0.1
		 */
		menuKeyAvaliable?: number;
		/**
		 * Returns the package version of an app on the device.
		 *
		 *     @example
		 *     System.android.getPackageVersion({
		 *         packageName: "io.smartface.SmartfaceApp",
		 *         onSuccess: function(versionName) {
		 *             console.log("App version name:" + versionName);
		 *         },
		 *         onError: function(error) {
		 *             console.log("Package doesn’t exist");
		 *         }
		 *     });
		 *
		 * @method getPackageVersion
		 * @param {String} packageName
		 * @param {Function} onSuccess
		 * @param {Function} onError
		 * @static
		 * @android
		 * @since 0.1
		 */
		getPackageVersion?(params: {
			packageName: string | null;
			onSuccess: (versionName: string) => void;
			onError: (error: ErrorType) => void;
		}): void;
	};
	static ios: {
		/**
		 * @deprecated
		 *
		 * Indicates whether finger print operations can be used or not.
		 * TouchID should be enabled to access fingerprint on iOS.
		 *
		 * @property {Boolean} fingerPrintAvaliable
		 * @readonly
		 * @ios
		 * @static
		 * @since 0.1
		 */
		fingerPrintAvaliable: boolean;
		/**
		 * @deprecated
		 *
		 * Checks if the provided finger print matches with the system's finger print.
		 * TouchID should be enabled to access fingerprint on iOS.
		 *
		 *     @example
		 *     System.ios.validateFingerPrint({
		 *            message : "Message",
		 *            onSuccess : function(){
		 *                  console.log("Success");
		 *            },
		 *            onError : function(){
		 *                  console.log("Error");
		 *            }
		 *      });
		 * @method validateFingerPrint
		 * @param {String} message
		 * @param {Function} onSuccess
		 * @param {Function} onError
		 * @static
		 * @ios
		 * @since 0.1
		 */
		validateFingerPrint(params: {
			message: string;
			onSuccess: () => void;
			onError: () => void;
		}): void;
	};
	/**
	 * Checks if the provided finger print matches with the system's finger print.
	 * Will be false if TouchID not enabled for iOS and user not enrolled at least one
	 * fingerprint for Android or hardware not supported by both of iOS and Android.
	 * Requires {@link Application.android.Permissions#USE_FINGERPRINT} permission on AndroidManifest.
	 * iOS only propery is deprecated.
	 *
	 *     @example
	 *     System.validateFingerPrint({
	 *            android: {
	 *                title: "Title"
	 *            },
	 *            message : "Message",
	 *            onSuccess : function(){
	 *                  console.log("Success");
	 *            },
	 *            onError : function(){
	 *                  console.log("Error");
	 *            }
	 *      });
	 * @method validateFingerPrint
	 * @param {String} message
	 * @param {Object} android
	 * @param {String} android.title
	 * @param {Function} onSuccess
	 * @param {Function} onError
	 * @static
	 * @ios
	 * @android
	 * @since 1.1.13
	 */
	static validateFingerPrint(params: {
		android: {
			title: string;
		};
		message: string;
		onSuccess: () => void;
		onError: () => void;
	}): void;
	/**
	 * Return value shows that if the device supports feature or not.
	 * Also it would be show that fingerprint (for Android) or
	 * TouchID (for iOS) is defined or not defined on the phone,
	 * You need to add {@link Application.android.Permissions#USE_FINGERPRINT}
	 * permission on AndroidManifest under config/Android when you publish project.
	 *
	 * @property {Boolean} fingerPrintAvailable
	 * @readonly
	 * @ios
	 * @android
	 * @static
	 * @since 1.1.13
	 */
	static fingerPrintAvailable: boolean;
	/**
	 * clipboard can be used to set a text to the device's clipboard or get a text from it.
	 *
	 * @property {String} clipboard
	 * @android
	 * @ios
	 * @static
	 * @since 0.1
	 */
	static clipboard: string;
	/**
	 * Vibrates the device for a while. iOS ignores given parameter.
	 *
	 * @method vibrate
	 * @param {Object} params
	 * @param {Number} params.millisecond
	 * @android
	 * @ios
	 * @static
	 * @since 0.1
	 */
	static vibrate(params: { millisecond: number }): void;
	/**
	 * Checks if an app is installed or not.
	 * @method isApplicationInstalled
	 * @param {String} packageName | schemaName
	 * @android
	 * @ios
	 * @static
	 * @since 0.1
	 */
	static isApplicationInstalled(packageName: string): void;
}

declare namespace System {
	const OS: OSType;

	/**
	 * @enum {String} Device.System.OSType
	 * @static
	 * @since 2.0.7
	 */
	enum OSType {
		/**
		 * @property {String} ANDROID
		 * @android
		 * @ios
		 * @static
		 * @readonly
		 * @since 2.0.7
		 */
		ANDROID = "Android",

		/**
		 * @property {String} IOS
		 * @android
		 * @ios
		 * @static
		 * @readonly
		 * @since 2.0.7
		 */
		IOS = "iOS"
	}
	/**
	 * @enum {Number} Device.System.LABiometryType
	 * @since 3.0.2
	 * @ios
	 *
	 * The set of available biometric authentication types. Works on iOS 11.0+.
	 *
	 */
	enum LABiometryType {
		/**
		 * No biometry type is supported. Works on iOS 11.0+.
		 *
		 * @property {Number} NONE
		 * @static
		 * @ios
		 * @readonly
		 * @since 3.0.2
		 */
		NONE = 0,
		/**
		 * The device supports Touch ID. Works on iOS 11.0+.
		 *
		 * @property {Number} TOUCHID
		 * @static
		 * @ios
		 * @readonly
		 * @since 3.0.2
		 */
		TOUCHID = 1,
		/**
		 * The device supports Face ID. Works on iOS 11.0+.
		 *
		 * @property {Number} FACEID
		 * @static
		 * @ios
		 * @readonly
		 * @since 3.0.2
		 */
		FACEID = 2
	}
}