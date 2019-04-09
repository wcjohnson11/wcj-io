import React, { useRef, useState } from 'react';
import { extent, line, nest, scaleLinear, scaleTime } from 'd3';

import DropdownSelect from '../dropdownSelect';

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const height= 500;
const width = 700;
const MultiLine = ({ countryOptions, data }) => {
	// Get list of active countries
	const activeCountries = selected.map((d) => d.value);

	// Get filtered Data for active countries
	const filteredData = data.filter((d) => activeCountries.indexOf(d.Entity) >= 0);
	
    const [
		selected,
		setSelected
	] = useState([
		{ label: 'United States', value: 'United States' },
		{ label: 'England', value: 'England' },
		{ label: 'Japan', value: 'Japan' },
		{ label: 'India', value: 'India' },
		{ label: 'China', value: 'China' },
		{ label: 'Germany', value: 'Germany' },
		{ label: 'France', value: 'France' }
	]);
    // Declare Axis Refs
    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);

    // Declare Axis
    const xAxis = axisBottom().tickOuterSize(0);
    const yAxis = axisLeft().tickOuterSize(0);

    // Declare x and y Scales
    const xScale = scaleTime()
        .domain(extent(filteredData, d => d.Year))
        .nice()
        .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
        .domain(extent(filteredData, d => d["GDP per capita"]))
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Declare line function
    const lineFn = line()
        .curve(curveCatMullRom)
        .x(d => xScale(d.Year))
        .y(d => yScale(d["GDP per capita"]))

    // Declare voronoi function
    const voronoiFn = voronoi()
        .x(d => xScale(d.Year))
        .y(d => yScale(d["GDP per capita"]))
        .extent([
            [-margin.left, -margin.top],
            [width + margin.right, height + margin.bottom]
        ]);

    // Handle SelectionChange and update selected state
	function handleSelectionChange(selections){
		setSelected(selections);
	}

	return (
		<div>
			<h1>Multiline</h1>
			<DropdownSelect
				currentSelection={selected}
				options={countryOptions}
				handleChange={handleSelectionChange}
				isMulti={true}
			/>
            <svg className="multilineSvg" id="multiline" height={height} width={width}>
                <g
                    className="xAxis"
                    ref={xAxisref}
                    transform={`translate(0, ${height - margin.bottom})`}
                />
                <g><text className="xAxisTitle"></text></g>
                <g
                    className="yAxis"
                    ref={yAxisRef}
                    transform={`translate(${margin.left}, 0)`}
                />
                <g><text className="yAxisTitle"></text></g>
                <g className="focus" transform={`translate(-100, -100)`}>
                    <circle r={3.5} />
                    <text y={-10} />
                </g>
                <g className="voronoi" fill="none" />
            </svg>
		</div>
	);
};

export default MultiLine;
