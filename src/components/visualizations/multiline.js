import React, { useEffect, useRef, useState } from 'react';
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
	selectAll,
	voronoi
} from 'd3';
import { merge } from 'd3-array';

import DropdownSelect from '../dropdownSelect';

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const height = 500;
const width = 700;
const MultiLine = ({ countryOptions, data }) => {
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
		{ label: 'France', value: 'France' }
	]);
	// Get list of active countries
    const activeCountries = selected.map((d) => d.value);

	// Get array of filtered data
	const filteredData = data.filter((d) => activeCountries.indexOf(d.Entity) >= 0);

	// Get data in array of objects, keyed by country name
	const nestedData = nest()
        .key((d) => d.Entity)
        .entries(filteredData);

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
    const dropdownCountryOptions = countryOptions.map(country => {
        return { label: country, value: country}
    });

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

	useEffect(
		() => {
			// Apply xScale to xAxis
			xAxis.scale(xScale);
			// add axis and attributes to xAxis
			d3Select(xAxisRef.current)
                .transition()
                .duration(200)
				.call(xAxis)
				.selectAll('text')
				.attr('y', 3)
				.attr('x', margin.right / 2)
				.attr('font-weight', 'bold')
				.attr('transform', 'rotate(45)')
				.style('text-anchor', 'start');

			// Calculate xTranslate for xAxis Title
			const xTranslate = `translate(${width - margin.left},${height - margin.bottom})`;
			// Apply xAxis title attributes
			d3Select('.xAxisTitle')
				.attr('text-anchor', 'end')
				.style('font-size', '.8em')
				.style('font-weight', 600)
				.attr('transform', xTranslate)
				.text('Years');

			// Apply yScale to yAxis
			yAxis.scale(yScale);
			// add axis and attributes to yAxis
			d3Select(yAxisRef.current)
                .transition()
                .duration(200)
                .call(yAxis)
                .selectAll('text')
                .attr('dy', '.35em')
                .attr('font-weight', 'bold');
			// calculate yTranslate for yAxis title
			const yTranslate = `translate(${margin.left * 2.3 + margin.right * 2.3}, ${margin.top * 0.5})`;
			// Apply yAxis title attributes
			d3Select('.yAxisTitle')
				.attr('text-anchor', 'end')
				.style('font-size', '.8em')
				.style('font-weight', 600)
				.attr('transform', yTranslate)
				.text('Adjusted GDP Per Capita');

            // Bind data to countries
            const countriesWithData = d3Select('#multiline')
                .selectAll('.country')
                .data(nestedData, d => d.key)

            // handle exit and remove
            countriesWithData
                .exit()
                .attr("class", "exit")
                .attr("opacity", 1)
                .transition(200)
                .attr("opacity", 0)
                .remove();

            // Handle update
            const countriesWithUpdate = countriesWithData
                .enter()
                .append('g')
				.attr('class', 'country')
				.attr('fill', 'none')
				.attr('stroke', '#ddd')
				.attr('stroke-width', 1.5)
				.attr('stroke-linejoin', 'round')
				.attr('stroke-linecap', 'round');

            // append path and text
            countriesWithUpdate.append('path')
            countriesWithUpdate.append('text')

            // merge country g values (existing and updating)
            countriesWithData
                .merge(countriesWithUpdate)
                .select("g")
                .attr("class", "country")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round");

            // Merge paths and draw
            countriesWithData
                .merge(countriesWithUpdate)
                .select("path")
                .transition()
                .attr("class", "line")
                .style("mix-blend-mode", "multiply")
                .attr("d", function(d) {
                    d.values.forEach(country => {
                    country.line = this;
                    return country;
                    });
                    return lineFn(d.values);
                });

            // merge text and add text
            countriesWithData
                .merge(countriesWithUpdate)
                .select("text")
                .datum(d => {
                    return {
                    name: d.key,
                    value: d.values[d.values.length - 1]
                    };
                })
                .transition()
                .attr("transform", d => {
                    const yValue = yScale(d.value["GDP per capita"]);
                    const xValue = xScale(d.value.Year);
                    return `translate(${xValue}, ${yValue})`;
                })
                .attr("x", 3)
                .attr("dy", ".35em")
                .attr("fill", "black")
                .attr("stroke-width", 0)
                .style("font-size", "10px")
                .style("font-style", "sans-serif")
                .style("font-weight", "normal")
                .text(d => d.name);

            // Add text for hover info
			const hoverGroup = d3Select('#multiline')
				.append('g')
				.attr('class', 'hoverGroup')
				.style('opacity', 1)
				.style('stroke-width', 1)
				.style('stroke', 'gray');

			hoverGroup.append('text').attr('class', 'hoverText').attr('x', width / 2).attr('y', margin.top);

            // Clean up existing voronoi
            selectAll('.voronoi-path').remove()
            
			// Add Voronoi paths for handling mouse events
			// Uncomment stroke to show voronoi
			d3Select(".voronoi")
			    .selectAll("path")
			    .data(voronoiFn.polygons(merge(nestedData.map(d => d.values))))
			    .enter()
			    .append("path")
			    .classed("voronoi-path", true)
			    .style("pointer-events", "all")
			    .attr("d", d => (d ? "M" + d.join("L") + "Z" : null))
			    .attr("stroke", "red")
			    .attr("stroke-width", "0.2")
			    .attr("fill", "none")
			    .on("mouseover", d => mouseOver(d, xScale, yScale))
			    .on("mouseout", d => mouseOut(d));
		},
		[
			selected
		]
	);

	return (
		<div>
			<h1>Multiline</h1>
			<DropdownSelect
				currentSelection={selected}
				options={dropdownCountryOptions}
				handleChange={handleSelectionChange}
				isMulti={true}
			/>
			<svg className="multiline" id="multiline" height={height} width={width}>
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
