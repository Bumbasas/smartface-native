import Font from '../font';
import { IBadge } from '../badge/badge';
import { INativeMobileComponent, WithMobileOSProps } from '../../core/native-mobile-component';
import { IImage } from '../image/image';
import ViewState from '../shared/viewState';
import { IBottomTabBar } from '../bottomtabbar/bottomtabbar';
import { ITabBarController } from '../tabbarcontroller/tabbarcontroller';
import { IAttributedString } from '../attributedstring/attributedstring';

export interface TabbarItemIOSProps {
  /**
   * Gets/sets font of tab bar item.
   *
   * @property {UI.Font} font
   * @ios
   * @since 4.0.2
   */
  font: Font;
}

export interface TabbarItemAndroidProps {
  /**
   * Gets/sets attributed title of tab bar item.
   *
   * @property {UI.AttributedString} attributedTitle
   * @android
   * @since 4.0.2
   */
  attributedTitle: IAttributedString;
  /**
   * Gets/sets the system icon  of tab item. Built-in icons can be set with the corresponding systemIcon value.
   *
   *     @example
   *     var myItem = new TabBarItem({
   *         android: {
   *             systemIcon: 17301545   // OR 'ic_dialog_email'
   *         },
   *         title: "Page1"
   *     });
   *
   *
   * @property {Number | String} systemIcon
   * @android
   * @see https://developer.android.com/reference/android/R.drawable
   * @since 4.0.2
   */
  systemIcon: number | string;
}

/**
 * @class UI.TabBarItem
 * @since 1.1.10
 *
 * This class represents the page controller when added to a bottom tab bar. Router navigates
 * UI.TabBarItem.page when the tab bar item is clicked.
 *
 *     @example
 *     import TabBarItem from '@smartface/native/ui/tabbaritem';
 *     import BottomTabBar from '@smartface/native/ui/bottomtabbar';
 *     import Image from '@smartface/native/ui/image';
 *
 *     var myHomeImage = Image.createFromFile("images://home.png");
 *     var myTab = new BottomTabBar();
 *     var myItem = new TabBarItem({
 *         title: "Home",
 *         icon: myHomeImage,
 *         route: 'pages/pgHome'
 *     });
 *     myTab.add('home', myItem);
 */
export declare interface ITabbarItem extends INativeMobileComponent<any, WithMobileOSProps<any, TabbarItemIOSProps, TabbarItemAndroidProps>> {
  /**
   * Gets/sets the title of tab item.
   *
   * @property {String} title
   * @android
   * @ios
   * @since 1.1.10
   */
  title: string;
  /**
   * Gets/sets the icon  of tab item.
   *
   * @property {Object} icon
   * @property {UI.Image | String} icon.normal
   * @property {UI.Image | String} icon.selected
   * @android
   * @ios
   * @since 1.1.10
   */
  icon: ViewState<IImage | string> | undefined;
  /**
   * Gets badge of tab bar item. Badge that is displayed in the upper-right corner of the item with a surrounding red oval. Badge usage isn't currently supported if this TabBarItem is belongs to TabBarController.
   * For iOS, when tabBarItem icon size is big, default position of badge might be wrong. You should call move function for fix this problem. Badge should not be given in constructor.
   *
   *     @example
   *     page.parentController.tabBar.items[0].badge.text = "5"; //ParentController must be BottomTabbarController
   *     page.parentController.tabBar.items[0].badge.visible = true;
   *
   * @property {UI.Badge} badge
   * @android
   * @ios
   * @readonly
   * @since 4.0.1
   */
  badge: IBadge;
  /**
   * Gets/sets the route related to tab item. When an tab bar item is pressed, its route is shown.
   *
   * @property {String/UI.Navigator} route
   * @android
   * @ios
   * @since 1.1.10
   */
  route: string;
  setProperties(params: { itemTitle: string; itemIcon: ITabbarItem['icon']; systemIcon?: string | number }): void;
  tabBarItemParent: ITabBarController | IBottomTabBar | null;
  index: number | null;
}
