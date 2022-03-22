import Accelerometer from '../device/accelerometer';
import Location from '../device/location';
import TypeUtil from '../util/type';
import AndroidConfig from '../util/Android/androidconfig';
import Http from '../net/http';
import Network from '../device/network';
import { EventEmitter } from '../core/eventemitter';
import { ApplicationEvents } from './application-events';
import SliderDrawer from '../ui/sliderdrawer';
import SliderDrawerAndroid from '../ui/sliderdrawer/sliderdrawer.android';
import StatusBar from './statusbar';
import NavigationBar from './android/navigationbar';
import { IBottomTabBar } from '../ui/bottomtabbar';
import { ApplicationAndroidPermissions, ApplicationBase, KeyboardMode } from './application';
import SystemServices from '../util/Android/systemservices';
import * as RequestCodes from '../util/Android/requestcodes';
import ViewController from '../util/Android/transition/viewcontroller';
import NativeEventEmitterComponent from '../core/native-event-emitter-component';
import PageAndroid from '../ui/page/page.android';
import Page from '../ui/page';

const NativeSpratAndroidActivity = requireClass('io.smartface.android.SpratAndroidActivity');
const NativeActivityLifeCycleListener = requireClass('io.smartface.android.listeners.ActivityLifeCycleListener');
const NativeAccessibilityServiceInfo = requireClass('android.accessibilityservice.AccessibilityServiceInfo');
const NativeContext = requireClass('android.content.Context');
const NativeIntent = requireClass('android.content.Intent');
const NativeUri = requireClass('android.net.Uri');
const NativeContextCompat = requireClass('androidx.core.content.ContextCompat');
const NativeTrafficStats = requireClass('android.net.TrafficStats');
const NativePreferenceManager = requireClass('android.preference.PreferenceManager');
const LocaleHelperUtil = requireClass('io.smartface.android.utils.LocaleConfigurationUtil');
const LocaleConfigurationUtil = requireClass('io.smartface.android.utils.LocaleConfigurationUtil');

const NativeR = requireClass(AndroidConfig.packageName + '.R');

const Permissions = {
  READ_CALENDAR: 'android.permission.READ_CALENDAR',
  WRITE_CALENDAR: 'android.permission.WRITE_CALENDAR',
  CAMERA: 'android.permission.CAMERA',
  READ_CONTACTS: 'android.permission.READ_CONTACTS',
  WRITE_CONTACTS: 'android.permission.WRITE_CONTACTS',
  GET_ACCOUNTS: 'android.permission.GET_ACCOUNTS',
  ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
  RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
  READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE',
  CALL_PHONE: 'android.permission.CALL_PHONE',
  READ_CALL_LOG: 'android.permission.READ_CALL_LOG',
  WRITE_CALL_LOG: 'android.permission.WRITE_CALL_LOG',
  ADD_VOICEMAIL: 'com.android.voicemail.permission.ADD_VOICEMAIL',
  USE_SIP: 'android.permission.USE_SIP',
  PROCESS_OUTGOING_CALLS: 'android.permission.PROCESS_OUTGOING_CALLS',
  BODY_SENSORS: 'android.permission.BODY_SENSORS',
  SEND_SMS: 'android.permission.SEND_SMS',
  RECEIVE_SMS: 'android.permission.RECEIVE_SMS',
  READ_SMS: 'android.permission.READ_SMS',
  RECEIVE_WAP_PUSH: 'android.permission.RECEIVE_WAP_PUSH',
  RECEIVE_MMS: 'android.permission.RECEIVE_MMS',
  READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
  WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
  USE_FINGERPRINT: 'android.permission.USE_FINGERPRINT',
  WRITE_APN_SETTINGS: 'android.permission.WRITE_APN_SETTINGS'
} as const;

//InputMethodManager to close softinput keyboard

// Intent.ACTION_VIEW
const ACTION_VIEW = 'android.intent.action.VIEW';
// Intent.FLAG_ACTIVITY_NEW_TASK
const FLAG_ACTIVITY_NEW_TASK = 268435456;
const REQUEST_CODE_CALL_APPLICATION = 114;
const FLAG_SECURE = 8192;

