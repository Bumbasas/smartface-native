const View = require('../view');
const extend = require('js-base/core/extend');
const UIControlEvents = require("sf-core/util").UIControlEvents;
const Color = require('sf-core/ui/color');
const Image = require('sf-core/ui/image');
const Invocation = require('sf-core/util/iOS/invocation.js');

const UITableViewRowAnimation = {
    fade : 0,
    right : 1,// slide in from right (or out to right)
    left : 2,
    top : 3,
    bottom : 4,
    none : 5, // available in iOS 3.0
    middle : 6, // available in iOS 3.2.  attempts to keep cell centered in the space it will/did occupy
    automatic : 7 // available in iOS 5.0.  chooses an appropriate animation style for you
}


const ListView = extend(View)(
   function (_super, params) {
        var self = this;

        if(!self.nativeObject){
            self.nativeObject = new __SF_UITableView();
            self.refreshControl = new __SF_UIRefreshControl();
            self.nativeObject.addSubview(self.refreshControl);
            self.nativeObject.separatorStyle = 0;
            self.nativeObject.showsVerticalScrollIndicator = false;
            self.nativeObject.setValueForKey(0,"estimatedRowHeight");
            self.nativeObject.setValueForKey(0,"estimatedSectionHeaderHeight");
            self.nativeObject.setValueForKey(0,"estimatedSectionFooterHeight");
        }

        _super(this);

        self.onRowCreate = function(){};

        self.onRowBind = function (listViewItem, index){};
        self.onRowSelected = function (listViewItem, index){};
        self.onRowHeight = function (index){return 0};

        self.ios = {}
        
        Object.defineProperty(self.ios, 'leftToRightSwipeEnabled', {
            get: function() {
                return self.nativeObject.leftToRightSwipeEnabled;
            },
            set: function(value) {
                self.nativeObject.leftToRightSwipeEnabled = value;
            },
            enumerable: true
         });
          
        Object.defineProperty(self.ios, 'rightToLeftSwipeEnabled', {
          get: function() {
              return self.nativeObject.rightToLeftSwipeEnabled;
          },
          set: function(value) {
              self.nativeObject.rightToLeftSwipeEnabled = value;
          },
          enumerable: true
        });
        
        self.ios.onRowSwiped = function(swipeDirection,expansionSettings,index){};
        
        self.ios.swipeItem = function(title,color,padding,action){
            return __SF_MGSwipeButton.createMGSwipeButton(title,color.nativeObject,padding,action);
        }

        self.nativeObject.onRowSwiped = function(e){
            var index;
            if (e.index != -1) {
                index = e.index
            }
            return self.ios.onRowSwiped(e.direction,e.expansionSettings,index);
        }

        self.stopRefresh = function(){
            self.refreshControl.endRefreshing();
        }

        var _refreshEnabled = true;
        Object.defineProperty(self, 'refreshEnabled', {
            get: function() {
                return _refreshEnabled;
            },
            set: function(value) {
                _refreshEnabled = value;
                if (value){
                    self.nativeObject.addSubview(self.refreshControl);
                }else{
                    self.refreshControl.removeFromSuperview();
                }
            },
            enumerable: true
         });

         Object.defineProperty(self, 'onPullRefresh', {
            set: function(value) {
                self.refreshControl.addJSTarget(value.bind(this),UIControlEvents.valueChanged);
            },
            enumerable: true
          });

        Object.defineProperty(self, 'itemCount', {
            get: function() {
                return self.nativeObject.itemCount;
            },
            set: function(value) {
                self.nativeObject.itemCount = value;
            },
            enumerable: true
          });

        Object.defineProperty(self, 'rowHeight', {
            get: function() {
                return self.nativeObject.tableRowHeight;
            },
            set: function(value) {
                self.nativeObject.tableRowHeight = value;
            },
            enumerable: true
        });
        
        self.nativeObject.heightForRowAtIndex = function(e){
            return self.onRowHeight(e.index);
        };
        
        var _listItemArray = {};
        self.nativeObject.cellForRowAt = function(e){
            if (!_listItemArray[e.uuid]) {
                _listItemArray[e.uuid] = self.onRowCreate();
                self.onRowBind(_listItemArray[e.uuid],e.index);
            }else{
                self.onRowBind(_listItemArray[e.uuid],e.index);
            }
             _listItemArray[e.uuid].applyLayout();
         }

        self.nativeObject.onRowCreate =  function(e){
            _listItemArray[e.uuid] = self.onRowCreate();
            return _listItemArray[e.uuid].nativeObject;
        }
        
        self.listViewItemByIndex = function(index){
            var argActivityItems = new Invocation.Argument({
                type:"NSInteger",
                value: index
            });
            var argApplicationActivities = new Invocation.Argument({
                type:"NSInteger",
                value: 0
            });
            
            var indexPath = Invocation.invokeClassMethod("NSIndexPath","indexPathForRow:inSection:",[argActivityItems,argApplicationActivities],"NSObject");
            
            var argIndexPath = new Invocation.Argument({
                type:"NSObject",
                value: indexPath
            });
            
            var cell = Invocation.invokeInstanceMethod(self.nativeObject,"cellForRowAtIndexPath:",[argIndexPath],"NSObject");
            if (cell) {
                var uuid = Invocation.invokeInstanceMethod(cell,"uuid",[],"NSString");
                return _listItemArray[uuid];
            }
            
            return undefined
        }

        self.nativeObject.didSelectRowAt = function(e){
           self.onRowSelected(_listItemArray[e.uuid],e.index);
        };

        self.refreshData = function(){
            self.nativeObject.reloadData();
        };

        self.deleteRow = function(index){
            self.nativeObject.deleteRowIndexAnimation(index,UITableViewRowAnimation.left);
        }

        self.getFirstVisibleIndex = function(){
            var visibleIndexArray =  self.nativeObject.getVisibleIndexArray();
            return visibleIndexArray[0];
        };

        this.getLastVisibleIndex = function(){
            var visibleIndexArray =  self.nativeObject.getVisibleIndexArray();
            return visibleIndexArray[visibleIndexArray.length-1];
        };

        this.scrollTo = function(index){
            self.nativeObject.scrollTo(index);
        };

        Object.defineProperty(self, 'verticalScrollBarEnabled', {
            get:function() {
                return self.nativeObject.showsVerticalScrollIndicator;
            },
            set:function(value) {
                self.nativeObject.showsVerticalScrollIndicator = value;
            },
            enumerable: true
        });

        self.android = {};

        self.setPullRefreshColors = function(param){
            if( Object.prototype.toString.call( param ) === '[object Array]' ) {
                self.refreshControl.tintColor = param[0].nativeObject;
            }else{
                self.refreshControl.tintColor = param.nativeObject;
            }
        }
        
        Object.defineProperty(self, 'onScroll', {
            set: function(value) {
                self.nativeObject.didScroll = value;
            },
            enumerable: true
        });
        
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    }
);

ListView.iOS = {};

ListView.iOS.SwipeDirection = require('sf-core/ui/listview/direction');

ListView.iOS.createSwipeItem = function(title,color,padding,action,isAutoHide){
    if (isAutoHide === undefined) {
        return __SF_MGSwipeButton.createMGSwipeButton(title,color.nativeObject,padding,action);
    }else{
        return __SF_MGSwipeButton.createMGSwipeButtonWithTitleColorPaddingJsActionIsAutoHide(title,color.nativeObject,padding,action,isAutoHide ? true : false);
    }
}

ListView.iOS.createSwipeItemWithIcon = function(title,icon,color,padding,action,isAutoHide){
    if(!(icon instanceof Image)){
        throw new TypeError('icon must be a UI.Image');
    }

    if (!title) {
        title = "";
    }
    
    if (isAutoHide === undefined) {
        return __SF_MGSwipeButton.createMGSwipeButtonWithIcon(title,icon.nativeObject,color.nativeObject,padding,action);
    }else{
        return __SF_MGSwipeButton.createMGSwipeButtonWithIconWithTitleIconColorPaddingJsActionIsAutoHide(title,icon.nativeObject,color.nativeObject,padding,action,isAutoHide ? true : false);
    }
}       

module.exports = ListView;
