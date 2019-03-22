import React from "react"
import { Link } from './linkWithPrevUrl';
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"

const Post = styled.article`
    box-shadow: 0px 3px 10px rgba(25, 17, 34, 0.05);
    padding: .8em;
    margin-left: -.8em;
    margin-right: -.8em;
    border-radius: 10px;
    margin-bottom: 1em;
    @media (min-width: ${props => props.theme.breakpoints.laptop}) {
        max-width: 900px;
        padding: 1em;
        margin-left: -1em;
        margin-right: -1em;
    }
    h3 {
        margin-bottom: 0;
    }
    a {
        color: ${props => props.theme.colorPrimary};
        text-decoration: underline;
        &:hover {
            color: black;
        }
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
