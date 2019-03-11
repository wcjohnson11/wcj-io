/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Img from "gatsby-image"
import { Spring } from "react-spring/renderprops"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"

import Header from "./header"
import Archive from './archive'
import SEO from "./seo"
import "./layout.css"

const MainLayout = styled.main`
  max-width: 90%;
  margin: 1rem auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 40px;
`

const Layout = ({ children, location }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
        file(relativePath: { regex: "/bg/"}) {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    `}
    render={data => (
      <>
        <Header siteTitle={data.site.siteMetadata.title} />
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        <Spring
          from={{height: location.pathname === "/" ? 100 : 200}}
          to={{height: location.pathname === "/" ? 200 : 100}}
        >
          {styles => (
            <div style={{overflow: 'hidden', ...styles}}>
              <Img fluid={data.file.childImageSharp.fluid} />
            </div>
          )}
        </Spring>
        <MainLayout>
          <div>
            {children}
          </div>
          <Archive />
        </MainLayout>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
