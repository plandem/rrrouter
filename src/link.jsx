import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import { getValidClickEventNode, isValidClickEvent } from './click-utils';
import { routerPropTypes, routerPropName } from './prop-types';

class Link extends React.Component {
	onClick = (e) => {
		if(this.props.onClick) {
			this.props.onClick(e);
		}

		const node = getValidClickEventNode(e);
		if(isValidClickEvent(e, node)) {
			e.preventDefault();
			this.context[routerPropName].navigate(node.getAttribute('href'));
		}
	};

	createHref() {
		const { to, params, absolute } = this.props;
		return this.context[routerPropName].createHref(to, params, absolute);
	}

	render() {
		const props = omit(this.props, Object.keys(this.constructor.propTypes));

		return (
			<a {...props} href={this.createHref()} onClick={this.onClick}>{this.props.children}</a>
		);
	}
}

Link.propTypes = {
	to: PropTypes.string,
	params: PropTypes.object,
	absolute: PropTypes.bool,
	onClick: PropTypes.func,
	children: PropTypes.any,
};

Link.contextTypes = {
	[routerPropName]: PropTypes.shape({ ...routerPropTypes}),
};

export default Link;