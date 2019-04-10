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
import { merge } from "d3-array";

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
	const [ nestedData, setNestedData ] = useState(
        nest().key((d) => d.Entity).entries(filteredData)
    );
    console.log(nestedData, filteredData)
    // Set xScale
    const [ xScale, setXScale ] = useState(
        () => (scaleTime().domain(extent(filteredData, (d) => d.Year)).nice().range([
            margin.left,
            width - margin.right
        ]))
    );

    // Set yScale
    const [ yScale, setYScale ] = useState(
        () => (scaleLinear().domain(extent(filteredData, (d) => d['GDP per capita'])).nice().range([
            height - margin.bottom,
            margin.top
        ]))
    );

	// Declare Axis Refs
	const xAxisRef = useRef(null);
	const yAxisRef = useRef(null);

	// Declare Axis
	const xAxis = axisBottom().tickSizeOuter(0);
	const yAxis = axisLeft().tickSizeOuter(0);

    console.log('x', xScale)
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

    useEffect(() => {
        console.log(selected);

        // Declare xScale
        const xScale = scaleTime().domain(extent(filteredData, (d) => d.Year)).nice().range([
            margin.left,
            width - margin.right
        ]);
        // Apply xScale to xAxis
        xAxis.scale(xScale);
        // add axis and attributes to xAxis
        d3Select(xAxisRef.current)
            .call(xAxis)
            .selectAll('text')
            .attr('y', 3)
            .attr('x', margin.right/2)
            .attr('font-weight', 'bold')
            .attr('transform', 'rotate(45)')
            .style('text-anchor', 'start');
        // Calculate xTranslate for xAxis Title
        const xTranslate = `translate(${width - margin.left * 1 - margin.right * 1},${height -
        margin.bottom * .9})`;
        // Apply xAxis title attributes
        d3Select(".xAxisTitle")
            .attr("text-anchor", "end")
            .style("font-size",".8em")
            .style("font-weight", 600)
            .attr("transform", xTranslate)
            .text("Years");

        // Declare yScale
        const yScale = scaleLinear().domain(extent(filteredData, (d) => d['GDP per capita'])).nice().range([
            height - margin.bottom,
            margin.top
        ]);
        // Apply yScale to yAxis
        yAxis.scale(yScale);
        // add axis and attributes to yAxis
        d3Select(yAxisRef.current)
            .call(yAxis)
            .selectAll("text")
            .attr("dy", ".35em")
            .attr("font-weight", "bold");
        // calculate yTranslate for yAxis title
        const yTranslate = `translate(${margin.left * 2.3 + margin.right * 2.3}, ${margin.top * .5})`;
        // Apply yAxis title attributes
        d3Select(".yAxisTitle")
            .attr("text-anchor", "end")
            .style("font-size",".8em")
            .style("font-weight", 600)
            .attr("transform", yTranslate)
            .text("Adjusted GDP Per Capita");

        // Add data and G for each country
        const country = d3Select("#multiLine")
            .selectAll(".country")
            .data(nestedData, d => d.key)
            .join("g")
            .attr("class", "country")
            .attr("fill", "none")
            .attr("stroke", "#ddd")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round");

        // Add country line paths to each country
        country
            .append("path")
            .attr("class", "line")
            .style("mix-blend-mode", "multiply")
            .attr("d", function(d) {
                d.values.forEach(country => {
                country.line = this;
                return country;
                });
                return lineFn(d.values);
            });
        
        // Add text label for each line path
        country
            .append("text")
            .datum(d => {
                return {
                name: d.key,
                value: d.values[d.values.length - 1]
                };
            })
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

        const hoverGroup = d3Select("#multiLine")
            .append("g")
            .attr("class", "hoverGroup")
            .style("opacity", 1)
            .style("stroke-width", 1)
            .style("stroke", "gray");

        hoverGroup
            .append("text")
            .attr("class", "hoverText")
            .attr("x", width / 2)
            .attr("y", margin.top);

        // Add Voronoi paths for handling mouse events
        // Uncomment stroke to show voronoi
        // d3Select(".voronoi")
        //     .selectAll("path")
        //     .data(voronoiFn.polygons(merge(nestedData.map(d => d.values))))
        //     .enter()
        //     .append("path")
        //     .classed("voronoi-path", true)
        //     .style("pointer-events", "all")
        //     .attr("d", d => (d ? "M" + d.join("L") + "Z" : null))
        //     //   .attr("stroke", "red")
        //     // .attr("stroke-width", "0.2")
        //     .attr("fill", "none")
        //     .on("mouseover", d => this.mouseover(d, xScale, yScale))
        //     .on("mouseout", d => this.mouseout(d));
    }, [selected])

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
