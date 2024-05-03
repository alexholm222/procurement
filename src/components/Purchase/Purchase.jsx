import s from './Purchase.module.scss';
import { ReactComponent as IconFav } from '../../image/iconFav.svg';
import { HandledatePurchaseList } from '../../utils/date';
import { addSpaceNumber } from '../../utils/addSpaceNumber';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
//slice 
import { setPurchase } from '../../store/reducer/purchase/slice';

function Purchase({ el }) {
    const [status, setStatus] = useState(0);
    const dispatch = useDispatch();
    const existingFiles = [{ id: uuid(), file: el.bill, name: el.bill.split('/').pop(), type: 'existing' },
    { id: uuid(), file: el.bill2, name: el.bill2.split('/').pop(), type: 'existing' },
    { id: uuid(), file: el.bill3, name: el.bill3.split('/').pop(), type: 'existing' },
    { id: uuid(), file: el.bill4, name: el.bill4.split('/').pop(), type: 'existing' },
    { id: uuid(), file: el.bill5, name: el.bill5.split('/').pop(), type: 'existing' },
    { id: uuid(), file: el.bill6, name: el.bill6.split('/').pop(), type: 'existing' },
    { id: uuid(), file: el.bill7, name: el.bill7.split('/').pop(), type: 'existing' },
    ].filter(el => el.file && el.file !== null);

    useEffect(() => {
        if (el.status == 1 || el.status == 2) {
            setStatus(1);
            return
        }

        if (el.status == 3 || el.status == 6) {
            setStatus(2);
            return
        }

        if (el.status == 4 || el.status == 5 || el.status == 7) {
            setStatus(3);
            return
        }


        if (el.status == 9 || el.status == 8) {
            setStatus(4);
            return
        }
    }, [el]);

    const handleOpenPurchase = (e) => {
        const id = e.currentTarget.id
        dispatch(setPurchase({
            id,
            open: true,
            dateCreate: el.date_create,
            payerId: el.payer_id,
            categoryId: el.cat_id,
            positions: el.items,
            sum: el.sum,
            existingFiles
        }))
    }

    return (
        <div onClick={handleOpenPurchase} id={el.id} className={s.purchase}>
            <div className={`${s.item} ${s.item_date}`}>
                <p>{HandledatePurchaseList(el.date_create)}</p>
            </div>
            <div className={`${s.item} ${s.item_pos}`}>
                {el?.items.map((el) => {
                    return <div key={el.id} className={s.pos}>
                        <p>{el.name}</p>
                        {el.item_id !== 0 && <IconFav />}
                        <span>{el.quantity} {el.unit} по {el.price} ₽</span>
                    </div>
                })}
            </div>
            <div className={`${s.item} ${s.item_sum}`}>
                <p>{addSpaceNumber(el.sum)}</p>
            </div>
            <div className={`${s.item} ${s.item_buyer}`}>
                <p>{el.payer ? el.payer.name : ''}</p>
            </div>
            <div className={`${s.item} ${s.item_seller}`}>
                <p>{el.counterparty_name}</p>
                <span>{el.counterparty_inn && 'ИНН'} {el.counterparty_inn}  {el.counterparty_kpp && 'КПП'} {el.counterparty_kpp}</span>
            </div>
            <div className={`${s.item} ${s.item_status}`}>
                <div className={`${s.status} ${status >= 1 && s.status_done}`}></div>
                <div className={`${s.status} ${status >= 2 && s.status_done}`}></div>
                <div className={`${s.status} ${status >= 3 && s.status_done}`}></div>
                <div className={`${s.status} ${status >= 4 && s.status_done}`}></div>
            </div>
        </div>
    )
};

export default Purchase;