const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const fs = require('fs');

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy({
		"./public/": "/"
	});
	eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css'
	});

	eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpeg}");
	
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	function getSvgContent(file) {
		let relativeFilePath = `./public/${file}.svg`;
		let data = fs.readFileSync(relativeFilePath, 
		function(err, contents) {
		   if (err) return err
		   return contents
		});
  
		return data.toString('utf8');
	}
  
	eleventyConfig.addShortcode("svg", getSvgContent);
	eleventyConfig.addShortcode("icon", (path) => getSvgContent("icon/" + path));

	return {
		templateFormats: [
			"html",
			"njk",
			"md"
		],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",

		dir: {
			input: "src",
			includes: "../_includes",
			data: "../_data",
			output: "_site",
		},
		pathPrefix: "/multimedijski-sustavi/",
	}
};