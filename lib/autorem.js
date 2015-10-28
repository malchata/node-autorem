"use strict";

// Get needed modules
var postcss = require("postcss");

// Declare globals
var _pxRegEx,
	_ignoredSelectorsRegEx,
	_ignoredValues,
	_mediaQueryRegEx,
	_options;

function autorem(options){
	// Load option overrides
	options = options || {};

	// Internals
	_pxRegEx = /(\d*\.?\d+)px/ig;
	_ignoredSelectorsRegEx = /^(html|body|:root)$/i;
	_ignoredValues = /(calc)/i;

	// Options
	_options = {};
	_options.baseFontSize = options.baseFontSize !== undefined ? options.baseFontSize : 16;
	_options.legacy = options.legacy !== undefined ? options.legacy : false;
	_options.skipMediaQueries = options.skipMediaQueries !== undefined ? options.skipMediaQueries : false;
}

autorem.prototype.process = function(css, options){
	return postcss(this.postcss).process(css, options).css;
};

autorem.prototype.postcss = function(css){
	// Iterate through all of the rules in the stylesheet
	css.walkRules(function(rule){
		// Check if we're processing media queries
		if(_options.skipMediaQueries === false){
			// Check if this is a media query-related rule
			if(rule.type === "atrule" || (rule.parent && rule.parent.type === "atrule")){
				var params = rule.parent.params;

				params = params.replace(_pxRegEx, function(unit){
					return toRem(unit, _options.baseFontSize);
				});

				rule.parent.params = params;
			}
		}

		rule.each(function(decl, i){
			// Check if the declaration type is some kind of CSS rule
			if(decl.type === "decl"){
				// Capture value
				var value = decl.value;

				// Check if we've discovered a pixel value that is outside
				if(_ignoredSelectorsRegEx.test(rule.selector) === false && _ignoredValues.test(value) === false && value.indexOf("px") !== -1){
					value = value.replace(_pxRegEx, function(unit){
						return toRem(unit, _options.baseFontSize);
					});

					// Check if we need legacy support
					if(_options.legacy === true){
						var clone = decl.clone({
							value: value
						});

						rule.insertAfter(i, clone);
					}
					else{
						decl.value = value;
					}
				}
			}
		});
	});
};

function toRem(value, fontSize){
	return (parseFloat(value) / fontSize) + "rem";
}

var Autorem = function(options){
	return new autorem(options);
};

Autorem.process = function(css, options, postCssOptions){
	return new autorem(options).process(css, postCssOptions);
};

Autorem.postcss = function(css){
	return new autorem().postcss(css);
};

module.exports = Autorem;