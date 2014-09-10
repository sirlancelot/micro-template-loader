"use strict";

var openTag = "<%",
	closeTag = "%>",
	rWhitespace = /[\r\n\s]+/g

var modules = {
	escape: "escape = require(" + JSON.stringify(__dirname + "/helpers/escape.js") + ")"
}

module.exports = function microTemplateLoader(content) {
	var i, segment, first, len, concat, outName,
		usedModules = [],
		min = !!this.minimize,
		compiledStr = "",
		continuable = false
	this.cacheable && this.cacheable()

	// Parse identifiers
	content = content.split(openTag).join(closeTag + "\x11").split(closeTag)

	outName = "_o" + Date.now()
	len = content.length
	concat = (min ? "" : "\n\t") + outName + " = "
	for (i = 0; i < len; i++ ) {
		segment = content[i]
		if (!segment) continue;
		if (segment.charAt(0) === "\x11") {
			first = segment.charAt(1)
			if (first === "=" || first === "!") {
				// Escaped/Unescaped values
				compiledStr += (continuable ? " + " : concat) +
					(first == "=" ? "escape(" : "(") + segment.substring(2).trim() + ")"
				continuable = true
				if (first === "=") usedModules.push("escape")
			} else {
				// If this was the first segment, start an empty string first.
				if (!compiledStr) compiledStr = concat + "\"\""
				// Stop the string concatenation.
				if (continuable) compiledStr += ";"
				compiledStr += (min ? "\n" : "\n\t") + segment.substring(1).trim()
				continuable = false
			}
		} else {
			// Just add HTML
			if (min) { segment = segment.replace(rWhitespace, " ") }
			compiledStr += (continuable ? (min ? " + " : " +\n\t\t") : concat) +
				JSON.stringify(segment)
			continuable = true
		}
		concat = (min ? "" : "\n\t") + outName + " += "
	}

	usedModules = usedModules.reduce(buildDeps, "")

	// Inject code in to microTemplate function
	return (usedModules ? "var " + usedModules + "\n\n" : "") +
		"module.exports = function microTemplate(data) {\n" +
		"\tvar " + compiledStr.trim() + "\n" +
		"\treturn " + outName + ";\n" +
		"}";

}

function buildDeps(prev, module, i) {
	return prev + (i === 0 ? "" : ",\n\t") + modules[module];
}
