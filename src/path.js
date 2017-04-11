import pathToRegexp from 'path-to-regexp';

class Path {
	constructor(path, options) {
		// console.log(pathToRegexp.parse(path, options));
		// console.log(pathToRegexp(path, null, options));
		//
		// console.log(path);

		// const regexp = pathToRegexp(path, options);
		// path = pathToRegexp(path, null, options);
		// console.log(path.keys);

		// this.tokens = regexp.keys;
		// this.regexp = regexp;

		this.tokens = pathToRegexp.parse(path, options);
		this.build = pathToRegexp.tokensToFunction(this.tokens);
		this.regexp = pathToRegexp.tokensToRegExp(this.tokens, options || {});
		//
		// console.log(path, this.tokens, this.regexp);

		this.test = (pathname) => this.regexp.test(pathname);
	}

	match = (pathname) => {
		const matched = this.regexp.exec(pathname);
		if (!matched) {
			return null;
		}

		const params = { };
		this.tokens.forEach((token, i) => {
			if(typeof(token) !== 'string') {
				const param = matched[i];
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
			}
		});

		return params;
	}
}

export default Path;