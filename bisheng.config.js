module.exports = {
	lazyLoad: true,
	// plugins: ['bisheng-plugin-description'],
	source: './docs',
	output: './_site',
	theme: './bisheng-theme',
	port: 8001,
	// pick: {
	// 	posts(markdownData) {
	// 		return {
	// 			meta: markdownData.meta,
	// 			description: markdownData.description,
	// 		};
	// 	}
	// }
};