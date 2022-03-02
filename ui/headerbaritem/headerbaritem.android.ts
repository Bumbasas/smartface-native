import HeaderBarItem, { IHeaderBarItem, SystemItem } from '.';
import NativeComponent from '../../core/native-component';
import { Point2D } from '../../primitive/point2d';
import { AndroidConfig, HeaderBarItemPadding, LayoutParams } from '../../util';
import AttributedString from '../attributedstring';
import Badge from '../badge';
import Color from '../color';
import Font from '../font';
import Image from '../image';
import View from '../view';

const SFView = requireClass('io.smartface.android.sfcore.ui.view.SFViewUtil');
const NativeTextButton = requireClass('android.widget.Button');
const NativePorterDuff = requireClass('android.graphics.PorterDuff');
const NativeImageButton = requireClass('android.widget.ImageButton');
const NativeView = requireClass('android.view.View');
const NativeRelativeLayout = requireClass('android.widget.RelativeLayout');

const activity = AndroidConfig.activity;

function PixelToDp(px) {
  return AndroidUnitConverter.pixelToDp(px);
}

export default class HeaderBarItemAndroid extends NativeComponent implements IHeaderBarItem {
  iOS = { SystemItem: {} };
  private _title: string = '';
  private _image?: Image | string = null;
  private _customView?: View = undefined;
  private _enabled: boolean = true;
  private _onPress?: () => void = null;
  private _color?: Color = null;
  private _badge?: Badge = undefined;
  private _accessibilityLabel: string;
  private isLeftItem = false;
  private isBadgeEnabled = false;
  private actionBar = null;
  private _imageButton = false;
  private _searchView = null;
  private _menuItem = null;
  private nativeBadgeContainer: any;
  private _itemColor = Color.WHITE;
  private _android: Partial<{
    attributedTitle: AttributedString;
    systemIcon: number | string;
    elevation: number;
    contentInset: { left: number; right: number };
    logoEnabled: boolean;
    subtitle: string;
    subtitleFont: Font;
  }> = {};
  private _ios: Partial<{
    systemItem: SystemItem;
    font: Font;
    translucent: boolean;
    titleFont: Font;
    backBarButtonItem: IHeaderBarItem;
  }> = {};
  constructor(params?: Partial<HeaderBarItem>) {
    super();

    const self = this;
    this._android = {
      get systemIcon() {
        return self._android.systemIcon;
      },
      set systemIcon(systemIcon) {
        self._android.systemIcon = systemIcon;

        if (!self.nativeObject || (self.nativeObject && !self.imageButton)) {
          self.nativeObject = this.createNativeImageButton.call(self);
          self.updateAccessibilityLabel(self._accessibilityLabel);
        }

        self.nativeObject && self.nativeObject.setImageResource(Image.systemDrawableId(self._android.systemIcon));
      }
    };

    const { ios, android, ...restParams } = params;
    Object.assign(this._ios, ios);
    Object.assign(this._android, android);
    Object.assign(this, restParams);
  }
  get android() {
    return this._android;
  }
  set android(
    and: Partial<{
      attributedTitle: AttributedString;
      systemIcon: number | string;
      elevation: number;
      contentInset: { left: number; right: number };
      logoEnabled: boolean;
      subtitle: string;
      subtitleFont: Font;
    }>
  ) {
    this._android = and;
  }
  get ios() {
    return this._ios;
  }
  set ios(
    ios: Partial<{
      systemItem: SystemItem;
      font: Font;
      translucent: boolean;
      titleFont: Font;
      backBarButtonItem: IHeaderBarItem;
    }>
  ) {
    this._ios = ios;
  }
  get color() {
    return this._color;
  }
  set color(value: Color) {
    if (value === null) return;
    // TODO: Fix it for new router.
    if (!(typeof value === 'number' || value instanceof Color)) {
      throw new TypeError('color must be Color instance');
    }
    this._color = value;
    if (this.nativeObject) {
      if (this._image || this._android.systemIcon) {
        const imageCopy = this.nativeObject.getDrawable().mutate();
        imageCopy.setColorFilter(this.color.nativeObject, NativePorterDuff.Mode.SRC_IN);
        this.nativeObject.setImageDrawable(imageCopy);
      } else {
        this.nativeObject.setTextColor(this._color.nativeObject);
      }
    }
  }
  get title() {
    return this._title;
  }
  set title(value: string) {
    if (value !== null && typeof value !== 'string') {
      throw new TypeError('title must be string or null.');
    }
    this._title = value;
    this.titleSetterHelper(this._title);
  }
  get imageButton() {
    return this._imageButton;
  }
  set imageButton(value) {
    this._imageButton = value;
  }
  get menuItem() {
    return this._menuItem;
  }
  set menuItem(value) {
    this._menuItem = value;
  }
  get image() {
    return this._image;
  }
  set image(value: Image | string) {
    value = Image.createImageFromPath(value); //IDE requires this implementation.
    if (value === null || value instanceof Image) {
      this._image = value;
      if (!this.nativeObject || (this.nativeObject && !this.imageButton)) {
        this.nativeObject = this.createNativeImageButton();
        this.updateAccessibilityLabel(this._accessibilityLabel);
      }
      if (this.nativeObject && this.imageButton) {
        if (this._image) {
          const imageCopy = (this._image as Image).nativeObject.mutate();
          this.nativeObject.setImageDrawable(imageCopy);
        } else {
          this.nativeObject.setImageDrawable(null);
          this.nativeObject = null;
          if (this._android.attributedTitle) {
            this._android.attributedTitle = this._android.attributedTitle;
          } else {
            this.title = this._title;
          }
        }
      }
    } else {
      throw new TypeError('image must be Image instance or image path should be given properly.');
    }
  }
  get searchView() {
    return this.searchView;
  }
  set searchView(searchView) {
    if (searchView) {
      this._searchView = searchView;
      if (this.nativeObject) {
        this.nativeObject.setActionView(this._searchView.nativeObject);
      }
    }
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value: boolean) {
    this._enabled = !!value;
    if (this.nativeObject) {
      this.nativeObject.setEnabled(this._enabled);
    }
  }
  get onPress() {
    return this._onPress;
  }
  set onPress(value) {
    if (value instanceof Function) {
      this._onPress = value;
    } else {
      throw new TypeError('onPress must be function.');
    }
  }
  get size() {
    return this.nativeObject
      ? {
          width: AndroidUnitConverter.pixelToDp(this.nativeObject.getWidth()),
          height: AndroidUnitConverter.pixelToDp(this.nativeObject.getHeight())
        }
      : undefined;
  }
  set size(value) {
    if (typeof value === 'object' && this.nativeObject) {
      this.nativeObject.setWidth(AndroidUnitConverter.dpToPixel(value.width));
      this.nativeObject.setHeight(AndroidUnitConverter.dpToPixel(value.height));
    }
  }
  get badge() {
    if (this._badge === undefined) {
      this._badge = new Badge();
      this.isBadgeEnabled = true;
      this.assignRules(this._badge);
      this.addToHeaderView(this._badge);
    }
    return this._badge;
  }
  get customView() {
    return this._customView;
  }
  set customView(view) {
    this._customView = view;
  }
  get accessibilityLabel() {
    return this._accessibilityLabel;
  }
  set accessibilityLabel(value: string) {
    this._accessibilityLabel = value;
    this.updateAccessibilityLabel(this._accessibilityLabel);
  }
  get itemColor() {
    return this._itemColor;
  }
  set itemColor(color: Color) {
    if (color instanceof Color) {
      this._itemColor = color;
    }
  }
  setValues() {
    this.enabled = this.enabled;

    if (!this._customView) {
      if (this.imageButton) {
        this.image && (this.image = this.image);
        this._android.systemIcon && (this._android.systemIcon = this._android.systemIcon);
      } else if (this._android.attributedTitle) {
        this._android.attributedTitle = this._android.attributedTitle;
      } else {
        this.title = this._title;
      }
      this.color = this.color;
    }

    const self = this;
    this.nativeObject.setOnClickListener(
      NativeView.OnClickListener.implement({
        onClick: function () {
          self._onPress?.();
        }
      })
    );
  }
  toString() {
    return 'HeaderBarItem';
  }
  titleSetterHelper(title: string) {
    const itemTitle = title ? title : '';
    if (!this.nativeObject || this.imageButton) {
      this.nativeObject = new NativeTextButton(activity);
      this.updateAccessibilityLabel(this._accessibilityLabel);
      this.nativeObject.setText(itemTitle);
      this.nativeObject.setBackgroundColor(Color.TRANSPARENT.nativeObject);
      this.nativeObject.setPaddingRelative(HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal, HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal);
      this.imageButton = false;
      this.color = this._color;
      if (this.menuItem) {
        const itemView = this.menuItem.getActionView();
        itemView.getChildCount() && itemView.removeAllViews();
        itemView.addView(this.nativeObject);
      }
    } else if (!this.imageButton) {
      this.nativeObject.setText(itemTitle);
      this.color = this._color;
    }
  }
  updateAccessibilityLabel(accessibilityLabel: string) {
    if (this.isLeftItem && this.actionBar) {
      this.actionBar.setHomeActionContentDescription(accessibilityLabel);
    } else {
      this.nativeObject && this.nativeObject.setContentDescription(accessibilityLabel);
    }
  }
  assignRules(badge) {
    if (!this.nativeObject) return;
    const ALIGN_END = 19;

    const layoutParams = new NativeRelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
    this.nativeObject.setId(NativeView.generateViewId());
    layoutParams.addRule(ALIGN_END, this.nativeObject.getId());

    badge.nativeObject.setLayoutParams(layoutParams);
  }
  addToHeaderView(badge) {
    if (!this.nativeBadgeContainer || !badge) return;

    if (!badge.nativeObject.getParent()) {
      this.nativeBadgeContainer.addView(badge.nativeObject);
    } else {
      const parentOfNativeObject = badge.nativeObject.getParent();
      parentOfNativeObject.removeAllViews();
      this.nativeBadgeContainer.addView(badge.nativeObject);
    }
  }
  getScreenLocation(): Point2D {
    const location = toJSArray(SFView.getLocationOnScreen(this.nativeObject));
    const position: Partial<{ x: number; y: number }> = {};
    position.x = PixelToDp(location[0]);
    position.y = PixelToDp(location[1]);
    return position;
  }
  createNativeImageButton() {
    const headerBarItem = this;

    let nativeImageButton;
    if (!headerBarItem.nativeObject || !headerBarItem.imageButton) {
      nativeImageButton = new NativeImageButton(activity);
      nativeImageButton.setBackground(null);
      nativeImageButton.setPaddingRelative(HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal, HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal);
    } else nativeImageButton = headerBarItem.nativeObject;
    headerBarItem.imageButton = true;
    if (headerBarItem.menuItem) {
      /*
      We know that got action view is ViewGroup.
      */
      const itemView = headerBarItem.menuItem.getActionView();
      itemView.getChildCount() && itemView.removeAllViews();
      itemView.addView(nativeImageButton);
    }

    return nativeImageButton;
  }
}