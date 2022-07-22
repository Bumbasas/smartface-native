import { IColor } from '../../../ui/color/color';

/**
 * Determines whether the navigation bar should be light theme or dark theme based.
 */
export enum NavigationBarStyle {
  DARKCONTENT,
  LIGHTCONTENT
}

/**
 * @class Application.Android.NavigationBar
 *
 * This class represents Android navigation bar (includes soft keys) object. Creating instance of
 * NavigationBar is not valid since you can't use in anywhere.
 *
 * @since 4.0.0
 */
export declare class NavigationBarBase {
  color: IColor;
  /**
   * Style is an enum. It defines navigation bar appearance style.
   * Gets/sets transparency of status bar.This property works only for Android version
   * OREO 8.1.0 (API 27) or above.
   *
   * @defaultValue NavigationBarStyle.DARKCONTENT
   * @android
   * @since 4.0.0
   */
  style: NavigationBarStyle;
}
