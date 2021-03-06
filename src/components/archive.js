/**
 * Archive component that queries for blog posts
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from 'react';
import { Link } from './linkWithPrevUrl';
import { graphql, StaticQuery } from 'gatsby';
import styled from 'styled-components';

const ArchiveList = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;

	a {
		color: purple;
		font-size: 0.8rem;
		text-decoration: underline;

		&:hover {
			color: black;
		}
	}
`;

const POST_ARCHIVE_QUERY = graphql`
	query BlogArchiveQuery {
		allMarkdownRemark(
			limit: 5
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { fileAbsolutePath: { regex: "/posts/" } }
		) {
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
`;

const Archive = () => (
	<StaticQuery
		query={POST_ARCHIVE_QUERY}
		render={({ allMarkdownRemark }) => (
			<React.Fragment>
				<aside>
					<h3>Archive</h3>
					<ArchiveList>
						{allMarkdownRemark.edges.map((edge) => (
							<li key={edge.node.frontmatter.slug}>
								<Link to={`/blog/${edge.node.frontmatter.slug}`}>{edge.node.frontmatter.title}</Link>
							</li>
						))}
					</ArchiveList>
				</aside>
			</React.Fragment>
		)}
	/>
);

export default Archive;
