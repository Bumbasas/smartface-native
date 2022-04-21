import { AbstractNavigationController, Controller, IController, INavigationController, OperationType } from './navigationcontroller';
import NativeComponent from '../../core/native-component';
import BottomTabbarController from '../bottomtabbarcontroller';
import TabBarController from '../tabbarcontroller';
import { HeaderBar } from './headerbar';
import { ControllerPresentParams } from '../../util/Android/transition/viewcontroller';
import copyObjectPropertiesWithDescriptors from '../../util/copyObjectPropertiesWithDescriptors';
import { MobileOSProps } from '../../core/native-mobile-component';
import { IView, ViewIOSProps, ViewAndroidProps } from '../view/view';
import Page from '../page';

interface BottomSheetOptions {
  cornerRadius?: number;
  detents?: ('large' | 'small' | 'medium')[];
  isGrabberVisible?: boolean;
}
export default class NavigationControllerIOS extends AbstractNavigationController implements INavigationController, IController {
  protected _headerBar: HeaderBar;
  protected model: NavigationModel;
  pageID: number;
  view: NavigationView;
  tabBar?: TabBarController;
  isActive: boolean;
  popupBackNavigator: boolean;
  isInsideBottomTabBar: boolean;

  constructor(params: Partial<INavigationController>) {
    super(params);
    this._headerBar = new HeaderBar({
      navigationController: this
    });
    this._headerBar.ios.translucent = false;
  }
  transitionViews?: IView<'touch' | 'touchCancelled' | 'touchEnded' | 'touchMoved', { [key: string]: any }, MobileOSProps<ViewIOSProps, ViewAndroidProps>>[] | undefined;
  popUpBackPage?: any;
  dismissStart: () => void;
  dismissComplete: () => void;
  dismissCancel: () => void;
  onCompleteCallback?: (() => void) | undefined;
  protected __createNativeObject__() {
    this.view = new NavigationView({ viewModel: this });
    this.model = new NavigationModel();
    return this.view.nativeObject;
  }

  protected __init__(params?: Partial<Record<string, any>>): void {
    this.isActive = false;
    this.popupBackNavigator = false;
    super.__init__(params);
  }

  getCurrentController(): IController {
    return this.childControllers[this.childControllers.length - 1];
  }

  show(params: { controller: IController; animated: any; isComingFromPresent?: boolean; onCompleteCallback?: () => void }) {
    throw new Error('Method not implemented.');
  }

  get childControllers(): INavigationController['childControllers'] {
    return this.model.childControllers;
  }
  set childControllers(value: INavigationController['childControllers']) {
    if (typeof value === 'object') {
      this.model.childControllers = value as any; //TODO: Fix typing issue

      const nativeChildPageArray: any[] = [];
      for (const i in this.model.childControllers) {
        this.model.childControllers[i].parentController = this;
        nativeChildPageArray.push(this.model.childControllers[i].nativeObject);
      }
      this.view.setNativeChildViewControllers(nativeChildPageArray);
    }
  }
  get headerBar(): HeaderBar {
    return this._headerBar;
  }
  set headerBar(value: HeaderBar) {
    copyObjectPropertiesWithDescriptors(this._headerBar, value);
  }
  push(params: { controller: Controller; animated?: boolean }): void {
    if (params.controller instanceof Page) {
      params.controller.once('dismissStart', () => this.dismissStart());
    }
    this.view.push(params.controller, !!params.animated);
    this.model.pushPage(params.controller);
    params.controller.parentController = this;
  }
  pop(params: { animated: boolean } = { animated: true }): void {
    this.view.pop(!!params.animated);
    this.model.popPage();
  }
  popTo(params: { controller: Controller; animated?: boolean }): void {
    this.view.popTo(params.controller, !!params.animated);
    this.model.popToPage(params.controller);
  }
  willShow: (params: { controller: Controller; animated?: boolean }) => void;
  onTransition: (e: { controller?: Controller; operation: OperationType; currentController?: Controller; targetController?: Controller }) => void;
  present(params?: ControllerPresentParams, bottomSheet = false): void {
    if (typeof params === 'object') {
      const controller = params.controller;
      const animation = params.animated;
      const onComplete = params.onComplete;

      if (controller instanceof NavigationControllerIOS) {
        const _animationNeed = animation;
        const _completionBlock = () => onComplete?.();

        let controllerToPresent;
        if (controller?.nativeObject) {
          controllerToPresent = controller.nativeObject;

          const currentPage = this.getVisiblePage(this.childControllers[this.childControllers.length - 1]) as unknown as __SF_UIViewController;
          currentPage.dismissStart = () => {
            this.dismissStart?.();
            currentPage.dismissStart = null;
          };
          currentPage.dismissComplete = () => {
            this.dismissComplete?.();
            currentPage.dismissComplete = null;
          };
          if (typeof currentPage.transitionViews !== 'undefined') {
            controllerToPresent.setValueForKey(true, 'isHeroEnabled');
          }
          if (bottomSheet) {
            this.view.presentBottomSheet(controllerToPresent, _animationNeed, _completionBlock, params.options || {});
          } else {
            this.view.present(controllerToPresent, _animationNeed, _completionBlock);
          }
        }
      }
    }
  }