class ApplicationAndroid extends NativeEventEmitterComponent<ApplicationEvents, any, ApplicationBase> implements ApplicationBase {
  protected createNativeObject() {
    return {};
  }
  statusBar: typeof StatusBar = StatusBar;
  private _sliderDrawer: SliderDrawer;
  private _keepScreenAwake = false;
  private _onUnhandledError: ApplicationBase['onUnhandledError'];
  private _currentPage: PageAndroid;
  private _dispatchTouchEvent: ApplicationBase['android']['dispatchTouchEvent'];
  private __isSetOnItemSelectedListener: boolean;
  private _onReceivedNotification: ApplicationBase['onReceivedNotification'];
  private _keyboardMode: ApplicationBase['android']['keyboardMode'];
  private _secureWindowContent = false;
  private activity = AndroidConfig.activity;
  private spratAndroidActivityInstance = NativeSpratAndroidActivity.getInstance();
  __mDrawerLayout: any;
  readonly LayoutDirection = {
    LEFTTORIGHT: 0,
    RIGHTTOLEFT: 1
  } as const;
  static Events = ApplicationEvents;
  constructor() {
    super();

    Application.onApplicationCallReceived = (e) => {
      if (this.checkIsAppShortcut(e)) {
        this.onAppShortcutReceived?.(e);
        this.emit('appShortcutReceived', e);
      } else {
        this.onApplicationCallReceived?.(e);
        this.emit('applicationCallReceived', e);
      }
    };

    this._onReceivedNotification = (e) => {
      this.emit(ApplicationEvents.ReceivedNotification, e);
    };

    this.spratAndroidActivityInstance.attachBackPressedListener({
      onBackPressed: () => {
        this.android.onBackButtonPressed?.();
        this.emit('backButtonPressed');
      }
    });

    const mDrawerLayout = this.activity.findViewById(NativeR.id.layout_root);
    this.drawerLayout = mDrawerLayout;

    // Creating Activity Lifecycle listener
    const activityLifeCycleListener = NativeActivityLifeCycleListener.implement({
      onCreate: () => {},
      onResume: () => {
        this.onMaximize?.();
        this.emit('maximize');
      },
      onPause: () => {
        this.onMinimize?.();
        this.emit('minimize');
      },
      onStop: () => {},
      onStart: () => {},
      onDestroy: () => {
        this.cancelAllBackgroundJobs();
        this.onExit?.();
        this.emit('exit');
      },
      onRequestPermissionsResult: (requestCode, permission, grantResult) => {
        const permissionResults = {
          requestCode,
          result: grantResult === 0
        };
        this.android.onRequestPermissionsResult?.(permissionResults);
        this.emit('requestPermissionResult', permissionResults);
      },
      onActivityResult: (requestCode, resultCode, data) => {
        //TODO: check if this is correct
        if (requestCode === RequestCodes.Location.CHECK_SETTINGS_CODE) {
          Location.__onActivityResult?.(resultCode);
        }
      },
      dispatchTouchEvent: (actionType, x, y) => {
        const dispatchTouchEvent = this.android.dispatchTouchEvent?.();
        return typeof dispatchTouchEvent === 'boolean' ? dispatchTouchEvent : false;
      }
    });

    // Attaching Activity Lifecycle event
    this.spratAndroidActivityInstance.addActivityLifeCycleCallbacks(activityLifeCycleListener);
  }
  onExit: () => void;
  onApplicationCallReceived: (e: { data: { [key: string]: any } }) => void;
  onAppShortcutReceived: (e: { data: { [key: string]: any } }) => void;
  onMaximize: () => void;
  onMinimize: () => void;
  setAppTheme: (theme: string) => void;
  Events = ApplicationEvents;
  tabBar?: IBottomTabBar;

  attachSliderDrawer(sliderDrawer: SliderDrawerAndroid) {
    if (sliderDrawer) {
      sliderDrawer.__isAttached = true;
      const sliderDrawerId = sliderDrawer.layout.nativeObject.getId();
      const isExists = this.__mDrawerLayout.findViewById(sliderDrawerId);
      if (!isExists) {
        this.__mDrawerLayout.addView(sliderDrawer.layout.nativeObject);
        this.__mDrawerLayout.bringToFront();
        if (sliderDrawer.drawerListener) {
          this.__mDrawerLayout.addDrawerListener(sliderDrawer.drawerListener);
        }
      }
      sliderDrawer.onLoad?.();
    }
  }

