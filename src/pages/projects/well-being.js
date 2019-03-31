import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout.js';

const WellBeing = ({ data, location }) => {
	console.log(data)
	const { frontmatter, html } = data.markdownRemark;
	return (
		<Layout location={location}>
			<h1>{frontmatter.title}</h1>
		</Layout>
	)
};

export default WellBeing;

export const query = graphql`
	{
		markdownRemark(frontmatter: { title: { regex: "/Well-Being/" } }) {
			html
			frontmatter {
				date(formatString: "MMMM DD, YYYY")
				title
			}
		}
	}
`;
