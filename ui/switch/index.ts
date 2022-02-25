import Color from '../color';
import View, { AbstractView, IView } from '../view';
import { SwitchEvents } from './switch-events';

export type AndroidProps = View['android'] & {
  /**
   * Gets/sets color of the thumb when Switch is OFF.
   * It is set to gray by default.
   * thumbOffColor deprecated 1.1.8 use android.thumbOffColor instead.
   *
   * @property {UI.Color} thumbOffColor
   * @android
   * @since 1.1.8
   */
  thumbOffColor?: Color;
  /**
   * Gets/sets the toggle image of the switch. This property should be used before assigning colors.
   *
   * @property {UI.Color | String} toggleImage
   * @android
   * @since 3.2.1
   */

  toggleImage: Color | string;
  /**
   * Gets/sets the thumb image of the switch. This property should be used before assigning colors.
   *
   * @property {UI.Color | String} thumbImage
   * @android
   * @since 3.2.1
   */
  thumbImage: Color | string;
  /**
   * Gets/sets the background of the switch when it is OFF.  It is set to gray
   * by default. This property works only for Android.
   *
   *     @example
   *     const Switch = require('@smartface/native/ui/switch');
   *     const Color = require('@smartface/native/ui/color');
   *     var mySwitch = new Switch();
   *     mySwitch.android.toggleOffColor = Color.DARKGRAY;
   *
   * @property {UI.Color} toggleOffColor
   * @android
   * @since 0.1
   */
  toggleOffColor: Color;
};

export declare interface ISwitch<TEvent extends string = SwitchEvents, TIOS = {}, TAND = AndroidProps> extends IView<TEvent | SwitchEvents, TIOS, TAND & AndroidProps> {
  /**
   * Enables/disables the Switch.
   *
   *     @example
   *     const Switch = require('@smartface/native/ui/switch');
   *     var mySwitch = new Switch();
   *     mySwitch.enabled = false;
   *
   * @since 1.1.8
   * @property {Boolean} [enabled = true]
   * @android
   * @ios
   */
  enabled: boolean;

  /**
   * Gets/sets color of the thumb when Switch is ON. If this is set on iOS, the switch grip will lose its drop shadow.
   * The default of this property is green on Android and null on iOS. For iOS, If you want to use default of this property, you should set null.
   *
   * @property {UI.Color} thumbOnColor
   * @android
   * @ios
   * @since 0.1
   */
  thumbOnColor: Color;

  /**
   * Gets/sets color of the thumb when Switch is OFF.
   * It is set to gray by default.
   *
   * @property {UI.Color} thumbOffColor
   * @android
   * @since 0.1
   */
  thumbOffColor: Color;

  /**
   * Gets/sets toggle value of Switch. When Switch is ON,
   * the value of this property will be true. It is set to false by default.
   *
   * @property {Boolean} toggle
   * @android
   * @ios
   * @since 0.1
   */
  toggle: boolean;

  /**
   * Gets/sets the background of the switch when it is ON.
   * The default of this property is gray on Android and green on iOS.
   *
   * @property {UI.Color} toggleOnColor
   * @android
   * @ios
   * @since 0.1
   */
  toggleOnColor: Color;

  /**
   * This event is called when the state of switch changes from ON to OFF or vice versa.
   *
   * @event onToggleChanged
   * @param {Boolean} state
   * @deprecated
   * @android
   * @ios
   * @since 0.1
   * @example
   * ````
   * import Switch from '@smartface/native/ui/switch';
   *
   * const switch = new Switch();
   * switch.on(Switch.Events.ToggleChanged, (params) => {
   *  console.info('onToggleChanged', params);
   * });
   * ````
   */
  onToggleChanged: (toggle: boolean) => void;
}

export declare class AbstractSwitch<TEvent extends string = SwitchEvents> extends AbstractView<TEvent> implements ISwitch<TEvent> {
  get enabled(): boolean;
  set enabled(value: boolean);

  get thumbOnColor(): Color;
  set thumbOnColor(value: Color);

  get thumbOffColor(): Color;
  set thumbOffColor(value: Color);

  get toggle(): boolean;
  set toggle(value: boolean);

  get toggleOnColor(): Color;
  set toggleOnColor(value: Color);

  get onToggleChanged(): (toggle: boolean) => void;
  set onToggleChanged(value: (toggle: boolean) => void);
}

const Switch: typeof AbstractSwitch = require(`./switch.${Device.deviceOS.toLowerCase()}`).default;
type Switch = AbstractSwitch;

export default Switch;
