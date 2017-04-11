import PropTypes from 'prop-types';

export const locationPropName = 'route';
export const matchedPropName = 'matched';

export const providerPropName = 'routeProvider';
export const providerSubPropName = `${providerPropName}Sub`;

export const routerPropName = 'router';
export const routerSubPropName = `${routerPropName}Sub`;

export const locationPropTypes = {
	href: PropTypes.string,
	location: PropTypes.shape({
		hash: PropTypes.string,
		pathname: PropTypes.string,
		search: PropTypes.string,
	}),
	query: PropTypes.object,
};

export const providerPropTypes = {
	[locationPropName]: PropTypes.shape({ ...locationPropTypes }).isRequired,
	go: PropTypes.func.isRequired,
	back: PropTypes.func.isRequired,
	forward: PropTypes.func.isRequired,
	navigate: PropTypes.func.isRequired,
};

export const routerPropTypes = {
	//provider API
	...providerPropTypes,

	//router API
	createHref: PropTypes.func.isRequired,
	testHref: PropTypes.func.isRequired,
	matchPath: PropTypes.func.isRequired,
};

export const providerSubPropTypes = {
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired,
	createPathMatcher: PropTypes.func.isRequired,
};

export const routerSubPropTypes = {
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired,
	update: PropTypes.func.isRequired,
};