  detachSliderDrawer(sliderDrawer: SliderDrawerAndroid) {
    if (sliderDrawer) {
      sliderDrawer.__isAttached = false;
      this.__mDrawerLayout.removeView(sliderDrawer.nativeObject);
      if (sliderDrawer.drawerListener) {
        this.__mDrawerLayout.removeDrawerListener(sliderDrawer.drawerListener);
      }
    }
  }
  call(params: Parameters<ApplicationBase['call']>['0']) {
    const _uriScheme = params.uriScheme;
    const _data = params.data || {};
    const _onSuccess = params.onSuccess;
    const _onFailure = params.onFailure;
    const _isShowChooser = params.isShowChooser;
    const _chooserTitle = params.chooserTitle;
    const _action = params.action || ACTION_VIEW;

    if (!TypeUtil.isString(_uriScheme)) {
      throw new TypeError('uriScheme must be string');
    }

    const intent = new NativeIntent(_action);
    let uriObject: any;

    if (TypeUtil.isObject(_data) && Object.keys(_data).length > 0) {
      // we should use intent.putExtra but it causes native crash.
      const dataStringified = Object.keys(_data)
        .map((k) => `${k}=${_data[k]}`)
        .join('&');

      if (_uriScheme.indexOf('|') !== -1) {
        this.configureIntent(intent, _uriScheme);
        uriObject = NativeUri.parse(dataStringified);
      } else {
        const uri = `${_uriScheme}?${dataStringified}}`;
        uriObject = NativeUri.parse(uri);
      }
    } else {
      if (_uriScheme.indexOf('|') !== -1) {
        this.configureIntent(intent, _uriScheme);
      } else {
        uriObject = NativeUri.parse(_uriScheme);
      }
    }
    uriObject && intent.setData(uriObject);
    if (TypeUtil.isBoolean(_isShowChooser)) {
      const title = TypeUtil.isString(_chooserTitle) ? _chooserTitle : 'Select and application';
      const chooserIntent = NativeIntent.createChooser(intent, title);
      try {
        this.activity.startActivity(chooserIntent); // Due to the AND-3202: we have changed startActivityForResult
      } catch (e) {
        _onFailure?.(e);
        return;
      }
    } else {
      try {
        this.activity.startActivity(intent); // Due to the AND-3202: we have changed startActivityForResult
      } catch (e) {
        _onFailure?.(e);
        return;
      }
    }
    _onSuccess?.();
  }
  canOpenUrl(url: string) {
    if (!url) {
      throw new Error("url parameter can't be empty.");
    }
    if (!TypeUtil.isString(url)) {
      throw new Error('url parameter must be string.');
    }
    const launchIntent = new NativeIntent(NativeIntent.ACTION_VIEW);
    launchIntent.setData(NativeUri.parse(url));
    const packageManager = AndroidConfig.activity.getApplicationContext().getPackageManager();
    const componentName = launchIntent.resolveActivity(packageManager);
    if (componentName === null) {
      return false;
    } else {
      const fallback = '{com.android.fallback/com.android.fallback.Fallback}';
      return !(fallback === componentName.toShortString());
    }
  }
  exit() {
    this.activity.finish();
  }
  restart() {
    this.spratAndroidActivityInstance.restartSpratActivity();
  }
  hideKeyboard() {
    const focusedView = this.activity.getCurrentFocus();
    if (!focusedView) return;
    const windowToken = focusedView.getWindowToken();
    const inputManager = AndroidConfig.getSystemService(SystemServices.INPUT_METHOD_SERVICE, SystemServices.INPUT_METHOD_MANAGER);
    inputManager.hideSoftInputFromWindow(windowToken, 0); //2.parameter: Provides additional operating flags. Currently may be 0
  }
  registOnItemSelectedListener() {
    if (this.__isSetOnItemSelectedListener) {
      return;
    }
    this.__isSetOnItemSelectedListener = true;
    this.spratAndroidActivityInstance.attachItemSelectedListener({
      onOptionsItemSelected: () => {
        const leftItem = this._currentPage?._headerBarLeftItem; //currentpage is undefined at start
        leftItem?.onPress?.();
      }
    });
  }
  // TODO: Beautify the class. It is too complex! It is not a readable file!
  setRootController(params) {
    ViewController.deactivateRootController(this.currentPage);
    // ViewController.activateController(params.controller);
    params.controller.__isActive = true;
    ViewController.setController(params);
  }
  get onUnhandledError() {
    return this._onUnhandledError;
  }
  set onUnhandledError(value) {
    this._onUnhandledError = value;
    Application.onUnhandledError = (e: Parameters<ApplicationBase['onUnhandledError']>['0']) => {
      this.emit('unhandledError', e);
      this._onUnhandledError?.(e);
    };
  }
  get currentPage() {
    return this._currentPage as unknown as Page;
  }
  set currentPage(value: Page) {
    this._currentPage = value as unknown as PageAndroid;
  }

