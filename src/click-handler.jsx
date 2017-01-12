import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import { getValidClickEventNode, isValidClickEvent } from './click-utils';
import { routerPropTypes, routerPropName } from './prop-types';

/**
 * ClickHandler intercept any valid clicks and navigate to absolute href
 */
class ClickHandler extends React.Component {
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

	render() {
		const props = omit(this.props, Object.keys(this.constructor.propTypes));
		const { component, children } = this.props;
		return React.cloneElement(component, { ...props, onClick: this.onClick }, children);
	}
}

ClickHandler.propTypes = {
	component: PropTypes.element.isRequired,
	children: PropTypes.any,
};

ClickHandler.defaultProps = {
	component: <div/>
};

ClickHandler.contextTypes = {
	[routerPropName]: PropTypes.shape({ ...routerPropTypes}).isRequired,
};

/**
 * return component that wrapped with ClickHandler
 * @param WrappedComponent
 * @param settings
 */
const withClickHandler = (WrappedComponent, settings) => {
	const ComponentWithClickHandler = (props, context) => (
		<ClickHandler {...settings}>
			<WrappedComponent {...props} {...{[routerPropName]: context[routerPropName]}} />
		</ClickHandler>
	);

	ComponentWithClickHandler.contextTypes = {
		[routerPropName]: PropTypes.shape({ ...routerPropTypes}).isRequired,
	};

	return ComponentWithClickHandler;
};

export default ClickHandler;
export { withClickHandler };
