import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';

import Header from './header';
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
	radius          : '.6rem',
	breakpoints     : {
		tablet : '780px',
		phone  : '420px'
	}
};

const LayoutWrapper = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const MainLayout = styled.main`
	flex-grow: 1;
	max-width: 90%;
	margin: 1rem auto;
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 40px;
`;

const Footer = styled.footer`
	text-align: center;
	flex-shrink: 0;
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
			<ThemeProvider theme={Theme}>
				<LayoutWrapper>
					<Header
						description={site.siteMetadata.description}
						siteName={site.siteMetadata.siteName}
						siteTitle={site.siteMetadata.title}
						location={location}
					/>
					<SEO
						title="Home"
						keywords={[
							`gatsby`,
							`application`,
							`react`
						]}
					/>
					<MainLayout>
						<div>{children}</div>
					</MainLayout>
					<Footer>
						© {new Date().getFullYear()}, Built by {site.siteMetadata.title}
					</Footer>
				</LayoutWrapper>
			</ThemeProvider>
		)}
	/>
);

Layout.propTypes = {
	children : PropTypes.node.isRequired,
	location : PropTypes.object.isRequired
};

export default Layout;
