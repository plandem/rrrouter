/**
 * return true if click event and node is valid or false in other case
 * @param event
 * @param node
 * @returns {boolean}
 */
export const isValidClickEvent = (event, node) => {
	// consider node as invalid in next cases:
	// node is not 'A' element,
	// node with target,
	// node with rel='external'
	// node without href
	// node with href that has protocol prefix, e.g. 'http://'

	// consider event as invalid in next cases:
	// event with middle-clicked,
	// event with right-click,
	// event with modifier key (e.g. ctrl-click, meta-click, shift-click, etc.)
	// event was already canceled via preventDefault()
	let href;

	return !(
		!node ||
		event.defaultPrevented ||
		(node.nodeName !== 'A') ||
		(node.target && node.target !== '_self') ||
		(node.rel && /(?:^|\s+)external(?:\s+|$)/.test(node.rel)) ||
		(!(href = node.getAttribute('href')) || href.match(/^([a-z-]+:|\/\/)/)) ||
		(event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
	);
};

/**
 * try to get 'A' node for click event
 * @param event
 */
export const getValidClickEventNode = (event) => {
	let node = event.target;

	while (node && node.nodeName !== 'A') {
		node = node.parentNode;
	}

	return node;
};
