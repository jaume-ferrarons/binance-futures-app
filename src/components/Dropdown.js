import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const Dropdown = ({ options, selectedValue, onChange }) => {
  return (
    <FormControl className="dropdown">
      <InputLabel>Options</InputLabel>
      <Select value={selectedValue} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
