import { Link } from './linkWithPrevUrl';
import { Spring } from 'react-spring/renderprops';
import PropTypes from 'prop-types';
import React from 'react';
import { FaGithub, FaLinkedin, FaCodepen } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import styled, { css } from 'styled-components';

// Set up smooth scrolling for all components inside layout
if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  require("smooth-scroll")('a[href*="#"]')
}

const HeaderWrapper = styled.header`
	background-color: ${(props) => props.theme.colorBackground};
	color: ${(props) => props.theme.colorPrimary};
`;

const HeaderContainer = styled.header`
	margin: 0 auto;
	max-width: 850px;
	padding: .4rem .4rem;
	@media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
		margin-left: .9rem;
		margin-right: .9rem;
	}
`;

const HeaderTop = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const HeaderBottom = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 10px;
`;

const HeaderBottomLeft = styled.div`
	margin: 0 20px 0 -10px;
	a {
		padding: 10px 10px;
	}
	a[aria-current] {
		text-decoration: underline;
		text-decoration-color: ${(props) => props.theme.colorPrimary};
	}
`;

const HeaderBottomRight = styled.div`
	margin: 0 -10px 0 10px;
	a {
		display: inline-block;
		padding: 5px 10px;
		/* border: ${(props) => props.theme.colorBorder} 1px solid; */
		color: ${(props) => props.theme.colorBase};
		font-size: .8rem;
		line-height: .8rem;
		/* border-radius: ${(props) => props.theme.radius}; */
		opacity: 0.9;
	}
`;

const HeaderNavList = styled.ul`
	display: flex;
	align-items: center;
	margin: 0 -10px 0 10px;
`;

const HeaderLink = styled(Link)`
  color: ${(props) => props.theme.colorBase};
  text-decoration: none;
  font-weight: ${(props) => props.theme.fontBold};
  font-family: 'Merriweather', serif;
  :visited {
    color: ${(props) => props.theme.colorBase};
  }
  :hover {
    color: ${(props) => props.theme.colorPrimary};
    border-color: ${(props) => props.theme.colorPrimary};
  }
  ${(props) => (props.primary ? css`font-size: 1.5rem;` : css`font-size: .8rem;`)};
`;

const HeaderNavLink = styled.a`
	display: inline-block;
	padding: 10px 12.5px;
	fill: ${(props) => props.theme.colorBase};
	text-decoration: none;
	svg {
		width: 1em;
		height: 1em;
		fill: ${(props) => props.theme.colorBase};
		&:hover {
			cursor: pointer;
			fill: ${(props) => props.theme.colorPrimary};
		}
	}
`;

const HomePageHero = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Header = ({ description, location, siteName, siteTitle }) => {
	// Is the page going to be coming from or going to the homepage?
	const isHomepageTransition = (location.state && location.state.prevUrlPath === '/') || location.pathname === '/';

	return (
		<HeaderWrapper>
			<HeaderContainer>
				<HeaderTop>
					<HeaderLink primary="true" to="/">
						{siteName}
					</HeaderLink>
					<HeaderNavList>
						<HeaderNavLink href="https://www.github.com/wcjohnson11" target="_blank" title="github">
							<FaGithub />
						</HeaderNavLink>
						<HeaderNavLink href="https://codepen.io/wcjohnson11/#" target="_blank" title="codepen">
							<FaCodepen />
						</HeaderNavLink>

						<HeaderNavLink
							href="https://beta.observablehq.com/@wcjohnson11"
							target="_blank"
							title="observable"
						>
							<svg role="img" viewBox="0 0 26 26">
								<path d="M12 21c-1.108 0-2.068-.261-2.88-.783a5.137 5.137 0 0 1-1.867-2.126 11.821 11.821 0 0 1-.952-2.847A16.523 16.523 0 0 1 6 12c0-.862.052-1.686.157-2.474.104-.787.297-1.587.578-2.399.281-.812.643-1.516 1.084-2.113a4.987 4.987 0 0 1 1.735-1.455C10.27 3.186 11.084 3 12 3c1.108 0 2.068.261 2.88.783a5.137 5.137 0 0 1 1.867 2.126c.434.895.751 1.844.952 2.847.2 1.002.301 2.084.301 3.244 0 .862-.052 1.686-.157 2.474a11.76 11.76 0 0 1-.59 2.399c-.29.812-.65 1.516-1.084 2.113-.434.597-1.008 1.082-1.723 1.455-.715.373-1.53.559-2.446.559zm2.118-6.882A2.888 2.888 0 0 0 15 12c0-.824-.287-1.53-.86-2.118C13.566 9.294 12.853 9 12 9c-.853 0-1.566.294-2.14.882A2.925 2.925 0 0 0 9 12c0 .824.287 1.53.86 2.118.574.588 1.287.882 2.14.882.853 0 1.559-.294 2.118-.882zM12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" />
							</svg>
						</HeaderNavLink>
						<HeaderNavLink href="https://www.linkedin.com/in/wcj11" target="_blank" title="linkedin">
							<FaLinkedin />
						</HeaderNavLink>
						<HeaderNavLink href="mailto:will@wcj.io" title="email">
							<MdMailOutline />
						</HeaderNavLink>
					</HeaderNavList>
				</HeaderTop>
				{isHomepageTransition && (
					<Spring
						from={{
							opacity : location.pathname === '/' ? 0 : 1,
							height  : location.pathname === '/' ? 0 : 500
						}}
						to={{ opacity: location.pathname === '/' ? 1 : 0, height: location.pathname === '/' ? 500 : 0 }}
					>
						{(styles) => (
							<HomePageHero style={{ overflow: 'hidden', ...styles }}>
								<h1>{siteTitle}</h1>
								<h3>{description}</h3>
							</HomePageHero>
						)}
					</Spring>
				)}
				<HeaderBottom>
					<HeaderBottomLeft>
						<HeaderLink to="/">home</HeaderLink>
						<HeaderLink to="/about">about</HeaderLink>
						<HeaderLink to="/blog">blog</HeaderLink>
						<HeaderLink to="/projects">projects</HeaderLink>
					</HeaderBottomLeft>
					<HeaderBottomRight>
						<HeaderLink to={`${location.pathname}#contact`}>contact</HeaderLink>
					</HeaderBottomRight>
				</HeaderBottom>
			</HeaderContainer>
		</HeaderWrapper>
	);
};

Header.propTypes = {
	siteTitle   : PropTypes.string,
	description : PropTypes.string,
	location    : PropTypes.object,
	siteName    : PropTypes.string
};

Header.defaultProps = {
	siteTitle   : ``,
	description : ``,
	location    : { pathname: `/` },
	siteName    : ``
};

export default Header;
