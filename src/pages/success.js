import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import Layout from '../components/layout';

const Success = ({ data, location }) => {
	return (
		<Layout location={location}>
			<div>
				<h1>Thanks for reaching out!</h1>
				<h3>I'll be in touch soon</h3>
				<div style={{ overflow: 'hidden' }}>
					<Img fluid={data.file.childImageSharp.fluid} />
				</div>
			</div>
		</Layout>
	);
};

export default Success;

export const query = graphql`
	{
		file(relativePath: { regex: "/bg/" }) {
			childImageSharp {
				fluid {
					...GatsbyImageSharpFluid_tracedSVG
				}
			}
		}
	}
`;
