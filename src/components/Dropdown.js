import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const Dropdown = ({ options, selectedValue, onChange, label }) => {
  return (
    <FormControl className="dropdown">
      <InputLabel>{label}</InputLabel>
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
