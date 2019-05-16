import React, { useEffect, useRef } from "react";
import {
  axisBottom,
  event,
  extent,
  geoEqualEarth,
  geoPath,
  interpolateOranges,
  scaleLinear,
  scaleSequential,
  select,
  selectAll,
  ticks
} from "d3";
import * as topojson from "topojson-client";
import styled, { withTheme } from "styled-components";
import world from "world-atlas/world/110m";

import CenteringDiv from "../centeringDiv";

const Tooltip = styled.div`
  position: absolute;
  z-index: 10;
  visibility: hidden;
  border: 3px solid ${props => props.theme.colorBorder};
  background: ${props => props.theme.colorBackground};

  p {
    margin: 0 ${props => props.theme.padding};
    padding: 0 ${props => props.theme.padding} 0 0;
  }
`;

const Title = styled.p`
  font-weight: ${props => props.theme.fontBold};
`;

const Metric = styled.p``;

const WorldMap = ({ data, metric, theme, windowWidth }) => {
  // Define Refs for D3
  const svgRef = useRef(null);
  const legendRef = useRef(null);
  const gradientRef = useRef(null);

  // Define dimensions of map on window width
  const width = windowWidth > 796 ? 796 : windowWidth - 90;
  const height = width * 0.75;

  // Create topology country objects
  const topoCountries = topojson.feature(world, world.objects.countries)
    .features;

  // Create topology mesh objects
  const topoMesh = topojson.mesh(
    world,
    world.objects.countries,
    (a, b) => a !== b
  );

  // Declare metric extent on countries that have values
  const metricExtent = extent(data, d => {
    if (d[metric.value] !== "FALSE") {
      return d[metric.value];
    }
  });

  // Define Scales
  const colorScale = scaleSequential(interpolateOranges).domain(metricExtent);
  const xScale = scaleLinear()
    .domain(extent(colorScale.domain()))
    .rangeRound([width / 2 - 120, width / 2 + 120]);

  // Declare Legend Ticks
  const legendTicks = ticks(metricExtent[0], metricExtent[1], 4);

  // Declare Legend Axis
  const legendAxis = axisBottom(xScale)
    .tickSize(13)
    .tickValues(legendTicks);

  // Declare Projection
  const projection = geoEqualEarth()
    .rotate([-10, 0])
    .fitExtent([[1, 1], [width - 1, height - 51]], { type: "Sphere" })
    .precision(0.1);

  // Declare Geography Paths
  const geographyPaths = geoPath().projection(projection);

  function getCountryColor(id, data, color, metric) {
    const matchedCountry = data.find(country => country.code === id);

    if (matchedCountry && matchedCountry[metric] !== "FALSE") {
      return color(matchedCountry[metric]);
    } else {
      return "url(#diagonalHatch)";
    }
  }

  function getCountryLabel(id, data) {
    const text = data.find(country => country.code === id);
    if (text) return text.name;
    return "Unknown";
  }

  function getMetricValue(id, data) {
    const country = data.find(country => country.code === id);

    if (country) return country[metric.value];
    return "unknown";
  }

  useEffect(() => {
    // Append legend ticks
    select(legendRef.current)
      .call(legendAxis)
      .select(".domain")
      .remove();

    // Add colors to gradient
    select("#linear-gradient")
      .selectAll("stop")
      .data(
        legendTicks.map((t, i, n) => ({
          offset: `${(100 * i) / n.length}%`,
          color: colorScale(t)
        }))
      )
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Add metric label to caption
    select(".caption").text(`${metric.label} scale`);

    // Create border
    select(svgRef.current)
      .append("path")
      .datum({ type: "Sphere" })
      .attr("fill", "theme.colorPrimary")
      .style("opacity", 0.4)
      .attr("fill-rule", "nonzero")
      .attr("stroke", theme.colorBorder)
      .attr("stroke-linejoin", "round")
      .attr("d", geographyPaths);

    // Add country features
    select(svgRef.current)
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(topoCountries)
      .enter()
      .append("path")
      .attr("stroke", 'gray')
      .attr("stroke-width", "0.5px")
      .attr("fill", d => getCountryColor(d.id, data, colorScale, metric.value))
      .attr("d", geographyPaths)
      .on("mouseover", function(d) {
        const name = getCountryLabel(d.id, data);
        const metricValue = getMetricValue(d.id, data);

        select(".tooltip")
          .style("visibility", "visible")
          .style("top", `${event.pageY + 18}px`)
          .style("left", `${event.pageX + 18}px`)
          .select("#title")
          .text(name);

        select(".tooltip #value").text(
          `${metric.label}: ${metricValue !== "FALSE" ? metricValue : "N/A"}`
        );

        selectAll(".countries path")
          .style("opacity", 0.3)
          .style("stroke", null);

        select(this)
          .style("opacity", 1)
          .style("stroke", "#222")
          .raise();

        selectAll(".mesh").style("opacity", 0);
      })
      .on("mouseout", d => {
        select(".tooltip").style("visibility", "hidden");

        selectAll(".countries path").style("opacity", 1);

        selectAll(".mesh").style("opacity", 1);
      });

    // Append Country Mesh
    select(svgRef.current)
      .append("path")
      .datum(topoMesh)
      .attr("class", "mesh")
      .attr("fill", "none")
      .attr("stroke", theme.colorBorder)
      .attr("stroke-width", "0.5px")
      .attr("stroke-linejoin", "round")
      .attr("d", geographyPaths);
  }, [metric]);

  return (
    <CenteringDiv>
      <svg height={height} width={width} ref={svgRef}>
        <defs>
          <linearGradient id="linear-gradient" ref={gradientRef} />
          <pattern
            id="diagonalHatch"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <path
              d="M-1,1 l2,-2
           M0,4 l4,-4
           M3,5 l2,-2"
              style={{ stroke: "black", strokeWidth: 1 }}
            />
          </pattern>
        </defs>
        <g ref={legendRef} transform={`translate(0, ${height - width / 9})`}>
          <rect
            height="8"
            width={
              xScale(legendTicks[legendTicks.length - 1]) -
              xScale(legendTicks[0])
            }
            x={xScale(legendTicks[0])}
            fill={`url(#linear-gradient)`}
          />
          <text
            className="caption"
            x={xScale(legendTicks[0])}
            y={-6}
            fill={theme.colorBase}
            textAnchor="start"
            fontWeight={theme.fontBold}
          />
        </g>
      </svg>
      <Tooltip className="tooltip">
        <Title id="title" />
        <Metric id="value" />
      </Tooltip>
    </CenteringDiv>
  );
};

export default withTheme(WorldMap);
