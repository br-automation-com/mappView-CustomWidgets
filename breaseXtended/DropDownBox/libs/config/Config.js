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
     * @cfg {Integer} selectedIndex=0
     * @iatStudioExposed
     * @iatCategory Data
     * @bindable
     * @editableBinding
     * Index of the selected item. The first item has index=0
     */

    /**
     * @cfg {String} selectedValue=''
     * @iatStudioExposed
     * @iatCategory Data
     * @bindable
     * @editableBinding
     * Value of the selected item
     */

    /**
     * @cfg {Integer} itemHeight=40
     * @iatStudioExposed
     * @iatCategory Appearance
     * Height of every item in the List
     */

    /**
     * @cfg {brease.enum.ImagePosition} imageAlign='left'
     * @iatStudioExposed
     * @iatCategory Appearance
     * Position of images relative to text  
     */

    /**
     * @cfg {DirectoryPath} imagePath=''
     * @iatStudioExposed
     * @iatCategory Appearance
     * Path to the images location (e.g. 'Media/images/').
     * Names of the images must be given like the index in the dataProvider (e.g. 0.png, 1.png, 2.png)
     */

    /**
     * @cfg {Boolean} ellipsis=false
     * @iatStudioExposed
     * @iatCategory Behavior
     * If true, overflow of text is symbolized with an ellipsis. This option has no effect, if wordWrap = true.
     */

    /**
     * @cfg {Boolean} wordWrap=false
     * @iatStudioExposed
     * @iatCategory Behavior
     * If true, text will wrap when necessary.
     */

    /**
     * @cfg {Boolean} multiLine=false
     * @iatStudioExposed
     * @iatCategory Behavior
     * If true, more than one line is possible. Text will wrap when necessary (wordWrap=true) or at line breaks (\n).
     * If false, text will never wrap to the next line. The text continues on the same line.
     */

    /**
     * @cfg {Boolean} fitHeight2Items=true
     * @iatStudioExposed
     * @iatCategory Behavior
     * If true, the height will fit to the necessary height if the height  oft the list is bigger
     * If false, the list uses the configured height
     */

    /**
     * @cfg {ItemCollection} dataProvider=[]
     * @iatStudioExposed
     * @bindable
     * @iatCategory Data
     * ItemCollection see Datatype
     *    
     */

    /**
     * @cfg {brease.enum.Position} listPosition='right'
     * Position of opened list relative to ToggleButton.  
     * @iatStudioExposed
     * @iatCategory Appearance
     */

    /**
     * @cfg {Integer} listPositionExt=0
     * @iatStudioExposed
     * @iatCategory Extended
     * If 0, list position extension is off.
     * If 1, the list box will reverse the pop-up direction. For ex. listPosition='right' from bottom upwards.
     * If 2, the list box will always try to center the list box to the screen.
     */

    /**
     * @cfg {Integer} listWidth=150
     * @iatStudioExposed
     * @iatCategory Appearance
     * Width of list and its items when the widget is pressed. 
     */

    /**
     * @cfg {UInteger} maxVisibleEntries=4
     * @iatStudioExposed
     * @iatCategory Appearance
     * An integer to determine max-height of the list
     */

    /**
     * @cfg {brease.enum.CropToParent} cropToParent='none'
     * @iatStudioExposed
     * @iatCategory Behavior
     * Crop list to parent element
     */

    /**
     * @cfg {brease.enum.DropDownDisplaySettings} displaySettings='default'
     * @iatStudioExposed
     * @iatCategory Appearance
     * Defines which elements are displayed on the widget
     */

    /**
     * @cfg {Integer} tabIndex=0
     * @iatStudioExposed
     * @iatCategory Behavior 
     * sets if a widget should have autofocus enabled (0), the order of the focus (>0),
     * or if autofocus should be disabled (-1)
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
