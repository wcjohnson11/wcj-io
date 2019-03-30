---
slug: gatsby-link-with-previous-history
title: Gatsby Link with Previous History
date: 2019-03-29T22:45:51.592Z
tags:
  - gatsby
  - gatsby link
  - reach router
  - transitions
---
When building this site, I wanted to have route specific animation behavior for the header. I wanted it to expand when arriving and the home page and collapsing when leaving the homepage. In order to do this, I needed to have access to the current and previous route.

Gatsby uses [Reach Router](https://reach.tech/router/) under the hood for its routing. It's a great, newer router for React that was built with accessibility in mind. It passes a location object to all route components via context. Including additional information in the location object is made easier thanks to React Router's [Location Component](https://reach.tech/router/api/Location) that provides the location anywhere in the app, even in child components via a child render prop.

## Creating a Custom Link Component

I'm able to create a custom Link component that will always pass the previous URL path into the location prop via its state by wrapping [Gatsby's Link Component](https://www.gatsbyjs.org/docs/gatsby-link/) in the Reach Router Location Component

```
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
```
And that's it, now all links across the site will add the previous url pathname to the location property to allow for transitions based on whether the user has navigated to or from the homepage.

Stored in a variable, it would look like this.

```
const isHomepageTransition = (
    location.state &&
    location.state.prevUrlPath === '/'
) || location.pathname === '/';
```

I then use this variable to determine whether or not the expand/collapse animation occurs.
