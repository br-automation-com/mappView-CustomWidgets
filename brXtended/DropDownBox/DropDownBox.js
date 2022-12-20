define([
    'widgets/brease/DropDownBox/DropDownBox',
    'widgets/brease/DropDownBox/libs/FocusHandler',
    'widgets/brXtended/DropDownBox/libs/config/Config',
    'widgets/brease/DropDownBox/libs/config/InitState',
    'widgets/brease/DropDownBox/libs/SubmitQueue',
    'brease/decorators/LanguageDependency',
    'brease/decorators/VisibilityDependency',
    'widgets/brXtended/DropDownBox/libs/view/DropDownBoxView/DropDownBoxView',
    'widgets/brease/DropDownBox/libs/reducer/DropDownBoxActions',
    'widgets/brease/DropDownBox/libs/reducer/DropDownBoxReducer',
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
     * @class widgets.brXtended.DropDownBox
     *
     * @mixins widgets.brease.common.DragDropProperties.libs.DroppablePropertiesEvents
     *
     * #Description
     * DropDownBox
     * @extends widgets.brease.DropDownBox
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

        // Initialize superclass
        SuperClass.prototype.init.apply(this, arguments);

        // //Define order for binding properties
        // BindingSync.setupPropertyOrder(this, [
        //     {
        //         name: 'selectedValue',
        //         waitFor: ['dataProvider']
        //     }, {
        //         name: 'selectedIndex',
        //         waitFor: ['dataProvider']
        //     }]);

        // // Queue for submitChange requests
        // this.submitQueue = new SubmitQueue(this);

        // Calculate init state
        var initState = InitState.calculateInitState(this.settings, this.isEnabled(), this.isVisible());
        // Add additonal propery to init state
        initState.items.listSettings.listPositionExt = this.settings.listPositionExt;

        // Create store
        this.store = Redux.createStore(DropDownBoxReducer, initState);

        // Remove inherited view
        window.removeEventListener('addEventListener', this.focusHandler.onRender.bind(this.focusHandler));
        this.dropDownBoxView.dispose();
        this.submitQueue.clear();

        // Create View
        this.dropDownBoxView = new DropDownBoxView(this.store, this.el, this);

        // Subscribe master view to the store
        this.store.subscribe(this.dropDownBoxView.render.bind(this.dropDownBoxView));

        // this.offlineAttributes = new Set();
        // this.focusHandler = new FocusHandler(this);

        if (brease.config.isKeyboardOperationEnabled()) {
            // Update focus after a render of the view
            this.dropDownBoxView.addEventListener('ViewRendered', this.focusHandler.onRender.bind(this.focusHandler));
        }
        // window.addEventListener('scroll', this._bind('close'));
    };

    return dragAndDropCapability.decorate(visibilityDependency.decorate(languageDependency.decorate(WidgetClass, true), false), false);

});
