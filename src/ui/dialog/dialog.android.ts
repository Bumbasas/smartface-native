import AndroidConfig from '../../util/Android/androidconfig';
import LayoutParams from '../../util/Android/layoutparams';
import SystemServices from '../../util/Android/systemservices';
import Color from '../color';
import FlexLayout from '../flexlayout';
import Screen from '../../device/screen';
import { AbstractDialog, DialogStyle, DEFAULT_TRANSLUCENCY } from './dialog';
import Application from '../../application';

const NativeDialog = requireClass('android.app.Dialog');
const NativeColorDrawable = requireClass('android.graphics.drawable.ColorDrawable');
const DialogInterface = requireClass('android.content.DialogInterface');

interface IDialogAndroid {
  hideKeyboard(): void;
  onShow(): void;
  cancelable: boolean;
  isTransparent: boolean;
  themeStyle: DialogStyle;
}

export default class DialogAndroid extends AbstractDialog {
  private _isTransparent: boolean;
  private _themeStyle: DialogStyle;
  private _layout: FlexLayout;
  private _onShowCallback: () => void;
  private _isSetListener: boolean;
  private _cancelable: boolean;
  skipDefaults: boolean;
  private dialogWindow: any;
  private colorDrawable: any;
  constructor(params: Partial<DialogAndroid> = {}) {
    super(params);
    this._layout = new FlexLayout({ backgroundColor: Color.TRANSPARENT });
    this.skipDefaults = params.skipDefaults || this._isTransparent;
    this.initDialogLayout();
  }
  createNativeObject(params: Partial<DialogAndroid> = {}) {
    this._themeStyle = params?.android?.themeStyle || DialogAndroid.Android.Style.ThemeDefault;
    this._isTransparent = params?.android?.isTransparent || false;

    return new NativeDialog(AndroidConfig.activity, this._themeStyle);
  }
  protected preConstruct(params?: Partial<Record<string, any>>): void {
    this.skipDefaults = false;
    this._cancelable = true;
    this._isSetListener = false;
    super.preConstruct(params);
    this.addAndroidProps(this.getAndroidProps());
  }
  setShowListener() {
    const listener = DialogInterface.OnShowListener.implement({
      onShow: () => this._onShowCallback?.()
    });
    this.nativeObject.setOnShowListener(listener);
    this._isSetListener = true;
  }

  private initDialogLayout() {
    this.dialogWindow = this.nativeObject.getWindow();
    const dialogAlpha = this.skipDefaults ? 0 : DEFAULT_TRANSLUCENCY;
    this.colorDrawable = new NativeColorDrawable(Color.create(dialogAlpha, 0, 0, 0).nativeObject);
    this.dialogWindow.setBackgroundDrawable(this.colorDrawable);

    if (!this.skipDefaults) {
      this.dialogWindow.setLayout(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
      this.nativeObject.requestWindowFeature(1); // View.Window.FEATURE_NO_TITLE
    } else {
      this.dialogWindow.setGravity(80);
      this.dialogWindow.setBackgroundDrawable(this.colorDrawable);
      const statusBarHeight = Application.statusBar.visible ? Application.statusBar.height : 0;
      const layoutHeight = Screen.height - statusBarHeight;
      if(statusBarHeight > 0) {
        this._layout.height = layoutHeight;
      }
      this.dialogWindow.setLayout(LayoutParams.MATCH_PARENT, statusBarHeight > 0 ? LayoutParams.WRAP_CONTENT : LayoutParams.MATCH_PARENT);
    }
    this.nativeObject.setContentView(this._layout.nativeObject);
  }

  private getAndroidProps() {
    const self = this;
    return {
      hideKeyboard(): void {
        if (!self.nativeObject) {
          return;
        }
        const windowToken = self.nativeObject.getWindow().getCurrentFocus().getWindowToken();
        const inputManager = AndroidConfig.getSystemService(SystemServices.INPUT_METHOD_SERVICE, SystemServices.INPUT_METHOD_MANAGER);
        inputManager.hideSoftInputFromWindow(windowToken, 0);
      },
      set onShow(value: IDialogAndroid['onShow']) {
        self._onShowCallback = value;
        if (!self._isSetListener) {
          self.setShowListener();
        }
      },
      get onShow() {
        return self._onShowCallback;
      },
      get cancelable() {
        return self._cancelable;
      },
      set cancelable(value: IDialogAndroid['cancelable']) {
        self._cancelable = value;
        self.nativeObject.setCancelable(value);
      },
      get isTransparent() {
        return self._isTransparent;
      },
      set isTransparent(value: IDialogAndroid['isTransparent']) {
        self._isTransparent = value;
      },
      get themeStyle() {
        return self._themeStyle;
      },
      set themeStyle(value: IDialogAndroid['themeStyle']) {
        self._themeStyle = value;
      }
    };
  }

  get layout() {
    return this._layout;
  }

  show() {
    this.nativeObject.show();
  }

  hide() {
    this.nativeObject.dismiss();
  }

  toString() {
    return 'Dialog';
  }

  static Android = {
    Style: DialogStyle
  };
}
