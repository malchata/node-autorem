# autorem
## A `postcss`-dependent node module that converts all `px` units in your CSS to `rem` units.
### by [Jeremy Wagner](http://jeremywagner.me) - [@malchata](https://twitter.com/malchata)

---

### Overview
For greater accessibility, it is becoming increasingly important to abandon absolute units like `px` in favor of more flexible reference units such as `rem` or `em`. Since `em` is context-dependent, `rem` units are much more convenient because they relate to the document's default `font-size` (typically `16px`.)

This plugin borrows heavily in terms of design from the [`node-pixrem`](https://github.com/iamvdo/node-pixrem) project by @iamvdo.

### Usage

Using `autorem` is quite simple. Add it to your `package.json` file, or just install it in your project directory using `npm` like so:

```
npm install autorem
```

Once you've done that, you can use it in your node application with the following pattern:

```
"use strict";
var fs = require("fs");
var autorem = require("autorem");
var css = fs.readFileSync("./example.css", "utf8");
var processedCss = autorem.process(css);

fs.writeFile("example.processed.css", processedCss, function(err){
	if(err){
		throw err;
	}
});
```

This assumes you have `example.css` running in the same folder as this code snippet. The `autorem.process` function call also accepts a second argument for some useful options (listed further on in this readme.)

If you like task runners, then you probably want to use something like grunt. Here's a simple `Gruntfile.js` example that utilizes `grunt-contrib-watch` to watch a CSS file for changes and employs `postcss` and `autorem` to process any `px` values found.

```
module.exports = function(grunt){
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-postcss");

	// Task Configuration
	var taskConfig = {
		pkg: grunt.file.readJSON("package.json"),
		watch: {
			options: {
				livereload: true,
				livereloadOnError: false,
				reload: true
			},
			files: ["css/styles.css"],
			tasks: ["postcss:dist"]
		},
		postcss: {
			options: {
				processors: [
					require("autorem")({
						// Options
						legacy: true
					})
				]
			},
			dist: {
				src: "css/styles.processed.css"
			}
		}
	};

	grunt.initConfig(taskConfig);
	grunt.registerTask("default", ["postcss:dist", "watch"]);
};
```

It will then transform your css from something like this:

```
p
{
	font-size: 24px;
	padding: 16px 32px;
	margin: 0 0 16px 0;
}
```

Into something like this:

```
p
{
	font-size: 1.5rem;
	padding: 1rem 2rem;
	margin: 0 0 1rem 0;
}
```

### Options

#### `baseFontSize`
##### default: `16`

All browser user agent stylesheets set a default `font-size` property of `16px`. `autorem` mimics this with a default of `16`, which you should preserve for new projects. You can override this with your own numeric value if necessary.

#### `legacy`
##### default: `false`

By default `autorem` will simply replace all of your rules with `px` units with their respective `rem` values. Older browsers have issues with `rem` units. If you want to provide fallback support to those browsers, set this value to true and `autorem` will preserve your rules with `px` and append a duplicate rule with the `rem` equivalent.

#### `skipMediaQueries`
##### default: `false`

`autorem` will process pixel values in media queries by default. If you don't like that, you can flip this to `true`.

### Known Limitations

`autorem` does not allow you to specify more than one base value. Some folks may prefer to set a `font-size` property on the `<html>` or `<body>` elements per breakpoint. `autorem` will steamroll this and use a single reference of `16px` to calculate `rem` values regardless of the breakpoint's default. I don't plan on fixing this. Use JavaScript or CSS classes to programmatically change your user's viewing experience for the moment. I'm not necessarily convinced that's a bad practice, and having a consistent default is preferable in most projects I have worked on.

### Issues

I'm not aware of any, but some may exist. If you run into problems with `autorem`, log a bug. Or submit a pull request and fix it, and I'll incorporate it.

### Special Thanks

Thanks to @iamvdo for his `pixrem` node module, from which `autorem` draws much of its inspiration and design.