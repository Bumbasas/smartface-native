import { IMaterialTextBox } from '.';
import Color from '../color';
import FlexLayout from '../flexlayout';
import Font from '../font';
import TextBoxIOS from '../textbox/textbox.ios';
import View from '../view';
import { MaterialTextBoxEvents } from './materialtextbox-events';

export default class MaterialTextBoxIOS<TEvent extends string = MaterialTextBoxEvents>
  extends TextBoxIOS<TEvent | MaterialTextBoxEvents, any, IMaterialTextBox>
  implements IMaterialTextBox
{
  private mdcTextInputControllerUnderline: __SF_MDCTextInputControllerUnderline;
  private _multiline: boolean;
  private _lineCount: number;
  private _rightLayout: { view: View; width: number; height?: number };
  private _rightLayoutMain: FlexLayout;
  private _labelsFont: Font;
  private _errorMessage: string;
  private __hint: string;
  private __hintTextColor: Color;
  private _onLeftViewRightPadding: number = 0;
  private _onRightViewLeftPadding: number = 0;
  private _leftLayout: { view: View; width: number; height?: number };
  private _leftLayoutMain: FlexLayout;
  private _onLeftViewRectForBounds: (bounds?: Object, defaultRect?: Object) => Object;
  private _onRightViewRectForBounds: (bounds?: Object, defaultRect?: Object) => Object;

  constructor(params: Partial<IMaterialTextBox> = {}) {
    super(params);

    this._multiline = params?.multiline || false;
    this._lineCount = params?.lineCount ? params.lineCount : 1;

    if (!this.nativeObject) {
      if (params && params.multiline) {
        this._nativeObject = new __SF_MDCMultilineTextField();
        this.mdcTextInputControllerUnderline = new __SF_MDCTextInputControllerUnderline(this.nativeObject);
        this.mdcTextInputControllerUnderline.expandsOnOverflow = false;
        this.mdcTextInputControllerUnderline.minimumLines = params.lineCount ? params.lineCount : 1;
      } else {
        this._nativeObject = new __SF_MDCTextField();
        this.mdcTextInputControllerUnderline = new __SF_MDCTextInputControllerUnderline(this.nativeObject);
      }
    }

    this.nativeObject.layer.masksToBounds = false;
    this.__hintTextColor = Color.create(199, 199, 205);

    this.addIOSProps(this.iosProps);
    this.ios.clearButtonEnabled = false;

    // const { ios, ...restParams } = params;
    // Object.assign(this._ios, this.iosProps, ios);
    // Object.assign(this, restParams);
  }

  get iosProps() {
    const self = this;
    return {
      get clearButtonColor(): Color {
        return self.mdcTextInputControllerUnderline.textInputClearButtonTintColor;
      },
      set clearButtonColor(value: Color) {
        self.mdcTextInputControllerUnderline.textInputClearButtonTintColor = value.nativeObject;
      },
      get underlineLabelsFont(): Font {
        return self.mdcTextInputControllerUnderline.trailingUnderlineLabelFont;
      },
      set underlineLabelsFont(value: Font) {
        self.mdcTextInputControllerUnderline.leadingUnderlineLabelFont = value;
        self.mdcTextInputControllerUnderline.trailingUnderlineLabelFont = value;
      },
      get inlineHintFont(): Font {
        return self.mdcTextInputControllerUnderline.inlinePlaceholderFont;
      },
      set inlineHintFont(value: Font) {
        self.mdcTextInputControllerUnderline.inlinePlaceholderFont = value;
      },
      get leftLayoutRightPadding(): number {
        return self._onLeftViewRightPadding;
      },
      set leftLayoutRightPadding(value: number) {
        self._onLeftViewRightPadding = value;
        self.mdcTextInputControllerUnderline.leadingViewTrailingPaddingConstantJS = value;
      },
      get rightLayoutLeftPadding(): number {
        return self._onRightViewLeftPadding;
      },
      set rightLayoutLeftPadding(value: number) {
        self._onRightViewLeftPadding = value;
        self.mdcTextInputControllerUnderline.trailingViewTrailingPaddingConstantJS = value;
      },
      get onLeftLayoutRectForBounds(): (bounds?: Object, defaultRect?: Object) => Object {
        return self._onLeftViewRectForBounds;
      },
      set onLeftLayoutRectForBounds(value: (bounds?: Object, defaultRect?: Object) => Object) {
        self._onLeftViewRectForBounds = value;
        self.mdcTextInputControllerUnderline.leadingViewRectForBounds = value;
      },
      get onRightLayoutRectForBounds(): (bounds?: Object, defaultRect?: Object) => Object {
        return self._onRightViewRectForBounds;
      },
      set onRightLayoutRectForBounds(value: (bounds?: Object, defaultRect?: Object) => Object) {
        self._onRightViewRectForBounds = value;
        self.mdcTextInputControllerUnderline.trailingViewRectForBounds = value;
      },
      get leftLayout(): { view: View; width: number; height?: number } {
        return self._leftLayout;
      },
      set leftLayout(value: { view: View; width: number; height?: number }) {
        if (self.multiline) {
          throw new Error('leftlayout cannot be used with multiline.');
        }

        self._leftLayout = value;
        if (value === undefined) {
          // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
          self.mdcTextInputControllerUnderline.textInput.setValueForKey(undefined, 'leadingView');
          self.mdcTextInputControllerUnderline.textInput.setValueForKey(0, 'leadingViewMode');
          // } else {
          //     self.nativeObject.setValueForKey(undefined, "leftView");
          //     self.nativeObject.setValueForKey(0, "leftViewMode");
          // }
          return;
        }

        if (!self._leftLayoutMain) {
          const flexMain = new FlexLayout();
          flexMain.nativeObject.yoga.isEnabled = false; // Bug : IOS-2714

          flexMain.nativeObject.translatesAutoresizingMaskIntoConstraints = false;
          flexMain.nativeObject.widthAnchor.constraintEqualToConstant(value.width ? value.width : 30).active = true;
          flexMain.nativeObject.heightAnchor.constraintEqualToConstant(value.height ? value.height : 30).active = true;

          const flexContent = new FlexLayout();
          flexContent.top = 0;
          flexContent.left = 0;
          flexContent.width = value.width ? value.width : 30;
          flexContent.height = value.height ? value.height : 30;
          flexMain.nativeObject.addFrameObserver();
          flexMain.nativeObject.frameObserveHandler = function (e) {
            flexContent.top = 0;
            flexContent.left = 0;
            flexContent.width = e.frame.width;
            flexContent.height = e.frame.height;
            flexContent.applyLayout();
          };
          flexMain.addChild(flexContent);
          // TODO: Ask why flexMain.content is implemented, it looks a bad idea.
          flexMain.content = flexContent;
          self._leftLayoutMain = flexMain;
        } else {
          const childs = self._leftLayoutMain.content.getChildList();
          for (const i in childs) {
            self._leftLayoutMain.content.removeChild(childs[i]);
          }
        }

        self._leftLayoutMain.content.addChild(value.view);
        self._leftLayoutMain.content.applyLayout();
        // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
        self.mdcTextInputControllerUnderline.textInput.setValueForKey(3, 'leadingViewMode');
        self.mdcTextInputControllerUnderline.textInput.setValueForKey(self._leftLayoutMain.nativeObject, 'leadingView');
        // } else {
        //     self.nativeObject.setValueForKey(3, "leftViewMode");
        //     self.nativeObject.setValueForKey(_rightLayoutMain.nativeObject, "leftView");
        // }
      },
      // TODO Old version has not this encapsulation.
      get normallineColor(): Color {
        return new Color({
          color: self.mdcTextInputControllerUnderline.normalColor
        });
      },
      set normallineColor(value: Color) {
        self.mdcTextInputControllerUnderline.normalColor = value.nativeObject;
      },
      get selectedLineColor(): Color {
        return new Color({
          color: self.mdcTextInputControllerUnderline.activeColor
        });
      },
      set selectedLineColor(value: Color) {
        self.mdcTextInputControllerUnderline.activeColor = value.nativeObject;
      },
      get lineHeight(): number {
        return self.mdcTextInputControllerUnderline.underlineHeightNormal;
      },
      set lineHeight(value: number) {
        self.mdcTextInputControllerUnderline.underlineHeightNormal = value;
      },
      get selectedLineHeight(): number {
        return self.mdcTextInputControllerUnderline.underlineHeightActive;
      },
      set selectedLineHeight(value: number) {
        self.mdcTextInputControllerUnderline.underlineHeightActive = value;
      },
      get expandsOnOverflow(): boolean {
        return self.mdcTextInputControllerUnderline.expandsOnOverflow;
      },
      set expandsOnOverflow(value: boolean) {
        self.mdcTextInputControllerUnderline.expandsOnOverflow = value;
      }
    };
  }

  // TODO Old version has not typing for this encapsulation
  get testId(): any {
    return this.nativeObject.valueForKey('accessibilityIdentifier');
  }
  set testId(value: any) {
    this.nativeObject.setValueForKey(value, 'accessibilityIdentifier');
    this.mdcTextInputControllerUnderline.textInput.setValueForKey(value + '_textBox', 'accessibilityIdentifier');
  }

  get cursorPosition(): { start: number; end: number } {
    const self = this._multiline ? this.nativeObject.textView : this.nativeObject;

    const selectedTextRange = self.valueForKey('selectedTextRange');

    let startPosition: any;
    const invocationStartPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('start', selectedTextRange);
    if (invocationStartPosition) {
      invocationStartPosition.target = selectedTextRange;
      invocationStartPosition.setSelectorWithString('start');
      invocationStartPosition.retainArguments();

      invocationStartPosition.invoke();
      startPosition = invocationStartPosition.getReturnValue();
    }

    let endPosition: any;
    const invocationEndPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('end', selectedTextRange);
    if (invocationEndPosition) {
      invocationEndPosition.target = selectedTextRange;
      invocationEndPosition.setSelectorWithString('end');
      invocationEndPosition.retainArguments();

      invocationEndPosition.invoke();
      endPosition = invocationEndPosition.getReturnValue();
    }

    const beginningOfDocument = self.valueForKey('beginningOfDocument');

    let offsetStart: number = 0;
    const invocationOffsetFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('offsetFromPosition:toPosition:', this);
    if (invocationOffsetFromPosition) {
      invocationOffsetFromPosition.target = self;
      invocationOffsetFromPosition.setSelectorWithString('offsetFromPosition:toPosition:');
      invocationOffsetFromPosition.retainArguments();
      invocationOffsetFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
      invocationOffsetFromPosition.setNSObjectArgumentAtIndex(startPosition, 3);
      invocationOffsetFromPosition.invoke();
      offsetStart = invocationOffsetFromPosition.getNSIntegerReturnValue();
    }

    let offsetEnd: number = 0;
    const invocationEndOffsetFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('offsetFromPosition:toPosition:', this);
    if (invocationEndOffsetFromPosition) {
      invocationEndOffsetFromPosition.target = self;
      invocationEndOffsetFromPosition.setSelectorWithString('offsetFromPosition:toPosition:');
      invocationEndOffsetFromPosition.retainArguments();
      invocationEndOffsetFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
      invocationEndOffsetFromPosition.setNSObjectArgumentAtIndex(endPosition, 3);
      invocationEndOffsetFromPosition.invoke();
      offsetEnd = invocationEndOffsetFromPosition.getNSIntegerReturnValue();
    }

    return {
      start: offsetStart,
      end: offsetEnd
    };
  }
  set cursorPosition(value: { start: number; end: number }) {
    const self = this._multiline ? this.nativeObject.textView : this.nativeObject;
    if (value && value.start === parseInt(String(value.start), 10) && value.end === parseInt(String(value.end), 10)) {
      const beginningOfDocument = self.valueForKey('beginningOfDocument');
      let startPosition: any;
      const invocationPositionFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('positionFromPosition:offset:', this);
      if (invocationPositionFromPosition) {
        invocationPositionFromPosition.target = self;
        invocationPositionFromPosition.setSelectorWithString('positionFromPosition:offset:');
        invocationPositionFromPosition.retainArguments();
        invocationPositionFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
        invocationPositionFromPosition.setNSIntegerArgumentAtIndex(value.start, 3);
        invocationPositionFromPosition.invoke();
        startPosition = invocationPositionFromPosition.getReturnValue();
      }
      let endPosition: any;
      const invocationEndPositionFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('positionFromPosition:offset:', this);
      if (invocationEndPositionFromPosition) {
        invocationEndPositionFromPosition.target = self;
        invocationEndPositionFromPosition.setSelectorWithString('positionFromPosition:offset:');
        invocationEndPositionFromPosition.retainArguments();
        invocationEndPositionFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
        invocationEndPositionFromPosition.setNSIntegerArgumentAtIndex(value.end, 3);
        invocationEndPositionFromPosition.invoke();
        endPosition = invocationEndPositionFromPosition.getReturnValue();
      }
      let characterRange: any;
      const invocationTextRangeFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('textRangeFromPosition:toPosition:', this);
      if (invocationTextRangeFromPosition) {
        invocationTextRangeFromPosition.target = self;
        invocationTextRangeFromPosition.setSelectorWithString('textRangeFromPosition:toPosition:');
        invocationTextRangeFromPosition.retainArguments();
        invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(startPosition, 2);
        invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(endPosition, 3);
        invocationTextRangeFromPosition.invoke();
        characterRange = invocationTextRangeFromPosition.getReturnValue();
      }
      self.setValueForKey(characterRange, 'selectedTextRange');
    }
  }

  get multiline(): boolean {
    return this._multiline;
  }

  get lineCount(): number {
    return this._lineCount;
  }

  get isPassword(): boolean {
    return this.nativeObject.isSecureTextEntry;
  }
  set isPassword(value: boolean) {
    this.nativeObject.secureTextEntry = value;
  }

  get characterRestriction(): number {
    return this.mdcTextInputControllerUnderline.characterCountMax;
  }
  set characterRestriction(value: number) {
    this.mdcTextInputControllerUnderline.characterCountMax = value;
  }

  get characterRestrictionColor(): Color {
    return new Color({
      color: this.mdcTextInputControllerUnderline.trailingUnderlineLabelTextColor
    });
  }
  set characterRestrictionColor(value: Color) {
    this.mdcTextInputControllerUnderline.trailingUnderlineLabelTextColor = value.nativeObject;
  }

  get rightLayout(): { view: View; width: number; height?: number } {
    return this._rightLayout;
  }
  set rightLayout(value: { view: View; width: number; height?: number }) {
    this._rightLayout = value;
    if (value === undefined) {
      // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
      this.mdcTextInputControllerUnderline.textInput.setValueForKey(undefined, 'trailingView');
      this.mdcTextInputControllerUnderline.textInput.setValueForKey(0, 'trailingViewMode');
      // } else {
      //     self.nativeObject.setValueForKey(undefined, "leftView");
      //     self.nativeObject.setValueForKey(0, "leftViewMode");
      // }
      return;
    }
    if (!this._rightLayoutMain) {
      const flexMain = new FlexLayout();
      flexMain.nativeObject.yoga.isEnabled = false; // Bug : IOS-2714
      flexMain.nativeObject.translatesAutoresizingMaskIntoConstraints = false;
      flexMain.nativeObject.widthAnchor.constraintEqualToConstant(value.width ? value.width : 30).active = true;
      flexMain.nativeObject.heightAnchor.constraintEqualToConstant(value.height ? value.height : 30).active = true;
      const flexContent = new FlexLayout();
      flexContent.top = 0;
      flexContent.left = 0;
      flexContent.width = value.width ? value.width : 30;
      flexContent.height = value.height ? value.height : 30;
      flexMain.nativeObject.addFrameObserver();
      flexMain.nativeObject.frameObserveHandler = function (e) {
        flexContent.top = 0;
        flexContent.left = 0;
        flexContent.width = e.frame.width;
        flexContent.height = e.frame.height;
        flexContent.applyLayout();
      };
      flexMain.addChild(flexContent);
      // TODO Recheck after build. There is no content property.
      flexMain.content = flexContent;
      this._rightLayoutMain = flexMain;
    } else {
      const childs = this._rightLayoutMain.content.getChildList();
      for (const i in childs) {
        this._rightLayoutMain.content.removeChild(childs[i]);
      }
    }
    this._rightLayoutMain.content.addChild(value.view);
    this._rightLayoutMain.content.applyLayout();
    // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
    this.mdcTextInputControllerUnderline.textInput.setValueForKey(3, 'trailingViewMode');
    this.mdcTextInputControllerUnderline.textInput.setValueForKey(this._rightLayoutMain.nativeObject, 'trailingView');
    // } else {
    //     self.nativeObject.setValueForKey(3, "leftViewMode");
    //     self.nativeObject.setValueForKey(_rightLayoutMain.nativeObject, "leftView");
    // }
  }

  get labelsFont(): Font {
    return this._labelsFont;
  }
  set labelsFont(value: Font) {
    this._labelsFont = value;
    this.mdcTextInputControllerUnderline.leadingUnderlineLabelFont = value;
    this.mdcTextInputControllerUnderline.trailingUnderlineLabelFont = value;
    this.mdcTextInputControllerUnderline.inlinePlaceholderFont = value;
  }

  get font(): Font {
    return this.mdcTextInputControllerUnderline.textInputFont;
  }
  set font(value: Font) {
    this.mdcTextInputControllerUnderline.textInputFont = value;
  }

  get selectedHintTextColor(): Color {
    return new Color({
      color: this.mdcTextInputControllerUnderline.floatingPlaceholderActiveColor
    });
  }
  set selectedHintTextColor(value: Color) {
    this.mdcTextInputControllerUnderline.floatingPlaceholderActiveColor = value.nativeObject;
  }

  get lineColor(): { normal: Color; selected: Color } {
    return {
      normal: this.iosProps.normallineColor,
      selected: this.iosProps.selectedLineColor
    };
  }
  set lineColor(value: { normal: Color; selected: Color }) {
    value.normal && (this.iosProps.normallineColor = value.normal);
    value.selected && (this.iosProps.selectedLineColor = value.normal);
  }

  get errorColor(): Color {
    return new Color({
      color: this.mdcTextInputControllerUnderline.errorColor
    });
  }
  set errorColor(value: Color) {
    this.mdcTextInputControllerUnderline.errorColor = value.nativeObject;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }
  set errorMessage(value: string) {
    this._errorMessage = value;
    if (value) {
      this.mdcTextInputControllerUnderline.setErrorTextErrorAccessibilityValue(this._errorMessage, this._errorMessage);
    } else {
      this.mdcTextInputControllerUnderline.setErrorTextNil();
    }
  }

  get hintTextColor(): Color {
    return this.__hintTextColor;
  }
  set hintTextColor(value: Color) {
    this.__hintTextColor = value;
    this.mdcTextInputControllerUnderline.inlinePlaceholderColor = this.__hintTextColor.nativeObject;
    this.mdcTextInputControllerUnderline.floatingPlaceholderNormalColor = this.__hintTextColor.nativeObject;
  }

  get hint(): string {
    return this.__hint;
  }
  set hint(value: string) {
    this.__hint = value;
    this.mdcTextInputControllerUnderline.placeholderText = value;
  }
}
