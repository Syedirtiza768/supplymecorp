import React, { useState } from 'react';

import Select from 'react-select';


const SelectList = ({placeholder}) => {
    const options = [
        { value: 'op1', label: 'option1' },
        { value: 'op2', label: 'option2' },
        { value: 'op3', label: 'option3' },
    ];
    const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="">
      <Select
        placeholder={placeholder}
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,              
              primary: '#a38127',              
            },
          })}
        
        styles={{
        control: (baseStyles, state) => ({
            ...baseStyles,
            height: '50px',
            borderRadius: '6px',
            paddingLeft: '15px'
        }),
        }}        
      />
    </div>
  )
}

export default SelectList