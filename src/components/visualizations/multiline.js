import React, { useState } from 'react';
import { extent, scaleLinear, scaleTime } from 'd3';

import DropdownSelect from '../dropdownSelect';

const margin = { top: 20, right: 20, bottom: 40, left: 45 };
const height= 500;
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

    // Declare x and y Scales
    const xScale = scaleTime()
        .domain(extent(filteredData, d => d.Year))
        .nice()
        .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
        .domain(extent(filteredData, d => d["GDP per capita"]))
        .nice()
        .range([height - margin.bottom, margin.top]);

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
		</div>
	);
};

export default MultiLine;
