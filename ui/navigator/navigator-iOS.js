function NavigatorViewModel(params) {
    var self = this;
    
    // Identifier
    self.type = "Navigator";
    self.routerPath = null;
    ////////////////////////////////////////////////////////////////////////////
    
    // System Specific
    self.ios = {};
    self.android = {};
    ////////////////////////////////////////////////////////////////////////////
    
    // View
    var _navigatorView = null;
    Object.defineProperty(self, 'view', {
        get: function() {
            return _navigatorView;
        },
        set: function(navigatorView) {
            if (typeof navigatorView === 'object') {
                _navigatorView = navigatorView;
            }
        },
        enumerable: true
    });
    ////////////////////////////////////////////////////////////////////////////
    
    // Model
    self.model = new NavigatorModel();
    ////////////////////////////////////////////////////////////////////////////
    
    // Properties
    ////////////////////////////////////////////////////////////////////////////
    var _prefersLargeTitles = false;
    Object.defineProperty(self.ios, 'prefersLargeTitles', {
        get: function() {
            return _prefersLargeTitles;
        },
        set: function(value) {
            if (typeof value === 'boolean') {
                _prefersLargeTitles = value;
                if (self.view) {
                    self.view.setPrefersLargeTitles(_prefersLargeTitles);
                }
            }
        },
        enumerable: true
    });
    
    // Functions
    this.add = function (key, value, isSingleton) {
        var retval = false;
        
        if (typeof(key) !== "string") {
            throw TypeError("add takes string and Page as parameters");
        }
        
        var _isSingleton = false;
        if (typeof (isSingleton) === "boolean") {
            _isSingleton = isSingleton;    
        }
        
        if (value) {
            var object = {
                key : key,
                value : {
                    pageClassPath : null,
                    pageInstance : null,
                    isSingleton : _isSingleton
                }
            };
            
            if (typeof value === 'string') {
                object.value.pageClassPath = value;
            } else if (typeof value === 'object') {
                object.value.pageInstance = value;
            }
            retval = self.model.addObject(object);
        }
        return retval;
    };
    this.go = function (key, parameters, animated, layoutNeeded) {
        if (!layoutNeeded) 
        {
            // From navigator
            self.model.rootPage = self.model.divideRoute(key)[0];
        } 
        else 
        {
            var pageToGo = null;
            var routes = [];
            
            var _animated = true;
            if (typeof (animated) === "boolean") 
            {
                _animated = animated;
            }
            
            // Page stuff
            if (typeof(key) === "object") 
            {
                pageToGo = key;
            } 
            else if (typeof(key) === "string")
            {
                routes = self.model.divideRoute(key);
                
                if (self.view === null) 
                {
                    var rootPage = self.model.getPageInstance(self.model.rootPage);
                    var nativeRootPage;
                    if (rootPage.type == "TabBarFlow") 
                    {
                        rootPage.go(routes[1],parameters,_animated);
                        nativeRootPage = rootPage.tabBarView.nativeObject;
                    } 
                    else 
                    {
                        nativeRootPage = rootPage.nativeObject;
                    }
                    
                    self.view = new NavigatorView({
                        viewModel: self,
                        rootPage : nativeRootPage
                    });
                    self.model.currentPage = rootPage;
                    self.model.history.push(rootPage);
                }
                else if (routes[0] !== self.model.rootPage)
                {
                    pageToGo = self.model.getPageInstance(routes[0]);
                }
                
                if (pageToGo) 
                {
                    if (typeof (parameters) != 'undefined' && parameters != null) 
                    {
                        pageToGo.__pendingParameters = parameters; 
                    }
                    
                    var pageInfo = {};
                    switch (pageToGo.type) 
                    {
                        case 'TabBarFlow': 
                        {
                            pageToGo.go(routes[1],parameters,_animated);
                            pageInfo.nativeObject = pageToGo.tabBarView.nativeObject;
                            pageInfo.animated = _animated;
                            break;
                        }
                        default: 
                        {
                            pageInfo.nativeObject = pageToGo.nativeObject;
                            pageInfo.animated = _animated;
                            break;
                        }
                    }
                    
                    var isShowed = self.view.show(pageInfo);
                    if (isShowed) 
                    {
                        self.model.currentPage = pageToGo;
                        var pageIndex = self.model.history.indexOf(pageToGo);
                        if (pageIndex == -1) 
                        {
                            self.model.history.push(pageToGo);
                        } 
                        else 
                        {
                            for (var i = self.model.history.length - 1; i > pageIndex; --i) 
                            {
                                self.model.history.pop();
                            }
                        }
                    }

                }
            }
        }
    };
    this.goBack = function (key, parameters, animated, layoutNeeded) {
        if (key) {
            this.go(key, parameters, animated, layoutNeeded);
        } else {
            if (self.model.currentPage.type == "TabBarFlow" && self.model.currentPage.tabBarBrain.getCurrentPage().type == "Navigator") {
                self.model.currentPage.tabBarBrain.getCurrentPage().goBack(null, parameters, animated, layoutNeeded);
            } else {
                self.model.history.pop();
                this.go(self.model.history[self.model.history.length - 1], parameters, animated, layoutNeeded);
            }
        }
    };
    this.getCurrent = function () {
        var retval = null;
        if (self.model.currentPage) {
            if (self.model.currentPage.type) {
                retval = "/" + self.model.currentPage.routerPath + self.model.currentPage.getCurrent();
            } else {
                retval = "/" + self.model.currentPage.routerPath;
            }
        }
        
        return retval;
    };
    ////////////////////////////////////////////////////////////////////////////
    
    // From View's Delegate
    this.didShowViewController = function(viewController, index){
        // If user press back button, history needs to update
        for (var i = self.model.history.length - 1; i > index; --i) {
            self.model.history.pop();
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
};

function NavigatorView(params) {
    const UINavigationBar = SF.requireClass("UINavigationBar");
    const UINavigationController = SF.requireClass("UINavigationController");
    
    var self = this;
    var viewModel = params.viewModel;
    
    self.setPrefersLargeTitles = function(prefersLargeTitles) {
        if (UINavigationBar.instancesRespondToSelector("prefersLargeTitles")) {
            self.nativeObject.navigationBar.prefersLargeTitles = prefersLargeTitles;
        }
    };
    
    // It shouldnt create with rootPage
    if (typeof params.rootPage === 'object') {
        // Native object creation
        var nativeNavigationController = UINavigationController.new();
        nativeNavigationController.viewControllers = [params.rootPage];
        nativeNavigationController.navigationBar.translucent = false;

        // Assign as native object
        self.nativeObject = nativeNavigationController;
        self.setPrefersLargeTitles(viewModel.ios.prefersLargeTitles); // It requires self.native object
        
        self.nativeObjectDelegate = SF.defineClass('NavigationControllerDelegate : NSObject <UINavigationControllerDelegate>',{
            navigationControllerDidShowViewControllerAnimated : function (navigationController, viewController, animated){
                var index = 0;
                var childViewControllerArray = navigationController.childViewControllers;
                for (var i = childViewControllerArray.length - 1; i >= 0; --i) {
                    if(viewController === childViewControllerArray[i]){
                        index = i;
                        break;
                    }
                }
                viewModel.didShowViewController(viewController, index);
            }
        }).new();
        
        self.nativeObject.delegate = self.nativeObjectDelegate;
    }
    
    // Functions
    this.show = function(info){
        var viewController = info.nativeObject;
        
        // Check from native array
        var viewControllerExists = false;
        var childViewControllerArray = self.nativeObject.childViewControllers;
        for (var i = 0; i < childViewControllerArray.length; i++) { 
            if(viewController.isEqual(childViewControllerArray[i])){
                viewControllerExists = true;
                break;
            }
        }
        
        // Show
        var isShowed = false;
        if (viewControllerExists) {
            self.nativeObject.popToViewControllerAnimated(viewController, info.animated);
            isShowed = true;
        } else {
            self.nativeObject.pushViewControllerAnimated(viewController, info.animated);
            isShowed = true;
        }
        
        return isShowed;
    };
    
    ////////////////////////////////////////////////////////////////////////////
};

function NavigatorModel(params) {
    var self = this;
    
    var objects = {};
    self.history = [];
    self.currentPage = null;
    self.rootPage = null;
    
    // Functions
    this.addObject = function(object){
        var retval = false;
        if (!objects[object.key]) {
            objects[object.key] = object.value;
            retval = true;
        }
        return retval;
    };
    this.divideRoute = function (route) {
        var dividedRoute = [];
        if (route.substr(0,route.indexOf('/')) === "") {
            dividedRoute.push(route);
        } else {
            dividedRoute.push(route.substr(0,route.indexOf('/')));
            dividedRoute.push(route.substr(route.indexOf('/') + 1));
        }
        return dividedRoute;
    };
    this.getPageInstance = function (key) {
        if (objects[key]) {
            var retval = null;
            if (objects[key].isSingleton) {
                retval = objects[key].pageInstance || (objects[key].pageInstance = new (require(objects[key].pageClassPath))());
            } else {
                retval = objects[key].pageInstance || new (require(objects[key].pageClassPath))();
            }
            retval.routerPath = key;
            return retval;
        } else {
            throw Error(key + " is not in routes");
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    
};

module.exports = NavigatorViewModel;