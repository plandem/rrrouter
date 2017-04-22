import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { routerSubPropTypes, routerPropTypes, routerPropName, routerSubPropName } from './prop-types';

const elementRender = (component) => (props) => React.cloneElement(component, props);
const classRender = (component) => (props) => React.createElement(component, props);

class Route extends React.Component {
	constructor(props) {
		super(props);
		this.state = { matched: null }
	}

	componentWillMount() {
		this.$id = this.context[routerSubPropName].subscribe(this.props, (matched) => this.setState({ matched }));
	}

	componentWillUnmount() {
		this.context[routerSubPropName].unsubscribe(this.$id);
	}

	renderHandler(props) {
		let result, callback;
		const { handler } = this.props;

		try {
			if (typeof(handler) === 'object') {
				//React.element
				callback = elementRender(handler);
			} else {
				if (handler.prototype && handler.prototype.isReactComponent) {
					//extended class of React.Component
					callback = classRender(handler);
				} else {
					//stateless component or plain JS function
					callback = handler;
				}
			}

			invariant(typeof(callback) === 'function', 'Could not resolve handler to render. Provide a valid \'handler\'.');
			result = callback(props);
		} catch(e) {
			console.error(e);
		}

		return result || null;
	}

	render() {
		invariant(false, 'Route is abstract class that can\'t be rendered.');
	}
}

Route.propTypes = {
	handler: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.element,
	]).isRequired,
};

Route.contextTypes = {
	[routerPropName]: PropTypes.shape({ ...routerPropTypes}).isRequired,
	[routerSubPropName]: PropTypes.shape({ ...routerSubPropTypes }).isRequired,
};

export default Route;