/*globals array,requireClass,release */
const View = require('../view');
const TypeUtil = require("../../util/type");
const extend = require('js-base/core/extend');
const NativeViewGroup = requireClass("android.view.ViewGroup");

const ViewGroup = extend(View)(
    function(_super, params) {
        if (!this.nativeObject) {
            throw new Error("Can't create instance from ViewGroup. It is an abstract class.");
        }
        this.childViews = {};
        _super(this);

        // Assign parameters given in constructor
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    },
    function(viewGroupPrototype) {
        viewGroupPrototype._onViewAdded = null;
        viewGroupPrototype._onViewRemoved = null;
        Object.defineProperties(viewGroupPrototype, {
            'addChild': {
                value: function(view) {
                    view.parent = this;
                    this.childViews[view.id] = view;
                    if (this instanceof require("../flexlayout")) {
                        this.nativeObject.addView(view.nativeObject, view.yogaNode);
                    }
                },
                enumerable: true,
                configurable: true
            },
            'removeChild': {
                value: function(view) {
                    this.nativeObject.removeView(view.nativeObject);
                    if (this.childViews[view.id]) {
                        delete this.childViews[view.id];
                    }
                    view.parent = undefined;
                },
                enumerable: true
            },
            'removeAll': {
                value: function() {
                    this.nativeObject.removeAllViews();

                    var ids = Object.keys(this.childViews);
                    for (var i = 0; i < ids.length; i++) {
                        this.childViews[ids[i]].parent = undefined;
                    }
                    this.childViews = {};
                },
                enumerable: true
            },
            'getChildCount': {
                value: function() {
                    return this.nativeObject.getChildCount();
                },
                enumerable: true
            },
            'findChildById': {
                value: function(id) {
                    return this.childViews[id] ? this.childViews[id] : null;
                },
                enumerable: true
            },
            'onChildViewAdded': {
                get: function() {
                    return this._onViewAdded;
                },
                set: function(callback) {
                    if (TypeUtil.isFunction(callback)) {
                        this._onViewAdded = callback;
                        if (!this.didSetHierarchyChangeListener) setHierarchyChangeListener(this);
                    }
                },
                enumerable: true
            },
            'onChildViewRemoved': {
                get: function() {
                    return this._onViewRemoved;
                },
                set: function(callback) {
                    if (TypeUtil.isFunction(callback)) {
                        this._onViewRemoved = callback;
                        if (!this.didSetHierarchyChangeListener) setHierarchyChangeListener(this);
                    }
                },
                enumerable: true
            },
            'toString': {
                value: function() {
                    return 'ViewGroup';
                },
                enumerable: true,
                configurable: true
            }
        });
    }
);

function setHierarchyChangeListener(object) {
    object.nativeObject.setOnHierarchyChangeListener(NativeViewGroup.OnHierarchyChangeListener.implement({
        'onChildViewAdded': function(parent, child) {
            this.onChildViewAdded && this.onChildViewAdded(this.childViews[child.getId()]);
        }.bind(object),
        'onChildViewRemoved': function(parent, child) {
            this.onChildViewRemoved && this.onChildViewRemoved(this.childViews[child.getId()]);
        }.bind(object),
    }));

    object.didSetHierarchyChangeListener = true;
}

module.exports = ViewGroup;
