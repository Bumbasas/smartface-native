import { AbstractImageView, IImageView } from '../imageview';
import GifImage from '../gifimage';
import { IImage } from '../image';
import Color from '../color';
import { GifImageViewEvents } from './gifimageview-events';

export interface IGifImageView<TEvent extends string = GifImageViewEvents> extends IImageView<TEvent | GifImageViewEvents> {
  /**
   * Gets/sets the gifImage. GifImage object can be set.
   *
   * @property {UI.GifImage}  [gifImage = undefined]
   * @android
   * @ios
   * @since 3.2.0
   */
  gifImage: undefined | GifImage;
  /**
   * Gets the currentFrame.
   *
   * @property {UI.Image}  currentFrame
   * @readonly
   * @android
   * @ios
   * @since 3.2.0
   */
  readonly currentFrame: IImage;
  /**
   * Gets the currentFrameIndex.
   *
   * @property {Number}  currentFrameIndex
   * @readonly
   * @android
   * @ios
   * @since 3.2.0
   */
  readonly currentFrameIndex: number;
  /**
   * Gets the isAnimating.
   *
   * @property {Boolean}  isAnimating
   * @readonly
   * @android
   * @ios
   * @since 3.2.0
   */
  isAnimating: boolean;
  /**
   * You should call this method when you want start gif's animation.
   *
   * @method startAnimating
   * @android
   * @ios
   * @since 3.2.0
   */
  startAnimating(): void;
  /**
   * You should call this method when you want stop gif's animation.
   *
   * @method stopAnimating
   * @android
   * @ios
   * @since 3.2.0
   */
  stopAnimating(): void;
  /**
   * This event is called when every gif's loop ends.
   *
   * @event loopCompletionCallback
   * @param {Number} loopCountRemaining
   * @ios
   * @since 3.2.0
   */
  loopCompletionCallback: (loopCountRemain: number) => void;
  /**
   * Gets/sets the tintColor. Must create a new image object with the imageWithRenderingMode(Image.iOS.RenderingMode.TEMPLATE) method to work correctly on the iOS.
   *
   * @property {UI.Color} tintColor
   * @android
   * @removed
   * @ios
   * @since 3.2.0
   */
  tintColor: Color;
  /**
   * Load image from the server and place the returned image into the ImageView.
   * If you pass any image to placeHolder parameter, placeHolder image will shown until image loaded.
   *
   * @method loadFromUrl
   * @param {Object} object
   * @param {String} object.url
   * @param {UI.Image} object.placeholder
   * @param {Boolean} object.fade = true
   * @param {Function} object.onSuccess
   * @param {Function} object.onError
   * @android
   * @removed
   * @ios
   * @since 3.2.0
   */
  loadFromUrl(params: { url: string; placeholder?: IImage; fade?: boolean; onSuccess?: () => void; onError?: () => void }): void;
}

export abstract class AbstractGifImageView<TEvent extends string = GifImageViewEvents> extends AbstractImageView<TEvent> implements IGifImageView<TEvent> {
  startAnimating(): void {
    throw new Error('Method not implemented.');
  }
  stopAnimating(): void {
    throw new Error('Method not implemented.');
  }

  gifImage: undefined | GifImage;
  readonly currentFrame: IImage;
  readonly currentFrameIndex: number;
  isAnimating: boolean;
  loopCompletionCallback: (loopCountRemain: number) => void;
  tintColor: Color;
}

/**
 * @class UI.GifImageView
 * @extends UI.ImageView
 * @since 3.2.0
 *
 * GifImageView is simply an gifimage container where UI.GifImage is displayed inside.
 *
 *     @example
 *     import GifImage from '@smartface/native/ui/gifimage';
 *     import GifImageView from '@smartface/native/ui/gifimageview';
 *
 *     const myGifImage = GifImage.createFromFile("assets://smartface.gif")
 *     const myGifImageView = new GifImageView({
 *         gifImage: myGifImage,
 *         width: 200, height: 200
 *     });
 *
 *     myPage.layout.addChild(myGifImageView);
 *
 */
class GifImageViewImpl extends AbstractGifImageView {}
const GifImageView: typeof GifImageViewImpl = require(`./gifimageview.${Device.deviceOS.toLowerCase()}`).default;
type GifImageView = GifImageViewImpl;

export default GifImageView;
