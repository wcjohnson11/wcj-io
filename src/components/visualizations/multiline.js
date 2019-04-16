import React, { useEffect, useRef, useState } from 'react';
import {
	axisBottom,
	axisLeft,
	curveCatmullRom,
	extent,
	line,
	merge,
	nest,
	scaleLinear,
	scaleTime,
	select as d3Select,
	selectAll,
	voronoi
} from 'd3';
import wrapSVGText from '../../utils/wrapSVGText';
import styled, { withTheme } from 'styled-components';

import DropdownSelect from '../dropdownSelect';

const FullWidthDiv = styled.div`
	width: 100vw;
	position: relative;
	left: 50%;
	right: 50%;
	margin-left: -50vw;
	margin-right: -50vw;
`;

const margin = { top: 20, right: 50, bottom: 50, left: 40 };
const height = 500;
const MultiLine = ({ countryOptions, data, theme, windowWidth }) => {
	// Initial Selected State
	const [
		selected,
		setSelected
	] = useState([
		{ label: 'United States', value: 'United States' },
		{ label: 'United Kingdom', value: 'United Kingdom' },
		{ label: 'Japan', value: 'Japan' },
		{ label: 'India', value: 'India' },
		{ label: 'China', value: 'China' },
		{ label: 'Germany', value: 'Germany' },
		{ label: 'Costa Rica', value: 'Costa Rica' }
	]);

	// Get list of active countries
	const activeCountries = selected.map((d) => d.value);

	// Get array of filtered data
	const filteredData = data.filter(
		(d) => activeCountries.indexOf(d.Entity) >= 0
	);

	// Get data in array of objects, keyed by country name
	const nestedData = nest().key((d) => d.Entity).entries(filteredData);

	const width = windowWidth > 880 ? 880 : windowWidth;

	// Set xScale
	const xScale = scaleTime()
		.domain(extent(filteredData, (d) => d.Year))
		.nice()
		.range([
			margin.left,
			width - margin.right
		]);

	// Set yScale
	const yScale = scaleLinear()
		.domain(
			extent(filteredData, (d) => {
				return d['GDP per capita'];
			})
		)
		.nice()
		.range([
			height - margin.bottom,
			margin.top
		]);

	// Declare Axis Refs
	const xAxisRef = useRef(null);
	const yAxisRef = useRef(null);

	// Declare Axis
	const xAxis = axisBottom().tickSizeOuter(0);
	const yAxis = axisLeft().tickSizeOuter(0);

	// Declare line function
	const lineFn = line()
		.curve(curveCatmullRom)
		.x((d) => xScale(d.Year))
		.y((d) => yScale(d['GDP per capita']));

	// Declare voronoi function
	const voronoiFn = voronoi()
		.x((d) => xScale(d.Year))
		.y((d) => yScale(d['GDP per capita']))
		.extent([
			[
				-margin.left,
				-margin.top
			],
			[
				width + margin.right,
				height + margin.bottom
			]
		]);

	// array of options for dropdown
	const dropdownCountryOptions = countryOptions.map((country) => {
		return { label: country, value: country };
	});

	// Handle mouseOver event
	function mouseOver(d, xScale, yScale){
		// Set color of moused over line
		selectAll('.line').attr('stroke', (el) => {
			return d.data.Entity === el.key ? theme.colorPrimary : '#ddd';
		});
		// Move line to top
		d.data.line.parentNode.appendChild(d.data.line);
		// Move focus into viewbox
		d3Select('.focus')
			.attr(
				'transform',
				`translate(${xScale(d.data.Year)}, ${yScale(
					d.data['GDP per capita']
				)})`
			)
			.selectAll(line)
			.attr('stroke-dasharray', '3 3')
			.attr('stroke-width', '1.5px');

		d3Select('.focus')
			.select('line.xFocusLine')
			.attr('stroke-dasharray', '3 3')
			.attr('stroke-width', '1.5px')
			.attr('x1', 0)
			.attr('x2', margin.right - xScale(d.data.Year))
			.attr('y1', 0)
			.attr('y2', 0);
		d3Select('.focus')
			.select('line.yFocusLine')
			.attr('stroke-dasharray', '3 3')
			.attr('stroke-width', '1.5px')
			.attr('x1', 0)
			.attr('x2', 0)
			.attr('y1', 0)
			.attr(
				'y2',
				height - yScale(d.data['GDP per capita']) - margin.bottom
			);

		// Set opacity of hoverGroup to 1
		d3Select('.hoverGroup').style('opacity', 1);
		// Set text styles, attributes and value
		d3Select('.hoverText')
			.style('stroke', theme.colorPrimary)
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
		d3Select('.hoverGroup').style('opacity', 0);
		// Set hover text value to 0
		d3Select('.hoverText').text('');
		// Move focus element out of viewbox
		d3Select('.focus').attr('transform', 'translate(-100, -100)');
	}

	// Handle SelectionChange and update selected state
	function handleSelectionChange(selections){
		setSelected(selections);
	}

	useEffect(
		() => {
			// Apply xScale to xAxis
			xAxis.scale(xScale);

			// add axis and attributes to xAxis
			d3Select(xAxisRef.current)
				.transition()
				.duration(750)
				.call(xAxis)
				.selectAll('text')
				.attr('y', 10)
				.attr('dy', ' 0.35em')
				.attr('x', 10)
				.attr('font-weight', 'bold')
				.attr('transform', 'rotate(45)')
				.style('text-anchor', 'start');

			// Apply yScale to yAxis
			yAxis.scale(yScale);

			// add axis and attributes to yAxis
			d3Select(yAxisRef.current)
				.transition()
				.duration(750)
				// Remove tick for 0 value
				.call(
					yAxis.ticks().tickFormat((d) => {
						if (d) return d;
					})
				)
				.selectAll('text')
				.attr('dy', '.35em')
				.attr('font-weight', 'bold');

			// Apply yAxis title attributes
			d3Select('.yAxisTitle')
				.attr('text-anchor', 'start')
				.style('font-size', '1em')
				.style('fill', 'black')
				.style('font-weight', 700)
				.attr('transform', `translate(0, ${margin.top / 2})`)
				.text('Adjusted GDP Per Capita');

			// Bind data to countries and handle enter, update, exit
			const countriesWithData = d3Select('#multiline')
				.selectAll('.country')
				.data(nestedData, (d) => d.key)
				.join(
					(enter) => {
						enter = enter
							.append('g')
							.attr('class', 'country')
							.attr('fill', 'none')
							.attr('stroke', '#ddd')
							.attr('stroke-width', 1.5)
							.attr('stroke-linejoin', 'round')
							.attr('stroke-linecap', 'round');
						enter.append('path');
						enter.append('text');
						return enter;
					},
					(update) => update,
					(exit) =>
						exit
							.attr('class', 'exit')
							.attr('opacity', 1)
							.call((exit) =>
								exit
									.transition(
										d3Select('#multiline')
											.transition()
											.duration(500)
									)
									.attr('opacity', 0)
									.remove()
							)
				);

			// update paths post merge
			countriesWithData
				.select('path')
				.attr('class', 'line')
				.style('mix-blend-mode', 'multiply')
				.transition()
				.duration(750)
				.attr('d', function(d){
					d.values.forEach((country) => {
						country.line = this;
						return country;
					});
					return lineFn(d.values);
				});

			//  update text post merge
			countriesWithData
				.select('text')
				.datum((d) => {
					return {
						name  : d.key,
						value : d.values[d.values.length - 1]
					};
				})
				.attr('class', 'countryLabels')
				.attr('x', 3)
				.attr('class', 'labels')
				.attr('dy', '.35em')
				.attr('fill', 'black')
				.attr('stroke-width', 0)
				.style('font-size', '10px')
				.style('font-style', 'sans-serif')
				.style('font-weight', 'normal')
				.text((d) => d.name)
				.call(wrapSVGText, margin.right)
				.transition()
				.duration(750)
				.attr('transform', (d) => {
					const yValue = yScale(d.value['GDP per capita']);
					const xValue = xScale(d.value.Year);
					return `translate(${xValue}, ${yValue})`;
				});

			// Add hover group
			const hoverGroup = d3Select('#multiline')
				.append('g')
				.attr('class', 'hoverGroup')
				.style('opacity', 1)
				.style('stroke-width', 1)
				.style('stroke', 'gray');

			// add text to hover group
			hoverGroup
				.append('text')
				.attr('class', 'hoverText')
				.attr('x', width / 2)
				.attr('y', margin.top);

			// Create and update voronoi to handle mouseover
			// Uncomment stroke to show voronoi
			d3Select('.voronoi')
				.selectAll('path')
				.data(
					voronoiFn.polygons(merge(nestedData.map((d) => d.values)))
				)
				.join(
					(enter) =>
						enter
							.append('path')
							.classed('voronoi-path', true)
							.style('pointer-events', 'all')
							.attr(
								'd',
								(d) => (d ? 'M' + d.join('L') + 'Z' : null)
							)
							// Uncomment to see voronoi
							// .attr('stroke', 'red')
							// .attr('stroke-width', '0.2')
							.attr('fill', 'none')
							.on('mouseover', (d) =>
								mouseOver(d, xScale, yScale)
							)
							.on('mouseout', (d) => mouseOut(d)),
					(update) =>
						update
							.on('mouseover', (d) =>
								mouseOver(d, xScale, yScale)
							)
							.call((update) =>
								update
									.transition(
										d3Select('#multiline')
											.transition()
											.duration(500)
									)
									.attr(
										'd',
										(d) =>
											d ? 'M' + d.join('L') + 'Z' : null
									)
							),
					(exit) => exit.remove()
				);
		},
		[
			selected
		]
	);

	return (
		<FullWidthDiv>
			<DropdownSelect
				currentSelection={selected}
				options={dropdownCountryOptions}
				handleChange={handleSelectionChange}
				isMulti={true}
			/>
			<svg
				className="multiline"
				id="multiline"
				height={height}
				width={width}
			>
				<g
					className="xAxis"
					ref={xAxisRef}
					transform={`translate(0, ${height - margin.bottom})`}
				>
					<text className="xAxisTitle" />
				</g>
				<g
					className="yAxis"
					ref={yAxisRef}
					transform={`translate(${margin.left}, 0)`}
				>
					<text className="yAxisTitle" />
				</g>

				<g className="focus" transform={`translate(-100, -100)`}>
					<circle r={3.5} fill={theme.colorPrimary} />
					<line
						className={'xFocusLine'}
						fill="none"
						stroke={theme.colorPrimary}
					/>
					<line
						className={'yFocusLine'}
						fill="none"
						stroke={theme.colorPrimary}
					/>
				</g>
				<g className="voronoi" fill="none" />
			</svg>
		</FullWidthDiv>
	);
};

export default withTheme(MultiLine);
