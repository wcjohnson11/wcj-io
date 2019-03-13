import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';

import Header from './header';
import Archive from './archive';
import SEO from './seo';
import './layout.css';

const Theme = {
	colorPrimary    : '#3eb0ef',
	colorBase       : '#15171A',
	colorSecondary  : '#5B7A81',
	colorBorder     : '#c7d5d8',
	colorBackground : '#f5f5f5',
	fontLight       : 100,
	fontNormal      : 400,
	fontBold        : 700,
	fontHeavy       : 800,
	height          : '4rem',
	margin          : '2rem',
	radius          : '.6rem'
};

const MainLayout = styled.main`
	max-width: 90%;
	margin: 1rem auto;
	display: grid;
	grid-template-columns: 3fr 1fr;
	grid-gap: 40px;
`;

const Layout = ({ children, location }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
				site {
					siteMetadata {
						description
						siteName
						title
					}
				}
			}
		`}
		render={({ site }) => (
			<React.Fragment>
				<ThemeProvider theme={Theme}>
					<Header
						description={site.siteMetadata.description}
						siteName={site.siteMetadata.siteName}
						siteTitle={site.siteMetadata.title}
						location={location}
					/>
				</ThemeProvider>
				<SEO
					title="Home"
					keywords={[
						`gatsby`,
						`application`,
						`react`
					]}
				/>
				<ThemeProvider theme={Theme}>
					<MainLayout>
						<div>{children}</div>
						<Archive />
					</MainLayout>
				</ThemeProvider>
				<footer>© {new Date().getFullYear()}, Built by {site.siteMetadata.title}</footer>
			</React.Fragment>
		)}
	/>
);

Layout.propTypes = {
	children : PropTypes.node.isRequired,
	location : PropTypes.object.isRequired
};

export default Layout;
