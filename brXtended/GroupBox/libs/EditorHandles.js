define([
    'brease/core/Class'
], function (SuperClass) {

    'use strict';

    var ModuleClass = SuperClass.extend(function EditorHandles(widget) {
            SuperClass.call(this);

            this.widget = widget;
            this.oldSettings = {
                top: this.widget.settings.top,
                left: this.widget.settings.left,
                width: this.widget.settings.width,
                height: this.widget.settings.height
            };

        }, null),

        p = ModuleClass.prototype;

    p.getHandles = function () {

        var instance = this;
        return {
            moveHandles: undefined, /* use default*/
            pointHandles: [],
            resizeHandles: [{

                start: function () {
                    _retainSettings.call(instance);
                },

                update: function (newBox) {

                    var updatedBox = {
                        width: newBox.width,
                        height: newBox.height,
                        top: newBox.top,
                        left: newBox.left
                    };

                    instance.widget.settings.top = updatedBox.top;
                    instance.widget.settings.left = updatedBox.left;
                    instance.widget.settings.width = updatedBox.width;
                    instance.widget.settings.height = updatedBox.height;

                    _redrawWidget.call(instance);
                },

                finish: function () {
                    _redrawWidget.call(instance);
                    return _compareSettings.call(instance);
                },

                handle: function () {
                    return instance.widget.elem;
                }
            }]
        };
    };

    // private functions
    function _redrawWidget() {

        this.widget.el.css('top', parseInt(this.widget.settings.top, 10))
            .css('left', parseInt(this.widget.settings.left, 10))
            .css('width', parseInt(this.widget.settings.width, 10))
            .css('height', parseInt(this.widget.settings.height, 10));

        this.widget._refreshScroller();
    }

    function _retainSettings() {

        this.oldSettings.top = parseInt(this.widget.settings.top, 10);
        this.oldSettings.left = parseInt(this.widget.settings.left, 10);
        this.oldSettings.width = parseInt(this.widget.settings.width, 10);
        this.oldSettings.height = parseInt(this.widget.settings.height, 10);
    }

    function _compareSettings() {

        var returnValue = {};

        if (this.widget.settings.top !== this.oldSettings.top) {
            returnValue.top = this.widget.settings.top;
        }
        if (this.widget.settings.left !== this.oldSettings.left) {
            returnValue.left = this.widget.settings.left;
        }
        if ((this.widget.settings.width !== this.oldSettings.width) || (this.widget.settings.height !== this.oldSettings.height)) {
            returnValue.height = this.widget.settings.height;
            returnValue.width = this.widget.settings.width;
        }

        return returnValue;
    }
        
    return ModuleClass;
});
