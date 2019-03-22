import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';

import Header from './header';
import SEO from './seo';
import './layout.css';
import theme from '../utils/theme';

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
	@media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
		max-width: 98%;
	}
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
			<ThemeProvider theme={theme}>
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
