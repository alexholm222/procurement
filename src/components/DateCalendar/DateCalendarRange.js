import { useState, useEffect, useRef } from 'react';
import s from './DateCalendar.module.scss';
import './DateCalendar.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DateRangePicker } from '@mui/x-date-pickers-pro';

function DateCalendarRange({ value, setValue, endDisabled}) {




    const theme = createTheme({
        typography: {
            fontFamily: 'Inter, sans-serif',
        }
    })


    function onChange(date) {
        console.log(date)
        setValue(date)
    };


    return (


        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <ThemeProvider theme={theme}>
                <DateRangePicker value={value} onChange={onChange} views={['day']} reduceAnimations={true} localeText={{ start: 'Начало', end: 'Конец' }} />
            </ThemeProvider>
        </LocalizationProvider>

    );
}

export default DateCalendarRange;