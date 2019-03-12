import React from 'react'
import { graphql } from 'gatsby';
import { Spring } from "react-spring/renderprops"
import Img from "gatsby-image"
import Layout from '../components/layout'

const About = ({data, location}) => {
    const {node} = data.allMarkdownRemark.edges[0]
    const createMarkup = () => ({__html: node.html})
    return (
    <Layout location={location}>
        <div>
            <Spring
                from={{height: location.pathname === "/" ? 100 : 500}}
                to={{height: location.pathname === "/" ? 500 : 100}}
            >
                {styles => (
                <div style={{overflow: 'hidden', ...styles}}>
                    <Img fluid={data.file.childImageSharp.fluid} />
                </div>
                )}
            </Spring>
            <h1>About</h1>
            <h3>{node.frontmatter.title}</h3>
            <div dangerouslySetInnerHTML={createMarkup()}/>
        </div>
    </Layout>
)}

export default About

export const query = graphql`
    {
        allMarkdownRemark {
            edges {
                node {
                    html
                    frontmatter {
                        title
                    }
                }
            }
        }
        file(relativePath: { regex: "/bg/"}) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
    }
`