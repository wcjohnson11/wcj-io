import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';

import Header from './header';
import SEO from './seo';
import NetlifyForm from './netlifyForm'
import Footer from './footer'
import theme from '../utils/theme'
import './layout.css';

const LayoutWrapper = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const MainLayout = styled.main`
	flex-grow: 1;
	margin: 0 auto;
	max-width: 95%;
	padding: .3rem .3rem;
	@media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
		max-width: 90%;
	}
	@media (min-width: ${props => props.theme.breakpoints.laptop}) {
		max-width: 880px;
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
					<MainLayout>
						{children}
					</MainLayout>
					{ location.pathname !== "/success" && <NetlifyForm /> }
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
