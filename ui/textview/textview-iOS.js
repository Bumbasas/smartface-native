const View = require('../view');
const extend = require('js-base/core/extend');
const Color = require("sf-core/ui/color");
const SFTextAlignment = require("sf-core/ui/textalignment");

const TextView = extend(View)(
    function (_super, params) {
        var self = this;
        
        if(!self.nativeObject){
            self.nativeObject = new __SF_UITextView();
        }
        
        _super(this);
        
        //Defaults
        self.nativeObject.setSelectable = false;
		self.nativeObject.setEditable = false;	
		self.nativeObject.setDelaysContentTouches = true;
	    self.nativeObject.textAlignmentNumber = SFTextAlignment.MIDLEFT;
	    self.nativeObject.textContainer.maximumNumberOfLines = 0;
    	self.nativeObject.textContainer.lineBreakMode = 0;
    	self.nativeObject.backgroundColor = Color.TRANSPARENT.nativeObject;
    	
    	var _selectable = false;			
    	Object.defineProperty(self, 'selectable', {
            get:function() {
                return _selectable;
            },
            set:function(value) {
                if (typeof(value) === "boolean"){
                    _selectable = value;
                    self.nativeObject.setSelectable = value;
                }
            },
            enumerable: true
         });
         
        Object.defineProperty(self, 'htmlText', {
            get:function() {
                return self.nativeObject.htmlText;
            },
            set:function(value) {
                self.nativeObject.htmlText = value;
            },
            enumerable: true
        });
        
        self.ios = {};
        Object.defineProperty(self.ios, 'showScrollBar', {
            get:function() {
                return self.nativeObject.showsHorizontalScrollIndicator;
            },
            set:function(value) {
                self.nativeObject.showsHorizontalScrollIndicator = value;
                self.nativeObject.showsVerticalScrollIndicator = value;
            },
            enumerable: true
        });
        
        Object.defineProperty(self.ios, 'scrollEnabled', {
            get:function() {
                return self.nativeObject.valueForKey("scrollEnabled");
            },
            set:function(value) {
                self.nativeObject.setValueForKey(value,"scrollEnabled");
            },
            enumerable: true
        });
        
        Object.defineProperty(self, 'font', {
            get:function() {
                return self.nativeObject.font;
            },
            set:function(value) {
                self.nativeObject.setEditable = true;
                self.nativeObject.font = value;
                self.nativeObject.setEditable = false;
                self.nativeObject.setSelectable = self.selectable;
            },
            enumerable: true
         });

        Object.defineProperty(self, 'multiline', {
            get: function() {
               if(self.nativeObject.textContainer.maximumNumberOfLines === 0 && self.nativeObject.textContainer.lineBreakMode === 0){
                    return true;
                }else{
                    return false;
                }
            },
            set: function(value) {
            	if (value){
            		self.nativeObject.textContainer.maximumNumberOfLines = 0;
    				self.nativeObject.textContainer.lineBreakMode = 0;
            	}else{
            		self.nativeObject.textContainer.maximumNumberOfLines = 1;
    				self.nativeObject.textContainer.lineBreakMode = 4;
            	}
            },
            enumerable: true
        });

        Object.defineProperty(self, 'text', {
            get: function() {
                return self.nativeObject.text;
            },
            set: function(value) {
                self.nativeObject.text = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(self, 'textAlignment', {
            get: function() {
                return self.nativeObject.textAlignmentNumber;
            },
            set: function(value) {
                self.nativeObject.setEditable = true;
                self.nativeObject.textAlignmentNumber = value;
                self.nativeObject.setEditable = false;
                self.nativeObject.setSelectable = self.selectable;
            },
            enumerable: true
        });
        
        var _textColor = Color.BLACK;
        Object.defineProperty(self, 'textColor', {
            get: function() {
                return _textColor;
            },
            set: function(value) {
                _textColor = value;
                self.nativeObject.setEditable = true;
                self.nativeObject.textColor = value.nativeObject;
                self.nativeObject.setEditable = false;
                self.nativeObject.setSelectable = self.selectable;
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

module.exports = TextView;