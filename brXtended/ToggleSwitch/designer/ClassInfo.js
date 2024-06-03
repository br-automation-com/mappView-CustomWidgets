/*global define*/
define(["widgets/brease/ToggleSwitch/designer/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brXtended.ToggleSwitch", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brXtended.ToggleSwitch","widgets.brease.ToggleSwitch","widgets.brease.ToggleButton","widgets.brease.Button","brease.core.BaseWidget"],
			actions: {"Focus":{"method":"focus"},"GetValueBool":{"method":"getValueBool"},"GetValueInteger":{"method":"getValueInteger"},"RemoveImage":{"method":"removeImage"},"RemoveMouseDownText":{"method":"removeMouseDownText"},"RemoveText":{"method":"removeText"},"setAdditionalStyle":{"method":"setAdditionalStyle","parameter":{"styleName":{"name":"styleName","index":0,"type":"StyleReference"}}},"setBreakWord":{"method":"setBreakWord","parameter":{"breakWord":{"name":"breakWord","index":0,"type":"Boolean"}}},"setEditable":{"method":"setEditable","parameter":{"editable":{"name":"editable","index":0,"type":"Boolean"},"metaData":{"name":"metaData","index":1,"type":"Object"}}},"setEllipsis":{"method":"setEllipsis","parameter":{"ellipsis":{"name":"ellipsis","index":0,"type":"Boolean"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"SetImage":{"method":"setImage","parameter":{"image":{"name":"image","index":0,"type":"ImagePath"}}},"setImageAlign":{"method":"setImageAlign","parameter":{"imageAlign":{"name":"imageAlign","index":0,"type":"brease.enum.ImageAlign"}}},"SetMouseDownImage":{"method":"setMouseDownImage","parameter":{"mouseDownImage":{"name":"mouseDownImage","index":0,"type":"ImagePath"}}},"SetMouseDownText":{"method":"setMouseDownText","parameter":{"text":{"name":"text","index":0,"type":"String"},"keepKey":{"name":"keepKey","index":1,"type":"Boolean"}}},"setMouseDownTextKey":{"method":"setMouseDownTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"setMultiLine":{"method":"setMultiLine","parameter":{"multiLine":{"name":"multiLine","index":0,"type":"Boolean"}}},"setParentCoWiId":{"method":"setParentCoWiId","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setTabIndex":{"method":"setTabIndex","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"SetText":{"method":"setText","parameter":{"text":{"name":"text","index":0,"type":"String"},"keepKey":{"name":"keepKey","index":1,"type":"Boolean"}}},"setTextKey":{"method":"setTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"setUseSVGStyling":{"method":"setUseSVGStyling","parameter":{"useSVGStyling":{"name":"useSVGStyling","index":0,"type":"Boolean"}}},"SetValue":{"method":"setValue","parameter":{"value":{"name":"value","index":0,"type":"Integer"}}},"SetValueBool":{"method":"setValueBool","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"SetValueInteger":{"method":"setValueInteger","parameter":{"value":{"name":"value","index":0,"type":"Integer"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setWordWrap":{"method":"setWordWrap","parameter":{"wordWrap":{"name":"wordWrap","index":0,"type":"Boolean"}}},"ShowTooltip":{"method":"showTooltip"}}
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