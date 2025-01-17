import React from 'react';

const Dropdown = ({ options, selectedValue, onChange }) => {
  return (
    <select value={selectedValue} onChange={onChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
