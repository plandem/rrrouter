import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import memoize from 'lodash/memoize';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import uniqueId from 'lodash/uniqueId';
import { routerSubPropTypes, routerPropTypes, routerPropName, routerSubPropName, providerPropName, providerSubPropName, providerPropTypes, providerSubPropTypes, locationPropName } from './prop-types';

class Router extends React.Component {
	constructor(props, context) {
		super(props, context);

		let prefix;
		if(props.relative) {
			const { location } = context[providerPropName][locationPropName];
			const currentPath = location && location.pathname;

			if(currentPath) {
				const parent = context[routerPropName];
				invariant(parent, 'Relative Router requires at least one absolute Router.');

				const parentRoute = parent.matchPath(currentPath).next().value;

				//TODO: think more about that checking - actually, there is no any case when it can be possible.
				invariant(parentRoute, 'Unhandled issue - parent of relative router has no any matches for current route.');

				const wildcard = parentRoute.path.indexOf('*');
				prefix = wildcard ? currentPath.substring(0, wildcard) : currentPath;
				if(prefix[prefix.length - 1] === '/') {
					prefix = prefix.slice(0, -1);
				}
			}
		}

		this.prefix = prefix || '';
		this.listeners = new Map();
		this.$$matchPath = memoize(this.$$matchPath);
	}

	componentWillMount() {
		this.$id = this.context[providerSubPropName].subscribe(this.notify);
	}

	componentDidMount() {
		this.notify();
	}

	componentWillUnmount() {
		this.listeners.clear();
		this.context[providerSubPropName].unsubscribe(this.$id);
	}

	getChildContext() {
		const provider = pick(this.context[providerPropName], Object.keys(providerPropTypes));

		return {
			[routerPropName]: {
				//provider API
				...provider,

				//router API
				createHref: this.createHref,
				testHref: this.testHref,
				matchPath: this.matchPath,
			},
			[routerSubPropName]: {
				subscribe: this.subscribe,
				unsubscribe: this.unsubscribe,
				update: this.update,
				notify: this.notify,
			}
		};
	}

	render() {
		const props = omit(this.props, Object.keys(this.constructor.propTypes));
		return <div {...props}>{this.props.children}</div>;
	}

	$$createRoute = (callback, { path, options }) => {
		//NB: always create a matcher for absolute path
		return path ? { path, options, matcher: this.context[providerSubPropName].createPathMatcher(this.prefix + (!this.props.relative || path !== '/' ? path : ''), options || this.props.matcherOptions), callback } : { callback };
	};

	$$resetMatches = () => {
		this.$$matchPath.cache.clear();
	};

	$$matchPath = (path) => {
		//cache matching for one path only to prevent memory leaks for parent routers
		this.$$resetMatches();

		const matches = new Map();
		if(path) {
			let parentParams = {};

			if(this.props.relative) {
				const parent = this.context[routerPropName];
				const parentRoute = parent.matchPath(path).next().value;
				parentParams = parentRoute.params;
			}

			this.listeners.forEach((r, id) => {
				if(r.matcher) {
					const pathParams = r.matcher.match(path);
					if (pathParams) {
						matches.set(id, this.props.relative
							? { relativePath: r.path, relativeParams: pathParams, path, params: Object.assign({}, parentParams, pathParams) }
							: { path: r.path, params: pathParams }
						);
					}
				}
			});
		}

		return matches;
	};

	/**
	 * build and return string with absolute href with params
	 *
	 * @param path
	 * @param params
	 * @param absolute
	 */
	createHref = (path, params, absolute) => {
		if(!absolute) {
			path = this.prefix + path;
		}

		return this.context[providerSubPropName].createPathMatcher(path, this.props.matcherOptions).build(params);
	};

	/**
	 * try to match path against subscribed listeners and return iterator with matched routes
	 * @param path
	 * @returns {Array}
	 */
	matchPath = (path) => {
		return this.$$matchPath(path).values();
	};

	/**
	 * try to test href for matching with path and if success, then return object with extracted params or null in other case.
	 * NB: absolute path/href
	 *
	 * @param path
	 * @param href
	 * @param options
	 */
	testHref = (path, href, options) => {
		return this.context[providerSubPropName].createPathMatcher(path, options || this.props.matcherOptions).match(href);
	};

	/**
	 * subscribe a new listener for path
	 * @param props
	 * @param callback
	 */
	subscribe = (props, callback) => {
		const id = uniqueId('router-listener');
		this.listeners.set(id, this.$$createRoute(callback, props));
		this.$$resetMatches();
		this.notify(null ,id);

		return id;
	};

	/**
	 * update existing listener with id
	 * @param id
	 * @param props
	 */
	update = (id, props) => {
		const route = this.listeners.get(id);
		if(route) {
			this.listeners.set(id, this.$$createRoute(route.callback, props));
			this.$$resetMatches();
			this.notify(null, id);
		}
	};

	/**
	 * unsubscribe existing listener with id
	 * @param id
	 */
	unsubscribe = (id) => {
		if(this.listeners.delete(id)) {
			this.$$resetMatches();
			this.notify();
		}
	};

	/**
	 * notify subscribed routes about route change
	 * @param route
	 * @param route_id
	 */
	notify = (route, route_id) => {
		if(!route) {
			route = this.context[providerPropName][locationPropName];
		}

		const path = route.location && route.location.pathname;
		const matches = this.$$matchPath(path);

		this.listeners.forEach((r, id) => {
			const matched = matches.get(id);

			if(matched) {
				if(!route_id || route_id === id) {
					r.callback(matched);
				}
			} else {
				(r.matcher) ? r.callback(null) : r.callback(!matches.size || null);
			}
		});
	};
}

Router.propTypes = {
	relative: PropTypes.bool,
	children: PropTypes.any.isRequired,
	matcherOptions: PropTypes.object,
};

Router.defaultProps = {
	relative: false,
};

Router.childContextTypes = {
	[routerPropName]: PropTypes.shape({ ...routerPropTypes }),
	[routerSubPropName]: PropTypes.shape({ ...routerSubPropTypes }),
};

Router.contextTypes = {
	[routerPropName]: PropTypes.shape({ ...routerPropTypes }),
	[providerPropName]: PropTypes.shape({ ...providerPropTypes }).isRequired,
	[providerSubPropName]: PropTypes.shape({ ...providerSubPropTypes }).isRequired,
};

/**
 * return component that wrapped with Router
 * @param WrappedComponent
 */
const withRouter = (WrappedComponent) => {
	const ComponentWithRouter = (props, context) => (
		<WrappedComponent {...props} {...{[routerPropName]: context[routerPropName]}}/>
	);

	ComponentWithRouter.contextTypes = {
		[routerPropName]: PropTypes.shape({ ...routerPropTypes}).isRequired,
	};

	return ComponentWithRouter;
};

export default Router;
export { withRouter };


 