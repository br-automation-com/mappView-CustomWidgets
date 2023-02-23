define([
    'widgets/brease/ToggleSwitch/ToggleSwitch'
], function (
    SuperClass
) {

    'use strict';

    /**
        * @class widgets.brXtended.ToggleSwitch
        * #Description
        * Switch, which toggles between two values
        * @extends widgets.brease.ToggleSwitch
        * @requires widgets.brease.ToggleSwitch
        * @iatMeta studio:license
        * licensed
        * @iatMeta category:Category
        * Buttons
        * @iatMeta description:short
        * Schiebeschalter
        * @iatMeta description:de
        * Schaltet einen Wert zwischen true und false über Touch-Gesten des Benutzers
        * @iatMeta description:en
        * Toggles a value between true and false with touch gestures by the user
        */

    var defaultSettings = {
            height: 30,
             width: 100,
             text: '',
             mouseDownText: '',
             image: '',
             mouseDownImage: ''
         },

        WidgetClass = SuperClass.extend(function ToggleSwitch() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    return WidgetClass;
});
