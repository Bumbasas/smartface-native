const Screen = require('sf-core/device/screen');
const Invocation = require('sf-core/util/iOS/invocation.js');

KeyboardAnimationDelegate.offsetFromTop = function(self) {
    if (!self.getParentViewController()) {
        return 0;
    };

    var statusBar = KeyboardAnimationDelegate.statusBarFrames(self);
    if (self.getParentViewController().navigationController && self.getParentViewController().navigationController.navigationBar.visible) {
        if (!self.getParentViewController().statusBarHidden) {
            //44 point = iPhone X
            return (statusBar.viewRect.height == 44 ? 44 : (statusBar.viewRect.height > 20 ? 20 : statusBar.frame.height)) + self.getParentViewController().navigationController.navigationBar.frame.height;
        } else {
            return self.getParentViewController().navigationController.navigationBar.frame.height;
        }
    } else {
        return 0;
    }
}

KeyboardAnimationDelegate.statusBarFrames = function(self) {
    if (!self.getParentViewController()) {
        var frame = {
            x: 0,
            y: 0,
            height: 0,
            width: 0
        };
        return {
            frame: frame,
            windowRect: frame,
            viewRect: frame
        };
    };
    var view = self.getParentViewController().view;
    var statusBarFrame = __SF_UIApplication.sharedApplication().statusBarFrame;
    var viewWindow = Invocation.invokeInstanceMethod(view, "window", [], "NSObject");
    var argRect = new Invocation.Argument({
        type: "CGRect",
        value: statusBarFrame
    });
    var argWindow = new Invocation.Argument({
        type: "NSObject",
        value: undefined
    });
    var statusBarWindowRect = Invocation.invokeInstanceMethod(viewWindow, "convertRect:fromWindow:", [argRect, argWindow], "CGRect");

    var argRect1 = new Invocation.Argument({
        type: "CGRect",
        value: statusBarWindowRect
    });
    var argWindow1 = new Invocation.Argument({
        type: "NSObject",
        value: undefined
    });
    var statusBarViewRect = Invocation.invokeInstanceMethod(view, "convertRect:fromView:", [argRect1, argWindow1], "CGRect");

    return {
        frame: statusBarFrame,
        windowRect: statusBarWindowRect,
        viewRect: statusBarViewRect
    };
}


