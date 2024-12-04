## Description
This widgets is a complete new widget from scratch. The widget is a container for other widget "item" same as Table widget for example.
He's used to create a week planning by day and 30min. The widget as a bindable property "tableDatas" that is of datatype REAL[0..335].


## Usage

#### Properties

**tableDatas**

This property is use as binding to a REAL[0..335], it's REAL datatype but it will be only working with integers, there is no array of integers in mappView.

The value 0 is reserved by the Delete button, it means that nothing is fill in the table.

Others integers will be define in child widgets (same for backColor of cell selected) [WeekPlanningItem](./widgets_week_planning_item.md).

Indexes are from top to bottom and from left to right
![](./images/weekplanning1.png)

To use the widget select a button of [WeekPlanningItem](./widgets_week_planning_item.md) and click or keep click on cell to select them.

You can select of the cells using the empty cell on the top left corner of the table.



## Limitations

## Requirements

Tested with

* Automation Studio 4.12
* mappView 5.24

May also work with lower version: **YES**

## Revision History

##### Version 1
- First release



