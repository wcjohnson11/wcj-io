import React from 'react'
import { graphql } from 'gatsby';
import Layout from '../components/layout'

const About = ({data}) => {
    const {node} = data.allMarkdownRemark.edges[0]
    const createMarkup = () => ({__html: node.html})
    return (
    <Layout>
        <div>
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
    }
`