  get drawerLayout() {
    return this.__mDrawerLayout;
  }
  set drawerLayout(value) {
    this.__mDrawerLayout = value;
  }
  get sliderDrawer() {
    return this._sliderDrawer as SliderDrawer;
  }
  set sliderDrawer(drawer) {
    if (drawer instanceof SliderDrawer) {
      this.detachSliderDrawer(this._sliderDrawer as unknown as SliderDrawerAndroid); //TODO: Fix as unknown problem
      this._sliderDrawer = drawer;
      this.attachSliderDrawer(this._sliderDrawer as unknown as SliderDrawerAndroid);
    } else {
      throw TypeError('Object must be SliderDrawer instance');
    }
  }
  get keepScreenAwake() {
    return this._keepScreenAwake;
  }
  set keepScreenAwake(value) {
    this._keepScreenAwake = value;
    if (this._keepScreenAwake) {
      // 128 = WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
      this.activity.getWindow().addFlags(128);
    } else {
      // 128 = WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
      this.activity.getWindow().clearFlags(128);
    }
  }
  get byteReceived() {
    const UID = this.activity.getApplicationInfo().uid;
    return NativeTrafficStats.getUidRxBytes(UID) / (1024 * 1024);
  }
  get byteSent() {
    const UID = this.activity.getApplicationInfo().uid;
    return NativeTrafficStats.getUidTxBytes(UID) / (1024 * 1024);
  }
  get currentReleaseChannel() {
    // For publish case, project.json file will be encrypted we can not decrypt this file, we do not have a key so let SMFApplication handle this
    return Application.currentReleaseChannel;
  }
  get smartfaceAppName() {
    // For publish case, project.json file will be encrypted we can not decrypt this file, we do not have a key so let SMFApplication handle this
    return Application.smartfaceAppName;
  }
  get appName() {
    // For publish case, project.json file will be encrypted we can not decrypt this file, we do not have a key so let SMFApplication handle this
    return Application.smartfaceAppName;
  }
  get version() {
    // For publish case, project.json file will be encrypted we can not decrypt this file, we do not have a key so let SMFApplication handle this
    return Application.version;
  }
  // events
  get onReceivedNotification() {
    return this._onReceivedNotification;
  }
  set onReceivedNotification(callback) {
    this._onReceivedNotification = (data: Parameters<ApplicationBase['onReceivedNotification']>['0']) => {
      callback?.(data);
      this.emit('receivedNotification', data);
    };
  }
  get isVoiceOverEnabled() {
    const context = AndroidConfig.activity;
    const accessibilityManager = context.getSystemService(NativeContext.ACCESSIBILITY_SERVICE);
    if (accessibilityManager !== null && accessibilityManager.isEnabled()) {
      const serviceInfoList = accessibilityManager.getEnabledAccessibilityServiceList(NativeAccessibilityServiceInfo.FEEDBACK_SPOKEN);
      if (!serviceInfoList.isEmpty()) return true;
    }
    return false;
  }
  get android(): ApplicationBase['android'] {
    const self = this;
    return {
      Permissions,
      packageName: self.activity.getPackageName(),
      get dispatchTouchEvent() {
        return self._dispatchTouchEvent;
      },
      set dispatchTouchEvent(callback) {
        self._dispatchTouchEvent = callback;
      },
      checkPermission(permission) {
        if (!TypeUtil.isString(permission)) {
          throw new Error('Permission must be Application.Permission type');
        }
        if (AndroidConfig.sdkVersion < AndroidConfig.SDK.SDK_MARSHMALLOW) {
          // PackageManager.PERMISSION_GRANTED
          return NativeContextCompat.checkSelfPermission(self.activity, permission) === 0;
        } else {
          const packageManager = self.activity.getPackageManager();
          // PackageManager.PERMISSION_GRANTED
          return packageManager.checkPermission(permission, self.android.packageName) === 0;
        }
      },
      // @todo requestPermissions should accept permission array too, but due to AND- it accepts just one permission.
      requestPermissions(requestCode, permissions) {
        if (!TypeUtil.isNumeric(requestCode) || !TypeUtil.isString(permissions)) {
          throw new Error('requestCode must be numeric or permission must be Application.Permission type or array of Application.Permission.');
        }
        if (AndroidConfig.sdkVersion < AndroidConfig.SDK.SDK_MARSHMALLOW) {
          self.android.onRequestPermissionsResult &&
            self.android.onRequestPermissionsResult({
              requestCode: requestCode,
              result: self.android.checkPermission?.(permissions) || false
            });
        } else {
          self.activity.requestPermissions(array([permissions], 'java.lang.String'), requestCode);
        }
      },
      shouldShowRequestPermissionRationale(permission) {
        if (!TypeUtil.isString(permission)) {
          throw new Error('Permission must be Application.Permission type');
        }
        return AndroidConfig.sdkVersion > AndroidConfig.SDK.SDK_MARSHMALLOW && self.activity.shouldShowRequestPermissionRationale(permission);
      },
      setAppTheme(currentTheme) {
        const sharedPreferences = NativePreferenceManager.getDefaultSharedPreferences(self.activity);
        const _themeRes = self.activity.getResources().getIdentifier(currentTheme, 'style', self.activity.getPackageName());
        sharedPreferences.edit().putInt('SFCurrentBaseTheme', _themeRes).commit();
      },
      get navigationBar() {
        return NavigationBar;
      },
      get keyboardMode() {
        return self._keyboardMode;
      },
      set keyboardMode(modeEnum) {
        if (typeof modeEnum !== 'number') return;
        self._keyboardMode = modeEnum;
        self.activity.getWindow().setSoftInputMode(modeEnum);
      },
      get locale() {
        return LocaleConfigurationUtil.getDeviceLanguage();
      },
      set locale(languageCode) {
        if (TypeUtil.isString(languageCode)) {
          const sharedPreferences = NativePreferenceManager.getDefaultSharedPreferences(self.activity);
          sharedPreferences.edit().putString('AppLocale', languageCode).commit();
          LocaleHelperUtil.changeConfigurationLocale(self.activity);
        }
      },
      get getLayoutDirection() {
        return self.activity.getResources().getConfiguration().getLayoutDirection();
      },
      get secureWindowContent() {
        return self._secureWindowContent;
      },
      set secureWindowContent(value) {
        self._secureWindowContent = value;
        if (self._secureWindowContent) self.activity.getWindow().setFlags(FLAG_SECURE, FLAG_SECURE);
        else self.activity.getWindow().clearFlags(FLAG_SECURE);
      }
    };
  }
  get Android() {
    return {
      NavigationBar: NavigationBar,
      KeyboardMode: KeyboardMode,
      Permissions: ApplicationAndroidPermissions
    };
  }
  get ios() {
    return {
      onUserActivityWithBrowsingWeb: () => false
    };
  }

  private configureIntent(intent: any, uriScheme: string) {
    const classActivityNameArray = uriScheme.split('|');
    intent.setClassName(classActivityNameArray[0], classActivityNameArray[1]);
  }
  private cancelAllBackgroundJobs() {
    Location.stop();
    Accelerometer.stop();
    Http.cancelAll();
    Network.cancelAll();
  }
  private checkIsAppShortcut(e: Record<string, any>) {
    return Object.prototype.hasOwnProperty.call(e?.data, 'AppShortcutType');
  }
}

const ApplicationInstance = new ApplicationAndroid();

export default ApplicationInstance;
