
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Filter(props) {
 const {filter,handleChange} = props
  return (
    <Box sx={{ minWidth: 120,maxWidth:{xs:'100%',sm:200} }}>
        
      <FormControl fullWidth>
        <InputLabel id="filter">Filter By Status</InputLabel>
        <Select
          labelId="filter"
          id="filter"
          value={filter}
          label="Filter By Status"
          onChange={handleChange}
        >
          <MenuItem value={'all'}>All</MenuItem>
          <MenuItem value={'pending'}>Pending</MenuItem>
          <MenuItem value={'approve'}>Approve</MenuItem>
          <MenuItem value={'reject'}>Reject</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
