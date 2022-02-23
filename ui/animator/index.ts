import ViewGroup from '../viewgroup';

export type AnimatorParams = {
  layout: ViewGroup;
  duration: number;
  animFn: () => void;
};

export interface IAnimator {
  perform(): AnimatorBase;
  /**
   * Performs the changes declared in animFunction with animation.
   * Duration indicates how long the animation will take in milliseconds.
   * @android
   * @ios
   * @since 0.1
   */
  then(duration: number, animFn: () => void): AnimatorBase;

  /**
   * Runs the function provided after all animations are completed.
   * Note that: It does not perform any animations.
   * @android
   * @ios
   * @since 0.1
   */
  complete(callback: () => void): void;
}

export class AnimatorBase implements IAnimator {
  constructor(params: Partial<AnimatorParams>) {}
  perform(): AnimatorBase {
    throw new Error('Method not implemented.');
  }
  then(duration: number, animFn: () => void): AnimatorBase {
    throw new Error('Method not implemented.');
  }
  complete(callback: () => void): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Performs the changes declared in animFunction with animation inside the layout provided.
   * Duration indicates how long the animation will take in milliseconds.
   * For animation rootLayout you should choose parent layout for Android, you can choose page
   * layout for iOS as shown in example.
   * While animating Textbox, you may see the hint of the Textbox disappear on Android.
   * This is related with Android internal issue (same reason of Google Issue Tracker 38303812, 37048478). For getting over from this problem you should
   * set empty text to the Textbox onComplete callback of animation.
   * @android
   * @ios
   * @since 0.1
   */
  static animate(rootLayout: ViewGroup, duration: number, animFn: () => void): AnimatorBase {
    throw new Error('Method not implemented.');
  }
}

const Animator: typeof AnimatorBase = require(`./animator.${Device.deviceOS.toLowerCase()}`).default;
type Animator = AnimatorBase;

export default Animator;
