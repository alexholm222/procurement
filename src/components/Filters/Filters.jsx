import s from './Filters.module.scss';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
//selector
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//components
import CheckBox from '../CheckBox/CheckBox';
import DateCalendarRange from '../DateCalendar/DateCalendarRange';


const FilterItem = ({ item }) => {
    const [active, setActive] = useState(false);

    const handleActive = () => {
        active ? setActive(false) : setActive(true)
    }
    return (
        <li onClick={handleActive} id={item.id} className={`${s.item} ${active && s.item_active}`}>
            <CheckBox active={active} />
            <p>{item.name}</p>
        </li>
    )
}

export const Filters = ({ filterPayDate, setFilterPayDate, setFiltersModal }) => {
    const payers = useSelector(purchaseSelector).payers;
    const categories = useSelector(purchaseSelector).categories;
    const [dateRange, setDateRange] = useState([filterPayDate[0] == null ? null : dayjs(filterPayDate[0]), filterPayDate[1] == null ? null : dayjs(filterPayDate[1])]);
    const [dateRangeFormat, setDateRangeFormat] = useState([null, null]);
    const [disabled, setDisabled] = useState(false);
    const [endDisabled, setEndDisabled] = useState(false);
    const [resetState, setResetState] = useState(false);
    const [anim, setAnim] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        setAnim(true)
    }, []);

    useEffect(() => {
        const dateRangeFormat = dateRange.map(el => {
            return el ? el?.format('YYYY-MM-DD') : null
        })
        setDateRangeFormat(dateRangeFormat)
        setDisabled(dateRangeFormat.some(el => el == "Invalid Date") || (dateRangeFormat[0] == null && dateRangeFormat[1] !== null))

        dateRangeFormat[1] !== null && setEndDisabled(false)

        if (dateRangeFormat[0] == null && dateRangeFormat[1] == null) {
            setResetState(false)
        } else {
            setResetState(true)
        }
    }, [dateRange]);

    const handleDisabledEnd = () => {
        if (endDisabled) {
            setEndDisabled(false)
        } else {
            setEndDisabled(true)
            setDateRange(prevState => [prevState[0], null])
        }
    }

    const handleReset = () => {
        setDateRange([null, null]);
        setFilterPayDate([null, null])
        setEndDisabled(false)
    }

    const handleConfirm = () => {
        setFilterPayDate(dateRangeFormat)

        setTimeout(() => {
            handleCloseModal();
        }, 150)

    }

    const handleCloseModal = () => {
        setAnim(false);
        setTimeout(() => {
            setFiltersModal(0);
        }, 100)
    }

    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target) && !e.target.closest('.MuiPopper-root')) {
            handleCloseModal();
            return
        }
    }


    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, []);

    return (
        <div ref={modalRef} className={`${s.window} ${anim && s.window_anim}`}>
           {/*   <div className={s.container}>
                <div className={s.block}>
                    <p className={s.sub}>Категории</p>

                    <ul className={s.list}>
                        <FilterItem item={{ id: 0, name: 'Все' }} />
                        {payers.map(el => {
                            return <FilterItem item={el} />
                        })}
                    </ul>
                </div>

                <div className={s.block}>
                    <p className={s.sub}>Плательщики</p>
                    <ul className={s.list}>
                        <FilterItem item={{ id: 0, name: 'Все' }} />
                        {categories.map(el => {
                            return <FilterItem item={el} />
                        })}
                    </ul>
                </div>
            </div> */}

            <div className={s.block}>
                <div className={s.subs}>
                    <p className={s.sub}>Дата оплаты</p>
                    <p onClick={handleReset} className={`${s.reset} ${resetState && s.reset_vis}`}>Сбросить</p>
                </div>

                <DateCalendarRange value={dateRange} setValue={setDateRange} endDisabled={endDisabled} />
               {/*  <div onClick={handleDisabledEnd} className={`${s.item} ${endDisabled && s.item_active} ${s.item_end}`}>
                    <CheckBox active={endDisabled} />
                    <p>без конечной даты</p>
                </div> */}

            </div>

            <button onClick={handleConfirm} disabled={disabled} className={s.button}>
                Применить
            </button>
        </div>
    )
}

export default Filters;