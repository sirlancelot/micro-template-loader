// Helper modules encapsulate simple logic which will be shared between
// multiple compiled templates. When Webpack builds multiple templates it will
// identify these helper modules as common and won't bundle them multiple
// times.

// Provide a function to be used with `Array#reduce()` which will concatenate
// all the module dependencies in to a string.
module.exports = function buildDeps(prev, module, i) {
	return prev + (i === 0 ? "" : ",\n\t") + modules[module];
}

// Initialize helper module strings. The key is used during parsing to tell
// the renderer what modules it should create. The value is the `require()`
// string to be used in the rendered output.
var modules = {
	escape: "escape = require(\"!!" + __dirname + "/helpers/escape.js\")"
}
