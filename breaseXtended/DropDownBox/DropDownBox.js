define([
    'brease/core/BaseWidget',
    'widgets/breaseXtended/DropDownBox/libs/FocusHandler',
    'widgets/breaseXtended/DropDownBox/libs/config/Config',
    'widgets/breaseXtended/DropDownBox/libs/config/InitState',
    'widgets/breaseXtended/DropDownBox/libs/SubmitQueue',
    'brease/decorators/LanguageDependency',
    'brease/decorators/VisibilityDependency',
    'widgets/breaseXtended/DropDownBox/libs/view/DropDownBoxView/DropDownBoxView',
    'widgets/breaseXtended/DropDownBox/libs/reducer/DropDownBoxActions',
    'widgets/breaseXtended/DropDownBox/libs/reducer/DropDownBoxReducer',
    'widgets/brease/common/libs/external/redux',
    'widgets/brease/common/libs/redux/utils/UtilsList',
    'widgets/brease/common/libs/redux/utils/UtilsImage',
    'widgets/brease/common/libs/redux/utils/UtilsText',
    'widgets/brease/common/libs/BindingSync',
    'widgets/brease/common/libs/wfUtils/UtilsEditableBinding',
    'brease/decorators/DragAndDropCapability',
    'widgets/brease/common/DragDropProperties/libs/DroppablePropertiesEvents'
], function (SuperClass, FocusHandler, Config, InitState, SubmitQueue, languageDependency, visibilityDependency, DropDownBoxView, DropDownBoxActions, DropDownBoxReducer, Redux, UtilsList, UtilsImage, UtilsText, BindingSync, UtilsEditableBinding, dragAndDropCapability) {

    'use strict';

    /**
     * @class widgets.breaseXtended.DropDownBox
     *
     * @mixins widgets.brease.common.DragDropProperties.libs.DroppablePropertiesEvents
     *
     * #Description
     * DropDownBox
     * @extends brease.core.BaseWidget
     *
     * @iatMeta studio:visible
     * true
     * @iatMeta category:Category
     * Selector
     * @iatMeta description:short
     * DropDownliste von Texten
     * @iatMeta description:de
     * Zeigt eine DropDownliste, aus welcher der Benutzer Elemente auswählen kann
     * @iatMeta description:en
     * Displays a drop-down list where the user can select items
     */

    var defaultSettings = Config,

        WidgetClass = SuperClass.extend(function DropDownBox() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {

        //Initialize superclass
        SuperClass.prototype.init.apply(this, arguments);

        //Define order for binding properties
        BindingSync.setupPropertyOrder(this, [
            {
                name: 'selectedValue',
                waitFor: ['dataProvider']
            }, {
                name: 'selectedIndex',
                waitFor: ['dataProvider']
            }]);

        // queue for submitChange requests
        this.submitQueue = new SubmitQueue(this);

        //Calculate init state
        var initState = InitState.calculateInitState(this.settings, this.isEnabled(), this.isVisible());

        //Create store
        this.store = Redux.createStore(DropDownBoxReducer, initState);

        //Create View
        this.dropDownBoxView = new DropDownBoxView(this.store, this.el, this);

        //Subscribe master view to the store
        this.store.subscribe(this.dropDownBoxView.render.bind(this.dropDownBoxView));

        this.offlineAttributes = new Set();
        this.focusHandler = new FocusHandler(this);

        if (brease.config.isKeyboardOperationEnabled()) {
            // update focus after a render of the view
            this.dropDownBoxView.addEventListener('ViewRendered', this.focusHandler.onRender.bind(this.focusHandler));
        }
        window.addEventListener('scroll', this._bind('close'));
    };

    // override method called in BaseWidget.init
    p._initEditor = function () {
        // handle interlaced properties selectedIndex and selecteValue
        this.designer.trySetProperty = trySetProperty.bind(this);
    };

    // FocusHandler support 
    p._handleFocusKeyDown = function (e) {
        //if (!this.focusHandler.editMode) { SuperClass.prototype._handleFocusKeyDown.apply(this, arguments); }
        
        //if (e.key === 'Enter') {
        //    this.internalData.isKeyDown = true;
        //_triggerVirtualMouseEvent.call(this, BreaseEvent.MOUSE_DOWN, e);
        //}
        SuperClass.prototype._handleFocusKeyDown.apply(this, arguments);
        this.focusHandler.handleKeyDown(e);
    };

    p.getItemContainer = function () {
        if (this.dropDownBoxView.listContainer !== undefined) {
            return this.dropDownBoxView.listContainer[0].querySelector('.ListView.Container');
        }
    };

    p.getSelectedItem = function () {
        if (this.dropDownBoxView.listContainer !== undefined) {
            return this.dropDownBoxView.listContainer[0].querySelector('.ItemView.itemSelected');
        }
    };

    p.getAllItems = function () {
        if (this.dropDownBoxView.listContainer !== undefined) {
            return this.dropDownBoxView.listContainer[0].querySelectorAll('.ItemView');
        }
    };

    p.getScroller = function () {
        return this.dropDownBoxView.listView.scroller;
    };

    p.valueChangeFromUI = function () {
        //Send value for the index if the value has changed
        this.submitChange();
        this.triggerToggleStateChanged();
    };

    /**
     * @method setStyle
     * @iatStudioExposed
     * @param {StyleReference} value
     */
    p.setStyle = function (style) {
        SuperClass.prototype.setStyle.apply(this, arguments);
        var action = DropDownBoxActions.styleChange(style);
        this.store.dispatch(action);
    };

    p.langChangeHandler = function () {
        var action = DropDownBoxActions.changeLanguage();
        this.store.dispatch(action);
    };

    p._setWidth = function (w) {
        SuperClass.prototype._setWidth.apply(this, arguments);
        var action = DropDownBoxActions.changeWidth(w);
        this.store.dispatch(action);
    };

    p._setHeight = function (h) {
        SuperClass.prototype._setHeight.apply(this, arguments);
        var action = DropDownBoxActions.changeHeight(h);
        this.store.dispatch(action);
    };

    /**
     * @method open
     * @iatStudioExposed
     * Opens the list
     */
    p.open = function () {
        if (!this.isOffline() && !this.store.getState().items.listOpen) {
            var action = DropDownBoxActions.openList();
            this.store.dispatch(action);
            this.triggerToggleStateChanged();
        }
    };

    /**
     * @method close
     * @iatStudioExposed
     * Closes the list
     */
    p.close = function () {
        if (this.store.getState().items.listOpen) {
            var action = DropDownBoxActions.closeList();
            this.store.dispatch(action);
            this.triggerToggleStateChanged();   
        }
    };

    /**
     * @method toggle
     * @iatStudioExposed
     * Opens or closes the list depending on the actual status
     */
    p.toggle = function () {
        if (!this.isOffline()) {
            var action = DropDownBoxActions.toggleListStatus();
            this.store.dispatch(action);
            this.triggerToggleStateChanged();
        }
    };

    /**
     * @method triggerToggleStateChanged
     * Triggers the event for a state change
     */
    p.triggerToggleStateChanged = function () {
        var state = this.store.getState();
        this.focusHandler.onToggleStateChanged(state.items.listOpen);

        /**
         * @event ToggleStateChanged
         * @iatStudioExposed
         * Triggered when the list is opened or closed.
         * @param {Boolean} newValue
         */
        var ev = this.createEvent('ToggleStateChanged', {
            newValue: state.items.listOpen
        });
        ev.dispatch();
    };

    /**
     * @method setDataProvider
     * @iatStudioExposed
     * method to set the dataProvider
     * @param {ItemCollection} value ItemCollection (=Array) of objects of type brease.objects.ListEntry
     * @param {Boolean} [omitPrompt=false] (deprecated)
     * @paramMeta omitPrompt:deprecated=true
     */
    p.setDataProvider = function (provider) {
        if (provider === null) {
            this.settings.dataProvider = provider;
            _setOffline.call(this, 'dataProvider');
            return;
        }
        this.settings.dataProvider = UtilsList.parseJSONtoObject(provider, this.elem.id);
        _setOnline.call(this, 'dataProvider');
        
        var previous = _getActValues.call(this),
            triggeredByBinding = _triggeredByBinding(arguments[arguments.length - 1]);

        //Generate the text elements
        var textElements = UtilsText.getTextsFromItems(this.settings.dataProvider);
        var actionText = DropDownBoxActions.updateText(textElements);
        //Generate the image elements
        var imageList = UtilsImage.createImageList(this.settings.dataProvider);
        var actionImage = DropDownBoxActions.updateImageList(imageList);
        //Generate the item list
        var itemList = UtilsList.getItemsFromItems(this.settings.dataProvider);
        var actionItem = DropDownBoxActions.updateItemList(itemList);
        //Dispatch the actions
        this.store.dispatch(actionText);
        this.store.dispatch(actionImage);
        this.store.dispatch(actionItem);

        //Update new values to server immediately, if there is no other binding to selectedIndex or selectedValue
        if (!_hasBinding.call(this, 'selectedIndex') && !_hasBinding.call(this, 'selectedValue')) {
            this.submitChange({ previous: previous, triggeredByBinding: triggeredByBinding });
        } else {
            // otherwise give the binding the chance to set selectedIndex or selectedValue to a valid value
            this.submitChange({ previous: previous, triggeredByBinding: triggeredByBinding, deferred: true });
        }

        if (this.internalData.selectedValue) {
            this.setSelectedValue(this.internalData.selectedValue);
        } else if (this.internalData.selectedIndex) {
            this.setSelectedIndex(this.internalData.selectedIndex);
        }
    };

    /**
     * @method getDataProvider 
     * Returns dataProvider.
     * @return {ItemCollection}
     */
    p.getDataProvider = function () {
        return this.settings.dataProvider;
    };

    /**
     * @method setSelectedValue
     * @iatStudioExposed
     * sets the selected entry based on a value
     * @param {String} value
     * @param {Boolean} [omitPrompt=false] (deprecated)
     * @paramMeta omitPrompt:deprecated=true
     */
    p.setSelectedValue = function (value) {
        _setSelected.call(this, 'selectedValue', DropDownBoxActions.updateSelectedValue(value), value, arguments[arguments.length - 1]);
    };

    /**
     * @method getSelectedValue
     * @iatStudioExposed
     * Returns selectedValue.
     * @return {String}
     */
    p.getSelectedValue = function () {
        if (this.settings.selectedValue === null) {
            return this.settings.selectedValue;
        }
        var state = this.store.getState();
        return state.items.selectedValue;
    };

    /**
     * @method setSelectedIndex
     * @iatStudioExposed
     * Sets the selected entry based on an index
     * @param {Integer} index
     * @param {Boolean} [omitPrompt=false] (deprecated)
     * @paramMeta omitPrompt:deprecated=true
     */
    p.setSelectedIndex = function (index) {
        _setSelected.call(this, 'selectedIndex', DropDownBoxActions.updateSelectedItem(index), index, arguments[arguments.length - 1]);
    };

    /**
     * @method getSelectedIndex
     * @iatStudioExposed
     * Returns selectedIndex.
     * @return {Integer}
     */
    p.getSelectedIndex = function () {
        if (this.settings.selectedIndex === null) {
            return this.settings.selectedIndex;
        }
        var state = this.store.getState();
        return state.items.selectedIndex;
    };

    /**
     * @method setMultiLine
     * Sets multiLine
     * @param {Boolean} multiLine
     */
    p.setMultiLine = function (multiLine) {
        this.settings.multiLine = multiLine;
        var action = DropDownBoxActions.updateTextSettings({ multiLine: multiLine });
        this.store.dispatch(action);
    };

    /**
     * @method getMultiLine 
     * Returns multiLine.
     * @return {Boolean}
     */
    p.getMultiLine = function () {
        return this.settings.multiLine;
    };

    /**
     * @method setEllipsis
     * Sets ellipsis
     * @param {Boolean} ellipsis
     */
    p.setEllipsis = function (ellipsis) {
        this.settings.ellipsis = ellipsis;
        var action = DropDownBoxActions.updateTextSettings({ ellipsis: ellipsis });
        this.store.dispatch(action);
    };

    /**
     * @method getEllipsis 
     * Returns ellipsis.
     * @return {Boolean}
     */
    p.getEllipsis = function () {
        return this.settings.ellipsis;
    };

    /**
     * @method setWordWrap
     * Sets wordWrap
     * @param {Boolean} wordWrap
     */
    p.setWordWrap = function (wordWrap) {
        this.settings.wordWrap = wordWrap;
        var action = DropDownBoxActions.updateTextSettings({ wordWrap: wordWrap });
        this.store.dispatch(action);
    };

    /**
     * @method getWordWrap 
     * Returns wordWrap.
     * @return {Boolean}
     */
    p.getWordWrap = function () {
        return this.settings.wordWrap;
    };

    /**
     * @method setFitHeight2Items
     * Sets fitHeight2Items
     * @param {Boolean} fitHeight2Items
     */
    p.setFitHeight2Items = function (fitHeight2Items) {
        this.settings.fitHeight2Items = fitHeight2Items;
        var action = DropDownBoxActions.updateItemSettings({ fitHeight2Items: fitHeight2Items });
        this.store.dispatch(action);
    };

    /**
     * @method getFitHeight2Items 
     * Returns fitHeight2Items.
     * @return {Boolean}
     */
    p.getFitHeight2Items = function () {
        return this.settings.fitHeight2Items;
    };

    /**
     * @method setItemHeight
     * Sets itemHeight
     * @param {Integer} itemHeight
     */
    p.setItemHeight = function (itemHeight) {
        this.settings.itemHeight = itemHeight;
        var action = DropDownBoxActions.updateItemSettings({ itemHeight: itemHeight });
        this.store.dispatch(action);
    };

    /**
     * @method getItemHeight 
     * Returns itemHeight.
     * @return {Integer}
     */
    p.getItemHeight = function () {
        return this.settings.itemHeight;
    };

    /**
     * @method setImageAlign
     * Sets imageAlign
     * @param {brease.enum.ImageAlign} imageAlign
     */
    p.setImageAlign = function (imageAlign) {
        this.settings.imageAlign = imageAlign;
        var action = DropDownBoxActions.updateItemSettings({ imageAlign: imageAlign });
        this.store.dispatch(action);
    };

    /**
     * @method getImageAlign 
     * Returns imageAlign.
     * @return {brease.enum.ImageAlign}
     */
    p.getImageAlign = function () {
        return this.settings.imageAlign;
    };

    /**
     * @method setImagePath
     * Sets imagePath
     * @param {DirectoryPath} imagePath
     */
    p.setImagePath = function (imagePath) {
        this.settings.imagePath = imagePath;
        var action = DropDownBoxActions.updateImagePath(imagePath);
        this.store.dispatch(action);
    };

    /**
     * @method getImagePath 
     * Returns imagePath.
     * @return {DirectoryPath}
     */
    p.getImagePath = function () {
        return this.settings.imagePath;
    };

    /**
     * @method setListPosition
     * Sets listPosition
     * @param {brease.enum.Position} listPosition
     */
    p.setListPosition = function (listPosition) {
        this.settings.listPosition = listPosition;
        var action = DropDownBoxActions.updateListSettings({ listPosition: listPosition });
        this.store.dispatch(action);
    };

    /**
     * @method getListPosition 
     * Returns listPosition.
     * @return {brease.enum.Position}
     */
    p.getListPosition = function () {
        return this.settings.listPosition;
    };

    /**
     * @method setListWidth
     * Sets listWidth
     * @param {Integer} listWidth
     */
    p.setListWidth = function (listWidth) {
        this.settings.listWidth = listWidth;
        var action = DropDownBoxActions.updateListSettings({ listWidth: listWidth });
        this.store.dispatch(action);
    };

    /**
     * @method getListWidth 
     * Returns listWidth.
     * @return {Integer}
     */
    p.getListWidth = function () {
        return this.settings.listWidth;
    };

    /**
     * @method setMaxVisibleEntries
     * Sets maxVisibleEntries
     * @param {Integer} maxVisibleEntries
     */
    p.setMaxVisibleEntries = function (maxVisibleEntries) {
        this.settings.maxVisibleEntries = maxVisibleEntries;
        var action = DropDownBoxActions.updateListSettings({ maxVisibleEntries: maxVisibleEntries });
        this.store.dispatch(action);
    };

    /**
     * @method getMaxVisibleEntries 
     * Returns maxVisibleEntries.
     * @return {Integer}
     */
    p.getMaxVisibleEntries = function () {
        return this.settings.maxVisibleEntries;
    };

    /**
     * @method setCropToParent
     * Sets cropToParent
     * @param {brease.enum.CropToParent} cropToParent
     */
    p.setCropToParent = function (cropToParent) {
        this.settings.cropToParent = cropToParent;
        var action = DropDownBoxActions.updateListSettings({ cropToParent: cropToParent });
        this.store.dispatch(action);
    };

    /**
     * @method getCropToParent 
     * Returns cropToParent
     * @return {brease.enum.CropToParent}
     */
    p.getCropToParent = function () {
        return this.settings.cropToParent;
    };

    /**
     * @method setDisplaySettings
     * Sets displaySettings
     * @param {brease.enum.DropDownDisplaySettings} displaySettings
     */
    p.setDisplaySettings = function (displaySettings) {
        this.settings.displaySettings = displaySettings;

        var subValues = UtilsList.getShowValues(this.settings.displaySettings),
            action = DropDownBoxActions.updateListSettings({ 
                showTexts: subValues.showTexts,
                showImages: subValues.showImages,
                showTextsInButton: subValues.showTextsInButton,
                showImagesInButton: subValues.showImagesInButton
            });
        this.store.dispatch(action);
    };

    /**
     * @method getDisplaySettings 
     * Returns displaySettings
     * @return {brease.enum.DropDownDisplaySettings}
     */
    p.getDisplaySettings = function () {
        return this.settings.displaySettings;
    };

    p._clickHandler = function (e) {
        SuperClass.prototype._clickHandler.call(this, e, { origin: this.elem.id });
    };

    p.setEditable = function (editable, metaData) {
        UtilsEditableBinding.handleEditable(editable, metaData, this, ['selectedIndex', 'selectedValue']);
    };

    p.updateVisibility = function () {
        SuperClass.prototype.updateVisibility.apply(this, arguments);
        if (this.store !== undefined) {
            var action = DropDownBoxActions.changeVisible(this.isVisible());
            this.store.dispatch(action);
        }
    };

    p._enableHandler = function () {
        if (!this.isOffline()) {
            SuperClass.prototype._enableHandler.apply(this, arguments);
            var action = DropDownBoxActions.changeEnable(this.isEnabled());
            this.store.dispatch(action);
        } else if (this.isEnabled()) {
            this.disable();
        }
    };

    p.isOffline = function () {
        return this.offlineAttributes.size > 0;
    };

    p.dispose = function () {
        window.removeEventListener('scroll', this._bind('close'));
        this.dropDownBoxView.dispose();
        this.submitQueue.clear();
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.suspend = function () {
        if (this.store !== undefined) {
            //Close the list
            var actionCloseList = DropDownBoxActions.closeList();
            this.store.dispatch(actionCloseList);
            //Set the status to innactive
            var actionInnactive = DropDownBoxActions.changeActive(false);
            this.store.dispatch(actionInnactive);
        }
        this.submitQueue.clear();
        SuperClass.prototype.suspend.apply(this, arguments);
    };

    p.onBeforeSuspend = function () {
        if (this.bindings && this.bindings['dataProvider']) {
            this.settings.dataProvider = [];
        }
    };

    p.wake = function () {
        if (this.store !== undefined) {
            //Set the status to active
            var action = DropDownBoxActions.changeActive(true);
            this.store.dispatch(action);
        }
        SuperClass.prototype.wake.apply(this, arguments);
    };

    p.submitChange = function (config) {
        var deferredCall = false;
        config = config || {};
        config.previous = config.previous || {};

        if (config && config.deferred === true) {
            this.submitQueue.add(config);
            return;
        } else if (this.submitQueue.length() > 0) {
            // get the values of selectedIndex and selectedValue before the latest submitChange calls
            config.previous = this.submitQueue.getPrevious();
            this.submitQueue.clear();
            deferredCall = true;
        }

        var state = this.store.getState();
        if (!UtilsList.isEqualIntBool(config.previous.selectedIndex, state.items.selectedIndex) || config.previous.selectedValue !== state.items.selectedValue) {
            /**
             * @event SelectedIndexChanged
             * @iatStudioExposed
             * Fired when selectedIndex or selectedValue changes.
             * @param {Integer} selectedIndex
             * @param {String} selectedValue 
             */
            var ev = this.createEvent('SelectedIndexChanged', {
                selectedIndex: this.getSelectedIndex(),
                selectedValue: this.getSelectedValue()
            });
            ev.dispatch();
        }

        var valueChange = {};
        if (config && config.triggeredByBinding === true) { // changes from binding
            if (deferredCall === true) {
                _addIfDifferent('selectedIndex', valueChange, state.items, config.previous);
                _addIfDifferent('selectedValue', valueChange, state.items, config.previous);
            } else {
                _addIfDifferent('selectedIndex', valueChange, state.items, this.settings);
                _addIfDifferent('selectedValue', valueChange, state.items, this.settings);
            }

        } else { // changes not from binding -> send changed values only
            
            _addIfDifferent('selectedIndex', valueChange, state.items, config.previous);
            _addIfDifferent('selectedValue', valueChange, state.items, config.previous);
        }
        this.settings.selectedIndex = state.items.selectedIndex;
        this.settings.selectedValue = state.items.selectedValue;

        if (valueChange.selectedIndex !== undefined || valueChange.selectedValue !== undefined) {
            this.sendValueChange(valueChange);
        }
    };

    // private

    /* Sets the selected entry with provided action
     * @param {String} attribute the selector attribute for index or value
     * @param {*} action the redux action for selecting
     * @param {*} value the selector value/index
     * @param {*} bindingArgs the arguments of binding call
     */
    function _setSelected(attribute, action, value, bindingArgs) {
        this.settings[attribute] = value;
        if (value === null) {
            _setOffline.call(this, attribute);
            return;
        }
        _setOnline.call(this, attribute);
        if (!this.isOffline() && this.settings.dataProvider.length > 0) {
            this.internalData[attribute] = undefined;
            var previous = _getActValues.call(this),
                triggeredByBinding = _triggeredByBinding(bindingArgs);
            this.store.dispatch(action);
    
            // if update comes e.g. from CompoundWidget, then give a binding the chance to change selectedValue
            if (_hasBinding.call(this, attribute) && triggeredByBinding !== true) {
                this.submitChange({ previous: previous, triggeredByBinding: triggeredByBinding, deferred: true });
            } else {
                // otherwise send update immediately
                this.submitChange({ previous: previous, triggeredByBinding: triggeredByBinding });
            }
        } else {
            this.internalData[attribute] = value;
        }
    }

    /* Set attribute to offline. If any attribute is offline the list will be disabled and offline status is displayed.
     * @param {String} attribute 
     */
    function _setOffline(attribute) {
        if (!this.isOffline()) {
            this.store.dispatch(DropDownBoxActions.setListOffline());
            this.close();
            this.disable();
        }
        this.offlineAttributes.add(attribute);
    }

    /* Set attribute to online. If any attribute is offline the list will be disabled and offline status is displayed.
     * @param {String} attribute 
     */
    function _setOnline(attribute) {
        if (this.offlineAttributes.delete(attribute) && !this.isOffline()) {
            this.setEnable(this.settings.enable);
            this.store.dispatch(DropDownBoxActions.setListOnline()); 
        }
    }

    function _triggeredByBinding(metaData) {
        return metaData !== undefined && metaData.origin === 'server';
    }

    function _addIfDifferent(selectType, valueChange, stateValues, compareValues) {
        if (!_isEqual(selectType, stateValues[selectType], compareValues[selectType])) {
            valueChange[selectType] = stateValues[selectType];
        } 
    }

    function _isEqual(selectType, value1, value2) {
        if (selectType === 'selectedIndex') {
            return UtilsList.isEqualIntBool(value1, value2);
        } else {
            return value1 === value2;
        }
    }

    function _getActValues() {
        return {
            selectedIndex: this.getSelectedIndex(),
            selectedValue: this.getSelectedValue()
        };
    }

    function _hasBinding(attribute) {
        return this.bindings !== undefined && this.bindings[attribute] !== undefined;
    }

    function trySetProperty(name, value) {
        var changeset = {};
        changeset[name] = value;
        if (name === 'selectedIndex') {
            changeset = Object.assign(changeset, trySetSelectedIndex.call(this, value));
        } else if (name === 'selectedValue') {
            changeset = Object.assign(changeset, trySetSelectedValue.call(this, value));
        } else if (name === 'dataProvider') {
            changeset = Object.assign(changeset, trySetDataProvider.call(this, value));
        }
        return changeset;
    }

    function trySetSelectedIndex(index) {
        var changeset = {};
        if (this.settings.dataProvider[index]) {
            changeset['selectedValue'] = this.settings.dataProvider[index].value;
        }
        return changeset;
    }

    function trySetSelectedValue(value) {
        var changeset = {};
        var index = findValueIndex(this.settings.dataProvider, value);
        if (index !== -1) {
            changeset['selectedIndex'] = index;
        }
        return changeset;
    }

    function trySetDataProvider(dataProvider) {
        var changeset = {};
        if (dataProvider.length === 0) {
            changeset['selectedIndex'] = defaultSettings.selectedIndex;
            changeset['selectedValue'] = defaultSettings.selectedValue;
        } else if (!dataProvider[this.settings.selectedIndex]) {
            changeset['selectedIndex'] = dataProvider.length - 1;
            changeset['selectedValue'] = dataProvider[dataProvider.length - 1].value;
        } else if (findValueIndex(dataProvider, this.settings.selectedValue) === -1) {
            changeset['selectedValue'] = dataProvider[this.settings.selectedIndex].value;
        }
        return changeset;
    }

    function findValueIndex(dataProvider, value) {
        return dataProvider.findIndex(function (data) { 
            return data.value === value; 
        });
    }

    return dragAndDropCapability.decorate(visibilityDependency.decorate(languageDependency.decorate(WidgetClass, true), false), false);

});
