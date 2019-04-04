import React from 'react';
import chroma from 'chroma-js';
import { withTheme } from 'styled-components';

import Select from 'react-select';

const DropdownSelect = ({ currentSelection, handleChange, isMulti, options, theme }) => {
	// Custom styles for react-select
	// https://react-select.com/styles#cx-and-custom-components
	const customStyles = {
		option            : (provided, state) => ({
			...provided,
			background : state.isSelected
				? theme.colorPrimary
				: state.isFocused ? chroma(theme.colorPrimary).alpha(0.3).css() : theme.colorBackground
		}),
		control           : (provided, state) => ({
			...provided,
			background   : theme.colorBackground,
			marginBottom : theme.margin,
			borderColor  : state.isFocused ? theme.colorPrimary : theme.colorBorder,
			boxShadow    : state.isFocused ? `0 0 0 1px ${theme.colorPrimary}` : null,
			':hover'     : { borderColor: state.isFocused ? theme.colorPrimary : theme.colorBorder }
		}),
		dropdownIndicator : (provided, state) => ({
			...provided,
			color : theme.colorPrimary
		})
	};

	return (
		<Select
			value={{ label: currentSelection.label, value: currentSelection.value }}
			onChange={handleChange}
			controlShouldRenderValue={true}
			options={options}
			blurInputOnSelect={false}
			isMulti={isMulti}
			styles={customStyles}
		/>
	);
};

export default withTheme(DropdownSelect);
