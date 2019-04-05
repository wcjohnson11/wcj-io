import React, { useState } from 'react';

import DropdownSelect from '../dropdownSelect';

const MultiLine = ({ countryOptions }) => {
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
