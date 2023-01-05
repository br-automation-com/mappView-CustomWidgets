## Description
This widgets creates a screenshot of the client visualization and stores it on the PLC or the client device. The widget is dervived from the button widget and therefore shares all its settings, actions and events. When the screenshot is called it will open a window that will ask the user what to share. 

![](./images/screenshot1.png)

Select the tab or region for the screenshot and hit the Share button.

## Usage
This widget requires mapp File (see AS help GUID f5ac430b-e0ca-4320-bcd0-b7e28a087f77). Make sure that there is a valid mpfilemanager configuration. Only the configuration is required, no additional task or function block must be added to the project. The libraries **MpFile** and **MpServer** are also required.

#### Additional Actions
The widget derives all actions from the button widget.

**Screenshot2Client**

This action creates a screenshot and saves it to the client device.

**Screenshot2Plc**

This action creates a screenshot and saves it to the PLC. This action needs two parameters

* DeviceName - Name of the file device as specified in the mpfilemanager configuration and system configuration.
* FileName - Name of the screenshot file.

#### Additional Events
The widget derives all events from the button widget.

**FileSaved**

This event is called when the Screenshot2Plc has saved the screenshot successful. Returns the full path of the file.

**OnError**

This event is called when a screenshot was not successful. Returns the error number.

## Requirements

Tested with

* Automation Studio 4.11
* Minimum tested version 5.15
* Expected to work with later version

May also work with lower version: **YES**



