/*global define*/
define(["widgets/brease/Button/designer/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brXtended.Screenshot", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brXtended.Screenshot","widgets.brease.Button","brease.core.BaseWidget"],
			actions: {"Screenshot2Client":{"method":"Screenshot2Client"},"Screenshot2Plc":{"method":"Screenshot2Plc","parameter":{"filePath":{"name":"filePath","index":0,"type":"FilePath"}}},"Focus":{"method":"focus"},"RemoveImage":{"method":"removeImage"},"RemoveMouseDownText":{"method":"removeMouseDownText"},"RemoveText":{"method":"removeText"},"setAdditionalStyle":{"method":"setAdditionalStyle","parameter":{"styleName":{"name":"styleName","index":0,"type":"StyleReference"}}},"setBreakWord":{"method":"setBreakWord","parameter":{"breakWord":{"name":"breakWord","index":0,"type":"Boolean"}}},"setEditable":{"method":"setEditable","parameter":{"editable":{"name":"editable","index":0,"type":"Boolean"},"metaData":{"name":"metaData","index":1,"type":"Object"}}},"setEllipsis":{"method":"setEllipsis","parameter":{"ellipsis":{"name":"ellipsis","index":0,"type":"Boolean"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"SetImage":{"method":"setImage","parameter":{"image":{"name":"image","index":0,"type":"ImagePath"}}},"setImageAlign":{"method":"setImageAlign","parameter":{"imageAlign":{"name":"imageAlign","index":0,"type":"brease.enum.ImageAlign"}}},"SetMouseDownImage":{"method":"setMouseDownImage","parameter":{"mouseDownImage":{"name":"mouseDownImage","index":0,"type":"ImagePath"}}},"SetMouseDownText":{"method":"setMouseDownText","parameter":{"text":{"name":"text","index":0,"type":"String"},"keepKey":{"name":"keepKey","index":1,"type":"Boolean"}}},"setMouseDownTextKey":{"method":"setMouseDownTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"setMultiLine":{"method":"setMultiLine","parameter":{"multiLine":{"name":"multiLine","index":0,"type":"Boolean"}}},"setParentCoWiId":{"method":"setParentCoWiId","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setTabIndex":{"method":"setTabIndex","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"SetText":{"method":"setText","parameter":{"text":{"name":"text","index":0,"type":"String"},"keepKey":{"name":"keepKey","index":1,"type":"Boolean"}}},"setTextKey":{"method":"setTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"setUseSVGStyling":{"method":"setUseSVGStyling","parameter":{"useSVGStyling":{"name":"useSVGStyling","index":0,"type":"Boolean"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setWordWrap":{"method":"setWordWrap","parameter":{"wordWrap":{"name":"wordWrap","index":0,"type":"Boolean"}}},"ShowTooltip":{"method":"showTooltip"}}
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