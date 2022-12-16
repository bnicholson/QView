import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function SortFilterMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const label = { inputProps: { 'aria-label': 'All' } };
  const labelA = { inputProps: { 'aria-label': 'Local-Experienced' } };
  const labelB = { inputProps: { 'aria-label': 'Local-Novice' } };
  const labelC = { inputProps: { 'aria-label': 'District-Experienced' } };
  const labelD = { inputProps: { 'aria-label': 'Checkbox Demo' } };

  return (
    <div>
       <Button 
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <KeyboardArrowDownIcon/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Sort Ascending</MenuItem>
        <MenuItem onClick={handleClose}>Sort Descending</MenuItem>
        <MenuItem onClick={handleClose}><Checkbox {...label} defaultChecked />All</MenuItem>
        <MenuItem onClick={handleClose}><Checkbox {...labelA} defaultChecked />Local-Experienced</MenuItem>
        <MenuItem onClick={handleClose}><Checkbox {...labelB} defaultChecked />Local-Novice</MenuItem>
        <MenuItem onClick={handleClose}><Checkbox {...labelC} defaultChecked />District-Experienced</MenuItem>
        <MenuItem onClick={handleClose}><Checkbox {...labelD} defaultChecked />District-Novice</MenuItem>
      </Menu>
    </div>
  );
}
