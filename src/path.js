import pathToRegexp from 'path-to-regexp';

class Path {
	constructor(path, options) {
		const tokens = pathToRegexp.parse(path, options);
		this.build = pathToRegexp.tokensToFunction(tokens);
		this.regexp = pathToRegexp.tokensToRegExp(tokens, options || {});

		this.keys = [];
		tokens.forEach((token, i) => {
			if (typeof(token) !== 'string') {
				this.keys.push(token);
			}
		});

		this.test = (pathname) => this.regexp.test(pathname);
	}

	match = (pathname) => {
		const matched = this.regexp.exec(pathname);
		if (!matched) {
			return null;
		}

		const params = { };
		this.keys.forEach((token, i) => {
			const param = matched[i + 1];
			if(typeof(param) !== 'undefined') {
				try {
					params[token.name] = decodeURIComponent(param);
					if(token.repeat) {
						params[token.name] = params[token.name].split(token.delimiter);
					}
				} catch(e) {
					console.log(e);
				}
			}
		});

		return params;
	}
}

export default Path;