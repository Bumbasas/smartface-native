function TabBarItem(params) {
    var _title, _icon, _page, _route, _firstPageIsSet;

    Object.defineProperties(this, {
        'title': {
            get: function() {
                return _title;
            },
            set: function(title) {
                if (typeof(title) === "string") {
                    _title = title;
                }
                else {
                    throw new Error("title should be string.");
                }
            },
            enumerable: true
        },
        'icon': {
            get: function() {
                return _icon;
            },
            set: function(valueObj) {
                const Image = require("../image");
                const NativeDrawable = requireClass("android.graphics.drawable.Drawable");

                var EmptyImage = {
                    nativeObject: NativeDrawable.createFromPath(null)
                }
                var icon = valueObj;
                if (!(icon instanceof Object)) { //IDE requires this implementation.
                    icon = Image.createImageFromPath(icon);
                }
                else {
                    icon.normal = Image.createImageFromPath(icon.normal);
                    icon.selected = Image.createImageFromPath(icon.selected);
                }

                if (icon instanceof Image || icon === null) {
                    _icon = icon;
                }
                else if (icon instanceof Object) {
                    if (icon.normal instanceof Image && icon.selected instanceof Image) {
                        _icon = makeSelector(icon.normal, icon.selected);
                    }
                    else if (icon.normal instanceof Image) {
                        _icon = makeSelector(icon.normal, EmptyImage);
                    }
                    else if (icon.selected instanceof Image) {
                        _icon = makeSelector(EmptyImage, icon.selected);
                    }
                }
                else {
                    throw new Error("icon should be an instance of Image or given icon path should be properly.");
                }

            },
            enumerable: true
        },
        'firstPageIsSet': {
            get: function() {
                return _firstPageIsSet;
            },
            set: function(value) {
                _firstPageIsSet = value;
            },
            enumerable: true
        },
        'page': {
            get: function() {
                return _page;
            },
            set: function(page) {
                if (typeof(page) === 'function')
                    _page = page;
                else
                    throw new Error("page should be a function.");
            },
            enumerable: true
        },
        'route': {
            get: function() {
                return _route;
            },
            set: function(route) {
                const Navigator = require("../navigator");
                if (route instanceof Navigator) {
                    _page = route.items[route.index];
                    _route = route;
                }
                else if (typeof(route) === 'function') {
                    _page = route;
                    _route = route;
                }
                else {
                    throw new Error("page should be an instance of Page or Navigator.");
                }
            },
            enumerable: true
        },
        'toString': {
            value: function() {
                return 'TabBarItem';
            },
            enumerable: true,
            configurable: true
        }
    });

    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }

    function makeSelector(normalImage, selectedImage) {
        const NativeStateListDrawable = requireClass("android.graphics.drawable.StateListDrawable");
        const NativeR = requireClass('android.R');

        var res = new NativeStateListDrawable();
        res.addState(array([NativeR.attr.state_checked], "int"), selectedImage.nativeObject);
        res.addState(array([], "int"), normalImage.nativeObject);

        return res;
    }
}

module.exports = TabBarItem;
