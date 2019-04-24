import React, { useState } from "react";
import { graphql } from "gatsby";
import { set, timeParse } from "d3";
import useWindowSize from "../../utils/useWindowSize";

import Layout from "../../components/layout";
import MarkdownDiv from "../../components/markdownDiv";
import MultiLine from "../../components/visualizations/multiline";
import Heatmap from "../../components/visualizations/heatmap";
import DropdownSelect from "../../components/dropdownSelect";
import WorldMap from "../../components/visualizations/WorldMap";

// Mapping of metrics to markdownRemark keys
const metrics = [
  { label: "GINI Index", value: "GINI_Index" },
  { label: "Happy Planet Index", value: "Happy_Planet_Index" },
  { label: "Human Development Index", value: "Human_Development_Index" },
  {
    label: "Sustainable Economic Development Index",
    value: "Sustainable_Economic_Development_Index"
  },
  {
    label: "World Happiness Report Score",
    value: "World_Happiness_Report_Score"
  }
];

const cleanNumbers = string => {
  return parseFloat(string.replace(/,/g, ""));
};
const parseTime = timeParse("%Y");

const WellBeing = ({ data, location }) => {
  // Set up component state
  const [metric, setMetric] = useState(metrics[0]);

  // Get window size for responsive charts
  const windowSize = useWindowSize();

  // Extract sectionHTML from markdownRemark
  const { fields, frontmatter } = data.markdownRemark;
  const sectionHTML = {};
  for (var field in fields) {
    sectionHTML[field] = fields[field];
  }

  // Extract gdp data from allGdpovertimeCsv for multiline chart
  const { edges } = data.allGdpovertimeCsv;
  const multilineNodes = edges.map(({ node }) => {
    return {
      Entity: node.Entity,
      Code: node.Code,
      Year: parseTime(node.Year),
      "GDP per capita": cleanNumbers(node["GDP_per_capita"])
    };
  });
  // Get list of countries from allGdpovertimeCSV for multiline dropdown
  const countryOptions = set(multilineNodes.map(d => d.Entity)).values();

  // Get Happiness data from allHappy2CSV
  const happinessData = data.allHappy2Csv.nodes;

  // handle <Select> onChange for metric
  function handleMetricChange(metric) {
    setMetric(metric);
  }

  return (
    <Layout location={location}>
      <h1>{frontmatter.title}</h1>
      <small>{frontmatter.date}</small>
      <MarkdownDiv content={sectionHTML["Introduction"]} />
      <MultiLine
        countryOptions={countryOptions}
        data={multilineNodes}
        windowWidth={windowSize.width}
      />
      <MarkdownDiv content={sectionHTML["Beyond_GDP"]} />
      <Heatmap metrics={metrics} />
      <DropdownSelect
        currentSelection={metric}
        options={metrics}
        handleChange={handleMetricChange}
        isMulti={false}
      />
      <MarkdownDiv content={sectionHTML[metric.value]} />
      <WorldMap data={happinessData} metric={metric} windowWidth={windowSize.width} />
      <MarkdownDiv content={sectionHTML["Conclusion"]} />
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
    allGdpovertimeCsv {
      edges {
        node {
          Entity
          Code
          Year
          GDP_per_capita
        }
      }
    }
    allHappy2Csv(skip: 9) {
      nodes {
        name
        GINI_Index
        World_Happiness_Report_Score
        Sustainable_Economic_Development_Index
        Happy_Planet_Index
        Human_Development_Index
      }
    }
  }
`;
