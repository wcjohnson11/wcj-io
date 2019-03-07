/**
 * Archive component that queries for blog posts
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { graphql, Link, StaticQuery } from "gatsby"

const POST_ARCHIVE_QUERY = graphql`
    query BlogArchiveQuery {
        allMarkdownRemark {
            edges {
                node {
                    excerpt
                    frontmatter {
                        title
                        slug
                    }
                }
            }
        }
    }
`

const Archive = () => (
  <StaticQuery
    query={POST_ARCHIVE_QUERY}
    render={({allMarkdownRemark}) => (
      <>
       <aside>
            <h3>Archive</h3>
            <ul>
                {allMarkdownRemark.edges.map(edge => (
                    <li key={edge.node.frontmatter.slug}>
                        <Link to={`/posts/${edge.node.frontmatter.slug}`}>{edge.node.frontmatter.title}</Link>
                    </li>
                ))}
            </ul>
       </aside>
      </>
    )}
  />
)

export default Archive
