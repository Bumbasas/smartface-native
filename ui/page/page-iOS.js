const FlexLayout = require('sf-core/ui/flexlayout');
const Image = require("sf-core/ui/image");
const Color = require('sf-core/ui/color');
const System = require('sf-core/device/system');
const Screen = require('sf-core/device/screen');
const OrientationType = require('sf-core/device/screen/orientationtype');
const Invocation    = require('sf-core/util').Invocation;
const HeaderBarItem = require('sf-core/ui/headerbaritem');

const UIInterfaceOrientation = {
    unknown : 0,
    portrait : 1, // Device oriented vertically, home button on the bottom
    portraitUpsideDown : 2, // Device oriented vertically, home button on the top
    landscapeLeft : 3, // Device oriented horizontally, home button on the right
    landscapeRight : 4
}

function Page(params) {
    var self = this;

    self.routerPath = null;

    if(!self.nativeObject){
        self.nativeObject = new __SF_UIViewController();
    }

    self.pageView = new FlexLayout();
    
    self.pageView.nativeObject.addObserver(function(){
                    self.layout.nativeObject.endEditing(true);
                },__SF_UIApplicationWillResignActiveNotification);
    
    self.nativeObject.automaticallyAdjustsScrollViewInsets = false;
    
    var _safeAreaPaddingObject = {
        "top" : 0,
        "bottom" : 0,
        "left" : 0,
        "right" : 0
    };
    
    function calculateSafeAreaPaddings(paddingObject) {
        self.pageView.paddingTop = paddingObject.top;
        self.pageView.paddingBottom = paddingObject.bottom;
        self.pageView.paddingLeft = paddingObject.left;
        self.pageView.paddingRight = paddingObject.right;
        self.calculatePosition();
    }
    
    self.ios = {};
    var _safeAreaLayoutMode = false;
    Object.defineProperty(self.ios, 'safeAreaLayoutMode', {
        get: function() {
            return _safeAreaLayoutMode;
        },
        set: function(value) {
            if (_safeAreaLayoutMode !== value) { // Prevents unnecessary applyLayout() calls.
                _safeAreaLayoutMode = value;
                if (_safeAreaLayoutMode === true) {
                    calculateSafeAreaPaddings(_safeAreaPaddingObject);
                } else {
                    calculateSafeAreaPaddings({ "top" : 0, "bottom" : 0, "left" : 0, "right" : 0 });
                }
                self.layout.applyLayout();
            }
        },
        enumerable: true
    });
    
    self.nativeObject.onViewSafeAreaInsetsDidChange = function (e) {
        _safeAreaPaddingObject = e;
        if (_safeAreaLayoutMode) {
            calculateSafeAreaPaddings(_safeAreaPaddingObject);
        }

        if (typeof self.ios.onSafeAreaPaddingChange === "function") {
            self.ios.onSafeAreaPaddingChange(_safeAreaPaddingObject);
        }
    }
    
    self.calculatePosition = function(){
        self.layout.applyLayout();
    }

    self.nativeObject.onViewLoad  = function(){
        self.pageView.nativeObject.backgroundColor = __SF_UIColor.whiteColor();
        return self.pageView.nativeObject;
    }

    self.nativeObject.onViewLayoutSubviews = function(){
        self.calculatePosition();
    }

    self.nativeObject.onViewDidAppear = function(){
        if (self.nativeObject.navigationController) { //COR-1627 for iOS 11 badge
            var subviews = Invocation.invokeInstanceMethod(self.nativeObject.navigationController.navigationBar,"subviews",[],"id");
            for (var i = 0; i < subviews.length; i++) {
                if (subviews[i].constructor.name == "_UINavigationBarContentView") {
                    var argConstant= new Invocation.Argument({
                        type:"BOOL",
                        value: false
                    });
                    Invocation.invokeInstanceMethod(subviews[i],"setClipsToBounds:",[argConstant]);
                    break;
                }
            }
        }
    }
    
    var _onOrientationChange;
    Object.defineProperty(this, 'onOrientationChange', {
        get: function() {
            return _onOrientationChange;
        },
        set: function(onOrientationChange) {
            _onOrientationChange = onOrientationChange.bind(this);
        },
        enumerable: true
    });
    
    self.onOrientationChangeHandler = function(){
        if (typeof self.onOrientationChange === "function"){
            var tempOrientation;
            switch (Screen.orientation) {
                case OrientationType.PORTRAIT:
                    tempOrientation = Page.Orientation.PORTRAIT;
                    break; 
                case OrientationType.UPSIDEDOWN:
                    tempOrientation = Page.Orientation.UPSIDEDOWN;
                    break; 
                case OrientationType.LANDSCAPELEFT:
                    tempOrientation = Page.Orientation.LANDSCAPELEFT;
                    break; 
                case OrientationType.LANDSCAPERIGHT:
                    tempOrientation = Page.Orientation.LANDSCAPERIGHT;
                    break; 
                default: 
                   tempOrientation = Page.Orientation.PORTRAIT;
            }
            self.onOrientationChange({orientation : tempOrientation});
        }
    }
    
    self.nativeObject.viewWillTransition = self.onOrientationChangeHandler;
    
    Object.defineProperty(self, 'layout', {
        get: function() {
            return self.pageView;
        },
        enumerable: true
    });

    self.layout.applyLayout = function(){
        self.layout.nativeObject.yoga.applyLayoutPreservingOrigin(true);
    }
    
    var _onLoad = function(){}.bind(this);
    Object.defineProperty(self, 'onLoad', {
        get: function() {
            return _onLoad;
        },
        set: function(value) {
            _onLoad = value;
            self.nativeObject.onLoad = function() {
                self.headerBar.itemColor = Color.BLACK;
                if (_onLoad instanceof Function) {
                    _onLoad.call(this);
                }
            }.bind(this);
        },
        enumerable: true
    });

    self.checkOrientation = function(){
        var currentOrientation = __SF_UIApplication.sharedApplication().statusBarOrientation;
        if (self.orientation.indexOf(currentOrientation) === -1){
            __SF_UIDevice.changeOrientation(currentOrientation); //Workaround for IOS-2580
            __SF_UIDevice.changeOrientation(self.orientation[0]);
            self.layout.applyLayout();
        }
        
    };
    
    Object.defineProperty(this, 'currentOrientation', {
        get: function() {
            var tempOrientation;
            switch (__SF_UIApplication.sharedApplication().statusBarOrientation) {
                case 1:
                    tempOrientation = Page.Orientation.PORTRAIT;
                    break; 
                case 2:
                    tempOrientation = Page.Orientation.UPSIDEDOWN;
                    break; 
                case 3:
                    tempOrientation = Page.Orientation.LANDSCAPELEFT;
                    break; 
                case 4:
                    tempOrientation = Page.Orientation.LANDSCAPERIGHT;
                    break; 
                default: 
                   tempOrientation = Page.Orientation.PORTRAIT;
            }
            return tempOrientation;
        },
        enumerable: true
    });
    
    Object.defineProperty(this, 'orientation', {
        get: function() {
            return self.nativeObject.orientations;
        },
        set: function(orientation) {
            self.nativeObject.orientations = orientation;
        },
        enumerable: true
    });
    
    self.orientation = [UIInterfaceOrientation.portrait]; // Default Portrait
    
    var _onShow = function(e){}.bind(this);
    Object.defineProperty(self, 'onShow', {
        get: function() {
            return _onShow;
        },
        set: function(value) {
            _onShow = value;
            self.nativeObject.onShow = function() {
                __SF_UIView.animation(0,0,function(){
                self.layout.nativeObject.endEditing(true);
                },{});
                self.checkOrientation();
                if (_onShow instanceof Function) {
                    _onShow.call(this, this.__pendingParameters);
                    delete this.__pendingParameters;
                }
            }.bind(this);
        },
        enumerable: true,
        configurable : true
    });
    
    self.onHideHandler = function(){
        __SF_UIView.animation(0,0,function(){
            self.layout.nativeObject.endEditing(true);
        },{});
        
        if (typeof self.onHide === "function"){
            self.onHide();
        }
    }
    
    self.nativeObject.onHide = self.onHideHandler;
    
    this.statusBar = {};
    Object.defineProperty(self.statusBar, 'height', {
         get: function() {
                return __SF_UIApplication.sharedApplication().statusBarFrame.height;
         },
         enumerable: true,configurable : true
    });

    Object.defineProperty(self.statusBar, 'visible', {
        get: function() {
            return !self.nativeObject.statusBarHidden;
        },
        set: function(value) {
            self.nativeObject.statusBarHidden = !value;
            self.nativeObject.setNeedsStatusBarAppearanceUpdate();
            var parentViewController = getParentViewController(self.nativeObject);
            if (parentViewController && parentViewController.constructor.name === "SMFNative.SMFUIViewController") {
                parentViewController.statusBarHidden = self.nativeObject.statusBarHidden;
                parentViewController.setNeedsStatusBarAppearanceUpdate();
            }
        },
        enumerable: true,configurable : true
    });

    this.statusBar.ios = {};
    // Deprecated self.statusBar.ios.style use : self.statusBar.style 
    Object.defineProperty(self.statusBar.ios, 'style', {
        get: function() {
            return self.nativeObject.statusBarStyle;
        },
        set: function(value) {
            self.nativeObject.statusBarStyle = value;
            self.nativeObject.setNeedsStatusBarAppearanceUpdate();
            var parentViewController = getParentViewController(self.nativeObject);
            if (parentViewController && parentViewController.constructor.name === "SMFNative.SMFUIViewController") {
                parentViewController.statusBarStyle = self.nativeObject.statusBarStyle;
                parentViewController.setNeedsStatusBarAppearanceUpdate();
            }
            
        },
        enumerable: true,configurable : true
    });
    
    Object.defineProperty(self.statusBar, 'style', {
        get: function() {
            return self.nativeObject.statusBarStyle;
        },
        set: function(value) {
            self.nativeObject.statusBarStyle = value;
            self.nativeObject.setNeedsStatusBarAppearanceUpdate();
            var parentViewController = getParentViewController(self.nativeObject);
            if (parentViewController && parentViewController.constructor.name === "SMFNative.SMFUIViewController") {
                parentViewController.statusBarStyle = self.nativeObject.statusBarStyle;
                parentViewController.setNeedsStatusBarAppearanceUpdate();
            }
            
        },
        enumerable: true,configurable : true
    });
    
    function getParentViewController(controller){
        var parent = Invocation.invokeInstanceMethod(controller,"parentViewController",[],"NSObject");
        if (parent) {
            return getParentViewController(parent);
        }else{
            return controller;
        }
    }
    // Prevent undefined is not an object error
    this.statusBar.android = {};
    // Prevent undefined is not an object error
    this.android = {};

    self.headerBar = {};
    
    self.headerBar.android = {};
    self.headerBar.ios = {};
    
    Object.defineProperty(self.headerBar, 'title', {
        get: function() {
            return self.nativeObject.navigationItem.title;
        },
        set: function(value) {
            self.nativeObject.navigationItem.title = value;
        },
        enumerable: true,configurable : true
    });
    
    var _titleView = true;
    Object.defineProperty(self.headerBar, 'titleLayout', {
        get: function() {
            return _titleView;
        },
        set: function(value) {
            if (typeof value === "object") {
                _titleView = value;
                _titleView.applyLayout();
                
                // These calls may need for different cases.
                // _titleView.nativeObject.layoutIfNeeded();
                // _titleView.nativeObject.translatesAutoresizingMaskIntoConstraints = true;
                _titleView.nativeObject.sizeToFit();
                
                self.nativeObject.navigationItem.titleView = _titleView.nativeObject;
            }
        },
        enumerable: true,configurable : true
    });

    Object.defineProperty(self.headerBar, 'titleColor', {
        get: function() {
            var retval = null;
            if (self.nativeObject.navigationController) {
                retval = new Color({color : self.nativeObject.navigationController.navigationBar.titleTextAttributes["NSColor"]});
            }
            return retval;
        },
        set: function(value) {
            if (self.nativeObject.navigationController) {
                self.nativeObject.navigationController.navigationBar.titleTextAttributes = {"NSColor" :value.nativeObject};
            }
        },
        enumerable: true,configurable : true
    });

    var _visible = true;
    Object.defineProperty(self.headerBar, 'visible', {
        get: function() {
            return _visible;
        },
        set: function(value) {
            _visible = value;
            if (self.nativeObject.navigationController) {
                self.nativeObject.navigationController.setNavigationBarHiddenAnimated(!value,true);
            }
        },
        enumerable: true,configurable : true
    });

    Object.defineProperty(self.headerBar, 'itemColor', {
        get: function() {
            var retval = null;
            if (self.nativeObject.navigationController) {
                retval = new Color({color : self.nativeObject.navigationController.navigationBar.tintColor});
            }
            return retval;
        },
        set: function(value) {
            if (self.nativeObject.navigationController) {
                self.nativeObject.navigationController.navigationBar.tintColor = value.nativeObject;
            }
        },
        enumerable: true,configurable : true
    });
    
    Object.defineProperty(self.headerBar, 'backgroundColor', {
        get: function() {
            var retval = null;
            if (self.nativeObject.navigationController) {
                retval = new Color({color : self.nativeObject.navigationController.navigationBar.barTintColor});
            }
            return retval;
        },
        set: function(value) {
            if (self.nativeObject.navigationController) {
                self.nativeObject.navigationController.navigationBar.barTintColor = value.nativeObject;  
            }
        },
        enumerable: true,configurable : true
    });

    Object.defineProperty(self.headerBar, 'backgroundImage', {
        get: function() {
            var retval = null;
            if (self.nativeObject.navigationController) {
                retval = Image.createFromImage(self.nativeObject.navigationController.navigationBar.backgroundImage);
            }
            return retval;
        },
        set: function(value) {
            if (self.nativeObject.navigationController) {
                self.nativeObject.navigationController.navigationBar.backgroundImage = value.nativeObject;
            }
        },
        enumerable: true,configurable : true
    });

    Object.defineProperty(self.headerBar, 'leftItemEnabled', {
        get: function() {
            return !self.nativeObject.navigationItem.hidesBackButton;
        },
        set: function(value) {
            self.nativeObject.navigationItem.hidesBackButton = !value;
            if (value){
                if (_leftItem){
                    self.nativeObject.navigationItem.leftBarButtonItem = _leftItem;
                }
            }else{
                self.nativeObject.navigationItem.leftBarButtonItem = undefined;
            }
        },
        enumerable: true,configurable : true
    });

    self.headerBar.setItems = function(value){
        var nativeObjectArray = [];
        
        for (var i = value.length-1; i >= 0; i--) { //Bug : IOS-2399
            nativeObjectArray.push(value[i].nativeObject);
        }

        self.nativeObject.navigationItem.rightBarButtonItems = nativeObjectArray;
    };

    var _leftItem;
    self.headerBar.setLeftItem = function(value){
        if(value){
            if (value instanceof HeaderBarItem) {
                if(self.headerBar.leftItemEnabled){
                    self.nativeObject.navigationItem.leftBarButtonItem = value.nativeObject;
                }
                _leftItem = value.nativeObject;
            }else{
                throw new Error("leftItem must be null or an instance of UI.HeaderBarItem");
            }
        } else {
            self.nativeObject.navigationItem.leftBarButtonItem = null;
        }
    };

    Object.defineProperty(self.headerBar, 'height', {
        get: function() {
            var retval = null;
            if (self.nativeObject.navigationController) {
                retval = self.nativeObject.navigationController.navigationBar.frame.height;
            }
            return retval;
        },
        enumerable: true,configurable : true
    });
    
    var _largeTitleDisplayMode = 0;
    Object.defineProperty(self.headerBar.ios, 'largeTitleDisplayMode', {
        get: function() {
            return _largeTitleDisplayMode;
        },
        set: function(value) {
            if (typeof value === 'number') {
                const UINavigationItem = SF.requireClass("UINavigationItem");
                if (UINavigationItem.instancesRespondToSelector("largeTitleDisplayMode")) {
                    _largeTitleDisplayMode = value;
                    self.nativeObject.navigationItem.largeTitleDisplayMode = _largeTitleDisplayMode;
                }
            }
        },
        enumerable: true
    });
    
    Object.defineProperty(self.headerBar.ios, 'backBarButtonItem', {
        get: function() {
            var retval = undefined;
            
            var nativeObject = self.nativeObject.navigationItem.backBarButtonItem;
            
            if (nativeObject) {
                var backBarButtonItem = new HeaderBarItem();
                backBarButtonItem.nativeObject = nativeObject;
                backBarButtonItem.nativeObject.target = nativeObject;
                retval = backBarButtonItem;
            }
            
            return retval;
        },
        set: function(value) {
            if (typeof value === 'object') {
                self.nativeObject.navigationItem.backBarButtonItem = value.nativeObject;
            }
        },
        enumerable: true
    });
    
    var _borderVisibility = true;
    Object.defineProperty(self.headerBar, 'borderVisibility', {
        get: function() {
            return _borderVisibility;
        },
        set: function(value) {
            if (typeof value === "boolean") {
                if (self.nativeObject.navigationController) {
                    if (value) {
                        self.nativeObject.navigationController.navigationBar.shadowImage = undefined;
                        self.nativeObject.navigationController.navigationBar.backgroundImage = undefined;
                    } else {
                        var emptyImage = __SF_UIImage.getInstance();
                        self.nativeObject.navigationController.navigationBar.shadowImage = emptyImage;
                        self.nativeObject.navigationController.navigationBar.backgroundImage = emptyImage;
                    }
                    _borderVisibility = value;
                }
            }
        },
        enumerable: true,configurable : true
    });

    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

Page.Orientation = {};
Object.defineProperty(Page.Orientation,"PORTRAIT",{
    value: [UIInterfaceOrientation.portrait]
});
Object.defineProperty(Page.Orientation,"UPSIDEDOWN",{
    value: [UIInterfaceOrientation.portraitUpsideDown]
});
Object.defineProperty(Page.Orientation,"AUTOPORTRAIT",{
    value: [UIInterfaceOrientation.portrait,UIInterfaceOrientation.portraitUpsideDown]
});
Object.defineProperty(Page.Orientation,"LANDSCAPELEFT",{
    value: [UIInterfaceOrientation.landscapeLeft]
});
Object.defineProperty(Page.Orientation,"LANDSCAPERIGHT",{
    value: [UIInterfaceOrientation.landscapeRight]
});
Object.defineProperty(Page.Orientation,"AUTOLANDSCAPE",{
    value: [UIInterfaceOrientation.landscapeLeft,UIInterfaceOrientation.landscapeRight]
});
Object.defineProperty(Page.Orientation,"AUTO",{
    value: [UIInterfaceOrientation.portrait,UIInterfaceOrientation.portraitUpsideDown,UIInterfaceOrientation.landscapeLeft,UIInterfaceOrientation.landscapeRight]
});

Page.iOS = {};
Page.iOS.LargeTitleDisplayMode = {};
Object.defineProperty(Page.iOS.LargeTitleDisplayMode,"AUTOMATIC",{
    value: 0
});
Object.defineProperty(Page.iOS.LargeTitleDisplayMode,"ALWAYS",{
    value: 1
});
Object.defineProperty(Page.iOS.LargeTitleDisplayMode,"NEVER",{
    value: 2
});

module.exports = Page;
