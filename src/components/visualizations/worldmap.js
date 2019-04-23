import React, { useRef } from "react";
import { axisBottom, extent, geoEqualEarth, geoPath, interpolateOranges, scaleLinear, scaleSequential, select, selectAll, ticks } from 'd3';
import * as topojson from 'topojson-client';
import { withTheme } from "styled-components";
import world from 'world-atlas/world/110m';

const WorldMap = ({ data, theme, windowWidth }) => {
  // Define Refs for D3
  const svgRef = useRef(null);
  const legendRef = useRef(null);
  const gradientRef = useRef(null);

  // Define dimensions of map on window width
  const width = windowWidth;
  const height = windowWidth * 0.75;

  // Create topology country objects
  const topoCountries = topojson.feature(world, world.objects.countries).features;

  // Create topology mesh objects
  const topoMesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

  // Define Scales
  // const colorScale = scaleSequential(interpolateOranges).domain(extent)

  return (
    <svg height={height} width={width} ref={svgRef}>
      <defs>
        <linearGradient id="linear-gradient" ref={gradientRef} />
      </defs>
      <g ref={legendRef} transform={`translate(0, ${height - width / 9})`}>
        <rect />
        <text className="caption" fill={theme.colorPrimary} />
      </g>
    </svg>
  );
};

export default withTheme(WorldMap);
