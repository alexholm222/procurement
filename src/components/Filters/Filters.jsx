import s from './Filters.module.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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

export const Filters = () => {
    const payers = useSelector(purchaseSelector).payers;
    const categories = useSelector(purchaseSelector).categories;
    const [dateRange, setDateRange] = useState([null, null]);
    const [dateRangeFormat, setDateRangeFormat] = useState([null, null]);
    const [disabled, setDisabled] = useState(false);
    const [endDisabled, setEndDisabled] = useState(false)
    console.log(dateRangeFormat, disabled)

    useEffect(() => {
        const dateRangeFormat = dateRange.map(el => {
            return el ? el?.format('YYYY-MM-DD') : null
        })
        setDateRangeFormat(dateRangeFormat)
        setDisabled(dateRangeFormat.some(el => el == "Invalid Date") || (dateRangeFormat[0] == null && dateRangeFormat[1] !== null))
    }, [dateRange])

    return (
        <div className={s.window}>
            {/* <div className={s.container}>
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
                    <p className={`${s.reset} ${s.reset_vis}`}>Сбросить</p>
                </div>

                <DateCalendarRange value={dateRange} setValue={setDateRange} />
                <div className={`${s.item} ${s.item_end}`}>
                    <CheckBox active={endDisabled} />
                    <p>без конечной даты</p>
                </div>

            </div>

            <button disabled={disabled} className={s.button}>Применить</button>
        </div>
    )
}

export default Filters;