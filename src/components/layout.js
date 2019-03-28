import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';

import Header from './header';
import SEO from './seo';
import NetlifyForm from './netlifyForm';
import Footer from './footer';
import theme from '../utils/theme';
import './layout.css';

const LayoutWrapper = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const MainLayout = styled.main`
	flex-grow: 1;
	margin: ${(props) => props.theme.margin} auto;
	max-width: ${(props) => props.theme.maxWidthMobile};
	padding: .5em;
	@media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
		max-width: ${(props) => props.theme.maxWidthTablet};
	}
	@media (min-width: ${(props) => props.theme.breakpoints.laptop}) {
		max-width: ${(props) => props.theme.maxWidth};
	}
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
					<MainLayout>{children}</MainLayout>
					{location.pathname !== '/success' && <NetlifyForm />}
					<Footer title={site.siteMetadata.title} />
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
