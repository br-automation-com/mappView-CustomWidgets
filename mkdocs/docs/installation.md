Please check each widget for requirements and minimum versions for Automation Studio and mappView.

To use the widget collection 

1. Close Automation Studio
2. Download the folder 'brXtended' and copy it in your Automation Studio project into the folder '\Logical\mappView\Widgets'.
3. Start Automation Studio

The new widget group 'brXtended' is now available in the toolbox.

![](./images/installation1.png)

The widgets can also be found by selecting the category or using the search field. If the widget is an extension of an existing widget it may have the same name. Make sure to pick the correct one.

![](./images/installation2.png)

**Remember**

Inherited widgets do not automatically adopt the themes from their parents. For example, the customized toggle switch does change the look when the standard theme is changed because the name of the customized widget "widgets.brXtended.ToggleSwitch" does not exist in this theme. 
To adopt the look and feel from the parent you have edit the style files from the theme and duplicate all entries for "widgets.brease.ToggleSwitch" and then assign them to "widgets.brXtended.ToggleSwitch"
