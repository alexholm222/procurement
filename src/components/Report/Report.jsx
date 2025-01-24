import s from './Report.module.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//selector 
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//API
import { getPurchaseReport } from '../../Api/Api';
//Components
import CalendarMonth from '../Calendar/CalendarMonth';
//utils 
import { addSpaceNumber } from '../../utils/addSpaceNumber';

const Category = ({ el, cash, cashless }) => {
    const sum = Number(cashless) + Number(cash)
    return (
        <div className={s.row}>
            <div className={`${s.item_cat}`}>{el.name} <span>{!el.active && '(не активная)'}</span></div>
            <div className={`${s.item_nal}`}>{cash == 0 ? '-' : addSpaceNumber(cash)}</div>
            <div className={`${s.item_nal}`}>{cashless == 0 ? '-' : addSpaceNumber(cashless)}</div>
            <div className={`${s.item_nal}`}>{sum == 0 ? '-' : addSpaceNumber(sum)}</div>
        </div>

    )
}

const Report = ({ isSkilla, categoriesAll,dateStart, dateEnd }) => {
    const [anim, setAnim] = useState(false);
    const [report, setReport] = useState({});
    const [total, setTotal] = useState({});
    const [load, setLoad] = useState()



    useEffect(() => {

    }, [])

    useEffect(() => {
        setAnim(true)
    }, []);

    useEffect(() => {
      
        getPurchaseReport(dateStart, dateEnd)
            .then(res => {
                const data = res.data;
                setReport(data);
                setTotal({ cash: 0, cashless: 0 })
                let cashArr = []
                let cashlessArr = []
                categoriesAll.forEach(el =>  data.cash?.[el.id] ? cashArr.push(Number(data.cash?.[el.id])) : 0)
                categoriesAll.forEach(el =>  data.cashless?.[el.id] ? cashlessArr.push(Number(data.cashless?.[el.id])) : 0)
             
                const cash = cashArr.length > 0 ? cashArr.reduce((acc, val) => Number(acc) + Number(val)) : 0;
                const cashless = cashlessArr.length > 0 ? cashlessArr?.reduce((acc, val) => Number(acc) + Number(val)) : 0;

               /*  const cash = Object.values(data.cash).length > 0 ? Object.values(data.cash).reduce((acc, val) => Number(acc) + Number(val)) : 0;
                const cashless = Object.values(data.cashless).length > 0 ? Object.values(data.cashless)?.reduce((acc, val) => Number(acc) + Number(val)): 0; */
                setTotal({ cash, cashless })
            })
            .catch(err => console.log(err))
    }, [dateStart, dateEnd, categoriesAll])

    return (
        <div className={`${s.window} ${anim && s.window_anim}`}>
          {/*   <div className={s.header}>
                <CalendarMonth setDateStart={setDateStart} setDateEnd={setDateEnd} isSkilla={isSkilla}/>
            </div> */}
            <div className={s.container}>
                <div className={s.items}>
                    <div className={`${s.item} ${s.item_cat}`}>
                        <p>Категория</p>
                    </div>

                    <div className={`${s.item} ${s.item_nal}`}>
                        <p>Наличные</p>
                    </div>

                    <div className={`${s.item} ${s.item_nal}`}>
                        <p>Безналичные</p>
                    </div>

                    <div className={`${s.item} ${s.item_nal}`}>
                        <p>Итого</p>
                    </div>
                </div>
                <div className={s.rows}>
                    {categoriesAll.map(el => {
                        const id = el.id;
                        const cash = report?.cash?.[id]
                        const cashless = report?.cashless?.[id]
                
                        return <Category el={el} cash={cash ? cash : 0} cashless={cashless ? cashless : 0} />
                    })}

                    <div className={s.row}>
                        <div className={`${s.item_cat} ${s.item_bold}`}>Итого</div>
                        <div className={`${s.item_nal} ${s.item_bold}`}>{total.cash == 0 ? '-' : addSpaceNumber(total.cash)}</div>
                        <div className={`${s.item_nal} ${s.item_bold}`}>{total.cashless == 0 ? '-' : addSpaceNumber(total.cashless)}</div>
                        <div className={`${s.item_nal} ${s.item_bold}`}>{total.cash + total.cashless == 0 ? '-' : addSpaceNumber(total.cash + total.cashless)}</div>
                    </div>

                </div>


            </div>
        </div>
    )
};

export default Report;