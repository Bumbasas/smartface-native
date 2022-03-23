/*globals requireClass*/
import Color from '../color';
import { SliderEvents } from './slider-events';
import ViewAndroid from '../view/view.android';
import { ISlider } from '.';
import AndroidConfig from '../../util/Android/androidconfig';
import ImageAndroid from '../image/image.android';

const SDK_VERSION = requireClass('android.os.Build').VERSION.SDK_INT;
const PorterDuffMode = requireClass('android.graphics.PorterDuff').Mode.SRC_IN;
const SeekBar = requireClass('android.widget.SeekBar');
const NativeR = requireClass('android.R');
const NativeView = requireClass('android.view.View');

export default class SliderAndroid<TEvent extends string = SliderEvents> extends ViewAndroid<TEvent | SliderEvents, any, ISlider> implements ISlider {
  private _layerDrawable: any;
  private _defaultThumb: any;
  private _minValue: number;
  private _maxValue: number;
  private _minTrackColor: Color;
  private _maxTrackColor: Color;
  private _thumbImage: ImageAndroid;
  private _thumbColor: Color;
  private _onValueChange: (value: number) => void;
  createNativeObject() {
    return new SeekBar(AndroidConfig.activity);
  }
  constructor(params?: Partial<ISlider>) {
    super(params);

    this._layerDrawable = this.nativeObject.getProgressDrawable().getCurrent();
    this._defaultThumb = this.nativeObject.getThumb();

    if (!this.skipDefaults) {
      // SET DEFAULTS
      this._thumbColor = Color.GRAY;
      this._minTrackColor = Color.DARKGRAY;
      this._maxTrackColor = Color.GREEN;
      this.value = 0;
      this._minValue = 0;
      this._maxValue = 100;
      this.nativeObject.setOnSeekBarChangeListener(
        SeekBar.OnSeekBarChangeListener.implement({
          onProgressChanged: (seekBar, actualValue, fromUser) => {
            const param = actualValue + this._minValue;
            this._onValueChange?.(param);
            this.emit(SliderEvents.ValueChange, param);
          },
          onStartTrackingTouch: function (seekBar) {},
          onStopTrackingTouch: function (seekBar) {}
        })
      );

      // Added for AND-2869 bug.
      this.nativeObject.setOnClickListener(
        NativeView.OnClickListener.implement({
          onClick: function (view) {}
        })
      );
    }
  }
  skipDefaults: boolean;

  get thumbColor(): Color {
    return this._thumbColor;
  }
  set thumbColor(value: Color) {
    if (value) {
      this._thumbColor = value;
      this._defaultThumb.setColorFilter(value.nativeObject, PorterDuffMode);
      this.nativeObject.setThumb(this._defaultThumb);
    }
  }

  get thumbImage(): ImageAndroid {
    return this._thumbImage;
  }
  set thumbImage(value: ImageAndroid) {
    if (value instanceof ImageAndroid && value.nativeObject) {
      this._thumbImage = value;
      this.nativeObject.setThumb(value.nativeObject);
    } else if (value === null) {
      this._thumbImage = value;
      this.nativeObject.setThumb(null);
    }
  }

  get minTrackColor(): Color {
    return this._minTrackColor;
  }
  set minTrackColor(value: Color) {
    if (value) {
      this._minTrackColor = value;
      this._layerDrawable.findDrawableByLayerId(NativeR.id.progress).setColorFilter(this._minTrackColor.nativeObject, PorterDuffMode);
    }
  }

  get maxTrackColor(): Color {
    return this._maxTrackColor;
  }
  set maxTrackColor(value: Color) {
    if (value) {
      this._maxTrackColor = value;
      this._layerDrawable.findDrawableByLayerId(NativeR.id.background).setColorFilter(this._maxTrackColor.nativeObject, PorterDuffMode);
    }
  }

  get value(): number {
    return this.nativeObject.getProgress() + this._minValue;
  }
  set value(value: number) {
    if (value < this._minValue) {
      value = this._minValue;
    } else if (value > this._maxValue) {
      value = this._maxValue;
    }

    this.nativeObject.setProgress(int(value - this._minValue));
  }

  get minValue(): number {
    return this._minValue;
  }
  set minValue(value: number) {
    this._minValue = value;
    this.nativeObject.setMax(int(this._maxValue - this._minValue));
  }

  get maxValue(): number {
    return this._maxValue;
  }
  set maxValue(value: number) {
    this._maxValue = value;
    this.nativeObject.setMax(int(this._maxValue - this._minValue));
  }

  get onValueChange(): (value: number) => void {
    return this._onValueChange;
  }
  set onValueChange(value: (value: number) => void) {
    this._onValueChange = value;
  }

  toString(): string {
    return 'Slider';
  }
}
