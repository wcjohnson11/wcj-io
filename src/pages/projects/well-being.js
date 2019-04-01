import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout.js';

const WellBeing = ({ data, location }) => {
	const { frontmatter } = data.markdownRemark;
	const { sections } = frontmatter;
	// Create dictionary of Sections for the project
	// keys are the markdown names and values are the markdown sections
	// { name: markdown, name: markdown... }
	const sectionsDict = {};
	for (var index in sections) {
		const { name, markdown } = sections[index];
		sectionsDict[name] = markdown;
	}

	return (
		<Layout location={location}>
			<h1>{frontmatter.title}</h1>
			<small>{frontmatter.date}</small>
		</Layout>
	);
};

export default WellBeing;

export const query = graphql`
	{
		markdownRemark(frontmatter: { title: { regex: "/Well-Being/" } }) {
			frontmatter {
				date(formatString: "MMMM DD, YYYY")
				title
				sections {
					markdown
					name
				}
			}
		}
	}
`;
