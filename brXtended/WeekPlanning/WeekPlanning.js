"use strict";
define(["brease/core/ContainerWidget"], function (SuperClass) {
    /**
     * @class widgets.brXtended.WeekPlanning
     * @extends brease.core.ContainerWidget
     *
     * @iatMeta category:Category
     * Data
     * @iatMeta description:short
     * Week planning widget
     * @iatMeta description:de
     * German.
     * @iatMeta description:en
     * English
     * @iatMeta studio:isContainer
     * true
     */

    /**
     * @property {WidgetList} children=["widgets.brXtended.WeekPlanningItem"]
     * @inheritdoc
     */

    /**
     * @cfg {NumberArray1D} tableDatas
     * @iatCategory Data
     * @iatStudioExposed
     * One dimension array [0..334]
     * @not_projectable
     * @bindable
     */


    var defaultSettings = {
            width: 500,
            height: 300,
        },
        WidgetClass = SuperClass.extend(function WeekPlanning() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),
        p = WidgetClass.prototype;


    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass("brXtendedWeekPlanning container");
        }

        SuperClass.prototype.init.apply(this, arguments);
        this.selectedMode = "clear";
        this.elem.classList.add("brXtendedWeekPlanning");
        this.initEventsTable();
        this.createEventHandlerButtons();
    };


    // Content editor only
    p.widgetAddedHandler = function (e) {
        // Move all widgets added to the container to the buttons div
        var buttonsDiv = document.querySelector(
            "#" + this.elem.id + " div.buttons"
        );
        var addedWidget = document.querySelector(
            "#" + this.elem.id + " div.container>[data-brease-widget]"
        );
        buttonsDiv.appendChild(addedWidget);
        this.removeEventHandlerButtons();
        this.createEventHandlerButtons();
    };

    p.childrenWidgetReadyHandler = function (){
        this.createEventHandlerButtons();
    }

    p.initEventsTable = function () {
        var widget = this;

        // Add hover effect
        var cells = document.querySelectorAll(
            "#" +
                this.elem.id +
                " .planning-table td, " +
                "#" +
                this.elem.id +
                " .planning-table th"
        );
        Array.prototype.forEach.call(cells, function (cell) {
            cell.addEventListener("mouseenter", function () {
                cell.classList.add("hovered");
                if (cell.classList.contains("Day")) {
                    var days = document.querySelectorAll(
                        "#" +
                            widget.elem.id +
                            ' [data-day="${cell.dataset.day}"]'
                    );
                    Array.prototype.forEach.call(days, function (el) {
                        el.classList.add("hovered");
                    });
                } else if (cell.classList.contains("Hour")) {
                    var hours = document.querySelectorAll(
                        "#" +
                            widget.elem.id +
                            ' [data-time="${cell.dataset.hour}:00"], [data-time="${cell.dataset.hour}:30"]'
                    );
                    Array.prototype.forEach.call(hours, function (el) {
                        el.classList.add("hovered");
                    });
                } else if (cell.id == widget.elem.id + "_select-all") {
                    var cellsInside = document.querySelectorAll(
                        "#" + widget.elem.id + " [data-time]"
                    );
                    Array.prototype.forEach.call(cellsInside, function (el) {
                        el.classList.add("hovered");
                    });
                }
            });

            cell.addEventListener("mouseleave", function () {
                var hoveredCells = document.querySelectorAll(
                    "#" + widget.elem.id + " .hovered"
                );
                Array.prototype.forEach.call(hoveredCells, function (el) {
                    el.classList.remove("hovered");
                });
            });
        });

        // Add selection for all, hours and day
        var cellsHeaders = document.querySelectorAll(
            "#" +
                this.elem.id +
                " .planning-table td:not([data-time]), .planning-table th:not([data-time])"
        );
        Array.prototype.forEach.call(cellsHeaders, function (cell) {
            cell.addEventListener("click", function () {
                var hoveredCells = document.querySelectorAll(
                    "#" + widget.elem.id + " .hovered[data-time]"
                );
                Array.prototype.forEach.call(hoveredCells, function (el) {
                    widget.applySelection(el, widget.selectedMode);
                });
            });
        });

        // Handle cell selection with mouse events
        var isMouseDown = false;

        var cellsInside = document.querySelectorAll(
            "#" + this.elem.id + " .planning-table td"
        );
        Array.prototype.forEach.call(cellsInside, function (cell) {
            cell.addEventListener("mousedown", function () {
                isMouseDown = true;
                if (widget.selectedMode) {
                    widget.applySelection(cell, widget.selectedMode);
                }
            });

            cell.addEventListener("mousemove", function () {
                if (isMouseDown && widget.selectedMode) {
                    widget.applySelection(cell, widget.selectedMode);
                }
            });

            cell.addEventListener("mouseup", function () {
                isMouseDown = false;
            });
        });

        // Handle mouse up event on document to stop selecting when mouse is released outside the cells
        document.addEventListener("mouseup", function () {
            isMouseDown = false;
        });
    };

    p.createEventHandlerButtons = function (){

        var widget = this;

        // Handle button toggle and selection
        var buttons = document.querySelectorAll(
            "#" + this.elem.id + " .buttons button"
        );

        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener("click", function () {
                Array.prototype.forEach.call(buttons, function (btn) {
                    btn.classList.remove("active");
                });
                button.classList.add("active");
                widget.selectedMode = button.dataset.action;
                console.log(widget.selectedMode);
                console.log(widget.children);
            });
        });
    }

    p.removeEventHandlerButtons = function (){
        // Handle button toggle and selection
        var buttons = document.querySelectorAll(
            "#" + this.elem.id + " .buttons button"
        );

        Array.prototype.forEach.call(buttons, function (button) {
            button.removeEventListener("click");
        });
    }

    p.applySelection = function (cell, mode) {
        var buttons = document.querySelectorAll(
            "#" + this.elem.id + ' .buttons button[data-action="' + mode + '"]'
        );
        if(buttons.length=0 || buttons.length > 1){
            return;
        }
        var button = buttons[0];
        if($(button).data("action") === "clear"){
            $(cell).css('background-color', "");
            $(cell).attr("data-num", 0)
        }else{
            $(cell).css('background-color',  $('#' + button.id).css('background-color'));    
            $(cell).attr("data-num",  $('#' + button.id).data("num"))
        }

        this.refreshOutputArray();
    };



    // Function to clear all selections
    p.clearSelection = function () {
        var cells = document.querySelectorAll(
            "#" + this.elem.id + " .planning-table td"
        );
        // Array.prototype.forEach.call(cells, function (cell) {
        //     cell.classList = "";
        // });
    };



    /**
     * @method setTableDatas
     * Sets the TableDatas Property
     * @param {NumberArray1D} value
     */
    p.setTableDatas = function (value){
        this.settings.tableDatas = value;
        // TODO: Update table
    }

    /**
     * @method getTableDatas
     * Get the TableDatas Property
     */
    p.getTableDatas = function (){
        return this.settings.tableDatas;
    }

    p.refreshTableFromArray = function (){
        
    };
    
    p.refreshOutputArray = function (){
        var tableDatas = [];
        var cells = document.querySelectorAll(
                "#" +
                this.elem.id +
                " .planning-table td"
        );
        console.log("Number of cells : " + cells.length);
        Array.prototype.forEach.call(cells, function (cell) {
            var valueOfCell = $(cell).attr("data-num");
            tableDatas.push(parseInt(valueOfCell));
        });

        this.setTableDatas(tableDatas);
        this.sendValueChange({ tableDatas: this.getTableDatas() });
    };


    return WidgetClass;
});
