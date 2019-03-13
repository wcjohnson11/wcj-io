import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import Layout from '../components/layout';

const About = ({ data, location }) => {
	const { node } = data.allMarkdownRemark.edges[0];
	const createMarkup = () => ({ __html: node.html });
	return (
		<Layout location={location}>
			<div>
				<div style={{ overflow: 'hidden' }}>
					<Img fluid={data.file.childImageSharp.fluid} />
				</div>
				<h1>About</h1>
				<h3>{node.frontmatter.title}</h3>
				<div dangerouslySetInnerHTML={createMarkup()} />
			</div>
		</Layout>
	);
};

export default About;

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
		file(relativePath: { regex: "/bg/" }) {
			childImageSharp {
				fluid {
					...GatsbyImageSharpFluid_tracedSVG
				}
			}
		}
	}
`;
