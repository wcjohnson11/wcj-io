import React, { useRef } from "react";
import { withTheme } from "styled-components";
import world from 'world-atlas/world/110m';

const height = 500;
const width = 700;
const WorldMap = ({ theme }) => {
  const svgRef = useRef(null);
  const legendRef = useRef(null);
  const gradientRef = useRef(null)

  return (
    <svg ref={svgRef}>
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
