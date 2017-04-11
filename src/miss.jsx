import React from 'react';
import PropTypes from 'prop-types';
import Route from './route';
import { routerPropName } from './prop-types';

class Miss extends Route {
	render() {
		const router = this.context[routerPropName];
		const { matched } = this.state;
		return matched && this.renderHandler({ [routerPropName]: router });
	}
}

export default Miss;