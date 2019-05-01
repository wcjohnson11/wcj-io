import React, { useEffect, useRef } from "react";
import {
  axisBottom,
  extent,
  geoEqualEarth,
  geoPath,
  interpolateOranges,
  scaleLinear,
  scaleSequential,
  select,
  ticks
} from "d3";
import * as topojson from "topojson-client";
import { withTheme } from "styled-components";
import world from "world-atlas/world/110m";

import CenteringDiv from "../centeringDiv";

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
      .attr("fill", theme.colorPrimary)
      .attr("fill-rule", "nonzero")
      .attr("stroke", theme.colorBorder)
      .attr("stroke-linejoin", "round")
      .attr("d", geographyPaths);

    // Add country features
    const features = select(svgRef.current)
      .append("g")
      .selectAll("path")
      .data(topoCountries)
      .enter()
      .append("path")
      .attr("fill", d => getCountryColor(d.id, data, colorScale, metric.value))
      .attr("d", geographyPaths);

    // Append country text labels
    features.append("rect");
    features.append("title").text(d => getCountryLabel(d.id, data));

    // Append Country Mesh
    select(svgRef.current)
      .append("path")
      .datum(topoMesh)
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
    </CenteringDiv>
  );
};

export default withTheme(WorldMap);
