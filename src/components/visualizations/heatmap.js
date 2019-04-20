import React, { useEffect, useRef } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { axisLeft, axisTop, select, scaleBand } from "d3";
import styled, { withTheme } from "styled-components";
import acronymize from "../../utils/acronymize";

const height = 375;
const width = 375;
const margin = { top: 135, left: 135 };

const ContainerDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const Heatmap = ({ theme, metrics }) => {
  const { allHappy2Csv } = useStaticQuery(graphql`
    query HeatmapQuery {
      allHappy2Csv(
        filter: {
          name: {
            in: [
              "Economics"
              "Health/Life Expectancy"
              "Inequality"
              "Sustainability"
              "Reported Happiness"
            ]
          }
        }
      ) {
        nodes {
          GINI_Index
          World_Happiness_Report_Score
          Sustainable_Economic_Development_Index
          Happy_Planet_Index
          Human_Development_Index
          name
        }
      }
    }
  `);

  // Define Axes Refs
  const heatmapRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  // Define Axes
  const xAxis = axisTop().tickSizeOuter(0);
  const yAxis = axisLeft().tickSizeOuter(0);

  // Extract xValues from StaticQuery data
  const xValues = allHappy2Csv.nodes.map(node => node.name);

  // Extract yValues from metrics map
  const yValues = metrics.map(metric => metric.value);

  // Define Scales
  const xScale = scaleBand()
    .domain(xValues)
    .range([0, width - margin.left])
    .padding(0.1);

  const yScale = scaleBand()
    .domain(yValues)
    .range([0, height - margin.top])
    .padding(0.1);

  useEffect(() => {
    // Apply x Scale and set text values
    xAxis.scale(xScale);
    select(xAxisRef.current)
      .call(xAxis)
      .selectAll("text")
      .attr("y", -9)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "start")
      .style("font-size", "16px");

    // Apply y Scale and set text values
    yAxis.scale(yScale);
    select(yAxisRef.current)
      .call(yAxis)
      .selectAll("text")
      .text(d =>
        // Create Acronyms for Metrics, GINI gets special treatment
        acronymize(
          d,
          [
            {
              input: "GINI_Index",
              output: "GINI"
            }
          ],
          "_"
        )
      )
      .attr("dy", ".35em")
      .style("font-size", "16px");

    // Add X Gridlines
    select("#heatmap")
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${height - margin.top})`)
      .attr("fill", theme.colorBorder)
      .call(
        axisTop(xScale)
          .ticks(xScale.domain().length)
          .tickSize(height - margin.top)
          .tickFormat("")
      );

    // add Y Gridlines
    select(heatmapRef.current)
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${width - margin.left}, 0)`)
      .attr("fill", theme.colorBorder)
      .call(
        axisLeft(yScale)
          .ticks(yScale.domain().length)
          .tickSize(width - margin.left)
          .tickFormat("")
      );

    // Create rects for data
    const rects = allHappy2Csv.nodes.reduce((result, node) => {
      const xValue = node.name;
      for (var key in node) {
        if (key !== "name") {
          result.push({
            x: xScale(xValue),
            y: yScale(key),
            width: xScale.bandwidth(),
            height: yScale.bandwidth(),
            fill: node[key] === "TRUE" ? theme.colorPrimary : "transparent"
          });
        }
      }
      return result;
    }, []);

    // Mount rects and set attr
    select("#heatmap")
      .selectAll("rect")
      .data(rects)
      .enter()
      .append("rect")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .attr("fill", d => d.fill);
  }, []);

  return (
    <ContainerDiv>
      <svg
        id="heatmap"
        ref={heatmapRef}
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left} ${height + margin.top}`}
        height={height}
        width={width}
      >
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </svg>
    </ContainerDiv>
  );
};

export default withTheme(Heatmap);
