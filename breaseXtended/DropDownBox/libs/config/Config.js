define([
    'brease/enum/Enum'
], function (Enum) {

    'use strict';

    /**
     * @class widgets.breaseXtended.DropDownBox.config.Config
     * @extends core.javascript.Object
     * @override widgets.breaseXtended.DropDownBox
     */

     /**
     * @cfg {Integer} listPositionExt=0
     * @iatStudioExposed
     * @iatCategory Extended
     * If 0, list position extension is off.
     * If 1, the list box will reverse the pop-up direction. For ex. listPosition='right' from bottom upwards.
     * If 2, the list box will always try to center the list box to the screen.
     */

     return {
        selectedIndex: 0,
        selectedValue: '',
        itemHeight: 40,
        imageAlign: Enum.ImageAlign.left,
        imagePath: '',
        ellipsis: false,
        wordWrap: false,
        multiLine: false,
        fitHeight2Items: true,
        dataProvider: [],
        listPosition: Enum.Position.right,
        listPositionExt: 0,
        listWidth: 150,
        maxVisibleEntries: 4,
        cropToParent: Enum.CropToParent.none,
        displaySettings: Enum.DropDownDisplaySettings.default,
        tabIndex: 0
    };
});
