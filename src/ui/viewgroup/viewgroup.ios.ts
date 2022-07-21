import { IViewGroup } from './viewgroup';
import { ExtractEventValues } from '../../core/eventemitter/extract-event-values';
import { IView } from '../view/view';
import ViewIOS from '../view/view.ios';
import { ViewGroupEvents } from './viewgroup-events';

/**
 * @class UI.ViewGroup
 * @since 0.1
 * @extends View
 * A ViewGroup is a special view that can contain other views (called children) like layouts and views.
 * ViewGroup is an abstract class. You can't create instance from it.
 */
// ViewGroup.prototype = Object.create(View.prototype);
export default class ViewGroupIOS<TEvent extends string = ViewGroupEvents, TNative extends { [key: string]: any } = { [key: string]: any }, TProps extends IViewGroup = IViewGroup>
  extends ViewIOS<ViewGroupEvents | ExtractEventValues<TEvent>, TNative, TProps>
  implements IViewGroup
{
  private _childs: Record<string, IView> = {};
  onChildViewAdded: IViewGroup['onViewAdded'];
  onChildViewRemoved: IViewGroup['onViewRemoved'];
  onViewRemovedInnerCallback: IViewGroup['onViewRemoved'];
  onViewAddedInnerCallback: IViewGroup['onViewAdded'];
  constructor(params?: Partial<TProps>) {
    super(params);
    this.nativeObject.didAddSubview = (e: __SF_UIView) => {
      const view = this._childs[e.subview.uuid];
      if (view) {
        this.onViewAdded?.(view);
        this.onChildViewAdded?.(view);
        this.onViewAddedInnerCallback?.(view);
      }
    };
    this.nativeObject.willRemoveSubview = (e: __SF_UIView) => {
      const view = this._childs[e.subview.uuid];
      if (view) {
        this.onViewRemoved?.(view);
        this.onChildViewRemoved?.(view);
        this.onViewRemovedInnerCallback?.(view);
      }
    };
    this.addAndroidProps(this.getAndroidProps());
  }
  onViewAdded: (view: IView) => void;
  onViewRemoved: (view: IView) => void;
  addChild(view: IView): void {
    view.parent = this;
    const uniqueId = view.uniqueId;
    this._childs[uniqueId] = view;
    this.nativeObject.addSubview(view.nativeObject);
    __SF_UIView.applyToRootView();
  }

  private getAndroidProps() {
    return {
      requestDisallowInterceptTouchEvent: (disallow: boolean) => {}
    };
  }

  // TODO: Make View disposable and move that logic into
  removeChild(view: ViewIOS) {
    view.nativeObject.removeFromSuperview();
    delete this._childs[view.uniqueId];
    view.parent = undefined;
    __SF_UIView.applyToRootView();
  }

  removeAll() {
    for (const child in this._childs) {
      this._childs[child].parent = undefined;
      this._childs[child].nativeObject.removeFromSuperview();
    }
    this._childs = {};
    __SF_UIView.applyToRootView();
  }

  getChildCount() {
    return Object.keys(this._childs).length;
  }

  getChildList() {
    return Object.values(this._childs);
  }

  findChildById(id: string) {
    for (const prop in this._childs) {
      if (this._childs[prop].id === id) {
        return this._childs[prop];
      }
    }
  }
}
