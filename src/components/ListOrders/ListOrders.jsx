import s from './ListOrders.module.scss';
import { useState, useEffect, useRef } from 'react';
import { ReactComponent as IconArrow } from '../../image/iconArrow.svg';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Api
import { getPurchasesCursor } from '../../Api/Api'
//component
import Order from '../Order/Order';
import WindowOrder from '../WindowOrder/WindowOrder';
import PurchaseSceleton from '../Purchase/PurchaseSceleton/PurchaseSceleton';
//selectors
import { purchaseSelector } from '../../store/reducer/purchase/selector';


function ListOrders({ orders, load, loadParametrs, personIsView }) {
    const [anim, setAnim] = useState(false)
    const order = useSelector(purchaseSelector).order;
   console.log(orders)
    const listRef = useRef();

    useEffect(() => {
        setAnim(true)
    }, [])







    return (
        <div style={{ pointerEvents: loadParametrs ? 'none' : '' }} ref={listRef} className={`${s.list} ${anim && s.list_anim}`}>
            <div className={s.header}>
                <div className={`${s.item} ${s.item_date}`}>
                    <p>Дата</p>
                </div>
                <div className={`${s.item} ${s.item_pos}`}>
                    <p>Позиции</p>
                </div>
                <div className={`${s.item} ${s.item_create}`}>
                    <p>Создано</p>
                </div>
                <div className={`${s.item} ${s.item_status}`}>
                    <p>Статус</p>
                    <IconArrow />
                </div>
            </div>
            {/*  {load && <ul className={s.purchases}>
                {[...Array(18)]?.map((el, i) => {
                    return <PurchaseSceleton key={i} />
                })}
            </ul>
            } */}

            {!load && <ul className={s.orders}>
                {orders?.map((el, i) => {
                    return <Order key={el.id} el={el} />
                })}
            </ul>
            }
            {order.open && order.id !== '' && <WindowOrder id={order.id} order={order} loadParametrs={loadParametrs} personIsView={personIsView}/>}
        </div>
    )
};

export default ListOrders;