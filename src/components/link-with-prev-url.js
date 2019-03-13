/*
* Create Link that will always pass it's prevUrlPath
* into the location props via it's state
* This is normally only accessible in Route Components
* Uses the @reach/router's Location component to pass
* anywhere in the app via a child render prop
* https://reach.tech/router/api/Location
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
