## Description
This widgets extends the standard list box. Adding 1 styling property **itemMarginExt** and 1 event **ItemClickExt**

## Usage
The following additional functions are available

* Additional property itemMarginExt

#### Properties

**itemMarginExt**

This property is use to apply maring to all items in the list.

* With **itemMarginExt** set to ```0px 0px 10px 0px``` here is the result
> :bulb: **Tip:** Set property **listSeparatorcolor** to ```rgba(0,0,0,0)``` to disable line separator in the list

![](./images/listbox1.png)
![](./images/listbox2.png)


#### Events

**ItemClickExt**

This event is fired whenever you click on a item, not the entire widget.

* Argurments :
    * **clickedValue** (String): Value of the item clicked
    * **clickedText** (String): Text of the item clicked
    * **clickedIndex** (Integer): Index of the item clicked

Here is an application to this event:

* You want to create a list of selection from an array containing equipement but not the complete array.
* You created a dataProvider with ```{"value": "IndexInTheArray", "text": "IdentifierForTheEquipement"}```
* Here is initial state in the visualization

![](./images/listbox3.png)

* Then when you click on the first item in the list, here is the result

![](./images/listbox4.png)

> :warning: **Warning:** Text returned by the event in argument **clickedText**, if it's localized text, event return the raw text translation in the current language of the session

> :memo: **Note:** This cannot be done using **SelectedIndexChanged** event, because index didn't change.

> :memo: **Note 2:** This also prevent the usage of **Click** event on the complete widget and fired an event when user didn't click on a item.


## Requirements

Tested with

* Automation Studio 4.9.5.36
* mappView 5.24

May also work with lower version: **YES**

## Todos

- [ ] Adding argument **clickedTmxTextKey** to **ItemClickExt** event if text is localized using text system

## Revision History

##### Version 1
- First release



