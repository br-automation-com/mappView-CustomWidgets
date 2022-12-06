define(['brease/events/BreaseEvent', 'brease/enum/Enum',
    'brease/core/Utils', 'brease/controller/libs/KeyActions'], 
function (BreaseEvent, Enum, Utils, KeyActions) {

    'use strict';
    var SCROLL_ACTIONS = [Enum.KeyAction.ScrollDown, Enum.KeyAction.ScrollUp, Enum.KeyAction.ScrollDownFast, Enum.KeyAction.ScrollUpFast];

    var FocusHandler = function (widget) {
            this.widget = widget;
            this.editMode = false;
            if (brease.config.isKeyboardOperationEnabled()) {
                this.widget.el.on(BreaseEvent.FOCUS_OUT, this.onFocusOut.bind(this));
                this.widget.el.on(BreaseEvent.BEFORE_ENABLE_CHANGE, this.onBeforeStateChange.bind(this));
                this.widget.el.on(BreaseEvent.BEFORE_VISIBLE_CHANGE, this.onBeforeStateChange.bind(this));
            }
        },
        p = FocusHandler.prototype,
        itemFocusClass = 'elementFocus';
    
    p.handleKeyDown = function (e) {
        var action = KeyActions.getActionForKey(e.key);

        if (!this.editMode) {
            if (brease.config.keyboardHandling.onStart.action === 'any') {
                if (action === Enum.KeyAction.Accept) {
                    this.widget.open();
                    startEditMode.call(this);
                } else if (SCROLL_ACTIONS.indexOf(action) !== -1) {
                    this.widget.open();
                    startEditMode.call(this);
                    this.editModeKeyDownHandler(action, e);
                }
            } else {
                if (action === Enum.KeyAction.Accept) {
                    this.widget.open();
                    startEditMode.call(this);
                } 
            }
        } else {
            this.editModeKeyDownHandler(action, e);
        }
    };

    p.editModeKeyDownHandler = function (action, e) {
        if (this.widget.settings.dataProvider.length > 0) {
            if (action === Enum.KeyAction.ScrollDown) {
                stopEvent(e);
                focusNextItem.call(this);
            } else if (action === Enum.KeyAction.ScrollUp) {
                stopEvent(e);
                focusPreviousItem.call(this);
            } else if (action === Enum.KeyAction.Accept) {
                selectFocusedItem.call(this);
                endEditMode.call(this);
                this.widget.triggerToggleStateChanged();
            } else if (action === Enum.KeyAction.Cancel) {
                // would otherwise also close dialog if widget is in dialog
                stopEvent(e);
                cancel.call(this);
            } else if (action === Enum.KeyAction.ScrollDownFast) {
                stopEvent(e);
                focusNextPage.call(this);
            } else if (action === Enum.KeyAction.ScrollUpFast) {
                stopEvent(e);
                focusPreviousPage.call(this);
            }
        }
    };

    // stop event from trigger scrolling, esc dialog..
    function stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    // store all widget dimensions which do not change during one focus session
    function setDimensions() {
        var itemContainer = this.widget.getItemContainer(),
            containerRect = itemContainer.getBoundingClientRect();
        this.dimensions = {
            itemHeight: (this.widget.settings.dataProvider.length > 0) ? this.widget.getAllItems()[0].getBoundingClientRect().height : this.widget.settings.itemHeight,
            container: {
                height: containerRect.height,
                offsetHeight: itemContainer.offsetHeight
            }
        };
        this.maxIndex = this.widget.settings.dataProvider.length - 1;
        this.pageIndexOffset = Math.ceil(this.dimensions.container.height / this.dimensions.itemHeight) - 1;
    }

    p.getDimensions = function () {
        if (!this.dimensions) {
            setDimensions.call(this);
        }
        return this.dimensions;
    };

    p.onFocusOut = function () {
        if (this.editMode) {
            if (brease.config.keyboardHandling.onEnd.action === 'focus') {
                selectFocusedItem.call(this);
                endEditMode.call(this);
                this.widget.triggerToggleStateChanged();
            } else if (brease.config.keyboardHandling.onEnd.action === 'accept') {
                cancel.call(this);
            }
        }
    };

    // react on a redraw of the ListBox and set focus to selectedIndex
    p.onRender = function () {
        if (this.editMode) {
            setDimensions.call(this);
            var selectedIndex = this.widget.getSelectedIndex();
            if (Number.isInteger(selectedIndex)) {
                focusItemByIndexAndCenter.call(this, selectedIndex);
            }
        }
    };

    p.onToggleStateChanged = function (listOpen) {
        if (listOpen) {
            if (!this.editMode) {
                startEditMode.call(this);
            }
        } else {
            this.editMode = false;
        }
    };

    // called before enable or visible state changes
    p.onBeforeStateChange = function (e) {
        if (!e.detail.value) {
            cancel.call(this);
        }
    };

    p.dispose = function () {
        this.widget.el.off(BreaseEvent.FOCUS_IN);
        this.widget.el.off(BreaseEvent.FOCUS_OUT);
        this.widget.el.off(BreaseEvent.BEFORE_ENABLE_CHANGE);
        this.widget.el.off(BreaseEvent.BEFORE_VISIBLE_CHANGE);
        this.widget = undefined; 
    };

    function getFocusedItem() {
        return this.widget.dropDownBoxView.listContainer[0].querySelector('.' + itemFocusClass);
        //return this.widget.elem.querySelector('.' + itemFocusClass);
    }

    function getIndexOfElement(elem) {
        return Array.prototype.indexOf.call(elem.parentNode.children, elem);
    }

    function getIndexOfFocusedItem() {
        var focusedItem = getFocusedItem.call(this);
        if (focusedItem) {
            return getIndexOfElement(focusedItem);
        } else { 
            return -1; 
        }
    }

    function startEditMode() {
        this.editMode = true;
        setDimensions.call(this);
        focusSelectedItem.call(this);
    }

    function endEditMode() {
        if (this.editMode) {
            blurAllItems.call(this);
            scrollToSelected.call(this);
            this.editMode = false;
        }
    }

    function cancel() {
        endEditMode.call(this);
        this.widget.close();
    }

    function focusSelectedItem() {
        Utils.addClass(this.widget.getSelectedItem(), itemFocusClass);
    }

    function blurAllItems() {
        this.widget.getAllItems().forEach(function (item) {
            Utils.removeClass(item, itemFocusClass);
        });
    }

    function selectFocusedItem() {
        var index = getIndexOfFocusedItem.call(this);
        if (index !== -1) {
            this.widget.setSelectedIndex(index);
        }
    }

    function focusNextItem() {
        var index = getIndexOfFocusedItem.call(this),
            nextIndex = index + 1;

        if (nextIndex > this.maxIndex) {
            nextIndex = 0;
        }
        focusItemByIndexAndCenter.call(this, nextIndex);
    }

    function focusPreviousItem() {
        var index = getIndexOfFocusedItem.call(this),
            prevIndex = index - 1;

        if (prevIndex === -1) {
            prevIndex = this.maxIndex;
        }
        focusItemByIndexAndCenter.call(this, prevIndex);
    }

    /*
    * @method 
    * Returns the offset of the scroll-wrapper as positive Number
    * @return {Number}
     */
    function getScrollOffset(considerZoom) {
        considerZoom = (considerZoom !== undefined) ? considerZoom : true;
        var scroller = this.widget.getScroller();
        if (scroller) {
            if (considerZoom) {
                return -(scroller.y * scroller.zoomFactor);
            } else {
                return -scroller.y;
            }
        } else {
            return 0;
        }
    }

    /*
    * @method 
    * Get the highest index of items, which are completely in view
    * @return {Integer}
     */
    function findLastIndexInView() {
        var itemHeight = this.getDimensions().itemHeight,
            scrollOffset = getScrollOffset.call(this),
            containerHeight = this.getDimensions().container.height;
        
        var f = (containerHeight + scrollOffset) / itemHeight,
            rounded = Utils.roundTo(f, 3),
            index = Math.floor(rounded) - 1;
        return Math.min(index, this.maxIndex);
    }

    /*
    * @method 
    * Get the lowest index of items, which are completely in view
    * @return {Integer}
     */
    function findFirstIndexInView() {
        
        var itemHeight = this.getDimensions().itemHeight,
            scrollOffset = getScrollOffset.call(this);

        var f = scrollOffset / itemHeight,
            rounded = Utils.roundTo(f, 3),
            index = Math.ceil(rounded);
        return Math.max(index, 0);
    }

    /*
    * @method 
    * If the focused item is not the last item, which is completely in view -> focus the last item completely in view  
    * If the focused item is the last item, which is completely in view -> focus some following item and scroll so that  
    * 1) the new focused item is on bottom of the ListBox  
    * 2) the previous focused item is visible on top of the ListBox (not necessarily complete)
    * If the focused item is the last item of the list -> do nothing  
     */
    function focusNextPage() {
        var lastIndexInView = findLastIndexInView.call(this),
            focusedIndex = getIndexOfFocusedItem.call(this);

        if (lastIndexInView === focusedIndex) {
            //jump one page
            var nextIndex = Math.min(focusedIndex + this.pageIndexOffset, this.maxIndex); 
            if (nextIndex > focusedIndex) {
                focusItemByIndex.call(this, nextIndex, false);
                var elem = this.widget.getAllItems()[nextIndex];
                scrollToItem.call(this, elem, -(this.getDimensions().container.offsetHeight - this.widget.settings.itemHeight));
            }
        } else {
            focusItemByIndex.call(this, lastIndexInView);
        }
    }

    /*
    * @method 
    * If the focused item is not the first item, which is completely in view -> focus the first item completely in view  
    * If the focused item is the first item, which is completely in view -> focus some previous item and scroll so that  
    * 1) the new focused item is on top of the ListBox  
    * 2) the previous focused item is visible on bottom of the ListBox (not necessarily complete)
    * If the focused item is the first item of the list -> do nothing  
     */
    function focusPreviousPage() {
        var firstIndexInView = findFirstIndexInView.call(this),
            focusedIndex = getIndexOfFocusedItem.call(this);

        if (firstIndexInView === focusedIndex) {
            //jump one page
            var prevIndex = Math.max(focusedIndex - this.pageIndexOffset, 0);
            if (prevIndex < focusedIndex) {
                focusItemByIndex.call(this, prevIndex, false);
                var elem = this.widget.getAllItems()[prevIndex];
                scrollToItem.call(this, elem, 0);
            }
        } else {
            focusItemByIndex.call(this, firstIndexInView);
        }
    }

    /*
    * @method 
    * Check if item is completely in view
    * @param {HTMLElement} elem
    * @return {Boolean}
     */
    function isItemInView(elem) {

        var scrollOffset = getScrollOffset.call(this, false),
            index = getIndexOfElement(elem),
            itemHeight = this.widget.settings.itemHeight,
            //containerHeight = this.dimensions.container.offsetHeight,
            containerHeight = this.getDimensions().container.offsetHeight,
            itemTop = index * itemHeight - scrollOffset;
        
        //console.log('elemTop:' + itemTop + ',itemHeight:' + itemHeight + ',containerHeight:' + containerHeight);
        return itemTop >= 0 && (itemTop + itemHeight <= containerHeight);
    }

    function focusItemByIndex(index) {
        if (index > -1) {
            blurAllItems.call(this);
            var elem = this.widget.getAllItems()[index];
            focusItem.call(this, elem);
        }
    }

    function focusItemByIndexAndCenter(index) {
        if (index > -1) {
            blurAllItems.call(this);
            var elem = this.widget.getAllItems()[index];
            focusItem.call(this, elem);
            scrollIntoView.call(this, elem);
        }
    }

    function focusItem(elem) {
        if (elem) {
            Utils.addClass(elem, itemFocusClass);
        }
    }

    function scrollToSelected() {
        scrollIntoView.call(this, this.widget.getSelectedItem());
    }

    function scrollIntoView(elem) {
        var scroller = this.widget.getScroller();
        if (scroller && elem && !isItemInView.call(this, elem)) {
            scroller.scrollToElement(elem, 100, true, true);
        }
    }

    function scrollToItem(elem, offsetY) {
        var scroller = this.widget.getScroller();
        if (scroller && elem) {
            scroller.scrollToElement(elem, 100, 0, offsetY);
        }
    }

    return FocusHandler;

});
