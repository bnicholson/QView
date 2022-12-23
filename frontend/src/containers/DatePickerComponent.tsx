import * as React from 'react';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

interface Props {
  initialDay?: Dayjs | null;
  label: React.ReactNode
  setDay: (newValue: Dayjs | null) => void
}

export const DatePickerComponent = (props: Props) => {
  const { initialDay, label, setDay } = props;
  const [value, setValue] = React.useState<Dayjs | null>(initialDay ? initialDay : null);
  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    setDay(newValue);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        inputFormat="MM/DD/YYYY"
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
