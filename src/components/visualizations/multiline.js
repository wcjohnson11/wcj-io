import React, { useRef, useState } from 'react';
import {
	axisBottom,
	axisLeft,
	curveCatmullRom,
	extent,
	line,
	nest,
	scaleLinear,
	scaleTime,
	select as d3Select,
	voronoi
} from 'd3';

import DropdownSelect from '../dropdownSelect';

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const height = 500;
const width = 700;
const MultiLine = ({ countryOptions, data }) => {
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

	// Get list of active countries
	const activeCountries = selected.map((d) => d.value);

	// Get filtered Data for active countries
	const filteredData = data.filter((d) => activeCountries.indexOf(d.Entity) >= 0);

	// Nest data points by country
	const nestedData = nest().key((d) => d.Entity).entries(filteredData);

	// Declare Axis Refs
	const xAxisRef = useRef(null);
	const yAxisRef = useRef(null);

	// Declare Axis
	const xAxis = axisBottom().tickSizeOuter(0);
	const yAxis = axisLeft().tickSizeOuter(0);

	// Declare x and y Scales
	const xScale = scaleTime().domain(extent(filteredData, (d) => d.Year)).nice().range([
		margin.left,
		width - margin.right
	]);
	const yScale = scaleLinear().domain(extent(filteredData, (d) => d['GDP per capita'])).nice().range([
		height - margin.bottom,
		margin.top
	]);

	// Declare line function
	const lineFn = line().curve(curveCatmullRom).x((d) => xScale(d.Year)).y((d) => yScale(d['GDP per capita']));

	// Declare voronoi function
	const voronoiFn = voronoi().x((d) => xScale(d.Year)).y((d) => yScale(d['GDP per capita'])).extent([
		[
			-margin.left,
			-margin.top
		],
		[
			width + margin.right,
			height + margin.bottom
		]
	]);

	// Handle mouseOver event
	function mouseOver(d, xScale, yScale){
		// Set color of moused over line
		selectAll('.line').attr('stroke', (el) => {
			return d.data.Entity === el.key ? 'steelblue' : '#ddd';
		});
		// Move line to top
		d.data.line.parentNode.appendChild(d.data.line);
		// Move focus into viewbox
		d3Select('.focus').attr('transform', `translate(${xScale(d.data.Year)}, ${yScale(d.data['GDP per capita'])})`);
		// Set opacity of hoverGroup to 1
		d3Select('.hoverGroup').transition().style('opacity', 1);
		// Set text styles, attributes and value
		d3Select('.hoverText')
			.style('font-size', '.9em')
			.style('text-anchor', 'middle')
			.attr('y', margin.top * 1.5)
			.text(d.data.Entity);
	}

	// Handle mouseOut event
	function mouseOut(d){
		// Turn all lines gray
		selectAll('.line').attr('stroke', '#ddd');
		// Set opacity to 0
		d3Select('.hoverGroup').transition().style('opacity', 0);
		// Set hover text value to 0
		d3Select('.hoverText').text('');
		// Move focus element out of viewbox
		d3Select('.focus').attr('transform', 'translate(-100, -100)');
	}

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
				<g className="xAxis" ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
				<g>
					<text className="xAxisTitle" />
				</g>
				<g className="yAxis" ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
				<g>
					<text className="yAxisTitle" />
				</g>
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