  dismiss(params: { onComplete: () => void; animated: boolean }): void {
    const onComplete = params.onComplete;
    const animation = params.animated;
    const _completionBlock = () => onComplete?.();
    this.view.dismiss(_completionBlock, animation);
  }
  private getVisiblePage(currentPage: Controller) {
    let retval = currentPage;
    if (currentPage instanceof BottomTabbarController) {
      const controller = currentPage.childControllers[currentPage.selectedIndex];
      retval = this.getVisiblePage(controller);
    } else if (currentPage instanceof NavigationControllerIOS) {
      const controller = currentPage.childControllers[currentPage.childControllers.length - 1] as IController;
      retval = this.getVisiblePage(controller);
    }
    return retval;
  }
  willShowViewController(index: number, animated?: boolean) {
    const page = this.model.pageForIndex(index);
    page &&
      this.willShow?.({
        controller: page,
        animated: animated
      });
  }

  didShowViewController(viewController: __SF_UIViewController, index: number, animated?: boolean) {
    let fromIndex = 0;
    let toIndex = 0;
    if (this.model.pageToPush) {
      const operation = NavigationControllerIOS.OperationType.PUSH;
      fromIndex = index - 1;
      toIndex = index;
      this.animationControllerForOperationFromViewControllerToViewController(operation, fromIndex, toIndex);
    } else if (this.view.nativeObject.viewControllers.length < this.model.childControllers.length) {
      const operation = NavigationControllerIOS.OperationType.POP;
      fromIndex = this.model.childControllers.length - 1;
      toIndex = index;
      this.animationControllerForOperationFromViewControllerToViewController(operation, fromIndex, toIndex);
      this.model.popToIndex(index);
    }
    if (this.model.pageToPush) {
      this.model.pageToPush = null;
    }
  }
  private animationControllerForOperationFromViewControllerToViewController(operation: number, fromIndex: number, toIndex: number) {
    const fromController = this.model.childControllers[fromIndex];
    const toController = this.model.pageForIndex(toIndex);
    toController &&
      this.onTransition?.({
        currentController: fromController,
        targetController: toController,
        operation: operation
      });
  }
  static OperationType = OperationType;
}

