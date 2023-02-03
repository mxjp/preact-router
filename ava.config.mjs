"use strict";

export default {
	files: [
		"./test_out/test/**/*.js",
		"!**/_*/**"
	],
	require: [
		"./test_out/test/_env/index.js"
	],
	ignoredByWatcher: [
		"./test_out/**/*"
	],
	verbose: true
};
