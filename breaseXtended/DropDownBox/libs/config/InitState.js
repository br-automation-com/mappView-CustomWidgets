define([
    'widgets/brease/common/libs/redux/utils/UtilsImage',
    'widgets/brease/common/libs/redux/utils/UtilsText',
    'widgets/brease/common/libs/redux/utils/UtilsList',
    'widgets/brease/common/libs/redux/utils/UtilsStyle'
], function (UtilsImage, UtilsText, UtilsList, UtilsStyle) {

    'use strict';

    var InitState = {};

    InitState.calculateInitState = function (settings, enabled, visible) {

        var initState = {};

        initState.text = {
            textElements: UtilsText.getTextsFromItems(settings.dataProvider),
            textSettings: {
                multiLine: settings.multiLine,
                wordWrap: settings.wordWrap,
                ellipsis: settings.ellipsis
            }
        };

        initState.image = {
            imageList: UtilsImage.createImageList(settings.dataProvider),
            imagePath: settings.imagePath,
            imageElements: UtilsImage.createImageElements(UtilsImage.createImageList(settings.dataProvider), settings.imagePath),
            imageSettings: {}
        };

        initState.items = {
            itemList: UtilsList.getItemsFromItems(settings.dataProvider, settings.selectedIndex),
            itemSettings: {
                itemHeight: settings.itemHeight,
                imageAlign: settings.imageAlign
            },
            selectedIndex: settings.selectedIndex,
            selectedValue: UtilsList.getSelectedValueFromItems(settings.dataProvider, settings.selectedIndex),
            previousSelectedIndex: 0,
            listOpen: false,
            listSettings: {
                fitHeight2Items: settings.fitHeight2Items,
                listPosition: settings.listPosition,
                listPositionExt: settings.listPositionExt,
                listWidth: settings.listWidth,
                listHeight: UtilsList.calculateListHeight(settings.fitHeight2Items, settings.dataProvider.length, settings.maxVisibleEntries, settings.itemHeight),
                maxVisibleEntries: settings.maxVisibleEntries,
                cropToParent: settings.cropToParent,
                showTexts: UtilsList.getShowValues(settings.displaySettings).showTexts,
                showImages: UtilsList.getShowValues(settings.displaySettings).showImages,
                showTextsInButton: UtilsList.getShowValues(settings.displaySettings).showTextsInButton,
                showImagesInButton: UtilsList.getShowValues(settings.displaySettings).showImagesInButton
            },
            offline: false
        };

        initState.status = {
            enabled: enabled,
            visible: visible,
            active: true
        };

        initState.size = {
            height: settings.height,
            width: settings.width
        };

        initState.style = {
            stylePrefix: settings.stylePrefix,
            style: settings.style,
            styleToApply: UtilsStyle.addStylePrefix(settings.stylePrefix, settings.style)
        };

        return initState;
    };

    return InitState;

});
