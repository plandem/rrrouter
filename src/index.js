import Router, { withRouter } from './router';
import Link from './link';
import Match from './match';
import Miss from './miss';
import ClickHandler, { withClickHandler } from './click-handler';

Router.Link = Link;
Router.Match = Match;
Router.Miss = Miss;
Router.ClickHandler = ClickHandler;

export default Router;

export {
	Link,
	Match,
	Miss,
	ClickHandler,
	withClickHandler,
	withRouter,
};

export * as RouterProps from './prop-types';
export Provider from './provider';
export Path from './path';