function KeyboardAnimationDelegate(params) {
    var self = this;

    self.nativeObject = params.nativeObject;

    self.getParentViewController = function() {
        if (self.parentView) {
            return self.parentView.parentViewController();
        }
        return undefined;
    }

    var _top = 0;
    function getViewTop(view){
        if(view.superview){
            if(view.superview.constructor.name === "SMFUIView"){
                _top += view.frame.y;
            }else if (view.superview.constructor.name === "SMFUIScrollView") {
                _top += view.frame.y - view.superview.contentOffset.y;
            }

            if (view.superview.constructor.name === "UIWindow") { // Check Dialog
                self.parentDialog = view;
            } else {
                self.parentDialog = undefined;
            }

            if (view.superview.superview) {
                var isRootView = (view.superview.superview.valueForKey("restorationIdentifier") == "RouterView") ? true : false;
                if (view.superview.superview.constructor.name !== "UIViewControllerWrapperView" && !isRootView) {
                    return getViewTop(view.superview);
                } else {
                    self.parentView = view.superview;
                }
            }
        }

        var statusBar = KeyboardAnimationDelegate.statusBarFrames(self);
        _top += statusBar.viewRect.height > 20 ? 20 : 0;

        var temp = _top;
        _top = 0;
        return temp;
    }

    var _isKeyboadAnimationCompleted = true;
    var _topDistance = 0;
    self.keyboardShowAnimation = function(keyboardHeight, e, isBeginEditing) {
        KeyboardAnimationDelegate.isKeyboardVisible = true;
        KeyboardAnimationDelegate.ApplicationKeyboardHeight = keyboardHeight;
        var controlValue = 0;
        var height = self.nativeObject.frame.height;
        var top = getViewTop(self.nativeObject);

        if (self.getParentViewController() || self.parentDialog) {
            controlValue = top + height;

            if (controlValue + KeyboardAnimationDelegate.offsetFromTop(self) > Screen.height - keyboardHeight) {
                _isKeyboadAnimationCompleted = false;
                _topDistance = controlValue - (Screen.height - keyboardHeight);

                if (!self.parentDialog) {
                    if (self.getParentViewController().tabBarController) {
                        if (_topDistance + self.getParentViewController().tabBarController.tabBar.frame.height > keyboardHeight) {
                            _topDistance = keyboardHeight - self.getParentViewController().tabBarController.tabBar.frame.height;
                        }
                    } else {
                        if (_topDistance > keyboardHeight) {
                            _topDistance = keyboardHeight;
                        }
                    }
                }


                if (e && e.userInfo) {
                    var animatonDuration = e.userInfo.UIKeyboardAnimationDurationUserInfoKey;
                    var animationCurve = e.userInfo.UIKeyboardAnimationCurveUserInfoKey;
                    var animationOptions = animationCurve << 16;

                    var invocationAnimation = __SF_NSInvocation.createClassInvocationWithSelectorInstance("animateWithDuration:delay:options:animations:completion:", "UIView");
                    if (invocationAnimation) {
                        invocationAnimation.setClassTargetFromString("UIView");
                        invocationAnimation.setSelectorWithString("animateWithDuration:delay:options:animations:completion:");
                        invocationAnimation.retainArguments();
                        invocationAnimation.setDoubleArgumentAtIndex(animatonDuration, 2);
                        invocationAnimation.setDoubleArgumentAtIndex(0, 3);
                        invocationAnimation.setNSUIntegerArgumentAtIndex(animationOptions, 4);
                        invocationAnimation.setVoidBlockArgumentAtIndex(function() {
                            var parent = self.parentDialog ? self.parentDialog : self.parentView;
                            var frame = parent.frame;
                            frame.y = -_topDistance;
                            parent.frame = frame;
                        }, 5);
                        invocationAnimation.setBoolBlockArgumentAtIndex(function(e) {

                        }, 6);
                        invocationAnimation.invoke();
                        _isKeyboadAnimationCompleted = true; // bug id : IOS-2763
                    }
                } else {
                    var parent = self.parentDialog ? self.parentDialog : self.parentView;
                    var frame = parent.frame;
                    frame.y = -_topDistance;
                    parent.frame = frame;
                    _isKeyboadAnimationCompleted = true;
                }
            } else {
                if (self.getParentViewController()) {
                    if (self.getParentViewController().view.frame.y !== KeyboardAnimationDelegate.offsetFromTop(self) && self.getParentViewController().view.frame.y != 0) {
                        if (e && e.userInfo) {
                            self.keyboardHideAnimation({
                                userInfo: e.userInfo,
                                isBeginEditing: isBeginEditing
                            });
                        } else {
                            self.keyboardHideAnimation({
                                isBeginEditing: isBeginEditing
                            });
                        }
                    }
                } else if (self.parentDialog) {
                    if (self.parentDialog.frame.y !== KeyboardAnimationDelegate.offsetFromTop(self)) {
                        if (e && e.userInfo) {
                            self.keyboardHideAnimation({
                                userInfo: e.userInfo,
                                isBeginEditing: isBeginEditing
                            });
                        } else {
                            self.keyboardHideAnimation({
                                isBeginEditing: isBeginEditing
                            });
                        }
                    }
                }
            }

        }
    }

    self.textFieldShouldBeginEditing = function() {
        if (KeyboardAnimationDelegate.ApplicationKeyboardHeight != 0 && KeyboardAnimationDelegate.isKeyboardVisible) {
            self.keyboardShowAnimation(KeyboardAnimationDelegate.ApplicationKeyboardHeight, {
                userInfo: {
                    UIKeyboardAnimationDurationUserInfoKey: 0.2,
                    UIKeyboardAnimationCurveUserInfoKey: 2
                }
            }, true)
        }
    }

    self.keyboardHideAnimation = function(e) {
        if (!(e && e.isBeginEditing)) {
            KeyboardAnimationDelegate.isKeyboardVisible = false;
        }
        if (self.getParentViewController() || self.parentDialog) {
            if (_isKeyboadAnimationCompleted) {
                if (e && e.userInfo) {
                    var animatonDuration = e.userInfo.UIKeyboardAnimationDurationUserInfoKey;
                    var animationCurve = e.userInfo.UIKeyboardAnimationCurveUserInfoKey;
                    var animationOptions = animationCurve << 16;

                    var invocationAnimation = __SF_NSInvocation.createClassInvocationWithSelectorInstance("animateWithDuration:delay:options:animations:completion:", "UIView");
                    if (invocationAnimation) {
                        invocationAnimation.setClassTargetFromString("UIView");
                        invocationAnimation.setSelectorWithString("animateWithDuration:delay:options:animations:completion:");
                        invocationAnimation.retainArguments();
                        invocationAnimation.setDoubleArgumentAtIndex(animatonDuration, 2);
                        invocationAnimation.setDoubleArgumentAtIndex(0, 3);
                        invocationAnimation.setNSUIntegerArgumentAtIndex(animationOptions, 4);
                        invocationAnimation.setVoidBlockArgumentAtIndex(function() {
                            var parent = self.parentDialog ? self.parentDialog : self.parentView;
                            var frame = parent.frame;
                            frame.y = KeyboardAnimationDelegate.offsetFromTop(self);
                            parent.frame = frame;
                        }, 5);
                        invocationAnimation.setBoolBlockArgumentAtIndex(function(e) {

                        }, 6);
                        invocationAnimation.invoke();
                    }
                } else {
                    var parent = self.parentDialog ? self.parentDialog : self.parentView;
                    var frame = parent.frame;
                    frame.y = KeyboardAnimationDelegate.offsetFromTop(self);
                    parent.frame = frame;
                }

            }
        }
    }
}

KeyboardAnimationDelegate.ApplicationKeyboardHeight = 0;
KeyboardAnimationDelegate.isKeyboardVisible = false;

module.exports = KeyboardAnimationDelegate;