define([
    'brease/core/ContainerWidget',
    'brease/events/BreaseEvent',
    'brease/decorators/LanguageDependency',
    'brease/enum/Enum',
    'brease/core/Types',
    'brease/core/Utils',
    'brease/helper/Scroller',
    'widgets/brease/common/libs/wfUtils/UtilsImage',
    'brease/decorators/DragAndDropCapability',
    'widgets/brease/common/DragDropProperties/libs/DroppablePropertiesEvents'
], function (SuperClass, BreaseEvent, languageDependency, Enum, Types, Utils, Scroller, UtilsImage, dragAndDropCapability) {

    'use strict';

    /**
     * @class widgets.brXtended.GroupBox
     * #Description
     * widget to group widgets with Label.   
     * @breaseNote 
     * @extends brease.core.ContainerWidget
     * @iatMeta studio:isContainer
     * true
     *
     * @mixins widgets.brease.common.DragDropProperties.libs.DroppablePropertiesEvents
     *
     * @iatMeta category:Category
     * Container
     * @iatMeta description:short
     * Rahmen mit Label
     * @iatMeta description:de
     * Zeigt einen Rahmen um eine Gruppe von Widgets; optional mit einem Beschriftungstext
     * @iatMeta description:en
     * Displays a frame around a group of widgets with an optional caption
     */

    /**
     * @cfg {String} text=''
     * @localizable
     * @iatStudioExposed
     * @iatCategory Appearance 
     * text for the Label
     */

    /**
     * @cfg {ImagePath} image=''
     * @iatStudioExposed
     * @iatCategory Appearance 
     * Image path for the Label
     * When svg - graphics are used, be sure that in your *.svg-file height and width attributes are specified on the svg-element.
     * For more detailed information see https://www.w3.org/TR/SVG/struct.html (chapter 5.1.2)
     */

    /**
     * @cfg {brease.enum.ImagePosition} imageAlign='left'
     * @iatStudioExposed
     * @iatCategory Appearance 
     * imageAlign for the Label
     * defines the Position of the image relative to the text
     * possible values: left(left of text)/right(right of text)
     */

    /**
    * @cfg {Boolean} useSVGStyling=true
    * @iatStudioExposed
    * @iatCategory Appearance
    * Define if the image stylings (i.e imageColor) are applied - only valid when SVG Images are used.
    */

    /**
     * @cfg {Boolean} ellipsis=false
     * @iatStudioExposed
     * @iatCategory Behavior 
     * ellipsis for the Label
     */

    /**
     * @cfg {brease.enum.Floating} float='left'
     * @iatStudioExposed
     * @iatCategory Appearance 
     * Floating of the childelements if childPositioning=relative
     */

    /**
     * @cfg {brease.enum.ChildPositioning} childPositioning='absolute'
     * @iatStudioExposed
     * @iatCategory Behavior 
     * positioning of child elements (widgets)
     */

    /**
     * @cfg {brease.enum.Direction} alignment='vertical'
     * @iatStudioExposed
     * @iatCategory Appearance
     * Alignment of the Bar. Possible Values:
     * horizontal: elements aligned from left to right. no line break
     * vertical: elements aligned from left to right. with line break
     */

    /**
     * @cfg {Integer} maxHeight=0
     * @iatStudioExposed
     * @iatCategory Appearance
     * Maximum height the GroupBox can grow, when childPositioning='relative'
     */

    /**
     * @cfg {Boolean} verticalAnchorTop=true
     * @iatStudioExposed
     * @iatCategory Appearance
     * If alignement='vertical' you can choose anchor of your items, Top='true' Bottom='false'
     */

    var defaultSettings = {
            alignment: Enum.Direction.vertical,
            borderTop: true,
            borderBottom: true,
            borderLeft: true,
            borderRight: true,
            childPositioning: Enum.ChildPositioning.absolute,
            imageAlign: Enum.ImagePosition.left,
            useSVGStyling: true,
            float: 'left',
            maxHeight: 0,
            verticalAnchorTop: true
        },

        WidgetClass = SuperClass.extend(function GroupBox() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;
    
    WidgetClass.static.multitouch = true;

    var scrollBarInitDone = false;

    p.init = function () {

        if (this.settings.omitClass !== true) {
            this.addInitialClass('brXtendedGroupBox');
        }
        this.debouncedResize = _.debounce(this.resize.bind(this), 100);
        SuperClass.prototype.init.call(this);
        if (brease.config.editMode !== true) {
            this._initEvents();
        }
        
        //If GB is relative we need to take care of all child widgets instantiate before recalculating the height
        if (this.settings.childPositioning === Enum.ChildPositioning.relative) {
            this.el.on(BreaseEvent.WIDGET_READY, this._bind('_widgetReadyHandler'));
            this.widgetReady = new $.Deferred();
            this.groupBoxReady = new $.Deferred();
            _initChildren(this);
            this._startInitialisation();
        } else {
            _childPositioningHandling(this);
            _floatHandling(this);
        }
        _checkLangDependency.call(this);
        if (this.settings.text !== undefined || this.settings.image !== undefined) {
            _addHeader(this);
            _containerOffsetHandling(this);
        }

        if (this.settings.childPositioning === Enum.ChildPositioning.relative) {
            _setAlignmentClass(this);
            this.container.on('VisibleChanged', this._bind('_scrollUpdateHandler'));
        }

        _headerHandling(this);

        this.el.addClass('initialized');
        this._refreshScroller();
    };

    p._startInitialisation = function () {
        var widget = this;
        $.when(this.widgetReady.promise(), this.groupBoxReady.promise()).then(function successHandler() {
            
            //Dispatch an event telling the GroupBox is finished - used for unit tests only
            var ev = widget.createEvent('GroupBoxReady', {});
            ev.dispatch();
            
            _childPositioningHandling(widget);
            _floatHandling(widget);
            _setFlexDirection(widget)
            scrollBarInitDone = false;

            if (_isResizable.call(widget)) {
                widget.debouncedResize();
            }
        });
    };
    
    p._onStylePropertiesChanged = function () {
        _containerOffsetHandling(this);
        this._refreshScroller();
    };

    /**
    * @method _initEvents
    * used to add eventhandlers to events the widget listens to
    * while active
    * @param {Boolean} remove
    * when set to true eventhandlers are removed
    */
    p._initEvents = function (remove) {
        var fn = remove === true ? 'off' : 'on';
        this.el[fn]('VisibleChanged', this._bind('_visibleChangeHandler'));
        this.el[fn]('SizeChanged', this._bind('_sizeChangeHandler'));
        this.el[fn](BreaseEvent.MOUSE_DOWN, this._bind('_downHandler'));
        if (remove === true) {
            $(document).off(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));
        }
    };

    // override method called in BaseWidget.init
    p._initEditor = function () {
        var widget = this;
        this.elem.addEventListener(BreaseEvent.WIDGET_STYLE_PROPERTIES_CHANGED, this._bind('_onStylePropertiesChanged'));
        this.elem.classList.add('iatd-outline');
        require(['widgets/brXtended/GroupBox/libs/EditorHandles'], function (EditorHandles) {
            var editorHandles = new EditorHandles(widget);
            widget.getHandles = function () {
                return editorHandles.getHandles();
            }; 
            widget.dispatchEvent(new CustomEvent(BreaseEvent.WIDGET_EDITOR_IF_READY, { bubbles: true }));
        });
    };

    p.langChangeHandler = function () {
        if (this.settings.textkey !== undefined) {
            _setStaticText.call(this, brease.language.getTextByKey(this.settings.textkey));
        }
    };

    /**
     * @method setText
     * Sets the text
     * @param {String} text
     */
    p.setText = function (text) {
        
        this.settings.text = text;
        _checkLangDependency.call(this);
        _setStaticText.call(this, this.getCurrentText());
    };

    function _checkLangDependency() {

        if (brease.language.isKey(this.settings.text) === true) {
            this.settings.textkey = brease.language.parseKey(this.settings.text);
            this.setLangDependency(true);
        } else {
            this.settings.textkey = undefined;
            this.setLangDependency(false);
        }
    }

    function _setStaticText(text) {
        _textHandling(this, text);
        _headerHandling(this);
    }

    /**
     * @method getText 
     * Returns the text.
     * @return {String}  text
     */
    p.getText = function () {
        return this.settings.text;
    };

    p.getCurrentText = function () {
        return (this.settings.textkey !== undefined) ? brease.language.getTextByKey(this.settings.textkey) : this.settings.text;
    };

    /**
     * @method setChildPositioning
     * Sets childPositioning
     * @param {brease.enum.ChildPositioning} childPositioning
     */
    p.setChildPositioning = function (childPositioning) {
        this.settings.childPositioning = childPositioning;
        _childPositioningHandling(this);
        //_floatHandling(this); no need to call this here => floating is done in "_childPositioningHandling" also
        //can not be testet due to editor issue.
    };

    /**
     * @method getChildPositioning 
     * Returns childPositioning.
     * @return {brease.enum.ChildPositioning}
     */
    p.getChildPositioning = function () {
        return this.settings.childPositioning;
    };

    /**
     * @method setEllipsis
     * Sets ellipsis
     * @param {Boolean} ellipsis
     */
    p.setEllipsis = function (ellipsis) {
        this.settings.ellipsis = ellipsis;

        if (this.header) {
            if (ellipsis === true) {
                this.header.addClass('ellipsis');
            } else if (ellipsis === false) {
                this.header.removeClass('ellipsis');
            }
        }
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
     * @method setImage
     * Sets image
     * @param {ImagePath} image
     */
    p.setImage = function (image) {
        this.settings.image = image;
        _imageHandling(this);
    };

    /**
     * @method getImage 
     * Returns image.
     * @return {ImagePath}
     */
    p.getImage = function () {
        return this.settings.image;
    };

    /**
     * @method setImageAlign
     * Sets imageAlign
     * @param {brease.enum.ImagePosition} imageAlign
     */
    p.setImageAlign = function (imageAlign) {
        this.settings.imageAlign = imageAlign;
        _imageAlignHandling(this);
    };

    /**
     * @method getImageAlign 
     * Returns imageAlign.
     * @return {brease.enum.ImagePosition}
     */
    p.getImageAlign = function () {
        return this.settings.imageAlign;
    };

    /**
    * @method setUseSVGStyling
    * Sets useSVGStyling
    * @param {Boolean} useSVGStyling
    */
    p.setUseSVGStyling = function (useSVGStyling) {
        this.settings.useSVGStyling = Types.parseValue(useSVGStyling, 'Boolean', { default: true });
        _imageHandling(this);
        _imageAlignHandling(this);
    };

    /**
    * @method getUseSVGStyling
    * Returns useSVGStyling
    * @return {Boolean}
    */
    p.getUseSVGStyling = function () {
        return this.settings.useSVGStyling;
    };

    /**
     * @method setAlignment
     * Sets alignment
     * @param {brease.enum.Direction} alignment
     */
    p.setAlignment = function (alignment) {
        this.settings.alignment = alignment;
        _setAlignmentClass(this);
    };

    /**
     * @method getAlignment 
     * Returns alignment.
     * @return {brease.enum.Direction}
     */
    p.getAlignment = function () {
        return this.settings.alignment;
    };

    /**
     * @method setFloat
     * Sets float
     * @param {brease.enum.Floating} float
     */
    p.setFloat = function (value) {
        this.settings.float = value;
        if (this.settings.childPositioning === Enum.ChildPositioning.relative) {
            _floatHandling(this);
        }
    };

    /**
     * @method getFloat 
     * Returns float.
     * @return {brease.enum.Floating}
     */
    p.getFloat = function () {
        return this.settings.float;
    };

    p.setTextKey = function (key) {
        if (key !== undefined) {
            this.settings.textkey = key;
            this.setLangDependency(true);
            this.langChangeHandler();
        }
    };

    /**
     * @method setMaxHeight
     * Sets maxHeight
     * @param {Integer} maxHeight
     */
    p.setMaxHeight = function (maxHeight) {
        this.settings.maxHeight = maxHeight;
    };

    /**
     * @method getMaxHeight 
     * Returns maxHeight.
     * @return {Integer}
     */
    p.getMaxHeight = function () {
        return this.settings.maxHeight;
    };

    /**
     * @method setVerticalAnchorTop
     * Sets verticalAnchorTop
     * @param {Boolean} verticalAnchorTop
     */
    p.setVerticalAnchorTop = function (verticalAnchorTop) {
        this.settings.verticalAnchorTop = verticalAnchorTop;
        _setFlexDirection(this)
    };

    /**
     * @method getVerticalAnchorTop 
     * Returns verticalAnchorTop.
     * @return {Boolean}
     */
    p.getVerticalAnchorTop = function () {
        return this.settings.verticalAnchorTop;
    };

    p.resize = function () {
        var curWidgetSize = this.el.outerHeight(),
            curInnerHeight = this.el.innerHeight(),
            initHeight = Types.parseValue(this.settings.height, 'Integer'),
            deltaSize = curWidgetSize - curInnerHeight,
            groupBoxContentSize = _calculateContentSize(this) + (this.header ? this.header.outerHeight() : 0);

        if (groupBoxContentSize < curInnerHeight && groupBoxContentSize > initHeight - deltaSize) {
            this.el.css('height', groupBoxContentSize + deltaSize + 'px');

        } else if (groupBoxContentSize < curInnerHeight && groupBoxContentSize <= initHeight - deltaSize) {
            this.el.css('height', initHeight + 'px');

        } else if (groupBoxContentSize >= curInnerHeight && groupBoxContentSize < this.settings.maxHeight - deltaSize) {
            this.el.css('height', groupBoxContentSize + deltaSize + 'px');

        } else if (groupBoxContentSize >= curInnerHeight && groupBoxContentSize >= this.settings.maxHeight - deltaSize) {
            this.el.css('height', this.settings.maxHeight + 'px');
        }
        this.debouncedRefresh();
        this.sizeChanged();

    };

    p.sizeChanged = function () {
        var sizeChangedEv = this.createEvent('SizeChanged');
        /**
         * @event sizeChanged
         * Fired when the size of the widget changes
         */
        sizeChangedEv.dispatch();
    };

    p._downHandler = function (e) {
        if (this.isDisabled || brease.config.editMode || this.isActive) { return; }
        this.isActive = true;
        this.pointerId = Utils.getPointerId(e);

        $(document).on(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));

        /**
         * @event MouseDown
         * @iatStudioExposed
         * Fired when widget enters mouseDown state
         * @param {String} horizontalPos horizontal position of mouse in pixel i.e '10px'
         * @param {String} verticalPos vertical position of mouse in pixel i.e '10px'
         */
        var clickEv = this.createMouseEvent('MouseDown', {}, e);
        clickEv.dispatch();

    };

    p._upHandler = function (e) {
        if (this.isDisabled || brease.config.editMode || Utils.getPointerId(e) !== this.pointerId) { return; }
        this.isActive = false;

        $(document).off(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));

        /**
         * @event MouseUp
         * @iatStudioExposed
         * Fired when widget enters mouseUp state
         * @param {String} horizontalPos horizontal position of mouse in pixel i.e '10px'
         * @param {String} verticalPos vertical position of mouse in pixel i.e '10px'
         */
        var clickEv = this.createMouseEvent('MouseUp', {}, e);
        clickEv.dispatch();
    };

    p._scrollUpdateHandler = function (e) {
        this._handleEvent(e);
        if (this.scroller !== undefined) {
            this._refreshScroller();
        } else {
            _setAlignmentClass(this);
        }

    };

    // method only to ensure compatibility
    p._refreshScroller = function () {
        this.debouncedRefresh();
    };

    p._widgetReadyHandler = function (e) {
        if (e.target.id === this.elem.id) {            
            this.widgetReady.resolve();
            this.el.off(BreaseEvent.WIDGET_READY, this._bind('_widgetReadyHandler'));
        }
    };

    p._sizeChangeHandler = function (e) {
        if (_isResizable.call(this)) {
            //Check if the sizeChange event was fired by a direct child of the GroupBox
            if (this.getContainer().get(0).children.namedItem(e.target.id) !== null) {
                this.debouncedRefresh.cancel();
                this.debouncedResize();
            }
        } else {
            this._refreshScroller();
        }
    };

    p._visibleHandler = function () {
        //console.log('_visibleHandler', this.elem.id);
        if (_isResizable.call(this)) {
            // might be called by the BaseWidget initially before
            // the container widget creates the debouncedRefresh method
            if (this.debouncedRefresh) {
                this.debouncedRefresh.cancel();
            }
            this.debouncedResize();
        } else {
            this._refreshScroller();
        }
    };

    p._visibleChangeHandler = function (e) {
        if (_isResizable.call(this)) {
            //Check if the visible change event was fired by a direct child of the GroupBox
            if (this.getContainer().get(0).children.namedItem(e.target.id) !== null) {
                this.debouncedRefresh.cancel();
                this.debouncedResize();
            }
        } else {
            this._refreshScroller();
        }
    };

    //this method, overshadowed from the container widget will tell us when a new widget is dropped
    p.widgetAddedHandler = function (e) {
        if (e.target.id !== this.elem.id) { return; }

        $('#' + e.detail.widgetId).css('float', this.settings.float !== undefined ? this.settings.float : 'none');

        //If there is no scroller wrapper
        if (!this.scrollWrapper && this.settings.childPositioning === Enum.ChildPositioning.relative) {
            _setAlignmentClass(this);
        } else if (this.scrollWrapper && this.settings.childPositioning === Enum.ChildPositioning.relative) {
            _addChildAtScroller(this);
        }
    };

    /**
    * @method getContainer
    * Returns the HTML Element which contains the childWidgets. 
    * Implemented in the core.ContainerWidget to pass parent settings
    * to all children. (e.g.: parentEnableState)
    * Using childPositioning = relative will move all child widgets from
    * this.container to this.scrollWrapper so if the scrollWrapper is defined
    * we return the reference to the ScrollWrapper
    */
    p.getContainer = function () {
        SuperClass.prototype.getContainer.apply(this, arguments);

        return this.scrollWrapper !== undefined ? this.scrollWrapper : this.container;
    };

    //Equivalently this method, just as widgetAddedHandler, will tell us when a widget is removed
    p.widgetRemovedHandler = function () {
        _removeChildAtScroller(this);
    };

    p.wake = function () {
        SuperClass.prototype.wake.apply(this, arguments);
        this._initEvents();
        if (_isResizable.call(this)) {
            this.debouncedResize();
        }
        this._refreshScroller();
    };

    p.suspend = function () {
        this._initEvents(true);
        this.debouncedRefresh.cancel();
        // invoke pending calls immediately
        this.debouncedResize.flush();
        // invoke pending call from debouncedResize() immediately
        this.debouncedRefresh.flush();
        SuperClass.prototype.suspend.apply(this, arguments);
    };

    p.dispose = function () {
        this._initEvents(true);
        this.debouncedResize.cancel();
        this.debouncedRefresh.cancel();
        this.container.off();

        if (this.scroller) {
            this.scroller.destroy();
            this.scroller = null;
        }

        SuperClass.prototype.dispose.apply(this, arguments);
    };

    function _setFlexDirection(widget){
        if (widget.scrollWrapper) {
            widget.scrollWrapper.css("flex-direction", widget.settings.verticalAnchorTop === true ? 'column' : 'column-reverse');
        }
    }

    function _initChildren(widget) {
        var itemDefs = Array.prototype.map.call(widget.getContainer().get(0).children, function (actChild) {
            var def = $.Deferred();

            if (brease.uiController.getWidgetState(actChild.id) === Enum.WidgetState.READY) {
                def.resolve();
            } else {
                actChild.addEventListener(BreaseEvent.WIDGET_READY, def.resolve);
                def.always(function () {
                    actChild.removeEventListener(BreaseEvent.WIDGET_READY, def.resolve);
                });
            }

            return def;
        });
        $.when.apply($, itemDefs).done(function () {
            widget.groupBoxReady.resolve();
        });
    }

    function _addHeader(widget) {

        var elHeader = $('<div class="header"></div>'),
            elText,
            elImg;

        if (widget.settings.ellipsis === true) {
            elHeader.addClass('ellipsis');
        }
        if (widget.settings.text !== undefined && widget.settings.text.length !== 0) {
            var text = ((widget.settings.textkey !== undefined) ? brease.language.getTextByKey(widget.settings.textkey) : widget.settings.text);
            elText = $('<span></span>').text(text);
        } else {
            elHeader.addClass('no-text');
        }
        elImg = _loadImage(widget.settings.image, widget.settings.useSVGStyling);

        if (widget.settings.imageAlign === Enum.ImagePosition.left) {
            elHeader.addClass('image-left').append(elImg).append(elText);
        } else {
            elHeader.addClass('image-right').append(elText).append(elImg);
        }
        widget.header = elHeader.prependTo(widget.el);
        widget.textEl = elText;
    }

    function _loadImage(image, useSVGStyling) {
        var imgEl;
        if (typeof image !== 'string' || image.length === 0) return imgEl;

        if (UtilsImage.isStylable(image) && useSVGStyling) {
            imgEl = $('<svg />');
            imgEl.hide();
            UtilsImage.getInlineSvg(image).then(function (svgElement) {
                imgEl.replaceWith(svgElement);
                imgEl = svgElement;
                imgEl.show();
            });
        } else {
            imgEl = $('<img src="' + image + '"/>');
        }
        return imgEl;
    }

    function _imageHandling(widget) {
        if (widget.header) {
            widget.header.children('svg').remove();
            widget.header.children('img').remove();
            var elImg = _loadImage(widget.settings.image, widget.settings.useSVGStyling);
            if (widget.settings.imageAlign === Enum.ImagePosition.right) {
                widget.header.append(elImg);
            } else {
                widget.header.prepend(elImg);
            }
        } else {
            _addHeader(widget);
        }
        _headerHandling(widget);
    }

    function _imageAlignHandling(widget) {
        var image;
        
        if (widget.header) {
            if (UtilsImage.isStylable(widget.settings.image)) {
                image = widget.header.children('svg');
            } else {
                image = widget.header.children('img');
            }

            if (widget.settings.imageAlign !== undefined || widget.settings.imageAlign !== '') {
                if (widget.settings.imageAlign === 'right') {
                    widget.header.removeClass('image-left');
                    widget.header.addClass('image-right');
                    image.appendTo(widget.header);
                }
                if (widget.settings.imageAlign === 'left') {
                    widget.header.removeClass('image-right');
                    widget.header.addClass('image-left');
                    image.prependTo(widget.header);
                }
            } 
        }
    }

    function _headerHandling(widget) {

        if ((widget.settings.image === '' || widget.settings.image === undefined) &&
            (widget.settings.text === '' || widget.settings.text === undefined)) {
                
            if (widget.header) {
                widget.header.remove();
                widget.header = undefined; 
            }
        }
        _containerOffsetHandling(widget);
    }

    function _containerOffsetHandling(widget) {
        if (widget.header) {
            widget.container.css('top', (widget.header.outerHeight()) + 'px');
        } else {
            widget.container.css('top', '0px');
        }

    }

    function _textHandling(widget, text) {
        
        if (widget.header) {
            widget.header.removeClass('no-text');

            if (!text || text.length === 0) {
                if (widget.textEl) {
                    widget.textEl.remove(); 
                    widget.textEl = undefined;
                }
                widget.header.addClass('no-text');

            } else {
                if (widget.textEl) {
                    widget.textEl.text(text);

                } else {
                    widget.textEl = $('<span>' + text + '</span>');
                    if (widget.settings.imageAlign === 'left') {
                        widget.header.append(widget.textEl);
                    } else if (widget.settings.imageAlign === 'right') {
                        widget.header.prepend(widget.textEl);
                    }
                } 
            }
        } else {
            _addHeader(widget);
        }
    }

    function _setAlignmentClass(widget) {
        widget.el.removeClass('vertical', 'horizontal');

        var scrollerSettings;
        if (widget.settings.alignment === 'horizontal') {
            widget.el.addClass('horizontal');
            scrollerSettings = { mouseWheel: true, tap: true, scrollY: false, scrollX: true };
        } else if (widget.settings.alignment === 'vertical') {
            widget.el.addClass('vertical');
            scrollerSettings = { mouseWheel: true, tap: true, scrollY: true, scrollX: false };
            if (!widget.settings.verticalAnchorTop) {
                var containerHeight = widget.container.outerHeight();
                var childrenHeight = 0;
                if(widget.scrollWrapper){
                    childrenHeight = widget.scrollWrapper.outerHeight();
                }else{
                    widget.container.children().each(function (){
                        childrenHeight += $(this).outerHeight();
                    });
                }
                
                $.extend(scrollerSettings, {startY: containerHeight-childrenHeight});
            }
        }

        widget.container.off('VisibleChanged', widget._bind('_scrollUpdateHandler'));

        if (widget.settings.childPositioning === Enum.ChildPositioning.relative) {
            widget.container.on('VisibleChanged', widget._bind('_scrollUpdateHandler'));
            if (!widget.scrollWrapper) {
                _addScroller(widget, scrollerSettings);
                widget.scrollWrapper.addClass('widgetContainer');
                widget.el.addClass('autoScroll');
            } else {
                if (brease.config.editMode) {
                    _swapScrollers(widget, scrollerSettings);
                }
                _addChildAtScroller(widget);
            }
            widget.container.removeClass('widgetContainer');
        } else {
            widget.el.removeClass('autoScroll');
            widget.container.addClass('widgetContainer');
        }
    }

    function _childPositioningHandling(widget) {
        var cssStyles = {
            'float': widget.settings.float !== undefined ? widget.settings.float : 'none',
            'position': widget.settings.childPositioning === Enum.ChildPositioning.relative ? 'relative' : 'absolute'
        };

        if (widget.settings.childPositioning === Enum.ChildPositioning.relative) {
            if (!widget.scrollWrapper) {
                _setAlignmentClass(widget);
            }

        } else if (widget.settings.childPositioning === Enum.ChildPositioning.absolute) {
            if (widget.scrollWrapper) {
                _removeScroller(widget);
            }
            _setAlignmentClass(widget);

        }
        widget.getContainer().children('[data-brease-widget]').css(cssStyles);
        if (widget.scrollWrapper) {
            widget.debouncedRefresh();
        }
    }

    function _floatHandling(widget) {
        if (widget.settings.childPositioning === Enum.ChildPositioning.relative) {
            if (widget.settings.float !== undefined) {
                widget.getContainer().children().css('float', widget.settings.float);
            }
        }
    }

    function _addScroller(widget, scrollerSettings) {
        widget.scrollWrapper = $('<div/>').addClass('scrollWrapper');
        widget.container.children().appendTo(widget.scrollWrapper);
        widget.container.append(widget.scrollWrapper);

        if (widget.scroller === undefined) {
            widget.scroller = Scroller.addScrollbars(widget.container[0], scrollerSettings);
        }
        widget._refreshScroller();
    }

    function _removeScroller(widget) {
        if (widget.scroller) {
            widget.debouncedRefresh.cancel();
            widget.scroller.destroy();
            widget.scroller = undefined;

        }
        // move widgets to the container before removing the scrollWrapper
        widget.scrollWrapper.children('.breaseWidget').appendTo(widget.container);
        widget.scrollWrapper.remove();
        widget.scrollWrapper = undefined;
    }

    // New function to rearrange children in scroll bar
    function _addChildAtScroller(widget) {
        widget._refreshScroller();
    }

    // used in editMode to change between horizontal and vertical scroller
    // if the alignmentClass has been changed (see _setAlignmentClass())
    function _swapScrollers(widget, scrollerSettings) {
        widget.debouncedRefresh.cancel();
        widget.scroller.destroy();
        widget.scroller = undefined;
        widget.scroller = Scroller.addScrollbars(widget.container[0], scrollerSettings);
    }

    function _removeChildAtScroller(widget) {
        //Check if any children still are present
        widget._refreshScroller();
    }

    function _calculateContentSize(widget) {
        var contentSize,
            maxContentSize = 0;

        widget.getContainer().children().each(function () {
            if (!this.classList.contains('remove')) {
                contentSize = this.offsetTop + this.offsetHeight + parseInt(getComputedStyle(this).marginBottom, 10);

                if (contentSize > maxContentSize) {
                    maxContentSize = contentSize;
                }
            }
        });

        return maxContentSize;
    }
    // GroupBox is only resizable during runtime if childPositioning = relative
    // and maxHeight > height as described in the AS Help
    function _isResizable() {
        var settings = this.settings;
        return brease.config.editMode !== true && this.isVisible() === true &&
            settings.childPositioning === Enum.ChildPositioning.relative &&
            Types.parseValue(settings.height, 'Integer') < settings.maxHeight;
    }

    return dragAndDropCapability.decorate(languageDependency.decorate(WidgetClass, false), false);

});
