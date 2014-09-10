"use strict";

var mapReg = /[&<>'"]/g

module.exports = function escapeHtml(str) {
	return (str + "").replace(mapReg, mapToEntity);
}

function mapToEntity(c) {
	return "&#" + c.charCodeAt(0) + ";";
}
