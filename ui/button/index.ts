import Color from '../color';
import Image from '../image';
import { ButtonEvents } from './button-events';
import { ILabel } from '../label/label';

export interface IButtonStates<Property = any> {
  normal?: Property;
  disabled?: Property;
  selected?: Property;
  pressed?: Property;
  focused?: Property;
}

export declare interface IButton<TEvent extends string = ButtonEvents, TIOS = {}, TAND = {}> extends ILabel<TEvent | ButtonEvents, TIOS, TAND> {
  /**
   * Enables/disables the Button. This will dim the button color. You can set the dim property on Button style.
   *
   *     @example
   *     import Button from '@smartface/native/ui/button';
   *     const myButton = new Button();
   *     myButton.enabled = false;
   *
   * @since 0.1
   * @android
   * @ios
   */
  enabled: boolean;
  /**
   * Gets/sets background image of a Button.
   *
   *     @example
   *     import Image from '@smartface/native/ui/image';
   *     import Button from '@smartface/native/ui/button';
   *     var myButton = new Button();
   *     myButton.backgroundImage = {
   *         normal: Image.createFromFile("images://normal.png"),
   *         disabled: Image.createFromFile("images://disabled.png"),
   *         pressed: Image.createFromFile("images://pressed.png"),
   *     };
   *     myButton.text = "First button text";
   *
   *     const myButton2 = new Button();
   *     myButton2.backgroundImage = Image.createFromFile("images://normal.png");
   *     myButton2.text = "Second button text";
   *
   * @since 0.1
   * @android
   * @ios
   */
  backgroundImage: Image; //TODO: Check with Cenk about Image | IButtonStates<Image>

  /**
   * Gets/sets background color of a Button. You can assign a color or
   * an object that contains colors depending on the state of the button.
   *
   *     @example
   *     import Button from '@smartface/native/ui/button';
   *     import Color from '@smartface/native/ui/color';
   *     const myButton = new Button();
   *
   *     // background color of the button
   *     myButton.backgroundColor = Color.GREEN;
   *
   *     // colors depending on the state of the button
   *     myButton.backgroundColor = {
   *         normal: Color.RED,
   *         disabled: Color.GRAY,
   *         pressed: Color.BLUE,
   *     };
   *
   * @since 0.1
   * @android
   * @ios
   */
  backgroundColor: Color; //TODO: Check with Cenk about Color | IButtonStates<Color>
  /**
   * @deprecated
   * @example
   * ````
   * import Button from '@smartface/native/ui/button';
   *
   * this.button1.on(Button.Events.Press, () => {
   *  console.info('Button pressed');
   * });
   * ````
   */
  onPress: () => void;
  /**
   * This only works for Android
   * @deprecated
   * @example
   * ````
   * import Button from '@smartface/native/ui/button';
   *
   * this.button1.on(Button.Events.LongPress, () => {
   *  console.info('Button long pressed');
   * });
   * ````
   */
  onLongPress: () => void;
}

const Button: IButton = require(`./button.${Device.deviceOS.toLowerCase()}`).default;
type Button = IButton;

export default Button;
