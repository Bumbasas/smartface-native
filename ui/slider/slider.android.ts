/*globals requireClass*/
import Color from '../color';
import { SliderEvents } from './slider-events';
import { ViewAndroid } from '../view/view.android';
import { ISlider } from '.';
import AndroidConfig from '../../util/Android/androidconfig';
import Image from '../image';

const SDK_VERSION = requireClass('android.os.Build').VERSION.SDK_INT;
const PorterDuffMode = requireClass('android.graphics.PorterDuff').Mode.SRC_IN;
const SeekBar = requireClass('android.widget.SeekBar');
const NativeR = requireClass('android.R');
const NativeView = requireClass('android.view.View');

export default class SliderAndroid<TEvent extends string = SliderEvents> extends ViewAndroid<TEvent | SliderEvents> implements ISlider {
  private _layerDrawable: any;
  private _defaultThumb: any;
  private _minValue: number;
  private _maxValue: number;
  private _minTrackColor: Color;
  private _maxTrackColor: Color;
  private _thumbImage: Image;
  private _thumbColor: Color;
  private _onValueChange: () => void;
  constructor(params: Partial<ISlider> = {}) {
    super();

    if (!this.nativeObject) {
      this._nativeObject = new SeekBar(AndroidConfig.activity);
    }

    this._layerDrawable = this.nativeObject.getProgressDrawable().getCurrent();
    this._defaultThumb = this.nativeObject.getThumb();

    // TODO Recheck after
    if (!this.skipDefaults) {
      // SET DEFAULTS
      this.thumbColor = Color.GRAY;
      this.minTrackColor = Color.DARKGRAY;
      this.maxTrackColor = Color.GREEN;
      this.value = 0;
      this.minValue = 0;
      this.maxValue = 100;
      this.nativeObject.setOnSeekBarChangeListener(
        SeekBar.OnSeekBarChangeListener.implement({
          onProgressChanged: (seekBar, actualValue, fromUser) => {
            // TODO Recheck after
            this?._onValueChange(actualValue + this._minValue);
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

    // Assign parameters given in constructor
    for (const param in params) {
      this[param] = params[param];
    }
  }

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

  get thumbImage(): Image {
    return this._thumbImage;
  }
  set thumbImage(value: Image) {
    if (value instanceof Image && value.nativeObject) {
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

  get onValueChange(): () => void {
    return this._onValueChange;
  }
  set onValueChange(value: () => void) {
    this._onValueChange = value;
    this.emit('valueChange');
  }

  toString(): string {
    return 'Slider';
  }
}
