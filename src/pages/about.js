import React from 'react';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import Layout from '../components/layout';

const About = ({ data, location }) => (
	<Layout location={location}>
		<div>
			<h1>Hello!</h1>
			<p>I'm a Software Engineer and Analyst with a background in analysis, planning and customer relations roles in Finance and Advertising.</p>
			<p>I'm currently looking for a job! <Link to="/contact">Get in touch and we'll see if it's a good fit!</Link> </p>
			<div style={{ overflow: 'hidden' }}>
				<Img fluid={data.file.childImageSharp.fluid} />
			</div>
			<p>I like to build things with code, analyze and visualize data, and help people be more productive.</p>
		</div>
	</Layout>
);

export default About;

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
