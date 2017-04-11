import React from 'react';
import PropTypes from 'prop-types';
import Route from './route';
import { routerSubPropName, routerPropName, matchedPropName } from './prop-types';

class Match extends Route {
	componentWillReceiveProps(nextProps, nextContext) {
		if(nextProps.path != this.props.path || nextProps.options != this.props.options) {
			nextContext[routerSubPropName].update(this.$id, nextProps);
		}
	}

	render() {
		const router = this.context[routerPropName];
		const { matched } = this.state;
		return matched && this.renderHandler({ [routerPropName]: router, [matchedPropName]: matched });
	}
}

Match.propTypes = {
	...Route.propTypes,
	path: PropTypes.oneOfType([
		PropTypes.instanceOf(RegExp),
		PropTypes.string,
	]).isRequired,
	options: PropTypes.object,
};

export default Match;