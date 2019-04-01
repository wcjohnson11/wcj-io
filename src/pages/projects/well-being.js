import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout.js';
import MarkdownDiv from '../../components/markdownDiv';

const WellBeing = ({ data, location }) => {
	const { fields, frontmatter } = data.markdownRemark;
	const sectionHTML = {};
	for (var field in fields) {
		sectionHTML[field] = fields[field];
	}

	return (
		<Layout location={location}>
			<h1>{frontmatter.title}</h1>
			<small>{frontmatter.date}</small>
			<MarkdownDiv content={sectionHTML['Introduction']} />
			<MarkdownDiv content={sectionHTML['Beyond_GDP']} />
			<MarkdownDiv content={sectionHTML['Conclusion']} />
		</Layout>
	);
};

export default WellBeing;

export const query = graphql`
	{
		markdownRemark(frontmatter: { title: { regex: "/Well-Being/" } }) {
			fields {
				Introduction
				Beyond_GDP
				GINI_Index
				Happy_Planet_Index
				Human_Development_Index
				Sustainable_Economic_Development_Index
				World_Happiness_Report_Score
				Conclusion
			}
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
