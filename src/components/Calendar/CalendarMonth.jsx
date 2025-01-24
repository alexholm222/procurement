import s from './CalendarMonth.module.scss';
import { ReactComponent as IconCalendar } from '../../image/icon/iconCalendar.svg';
import { ReactComponent as ArrowLeft } from '../../image/icon/arrowLeft.svg';
import { setDateForCalendarMonth } from '../../utils/date';
import { useEffect, useState } from 'react';


function CalendarMonth({ isSkilla, setDateStart, setDateEnd }) {
    const [month, setMonth] = useState(0);
    const [date, setDate] = useState('');

    useEffect(() => {
        const date = setDateForCalendarMonth(month);
        setDateStart(date.dateStart)
        setDateEnd(date.dateEnd)
        setDate(date)
    }, [month])


    function handleChangeMonth(e) {
        const id = e.currentTarget.id;

        if (month === 11) {
            if (id === 'left') {
                setMonth(10)
            } else {
                setMonth(11)
            }
            return
        }



        if (month === 0 && !isSkilla) {
            if (id === 'left') {
                setMonth(0)
            } else {
                setMonth(1)
            }
            return
        }
        if (month === 0 && isSkilla) {
            if (id === 'left') {
                setMonth(month - 1)
            } else {
                setMonth(month + 1)
            }
            return
        }


        if (month < 12) {
            if (id === 'left') {
                setMonth(month - 1)
            } else {
                setMonth(month + 1)
            }
            return
        }

    }

    return (
        <div className={`${s.month}`}>
            <div onClick={handleChangeMonth} id='left' className={`${s.left}`}>
                <ArrowLeft />
            </div>
            <div className={`${s.center}`}>
                <IconCalendar />
                <p>{date.month}</p>

            </div>

            <div onClick={handleChangeMonth} id='right' className={`${s.right}`}>
                <ArrowLeft />
            </div>
        </div>
    )
};

export default CalendarMonth;