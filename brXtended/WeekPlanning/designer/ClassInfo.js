/*global define*/
define(["brease/core/designer/ContainerWidget/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brXtended.WeekPlanning", 
			parents: ["*"],
			children: ["widgets.brXtended.WeekPlanningItem"],
			inheritance: ["widgets.brXtended.WeekPlanning","brease.core.ContainerWidget","brease.core.BaseWidget"],
			actions: {"Focus":{"method":"focus"},"setAdditionalStyle":{"method":"setAdditionalStyle","parameter":{"styleName":{"name":"styleName","index":0,"type":"StyleReference"}}},"setEditable":{"method":"setEditable","parameter":{"editable":{"name":"editable","index":0,"type":"Boolean"},"metaData":{"name":"metaData","index":1,"type":"Object"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setParentCoWiId":{"method":"setParentCoWiId","parameter":{"value":{"name":"value","index":0,"type":"String"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setTabIndex":{"method":"setTabIndex","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"setTableDatas":{"method":"setTableDatas","parameter":{"value":{"name":"value","index":0,"type":"NumberArray1D"}}},"SetTextDeleteButton":{"method":"setTextDeleteButton","parameter":{"text":{"name":"text","index":0,"type":"String"},"keepKey":{"name":"keepKey","index":1,"type":"Boolean"}}},"setTextKeyDeleteButton":{"method":"setTextKeyDeleteButton","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"ShowTooltip":{"method":"showTooltip"}}
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