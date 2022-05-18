import Page from '../../../ui/page';
import { IController, INavigationController } from '../../../ui/navigationcontroller/navigationcontroller';
import FragmentTransition from './fragmenttransition';
import BottomTabBarController from '../../../ui/bottomtabbarcontroller';
import NavigationControllerAndroid from '../../../ui/navigationcontroller/navigationcontroller.android';

type PageWithController = Page | INavigationController;

export type ControllerPresentParams = {
  controller: IController;
  animation?: boolean;
  animated?: boolean;
  isComingFromPresent?: boolean;
  onComplete?: () => void;
  onCompleteCallback?: () => void;
  animationType?: FragmentTransition.AnimationType;
  options?: {};
  sheetPresentationController?: any;
};
namespace ViewController {
  export function activateRootController(controller: IController) {
    if (!controller) return;
    controller.isActive = true;
    let parentController = controller.parentController;
    while (parentController) {
      parentController.isActive = true;
      parentController = parentController.parentController;
    }
  }
  export function deactivateRootController(controller: IController) {
    if (!controller) return;
    controller.isActive = false;
    let parentController = controller.parentController;
    while (parentController) {
      parentController.isActive = false;
      parentController = parentController.parentController;
    }
  }
  export function setIsActiveOfController(controller: IController, isActive: boolean) {
    if (!controller || controller instanceof Page) return;
    controller.isActive = isActive;
    let childController = controller.getCurrentController();
    while (childController) {
      childController.isActive = isActive;
      if (childController instanceof Page) break;
      childController = controller.getCurrentController();
    }
  }
  export function activateController(controller: IController) {
    ViewController.setIsActiveOfController(controller, true);
  }
  export function deactivateController(controller: IController | null) {
    if (controller) {
      ViewController.setIsActiveOfController(controller, false);
    }
  }
  export function setController(params: ControllerPresentParams) {
    if (params.controller instanceof NavigationControllerAndroid) {
      const childControllerStack = params.controller.childControllers;
      const childControllerStackLenght = childControllerStack.length;

      // This check is requested by Smartface Router team.
      if (childControllerStackLenght === 0)
        // no child controller
        return;

      // show latest page or controller
      params.controller.show({
        controller: childControllerStack[childControllerStackLenght - 1],
        animated: params.animated,
        isComingFromPresent: params.isComingFromPresent,
        onCompleteCallback: params.onComplete
      });
    } else if (params.controller instanceof Page) {
      // TODO: Check pageID settings! Code duplicate exists
      if (!params.controller.pageID) {
        params.controller.pageID = FragmentTransition.generatePageID();
      }
      // TODO: Check animation type. I am not sure about that!
      FragmentTransition.push({
        page: params.controller,
        animated: params.animated,
        isComingFromPresent: params.isComingFromPresent,
        onCompleteCallback: params.onComplete
      });
    } else if (params.controller instanceof BottomTabBarController) {
      // BottomTabBarController doesn't support pop-up or reveal animation yet.
      params.controller.isInsideBottomTabBar = true;
      params.controller.show();
    } else {
      throw Error('controller parameter mismatch, Parameter must be UI.Page, UI.NavigationController or UI.BottomTabBarController');
    }
  }

  export function getCurrentPageFromController(controller: PageWithController): Page | IController | null {
    if (controller instanceof Page) {
      return controller;
    }

    if (controller.childControllers.length > 0) {
      let childController: IController | null = controller.childControllers[controller.childControllers.length - 1];
      while (childController instanceof BottomTabBarController) {
        childController = childController.getCurrentController();
      }
      return childController;
    }
    return null;
  }

  export function setIsInsideBottomTabBarForAllChildren(controller: IController) {
    controller.isInsideBottomTabBar = true;
    if (controller instanceof Page) {
      return;
    }

    // for NavigationController
    controller.childControllers?.forEach((childController) => {
      childController.isInsideBottomTabBar = true;
      ViewController.setIsInsideBottomTabBarForAllChildren(childController);
    });
  }
}

export default ViewController;
