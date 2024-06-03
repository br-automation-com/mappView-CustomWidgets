/*global define*/
define(["widgets/brease/DropDownBox/designer/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brXtended.DropDownBox", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brXtended.DropDownBox","widgets.brease.DropDownBox","brease.core.BaseWidget"],
			actions: {"Close":{"method":"close"},"Focus":{"method":"focus"},"GetSelectedIndex":{"method":"getSelectedIndex"},"GetSelectedValue":{"method":"getSelectedValue"},"Open":{"method":"open"},"setAdditionalStyle":{"method":"setAdditionalStyle","parameter":{"styleName":{"name":"styleName","index":0,"type":"StyleReference"}}},"setCropToParent":{"method":"setCropToParent","parameter":{"cropToParent":{"name":"cropToParent","index":0,"type":"brease.enum.CropToParent"}}},"SetDataProvider":{"method":"setDataProvider","parameter":{"value":{"name":"value","index":0,"type":"ItemCollection"},"omitPrompt":{"name":"omitPrompt","index":1,"type":"Boolean"}}},"setDisplaySettings":{"method":"setDisplaySettings","parameter":{"displaySettings":{"name":"displaySettings","index":0,"type":"brease.enum.DropDownDisplaySettings"}}},"setEditable":{"method":"setEditable","parameter":{"editable":{"name":"editable","index":0,"type":"Boolean"},"metaData":{"name":"metaData","index":1,"type":"Object"}}},"setEllipsis":{"method":"setEllipsis","parameter":{"ellipsis":{"name":"ellipsis","index":0,"type":"Boolean"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setFitHeight2Items":{"method":"setFitHeight2Items","parameter":{"fitHeight2Items":{"name":"fitHeight2Items","index":0,"type":"Boolean"}}},"setImageAlign":{"method":"setImageAlign","parameter":{"imageAlign":{"name":"imageAlign","index":0,"type":"brease.enum.ImageAlign"}}},"setImagePath":{"method":"setImagePath","parameter":{"imagePath":{"name":"imagePath","index":0,"type":"DirectoryPath"}}},"setItemHeight":{"method":"setItemHeight","parameter":{"itemHeight":{"name":"itemHeight","index":0,"type":"Integer"}}},"setListPosition":{"method":"setListPosition","parameter":{"listPosition":{"name":"listPosition","index":0,"type":"brease.enum.Position"}}},"setListWidth":{"method":"setListWidth","parameter":{"listWidth":{"name":"listWidth","index":0,"type":"Integer"}}},"setMaxVisibleEntries":{"method":"setMaxVisibleEntries","parameter":{"maxVisibleEntries":{"name":"maxVisibleEntries","index":0,"type":"Integer"}}},"setMultiLine":{"method":"setMultiLine","parameter":{"multiLine":{"name":"multiLine","index":0,"type":"Boolean"}}},"setParentCoWiId":{"method":"setParentCoWiId","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"SetSelectedIndex":{"method":"setSelectedIndex","parameter":{"index":{"name":"index","index":0,"type":"Integer"},"omitPrompt":{"name":"omitPrompt","index":1,"type":"Boolean"}}},"SetSelectedValue":{"method":"setSelectedValue","parameter":{"value":{"name":"value","index":0,"type":"String"},"omitPrompt":{"name":"omitPrompt","index":1,"type":"Boolean"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setTabIndex":{"method":"setTabIndex","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setWordWrap":{"method":"setWordWrap","parameter":{"wordWrap":{"name":"wordWrap","index":0,"type":"Boolean"}}},"ShowTooltip":{"method":"showTooltip"},"Toggle":{"method":"toggle"}}
		}
	};
	if (superClassInfo.classExtension) {
		classInfo.classExtension = superClassInfo.classExtension;
	}
	if (classExtension) {
		classInfo.classExtension = classExtension;
	}
	return classInfo;
});