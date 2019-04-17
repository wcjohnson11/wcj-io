import React, { useEffect, useRef, useState } from 'react';
import { axisLeft, axisTop, select, scaleBand } from "d3";
import { withTheme } from 'styled-components';

const height = 350;
const width = 350;
const margin = { top: 120, left: 100 };

const xValues = [
  "Economics",
  "Health Expectancy",
  "Inequality",
  "Sustainability",
  "Happiness"
];

const Heatmap = ({data, metrics}) => {
    // Define Axes Refs
    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);

    // Define Axes
    const xAxis = axisTop().tickSizeOuter(0);
    const yAxis = axisLeft().tickSizeOuter(0);

    // Extract yValues from metrics map
    const yValues = metrics.map(metric => metric.label);

    // Define Scales
    const xScale = scaleBand()
        .domain(xValues)
        .range([0, width - margin.left])
        .padding(0.1);

    const yScale = scaleBand()
        .domain(yValues)
        .range([0, height - margin.top])
        .padding(0.1);

    useEffect(()=> {
        // Apply x Scale and set text values
        xAxis.scale(xScale);
        select(xAxisRef.current)
            .call(xAxis)
            .selectAll('text')
            .attr('y', -9)
            .attr('x', 9)
            .attr('dy', '.35em')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'start')
            .style('font-size', '16px');

        // Apply y Scale and set text values
        yAxis.scale(yScale);
        select(yAxisRef.current)
          .call(this.yAxis)
          .selectAll("text")
          .text(d =>
            // Create Acronyms for Metrics, GINI gets special treatment
            acronymize(d, [{ input: "GINI Index", output: "GINI" }])
          )
          .attr("dy", ".35em")
          .style("font-size", "16px");

    },[data]);

    

    return (
      <svg
        id="heatmap"
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left} ${height + margin.top}`}
        height={height}
        width={width}
      >
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </svg>
    );
};

export default withTheme(Heatmap);
