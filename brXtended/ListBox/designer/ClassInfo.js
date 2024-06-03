/*global define*/
define(["widgets/brease/ListBox/designer/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brXtended.ListBox", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brXtended.ListBox","widgets.brease.ListBox","brease.core.BaseWidget"],
			actions: {"Focus":{"method":"focus"},"GetSelectedIndex":{"method":"getSelectedIndex"},"GetSelectedValue":{"method":"getSelectedValue"},"setAdditionalStyle":{"method":"setAdditionalStyle","parameter":{"styleName":{"name":"styleName","index":0,"type":"StyleReference"}}},"SetDataProvider":{"method":"setDataProvider","parameter":{"provider":{"name":"provider","index":0,"type":"ItemCollection"}}},"setDisplaySettings":{"method":"setDisplaySettings","parameter":{"displaySettings":{"name":"displaySettings","index":0,"type":"brease.enum.DropDownDisplaySettings"}}},"setEditable":{"method":"setEditable","parameter":{"editable":{"name":"editable","index":0,"type":"Boolean"},"metaData":{"name":"metaData","index":1,"type":"Object"}}},"setEllipsis":{"method":"setEllipsis","parameter":{"ellipsis":{"name":"ellipsis","index":0,"type":"Boolean"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setFitHeight2Items":{"method":"setFitHeight2Items","parameter":{"fitHeight2Items":{"name":"fitHeight2Items","index":0,"type":"Boolean"}}},"setImageAlign":{"method":"setImageAlign","parameter":{"imageAlign":{"name":"imageAlign","index":0,"type":"brease.enum.ImageAlign"}}},"setImagePath":{"method":"setImagePath","parameter":{"imagePath":{"name":"imagePath","index":0,"type":"DirectoryPath"}}},"setItemHeight":{"method":"setItemHeight","parameter":{"itemHeight":{"name":"itemHeight","index":0,"type":"Integer"}}},"setMultiLine":{"method":"setMultiLine","parameter":{"multiLine":{"name":"multiLine","index":0,"type":"Boolean"}}},"setParentCoWiId":{"method":"setParentCoWiId","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"SetSelectedIndex":{"method":"setSelectedIndex","parameter":{"index":{"name":"index","index":0,"type":"Integer"}}},"SetSelectedValue":{"method":"setSelectedValue","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setTabIndex":{"method":"setTabIndex","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setWordWrap":{"method":"setWordWrap","parameter":{"wordWrap":{"name":"wordWrap","index":0,"type":"Boolean"}}},"ShowTooltip":{"method":"showTooltip"}}
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