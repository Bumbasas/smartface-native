import { AbstractShimmerFlexLayout, IShimmerFlexLayout, ShimmerFlexLayoutIOSParams } from '.';
import FlexLayout from '../flexlayout';
import { ViewEvents } from '../view/view-event';
import ViewIOS from '../view/view.ios';

export default class ShimmerFlexLayoutIOS<TEvent extends string = ViewEvents, TNative = ShimmerFlexLayoutIOSParams>
  extends ViewIOS<TEvent, TNative>
  implements IShimmerFlexLayout<TEvent, {}, TNative>
{
  private _contentLayout: FlexLayout;
  protected _nativeObject: __SF_FBShimmeringView;
  constructor(params: Partial<IShimmerFlexLayout> = {}) {
    super();
    if (!this.nativeObject) {
      this._nativeObject = new __SF_FBShimmeringView();
    }

    this.nativeSpecificProperties();

    for (const param in params) {
      this[param] = params[param];
    }
  }
  get nativeObject() {
    return this._nativeObject;
  }
  startShimmering(): void {
    __SF_Dispatch.mainAsync(() => {
      this.nativeObject.shimmering = true;
    });
  }
  stopShimmering(): void {
    __SF_Dispatch.mainAsync(() => {
      this.nativeObject.shimmering = false;
    });
  }
  get isShimmering(): boolean {
    return this.nativeObject.shimmering;
  }
  get shimmeringDirection(): IShimmerFlexLayout['shimmeringDirection'] {
    return this.nativeObject.shimmeringDirection;
  }
  set shimmeringDirection(value: IShimmerFlexLayout['shimmeringDirection']) {
    this.nativeObject.shimmeringDirection = value;
  }
  get contentLayout(): IShimmerFlexLayout['contentLayout'] {
    return this._contentLayout;
  }
  set contentLayout(value: IShimmerFlexLayout['contentLayout']) {
    this._contentLayout = value;
    this.nativeObject.contentView = value.nativeObject;
  }
  get pauseDuration(): IShimmerFlexLayout['pauseDuration'] {
    return this.nativeObject.shimmeringPauseDuration * 1000;
  }
  set pauseDuration(value: IShimmerFlexLayout['pauseDuration']) {
    this.nativeObject.shimmeringPauseDuration = value / 1000;
  }
  get baseAlpha(): IShimmerFlexLayout['baseAlpha'] {
    return this.nativeObject.shimmeringAnimationOpacity;
  }
  set baseAlpha(value: IShimmerFlexLayout['baseAlpha']) {
    this.nativeObject.shimmeringAnimationOpacity = value;
  }

  private nativeSpecificProperties() {
    const self = this;
    const android = {
      build() {
        return;
      }
    };
    const ios = {
      get highlightLength(): IShimmerFlexLayout['ios']['highlightLength'] {
        return self.nativeObject.shimmeringHighlightLength;
      },
      set highlightLength(value: IShimmerFlexLayout['ios']['highlightLength']) {
        self.nativeObject.shimmeringHighlightLength = value;
      },
      get animationAlpha(): IShimmerFlexLayout['ios']['animationAlpha'] {
        return self.nativeObject.shimmeringAnimationOpacity;
      },
      set animationAlpha(value: IShimmerFlexLayout['ios']['animationAlpha']) {
        self.nativeObject.shimmeringAnimationOpacity = value;
      },
      get speed(): IShimmerFlexLayout['ios']['speed'] {
        return self.nativeObject.shimmeringSpeed;
      },
      set speed(value: IShimmerFlexLayout['ios']['speed']) {
        self.nativeObject.shimmeringSpeed = value;
      },
      get beginFadeDuration(): IShimmerFlexLayout['ios']['beginFadeDuration'] {
        return self.nativeObject.shimmeringBeginFadeDuration * 1000;
      },
      set beginFadeDuration(value: IShimmerFlexLayout['ios']['beginFadeDuration']) {
        self.nativeObject.shimmeringBeginFadeDuration = value / 1000;
      },
      get endFadeDuration(): IShimmerFlexLayout['ios']['endFadeDuration'] {
        return self.nativeObject.shimmeringEndFadeDuration * 1000;
      },
      set endFadeDuration(value: IShimmerFlexLayout['ios']['endFadeDuration']) {
        self.nativeObject.shimmeringEndFadeDuration = value / 1000;
      }
    };
    this._ios = Object.assign(this._ios, ios);
    this.android = Object.assign(this.android, android);
  }

  static Android: typeof AbstractShimmerFlexLayout.Android = {
    Shimmer: AbstractShimmerFlexLayout.Android.Shimmer
  };
  static ShimmeringDirection = typeof AbstractShimmerFlexLayout.ShimmeringDirection;
}
