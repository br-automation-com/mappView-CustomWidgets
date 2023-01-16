## Description
This widgets creates a screenshot of the client visualization and stores it on the PLC or the client device. The widget is dervived from the button widget and therefore shares all its settings, actions and events. 

Due to browser security restrictions the screen access is blocked for standard HTTP connections which is the default for mappView. mappView must be changed to HTTPS access or the HTTP URL must be added to the browser as an exception. Use the following line in the browser URL to access the flag

```chrome://flags/#unsafely-treat-insecure-origin-as-secure```

![](./images/screenshot2.png)

Add the mappView URL and enable the flag.

When the screenshot is called it will open a window that will ask the user what to share. 

![](./images/screenshot1.png)

Select the tab or region for the screenshot and hit the Share button.

## Usage
This widget requires mapp File (see Automation Studio help GUID f5ac430b-e0ca-4320-bcd0-b7e28a087f77). Make sure that there is a valid mpfilemanager configuration. Only the configuration is required, no additional task or function block must be added to the project. The libraries **MpFile** and **MpServer** are also required.

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

**FileDownloaded**

This event is called when the file was downloaded with Screenshot2Client successful. 

**OnError**

This event is called when a screenshot was not successful. Returns the error number. Most error numbers are generated from underlying components and can be found in the Automation Studio help. The widget can also generate the following custom error numbers.

| Error No  | Description  |
|---|---|
| 10000  | Unknown error. Can occur when the user aborts the screenshot |
| 10001  | HTTP permission. This error occurs when the widget can not access the screen. Use HTTPS access or use flag as described above. |

## Requirements

Tested with

* Automation Studio 4.11
* Minimum tested version 5.15
* Expected to work with later version

May also work with lower version: **YES**



