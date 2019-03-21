import React from "react"
import { Link } from './linkWithPrevUrl';
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"

const Post = styled.article`
    box-shadow: 0px 3px 10px rgba(25, 17, 34, 0.05);
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    h3 {
        margin-bottom: 0;
    }
    a {
        color: purple;
        font-size: 0.8rem;
        text-decoration: underline;
        &:hover {
            color: black;
        }
    }
    p {
        font-size: 0.8rem;
    }
`

const PROJECTS_LISTING_QUERY = graphql`
    query ProjectsPostListing {
        allMarkdownRemark(
            limit: 10,
            filter: {
                fileAbsolutePath: {
                    regex: "/src/projects/"
                }
            }
            sort: {
            order: DESC,
            fields: [frontmatter___date]
        }) {
            edges {
                node {
                    excerpt
                    fileAbsolutePath
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                        slug
                    }
                }
            }
        }
    }
`

const ProjectListing = ({type}) => (
    <StaticQuery 
        query={PROJECTS_LISTING_QUERY}
        render={({allMarkdownRemark}) => (
            allMarkdownRemark.edges.map(({node}) => (
                <Post key={node.frontmatter.slug}>
                    <h3>{node.frontmatter.title}</h3>
                    <p>{node.frontmatter.date}</p>
                    <p>{node.excerpt}</p>
                    <Link to={`/projects/${node.frontmatter.slug}`}>Read More</Link>
                </Post>
            ))
        )}
    />
)

export default ProjectListing
