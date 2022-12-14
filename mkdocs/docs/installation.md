Please check each widget for requirements and minimum versions for Automation Studio and mappView.

To use the custom widget library follow these steps.

1. Download the folder 'breaseXtended' and copy it in your Automation Studio project into the folder '\Logical\mappView\'.
2. Open the project properties and add the following line in the tab "Build Events"

    ```
    powershell.exe $(AS_PROJECT_PATH)\Logical\mappView\breaseXtended\install.ps1 $(AS_PROJECT_PATH) breaseXtended $(WIN32_AS_PATH)
    ```

    ![](./images/installation0.png)

    The script will copy the library folder from the project to the correct mappView path in the Automation Studio installation every time you build the project.

3. Compile the project to put the widget library into the correct path.
4. Close Automation Studio and then open it again to update mappView libraries

The new widget group 'breaseXtended' is now available in the toolbox.

![](./images/installation1.png)

The widgets can also be found by selecting the category or using the search field. If the widget is an extension of an existing widget it may have the same name. Make sure to pick the correct one.

![](./images/installation2.png)
