// # Micro Template Loader
//
// This is a [Webpack][] [Loader][]. It converts **HTML** files to a
// Javascript function which can be passed a data model. You can use
// [EJS][]-style tags to break out in to vanilla Javascript to do anything you
// need. However, best practice dictates that you should keep logic to a
// minimum in your templates.
//
// [Webpack]: http://webpack.github.io/
// [Loader]: http://webpack.github.io/docs/using-loaders.html
// [EJS]: http://embeddedjs.com/
"use strict";

var openTag     = "<%",
	closeTag    = "%>",
	rWhitespace = /[\r\n\s]+/g,
	buildDeps   = require("./helpers")

// Webpack Loader Definition
// ---
//
// Receive HTML input from Webpack and return CommonJS-formatted Javascript.
module.exports = function microTemplateLoader(content) {
	this.cacheable && this.cacheable()
	var i, segment, first, len, concat,
		outName = "_o" + Date.now(), // Unique name to prevent tampering
		usedModules = [],
		min = !!this.minimize,
		outputStr = "",
		continuable = false

	// Replace identifiers in `content` with a special character so the parser
	// knows how to differentiate between HTML & JS.
	content = content.split(openTag).join(closeTag + "\x11").split(closeTag)

	// Begin parsing `content` which is now an array of strings. Some of the
	// strings start with our special character `\x11` which means that string
	// should be treated as EJS. We start out with `_o = ""`.
	len = content.length
	concat = (min ? "" : "\n\t") + outName + " = "
	for (i = 0; i < len; i++ ) {
		segment = content[i]
		if (!segment) continue;
		if (segment.charAt(0) === "\x11") {
			first = segment.charAt(1)
			// Handle EJS Escaped/Unescaped values.
			if (first === "=" || first === "!") {
				outputStr += (continuable ? " + " : concat) +
					(first == "=" ? "escape(" : "(") + segment.substring(2).trim() + ")"
				continuable = true
				if (first === "=") usedModules.push("escape")
			// If this was the first segment, start an empty string first just
			// in case `segment` is the start of a `for` loop. Close the
			// current string `continuable` if it's open and break out in to
			// Vanilla JS.
			} else {
				if (!outputStr) outputStr = concat + "\"\""
				if (continuable) outputStr += ";"
				outputStr += (min ? "\n" : "\n\t") + segment.substring(1).trim()
				continuable = false
			}
		// If `segment` is plain HTML, start a `continuable`. Otherwise, just
		// append it to `outputStr`.
		} else {
			if (min) { segment = segment.replace(rWhitespace, " ") }
			outputStr += (continuable ? (min ? " + " : " +\n\t\t") : concat) +
				JSON.stringify(segment)
			continuable = true
		}
		// Switch to `_o += ` for string concatenation and move on to the next
		// `segment`.
		concat = (min ? "" : "\n\t") + outName + " += "
	}

	// Build dependencies (see [helpers](./helpers.html)) and inject the
	// generated code in to a function.
	usedModules = usedModules.reduce(buildDeps, "")
	return (usedModules ? "var " + usedModules + "\n\n" : "") +
		"module.exports = function microTemplate(data) {\n" +
		"\tvar " + outputStr.trim() + "\n" +
		"\treturn " + outName + ";\n" +
		"}";
}
