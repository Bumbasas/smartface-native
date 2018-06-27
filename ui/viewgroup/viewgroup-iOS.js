const View = require('../view');
const extend = require('js-base/core/extend');
/**
 * @class UI.ViewGroup
 * @since 0.1
 * @extends View
 * A ViewGroup is a special view that can contain other views (called children) like layouts and views.
 * ViewGroup is an abstract class. You can't create instance from it.
 */
const ViewGroup = extend(View)(
    function (_super, params) {
        
        var self = this;

        self.childs = {};

        _super(this);
        
        this.addChild = function(view){
            self.nativeObject.addSubview(view.nativeObject);
            view.parent = self;
            var uniqueId = view.uniqueId;
            self.childs[uniqueId] = view;

            // if(self.nativeObject.constructor.name === "SMFNative.SMFUIScrollView"){
            //     self.autoSize();
            // }
            
            // if (view.nativeObject.constructor.name === "SMFNative.SMFUIScrollView"){
            //     view.autoSize();
            // }
        };

        this.removeChild = function(view){
            delete self.childs[view.uniqueId];
            view.parent = undefined;
            view.nativeObject.removeFromSuperview();  
        };

        this.removeAll = function(){
            for (var child in self.childs) {
                self.childs[child].parent = undefined;
                self.childs[child].nativeObject.removeFromSuperview();
            }
            self.childs = {};
        };


        this.getChildCount = function(){
            return Object.keys(self.childs).length;
        };

     
        this.findChildById = function(id){
            return getKeyByValue(self.childs,id); 
        };
        
        function getKeyByValue(object,value){
             for( var prop in object ) {
                if( object.hasOwnProperty( prop ) ) {
                     if( object[ prop ].id === value )
                         return object[ prop ];
                }
            }
        }

        self.onViewAddedHandler = function(e){
            if (typeof self.onViewAdded === "function"){
                self.onViewAdded();
            }
        }
        self.nativeObject.didAddSubview = self.onViewAddedHandler;
        
        self.onViewRemovedHandler = function(e){
            if (typeof self.onViewRemoved === "function"){
                self.onViewRemoved();
            }
        }
        self.nativeObject.willRemoveSubview = self.onViewRemovedHandler;
        
        // Assign parameters given in constructor
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    }
);

module.exports = ViewGroup;