class NavigationView extends NativeComponent<__SF_UINavigationController> {
  viewModel: NavigationControllerIOS;
  private __navigationControllerDelegate: __SF_SMFNavigationControllerDelegate;
  constructor(params: { viewModel?: any } = {}) {
    super(params);
  }
  protected __createNativeObject__(params) {
    this.viewModel = params.viewModel;
    return new __SF_UINavigationController();
  }
  protected __init__(params?: Partial<Record<string, any>>): void {
    this.__navigationControllerDelegate = new __SF_SMFNavigationControllerDelegate();
    this.__navigationControllerDelegate.navigationControllerWillShowViewControllerAnimated = (navigationController, viewController, animated) => {
      const index = this.nativeObject.viewControllers.indexOf(viewController);
      this.viewModel.willShowViewController(index, animated);
    };

    this.__navigationControllerDelegate.navigationControllerDidShowViewControllerAnimated = (navigationController, viewController, animated) => {
      const index = this.nativeObject.viewControllers.indexOf(viewController);
      this.viewModel.didShowViewController(viewController, index, animated);
    };

    this.nativeObject.delegate = this.__navigationControllerDelegate;
    super.__init__(params);
  }
  push(page: IController, animated?: boolean) {
    if (page.nativeObject) {
      this.nativeObject.pushViewControllerAnimated(page.nativeObject, animated);
    }
  }
  pop(animated?: boolean) {
    this.nativeObject.popViewControllerAnimated(animated);
  }

  popTo(page: IController, animated?: boolean) {
    if (page.nativeObject) {
      this.nativeObject.popToViewControllerAnimated(page.nativeObject, animated);
    }
  }

  present(controllerToPresent: __SF_UIViewController, animated?: boolean, completionBlock?: () => void) {
    this.nativeObject.presentViewController(controllerToPresent, completionBlock, animated);
  }

  presentBottomSheet(controllerToPresent: ControllerPresentParams, animated?: boolean, completionBlock?: () => void, options: BottomSheetOptions = {}) {
    this.nativeObject.presentSheetController(this.applySheetOptions(controllerToPresent, options), completionBlock, animated);
  }

  dismiss(completionBlock: () => void, animated?: boolean) {
    this.nativeObject.dismissViewController(completionBlock, animated);
  }

  setNativeChildViewControllers(nativeChildPageArray: __SF_UIViewController[]) {
    this.nativeObject.viewControllers = nativeChildPageArray;
  }

  private applySheetOptions(controller: ControllerPresentParams, options: BottomSheetOptions) {
    if (options.cornerRadius) {
      controller.sheetPresentationController.cornerRadius(controller.sheetPresentationController, options.cornerRadius);
    }
    if (options.detents && options.detents.length > 0) {
      const customDetents: any = [];
      options.detents.map((key) => {
        if (key === 'medium') {
          customDetents.push(controller.sheetPresentationController.medium());
        }
        if (key === 'large') {
          customDetents.push(controller.sheetPresentationController.large());
        }
      });
      if (customDetents.length > 0) {
        controller.sheetPresentationController.detents = customDetents;
      }
    }
    if (typeof options.isGrabberVisible === 'boolean') {
      controller.sheetPresentationController.prefersGrabberVisible = options.isGrabberVisible;
    }

    return controller;
  }
}

class NavigationModel {
  private _pageToPush: IController | null = null;
  get pageToPush(): IController | null {
    return this._pageToPush;
  }
  set pageToPush(value: IController | null) {
    this._pageToPush = value;
  }
  childControllers: IController[] = [];
  pushPage(page: IController) {
    this.pageToPush = page;
    this.childControllers.push(page);
  }
  popPage() {
    const poppedPage = this.childControllers.pop();
    if (poppedPage) {
      poppedPage.parentController = null;
    }
  }
  popToPage(page: IController) {
    const index = this.childControllers.indexOf(page);
    if (index >= 0) {
      this.popToIndex(index);
    }
  }
  popToIndex(index: number) {
    for (let i = this.childControllers.length - 1; i > index; --i) {
      const poppedPage = this.childControllers.pop();
      if (poppedPage) {
        poppedPage.parentController = null;
      }
    }
  }
  pageForIndex(index: number) {
    return index >= 0 ? this.childControllers[index] : this.pageToPush;
  }
}
