"use strict";
define(["brease/core/BaseWidget"], function (SuperClass) {
    /**
     * @class widgets.brXtended.WeekPlanningItem
     * @extends brease.core.BaseWidget
     *
     * @iatMeta category:Category
     * Data
     * @iatMeta description:short
     * Week planning widget
     * @iatMeta description:de
     * German.
     * @iatMeta description:en
     * English
     */

    /**
     * @property {WidgetList} parents=["widgets.brXtended.WeekPlanning"]
     * @inheritdoc
     */

    /**
    * @cfg {UInteger} valueForArray=1
    * Internal value of the button, this will be the value in the array of WeekPlanning
    * @iatCategory Data
    * @iatStudioExposed
    */

    /**
    * @cfg {String} action=default
    * Class that will be apply to the cells when this button is selected
    * @iatCategory Data
    * @iatStudioExposed
    */

    var defaultSettings = {
            valueForArray: 1,
            action: "default"
        },
        WidgetClass = SuperClass.extend(function WeekPlanningItem() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),
        p = WidgetClass.prototype;

    p.init = function () {
        SuperClass.prototype.init.apply(this, arguments);

        $(this.el).children("button").attr("data-action", this.settings.action);
        $(this.el).children("button").attr("data-num", this.settings.valueForArray);
        $(this.el).children("button").html(this.settings.action);
    };

     /**
     * @method setValueForArray
     * Set valueForArray option.
     * @param {Integer} valueForArray
     */
     p.setValueForArray = function setValueForArray(valueForArray) {
        this.settings.valueForArray = valueForArray;
        $(this.el).children("button").attr("data-num", this.settings.valueForArray);
        $(this.el).children("button").html(this.settings.action);
    };

    /**
     * @method getValueForArray
     * get valueForArray option.
     */
    p.getValueForArray = function getValueForArray() {
        return this.settings.valueForArray;
    };


    /**
     * @method setAction
     * Set action option.
     * @param {String} action
     */
    p.setAction = function setAction(action) {
        this.settings.action = action;
        $(this.el).children("button").attr("data-action", this.settings.action);
    };

    /**
     * @method getAction
     * get action option.
     */
    p.getAction = function setAction() {
        return this.settings.action;
    };

    return WidgetClass;
});
