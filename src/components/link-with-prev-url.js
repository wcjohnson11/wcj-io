/*
* Create Link that will always pass it's prevUrlPath to the location object
*/
import React from 'react';
import { Location } from '@reach/router';
import { Link } from 'gatsby';

const LinkWithPrevUrl = ({ children, state, ...rest }) => (
	<Location>
		{({ location }) => (
			<Link {...rest} state={{ prevUrlPath: location.pathname, ...state }}>
				{children}
			</Link>
		)}
	</Location>
);

export { LinkWithPrevUrl as Link };
