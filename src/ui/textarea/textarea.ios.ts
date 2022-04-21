import { ITextArea, TextareaiOSProps } from './textarea';
import ActionKeyType from '../shared/android/actionkeytype';
import KeyboardType from '../shared/keyboardtype';
import TextAlignment from '../shared/textalignment';
import TextBoxIOS from '../textbox/textbox.ios';
import { TextAreaEvents } from './textarea-events';

export default class TextAreaIOS<TEvent extends string = TextAreaEvents, TNative = __SF_UITextView, TProps extends ITextArea = ITextArea>
  extends TextBoxIOS<TEvent | TextAreaEvents, TNative, TProps>
  implements ITextArea<TEvent>
{
  private _bounces: boolean;
  private __hint: string;
  private _actionKeyType: ActionKeyType;
  private _keyboardType: KeyboardType;
  private _isPassword: boolean;
  private _adjustFontSizeToFit: boolean = false;
  private _minimumFontSize: number = 7;
  private __clearButtonEnabled: boolean;
  __createNativeObject__(): any {
    return new __SF_UITextView();
  }
  constructor(params?: Partial<TProps>) {
    super(params);

    this.addIOSProps(this.iosProps);
    this.ios.showScrollBar = false;
  }
  enabled?: boolean;

  get iosProps(): TextareaiOSProps {
    const self = this;
    return {
      get showScrollBar(): TextareaiOSProps['showScrollBar'] {
        return self.nativeObject.showsHorizontalScrollIndicator;
      },
      set showScrollBar(value: TextareaiOSProps['showScrollBar']) {
        self.nativeObject.showsHorizontalScrollIndicator = value;
        self.nativeObject.showsVerticalScrollIndicator = value;
      },
      get adjustFontSizeToFit(): TextareaiOSProps['adjustFontSizeToFit'] {
        return self._adjustFontSizeToFit;
      },
      set adjustFontSizeToFit(value: TextareaiOSProps['adjustFontSizeToFit']) {
        self._adjustFontSizeToFit = !!value;
      },
      get minimumFontSize(): TextareaiOSProps['minimumFontSize'] {
        return self._minimumFontSize;
      },
      set minimumFontSize(value: TextareaiOSProps['minimumFontSize']) {
        self._minimumFontSize = value;
      },
      get clearButtonEnabled(): boolean {
        return self.__clearButtonEnabled;
      },
      set clearButtonEnabled(value: TextareaiOSProps['clearButtonEnabled']) {
        self.__clearButtonEnabled = value;
      }
    };
  }

  get bounces(): boolean {
    return this._bounces;
  }
  set bounces(value: boolean) {
    this._bounces = value;
  }

  get textAlignment(): TextAlignment {
    return this.nativeObject.textAlignmentNumber;
  }
  set textAlignment(value: TextAlignment) {
    this.nativeObject.textAlignmentNumber = value;
  }

  get hint(): string {
    return this.__hint;
  }
  set hint(value: string) {
    this.__hint = value;
  }

  get actionKeyType(): ActionKeyType {
    return this._actionKeyType;
  }
  set actionKeyType(value: ActionKeyType) {
    this._actionKeyType = value;
  }

  get keyboardType(): KeyboardType {
    return this._keyboardType;
  }
  set keyboardType(value: KeyboardType) {
    this._keyboardType = value;
  }

  get isPassword(): boolean {
    return this._isPassword;
  }
  set isPassword(value: boolean) {
    this._isPassword = value;
  }
}
