//NativeAccess
const Invocation = require('sf-core/util/iOS/invocation.js');
const UICollectionView = SF.requireClass("UICollectionView");
const UICollectionViewFlowLayout = SF.requireClass("UICollectionViewFlowLayout");

function LayoutManager(params) {
    var sfSelf = this;
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // NATIVE FLOWLAYOUT CLASS IMPLEMENTATION
    
    // var flowLayout = UICollectionViewFlowLayout.new(); // This will change to StaggeredFlowLayout class
      var flowLayout = SF.defineClass('SMFUICollectionViewFlowLayout : UICollectionViewFlowLayout',
    {
        prepareLayout: function() {
            var retval = {width: 0, height: 0};
            var insetSize = 0;
            if (sfSelf.scrollDirection == LayoutManager.ScrollDirection.VERTICAL) 
            {
            	var calculatedSizes = calculateSize(sfSelf.collectionView.frame.width,sfSelf.spanCount);
            	retval.width = calculatedSizes.cellSize;
                retval.height = sfSelf.onItemLength(retval.width);
                var insetSize = calculatedSizes.insetSize/2;
                sfSelf.sectionInset = {top:0,left:insetSize,bottom:0,right:insetSize};
            } 
            else if (sfSelf.scrollDirection == LayoutManager.ScrollDirection.HORIZONTAL) 
            {
        	   	var calculatedSizes = calculateSize(sfSelf.collectionView.frame.height,sfSelf.spanCount);
            	retval.height = calculatedSizes.cellSize;
                retval.width = sfSelf.onItemLength(retval.height);
                var insetSize = calculatedSizes.insetSize/2;
                sfSelf.sectionInset = {top:insetSize,left:0,bottom:insetSize,right:0};
            }
    
            var argumentSize = new Invocation.Argument({
                type:"CGSize",
                value: retval
            });
            Invocation.invokeInstanceMethod(sfSelf.nativeObject,"setItemSize:",[argumentSize]);
        }
    }).new();
    
    function roundDown(number, decimals) {
	    decimals = decimals || 0;
	    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
	}
	
	function calculateSize(collectionViewSize,spanCount){
		var size = collectionViewSize;
    	var cellSize = roundDown(collectionViewSize / spanCount, 1);
    	var splitSize = (cellSize + "").split(".");
    	var insetSize = 0;
    	if (splitSize[1] !== undefined) {
        	var precision = parseFloat(splitSize[1]);
        	var scale = __SF_UIScreen.mainScreen().scale;
        	var decimal = Math.floor(precision/Math.floor(((1/scale)*10))) * (1/scale);
        	var fixedSize = parseFloat(splitSize[0]) + decimal;
        	insetSize = roundDown(collectionViewSize - fixedSize*spanCount, 2);
            cellSize = parseFloat(fixedSize);
    	}
    	return {"cellSize" : cellSize, "insetSize" : insetSize};
	}
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // INITIALIZATION
    if(!sfSelf.nativeObject){
        sfSelf.nativeObject = flowLayout;
        sfSelf.collectionView = null; //CollectionView will set this property.
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PROPERTIES
    
    var _spanCount = 1;
    Object.defineProperty(sfSelf, 'spanCount', {
        get: function() {
            return _spanCount;
        },
        set: function(value) {
            if (typeof value === "number") {
                _spanCount = value;   
            }
        },
        enumerable: true
    });
    
    var _lineSpacing = sfSelf.nativeObject.minimumLineSpacing;
    Object.defineProperty(sfSelf, 'lineSpacing', {
        get: function() {
            return _lineSpacing;
        },
        set: function(value) {
            if (typeof value === "number") {
                _lineSpacing = value; 
                sfSelf.nativeObject.minimumLineSpacing = _lineSpacing;
            }
        },
        enumerable: true
    });
    sfSelf.lineSpacing = 0;
        
    
    var _itemSpacing = sfSelf.nativeObject.minimumInteritemSpacing;
    Object.defineProperty(sfSelf, 'itemSpacing', {
        get: function() {
            return _itemSpacing;
        },
        set: function(value) {
            if (typeof value === "number") {
                _itemSpacing = value; 
                sfSelf.nativeObject.minimumInteritemSpacing = _itemSpacing;
            }
        },
        enumerable: true
    });
    sfSelf.itemSpacing = 0;
    
    var _contentInset = {top:0, left:0, bottom:0, right:0};
    Object.defineProperty(sfSelf, 'contentInset', {
        get: function() {
            return _contentInset;
        },
        set: function(value) {
            if (typeof value === "object") {
                _contentInset = value;
                
                if (sfSelf.collectionView) {
                    var argContentInset = new Invocation.Argument({
                        type:"UIEdgeInsets",
                        value: _contentInset
                    });
                    Invocation.invokeInstanceMethod(sfSelf.collectionView, "setContentInset:", [argContentInset]);
                }
            }
        },
        enumerable: true
    });
    
    var _scrollDirection = LayoutManager.ScrollDirection.VERTICAL;
    Object.defineProperty(sfSelf, 'scrollDirection', {
        get: function() {
            return _scrollDirection;
        },
        set: function(value) {
            if (typeof value === "number") {
                _scrollDirection = value;
                sfSelf.nativeObject.scrollDirection = _scrollDirection;
            }
        },
        enumerable: true
    });
     
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // METHODS
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CALLBACKS
    
    var _onItemLength = function(){
    		return 50;
    };
    Object.defineProperty(sfSelf, 'onItemLength', {
        get: function() {
            return _onItemLength;
        },
        set: function(value) {
            if (typeof value === "function") {
                _onItemLength = value;
            }
        },
        enumerable: true
    });
    
    var _itemLength = 50;
    Object.defineProperty(sfSelf, 'itemLength', {
        get: function() {
            return _itemLength;
        },
        set: function(value) {
            _itemLength = value;
        },
        enumerable: true
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // HIDDEN
    
    var _sectionInset = {top:0, left:0, bottom:0, right:0};
    Object.defineProperty(sfSelf, 'sectionInset', {
        get: function() {
            return _sectionInset;
        },
        set: function(value) {
            if (typeof value === "object") {
                _sectionInset = value;
                
                var argSectionInset = new Invocation.Argument({
                    type:"UIEdgeInsets",
                    value: _sectionInset
                });
                Invocation.invokeInstanceMethod(sfSelf.nativeObject, "setSectionInset:", [argSectionInset]);
            }
        },
        enumerable: true
    });
    
    // LOGIC
    sfSelf.sizeForItemAtIndexPath = function (collectionView, collectionViewLayout, indexPath) {
        var retval = {width: 0, height: 0};
        
        if (sfSelf.scrollDirection == LayoutManager.ScrollDirection.VERTICAL) 
        {
            var columnCount = sfSelf.spanCount;
            var itemWidth = collectionView.frame.width / columnCount;
            var itemHeight = 0;
            // itemHeight = sfSelf.onItemLength();
            
            retval.width = itemWidth;
            retval.height = itemHeight;
        } 
        else if (sfSelf.scrollDirection == LayoutManager.ScrollDirection.HORIZONTAL) 
        {
            var rowCount = sfSelf.spanCount;
            var itemHeight = collectionView.frame.height / rowCount;
            var itemWidth = 0;
            // itemWidth = sfSelf.onItemLength();
            
            retval.width = itemWidth;
            retval.height = itemHeight;
        }
        return retval;
    };
     
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

LayoutManager.ScrollDirection = {};
Object.defineProperties(LayoutManager.ScrollDirection,{ 
    'VERTICAL': {
        value: 0,
        writable: false
    },
    'HORIZONTAL': {
        value: 1,
        writable: false
    }
});

module.exports = LayoutManager;