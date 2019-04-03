import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Select from 'react-select';

import Layout from '../../components/layout.js';
import MarkdownDiv from '../../components/markdownDiv';

// Mapping of metrics to markdownRemark keys
const metrics = [
	{ label: 'GINI Index', value: 'GINI_Index' },
	{ label: 'Happy Planet Index', value: 'Happy_Planet_Index' },
	{ label: 'Human Development Index', value: 'Human_Development_Index' },
	{ label: 'Sustainable Economic Development Index', value: 'Sustainable_Economic_Development_Index' },
	{ label: 'World Happiness Report Score', value: 'World_Happiness_Report_Score' }
];

const WellBeing = ({ data, location }) => {
	// Set up component state
	const [
		metric,
		setMetric
	] = useState(metrics[0]);
	// Extract sectionHTML from markdownRemark
	const { fields, frontmatter } = data.markdownRemark;
	const sectionHTML = {};
	for (var field in fields) {
		sectionHTML[field] = fields[field];
	}

	// handle <Select> onChange for metric
	function handleMetricChange(metric){
		setMetric(metric);
	}

	return (
		<Layout location={location}>
			<h1>{frontmatter.title}</h1>
			<small>{frontmatter.date}</small>
			<MarkdownDiv content={sectionHTML['Introduction']} />
			<MarkdownDiv content={sectionHTML['Beyond_GDP']} />
			<Select
				value={{ label: metric.label, value: metric.value }}
				onChange={handleMetricChange}
				controlShouldRenderValue={true}
				options={metrics.map((metric) => {
					return {
						label : metric.label,
						value : metric.value
					};
				})}
				blurInputOnSelect={false}
				isMulti={false}
			/>
			<MarkdownDiv content={sectionHTML[metric.value]} />
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
