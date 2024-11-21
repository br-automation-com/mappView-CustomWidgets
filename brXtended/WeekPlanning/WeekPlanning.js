"use strict";
define([
  "brease/core/ContainerWidget",
  "brease/events/BreaseEvent",
  "brease/enum/Enum",
  "widgets/brXtended/WeekPlanning/libs/TableText"
], function (SuperClass, BreaseEvent, Enum, Texts) {
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

  /**
   * @cfg {Boolean} cancelButtonChangeEvents=true
   * If true, change events of inner widgets will not bubble through.
   */

  var uiController = brease.uiController;
  var defaultSettings = {
      cancelButtonChangeEvents: true,
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
    var self = this;
    SuperClass.prototype.init.apply(this, arguments);
    this.selectedMode = "clear";
    this.elem.classList.add("brXtendedWeekPlanning");

    this.el.on(BreaseEvent.WIDGET_READY, this._bind("_widgetReadyHandler"));
    this.tableText = Texts;
    this._initText();

    this.initEventsTable();
    _getChildrenInformation(this);
    _removeButtonClickHandler(this);

    // Save the children IDs
    this.settings.buttonIds = [];
    $("#" + this.elem.id + " div.buttons")
      .children()
      .each(function () {
        self.settings.buttonIds.push($(this).attr("id"));
      });

    this.buttonReady = [];
    for (var i = 0; i < this.settings.buttonIds.length; i += 1) {
      this.buttonReady[i] = new $.Deferred();
    }

    // Refresh scroller after all the buttons are READY
    $.when.apply(this, this.buttonReady).then(function () {
      self.debouncedRefresh();
    });
  };

  p._initText = function() {
    var widget = this;
    widget.actualLang = brease.language.getCurrentLanguage();
    var dayCells = document.querySelectorAll(
      "#" +
      widget.elem.id +
        " .planning-table th.Day"
    );
    Array.prototype.forEach.call(dayCells, function (cell) {
      var day = cell.dataset.day;
      cell.innerHTML = widget.tableText[widget.actualLang][day];
    });

  }

  p._widgetReadyHandler = function (e) {
    var index = this.settings.buttonIds.indexOf(e.target.id);
    if (index !== -1) {
      this.buttonReady[index].resolve();
    }
    this.el.off(BreaseEvent.CLICK, this._bind("_buttonClickHandler"));
    this.el.on(BreaseEvent.CLICK, this._bind("_buttonClickHandler"));
  };

  p.widgetAddedHandler = function (e) {
    // Move all widgets added to the container to the buttons div
    var buttonsDiv = document.querySelector(
      "#" + this.elem.id + " div.buttons"
    );
    var addedWidget = document.querySelector(
      "#" + this.elem.id + " div.container>[data-brease-widget]"
    );
    buttonsDiv.appendChild(addedWidget);
    this.el.off(BreaseEvent.CLICK, this._bind("_buttonClickHandler"));
    this.el.on(BreaseEvent.CLICK, this._bind("_buttonClickHandler"));
  };

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
            "#" + widget.elem.id + ' [data-day="' + cell.dataset.day + '"]'
          );
          Array.prototype.forEach.call(days, function (el) {
            el.classList.add("hovered");
          });
        } else if (cell.classList.contains("Hour")) {
          var hours = document.querySelectorAll(
            "#" +
              widget.elem.id +
              ' [data-time="' + cell.dataset.hour + ':00"], [data-time="' + cell.dataset.hour + ':30"]'
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
        widget.applySelection(hoveredCells, widget.selectedMode);
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


  p._buttonClickHandler = function (e) {
    this._handleEvent(e);

    var widgetTargetId = $(e.target).closest("[data-brease-widget]").attr("id");
    if (
      (!this.isDisabled &&
        this.buttonIds.indexOf(widgetTargetId) !== -1 &&
        widgetTargetId !== this.settings.selectedId &&
        uiController.callWidget(widgetTargetId, "isEnabled") === true) ||
      (e.target.dataset.action && e.target.dataset.action === "clear")
    ) {
      this.setSelectedMode(widgetTargetId);
    }
  };

  p.setSelectedMode = function (widgetId) {
    var widget = this;
    var buttons = document.querySelectorAll("#" + this.elem.id + " button");
    // Remove all active class on buttons
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.classList.remove("active");
    });

    var button = document.getElementById(widgetId + "_button");
    button.classList.add("active");
    widget.selectedMode = button.dataset.action;
  };

  p.applySelection = function (cells, mode) {
    var buttons = document.querySelectorAll(
      "#" + this.elem.id + ' button[data-action="' + mode + '"]'
    );
    if ((buttons.length = 0 || buttons.length > 1)) {
      return;
    }
    var button = buttons[0];
    if ($(button).data("action") === "clear") {
      $(cells).css("background-color", "");
      $(cells).attr("data-num", 0);
    } else {
      $(cells).css("background-color", $(button).css("background-color"));
      $(cells).attr("data-num", $("#" + button.id).data("num"));
    }

    this.refreshOutputArray();
  };

  // Get action from button number
  p.getActionOfButtonFromNum = function (num) {
    var buttons = document.querySelectorAll(
      "#" + this.elem.id + ' button[data-num="' + num + '"]'
    );
    if ((buttons.length = 0 || buttons.length > 1)) {
      return;
    }
    var button = buttons[0];
    return $(button);
  };

  p.getBackgroundColorFromButton = function (button) {
    return button.css("background-color");
  };



  /**
   * @method setTableDatas
   * Sets the TableDatas Property
   * @param {NumberArray1D} value
   */
  p.setTableDatas = function (value) {
    this.settings.tableDatas = value;
    // Update table
    this.refreshTableFromArray();
  };

  /**
   * @method getTableDatas
   * Get the TableDatas Property
   */
  p.getTableDatas = function () {
    return this.settings.tableDatas;
  };

  p.refreshTableFromArray = function () {
    var widget = this;
    var cells = document.querySelectorAll(
      "#" + this.elem.id + " .planning-table td"
    );
    var tableDatas = this.getTableDatas();
    var currentIndex = 0;
    Array.prototype.forEach.call(cells, function (cell) {
      var actualNum = tableDatas[currentIndex];

      var button = widget.getActionOfButtonFromNum(actualNum);
      var backgroundColor = widget.getBackgroundColorFromButton(button);

      // Affect color to cell
      if (actualNum == 0) {
        $(cell).css("background-color", "");
      } else {
        $(cell).css("background-color", backgroundColor);
      }

      // Affect data to cell
      $(cell).attr("data-num", actualNum);

      currentIndex = currentIndex + 1;
    });
  };

  p.refreshOutputArray = function () {
    var tableDatas = [];
    var cells = document.querySelectorAll(
      "#" + this.elem.id + " .planning-table td"
    );
    Array.prototype.forEach.call(cells, function (cell) {
      var valueOfCell = $(cell).attr("data-num");
      tableDatas.push(parseFloat(valueOfCell));
    });

    this.setTableDatas(tableDatas);
    this.sendValueChange({ tableDatas: this.getTableDatas() });
  };

  function _getChildrenInformation(widget) {
    widget.buttons = [];
    widget.buttonIds = [];

    widget.el.find("[data-brease-widget]").each(function () {
      var button = this,
        id = button.id,
        info = {
          el: $(button),
          elem: button,
          id: id,
          state: Enum.WidgetState.IN_QUEUE,
          selected: false,
        };

      widget.buttons.push(info);
      widget.buttonIds.push(info.id);
    });
  }

  function _removeButtonClickHandler(widget) {
    var index = -1;
    widget.buttonIndex = {};
    widget.readyState = 0;
    widget.el.find("[data-brease-widget]").each(function () {
      var button = this,
        id = button.id,
        info = {
          el: $(button),
          elem: button,
          id: id,
          state: Enum.WidgetState.IN_QUEUE,
          selected: false,
        };

      widget.readyState += 1;
      index += 1;
      widget.buttonIndex[id] = index;

      if (uiController.getWidgetState(id) > 0) {
        info.state = Enum.WidgetState.INITIALIZED;
        widget.readyState -= 1;
      } else {
        button.addEventListener(BreaseEvent.WIDGET_INITIALIZED, function (e) {
          widget.buttons[widget.buttonIndex[e.target.id]].state =
            Enum.WidgetState.INITIALIZED;
          widget.readyState -= 1;
        });
      }
    });
  }

  return WidgetClass;
});