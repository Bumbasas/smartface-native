import { AndroidProps, ITextArea } from '.';
import ActionKeyType from '../actionkeytype';
import KeyboardType from '../keyboardtype';
import TextBoxAndroid from '../textbox/textbox.android';
import { TextAreaEvents } from './textarea-events';

export default class TextAreaAndroid<TEvent extends string = TextAreaEvents, TNative = AndroidProps>
  extends TextBoxAndroid<TEvent | TextAreaEvents, TNative>
  implements ITextArea<TEvent, {}, TNative>
{
  private _bounces: boolean;
  private __hint: string;
  private __actionKeyType: ActionKeyType;
  private __keyboardType: KeyboardType;
  private __isPassword: boolean;
  private __onActionButtonPress: ITextArea['onActionButtonPress'];
  constructor(params: Partial<ITextArea> = {}) {
    super(params);

    this.nativeObject.setSingleLine(false);

    const { android, ...restParams } = params;
    Object.assign(this._android, this.androidFields, android);
    Object.assign(this, restParams);
  }

  private get androidFields() {
    const self = this;
    return {
      get hint(): string {
        return self.__hint;
      },
      set hint(value: string) {
        self.__hint = value;
      }
    };
  }

  get isPassword(): boolean {
    return this.__isPassword;
  }
  set isPassword(value: boolean) {
    this.__isPassword = value;
  }

  get actionKeyType(): ActionKeyType {
    return this.__actionKeyType;
  }
  set actionKeyType(value: ActionKeyType) {
    this.__actionKeyType = value;
  }

  get keyboardType(): KeyboardType {
    return this.__keyboardType;
  }
  set keyboardType(value: KeyboardType) {
    this.__keyboardType = value;
  }

  get hint(): string {
    return this.__hint;
  }
  set hint(value: string) {
    this.__hint = value;
  }

  get bounces(): boolean {
    return this._bounces;
  }
  set bounces(value: boolean) {
    this._bounces = value;
  }

  get onActionButtonPress(): ITextArea['onActionButtonPress'] {
    return this.__onActionButtonPress;
  }
  set onActionButtonPress(value: ITextArea['onActionButtonPress']) {
    this.__onActionButtonPress = value;
  }
}
