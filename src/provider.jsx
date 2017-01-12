import React, { PropTypes } from 'react';
import pick from 'lodash/pick';
import uniqueId from 'lodash/uniqueId';
import { providerPropTypes, providerSubPropTypes, providerPropName, providerSubPropName, locationPropName } from './prop-types';

class Provider extends React.Component {
	constructor(props) {
		super(props);
		this.listeners = new Map();
	}

	componentDidMount() {
		this.notify(this.props[locationPropName]);
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
		return id;
	};

	unsubscribe = (id) => {
		this.listeners.delete(id);
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
			}
		};
	}

	render() {
		return React.Children.only(this.props.children);
	}
}

Provider.propTypes = {
	children: PropTypes.element.isRequired,
	...providerPropTypes,
};

Provider.childContextTypes = {
	[providerPropName]: PropTypes.shape({ ...providerPropTypes }),
	[providerSubPropName]: PropTypes.shape({...providerSubPropTypes })
};

export default Provider;
