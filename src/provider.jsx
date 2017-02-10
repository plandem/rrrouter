import React, { PropTypes } from 'react';
import pick from 'lodash/pick';
import uniqueId from 'lodash/uniqueId';
import { providerPropTypes, providerSubPropTypes, providerPropName, providerSubPropName, locationPropName } from './prop-types';
import memoize from 'lodash/memoize';
import Path from './path';

const MATCHER_CACHE_SIZE = 1000;

class Provider extends React.Component {
	constructor(props) {
		super(props);
		this.listeners = new Map();

		this.serializeOptions = memoize(this.serializeOptions);
		this.createPathMatcher = memoize(this.createPathMatcher, (path, options) => (path + this.serializeOptions(options)));
	}

	componentDidMount() {
		if(this.props.initHref) {
			this.props.navigate(this.props.initHref);
		} else {
			this.notify(this.props[locationPropName]);
		}
	}

	componentWillUnmount() {
		this.listeners.clear();
	}

	componentWillReceiveProps(nextProps) {
		const route = this.props[locationPropName];
		const nextRoute = nextProps[locationPropName];

		if(route != nextRoute) {
			this.notify(nextRoute);
		}
	}

	notify = (route) => {
		this.listeners.forEach(callback => callback(route));
	};

	subscribe = (callback) => {
		const id = uniqueId('provider-listener');
		this.listeners.set(id, callback);
		
		//TODO: notify new router
		return id;
	};

	unsubscribe = (id) => {
		this.listeners.delete(id);
	};

	serializeOptions = (options) => {
		if(this.serializeOptions.cache.size > MATCHER_CACHE_SIZE) {
			this.serializeOptions.cache.clear();
		}

		return JSON.stringify(options);
	};

	createPathMatcher = (path, options) => {
		if(this.createPathMatcher.cache.size > MATCHER_CACHE_SIZE) {
			this.createPathMatcher.cache.clear();
		}

		return new Path(path, options || this.props.matcherOptions);
	};

	getChildContext() {
		return {
			[providerPropName]: {
				...pick(this.props, Object.keys(providerPropTypes)),
			},
			[providerSubPropName]: {
				subscribe: this.subscribe,
				unsubscribe: this.unsubscribe,
				notify: this.notify,
				createPathMatcher: this.createPathMatcher,
			}
		};
	}

	render() {
		return React.Children.only(this.props.children);
	}
}

Provider.propTypes = {
	initHref: PropTypes.string, //local property, because we don't want to expose this property to router.
	children: PropTypes.element.isRequired,
	matcherOptions: PropTypes.object,
	...providerPropTypes,
};

Provider.childContextTypes = {
	[providerPropName]: PropTypes.shape({ ...providerPropTypes }),
	[providerSubPropName]: PropTypes.shape({...providerSubPropTypes })
};

export default Provider;
