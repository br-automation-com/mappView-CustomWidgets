define([
    "brease/core/BaseWidget",
    'brease/decorators/LanguageDependency'
], function (SuperClass, languageDependency) {
    'use strict';
       
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
        this.buttonEl = $(this.el).children("button");
        _textInit.call(this);
        SuperClass.prototype.init.apply(this, arguments);
        $(this.el).children("button").attr("data-action", this.settings.action);
        $(this.el).children("button").attr("data-num", this.settings.valueForArray);
        var buttonId = $(this.el).children("button").attr("id").replace("{WIDGET_ID}", this.elem.id);
        $(this.el).children("button").attr("id", buttonId);
    };

    p.langChangeHandler = function (e) {
        if (this.settings.textkey) {
            this.setText(brease.language.getTextByKey(this.settings.textkey), true);
        }
    };

     /**
     * @method setValueForArray
     * Set valueForArray option.
     * @param {Integer} valueForArray
     */
     p.setValueForArray = function setValueForArray(valueForArray) {
        this.settings.valueForArray = valueForArray;
        $(this.el).children("button").attr("data-num", this.settings.valueForArray);
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

    function _textInit() {
        //console.log('[' + this.elem.id + ']._textInit');
        if (this.settings.text !== undefined && this.settings.text !== '') {
            if (brease.language.isKey(this.settings.text) === false) {
                this.setText(this.settings.text);
            } else {
                this.setTextKey(brease.language.parseKey(this.settings.text), false);
            }
        }
        this.langChangeHandler();
    }

    /**
    * @method setText
    * @iatStudioExposed
    * Sets the visible text. This method can remove an optional textkey.
    * @param {String} text
    * @param {Boolean} [keepKey=false] Set true, if textkey should not be removed
    * @paramMeta text:localizable=true
    */
    p.setText = function (text, keepKey) {
        this.settings.text = text;
        if (keepKey !== true) {
            this.removeTextKey();
        }

        if (brease.config.editMode !== true) {
            if (brease.language.isKey(this.settings.text) === true) {
                this.setTextKey(brease.language.parseKey(this.settings.text), false);
                this.langChangeHandler();
                return;
            }
        }
        this.buttonEl.text(text);
    };

    /**
     * @method setTextKey
     * set the textkey
     * @param {String} key The new textkey
     */
    p.setTextKey = function (key, invoke) {
        if (key !== undefined) {
            this.settings.textkey = key;
            this.setLangDependency(true);
            if (invoke !== false) {
                this.langChangeHandler();
            }
        }
    };

    /**
     * @method getTextKey
     * get the textkey
     */
    p.getTextKey = function () {
        return this.settings.textkey;
    };

    /**
     * @method removeTextKey
     * remove the textkey
     */
    p.removeTextKey = function () {

        this.settings.textkey = null;
        if (!this.settings.mouseDownTextkey) {
            this.setLangDependency(false);
        }
    };


    return languageDependency.decorate(WidgetClass, false);
});
