import React from 'react';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import Layout from '../components/layout';

const About = ({ data, location }) => (
	<Layout location={location}>
		<div>
			<h1>Hello!</h1>
			<p>I'm a Software Engineer and Data Analyst with a background in analysis, planning and customer relations roles in Finance and Advertising. I like to build things with code, analyze and visualize data, and help people be more productive. I transitioned into tech 5 years ago and have done web development and iOS programming bootcamps and worked at startups, nonprofits and as a freelance software developer building websites, adding additional functionality to existing websites, developing ETL tools and consulting on analytics implementations.</p>
			<p>I'm currently available for freelance projects and am looking for a new fulltime job! <Link to="/contact">Get in touch and we'll see if it's a good fit!</Link> </p>
			<div style={{ overflow: 'hidden' }}>
				<Img fluid={data.file.childImageSharp.fluid} />
			</div>
		</div>
	</Layout>
);

export default About;

export const query = graphql`
	{
		file(relativePath: { regex: "/bg4/" }) {
			childImageSharp {
				fluid {
					...GatsbyImageSharpFluid_tracedSVG
				}
			}
		}
	}
`;
