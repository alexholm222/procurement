import s from './Purchase.module.scss';
import { ReactComponent as IconFav } from '../../image/iconFav.svg';
import { HandledatePurchaseList } from '../../utils/date';
import { addSpaceNumber } from '../../utils/addSpaceNumber';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
//slice 
import { setPurchase } from '../../store/reducer/purchase/slice';
//selector
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';

function Purchase({ el }) {
    const [status, setStatus] = useState(0);
    const [purchase, setPurchaseUpdate] = useState(el);
    const [hidenPurchase, setHidenPurchase] = useState(false);
    const dispatch = useDispatch();
    const existingFiles = [{ id: uuid(), file: purchase?.bill, name: purchase?.bill?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill2, name: purchase?.bill2?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill3, name: purchase?.bill3?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill4, name: purchase?.bill4?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill5, name: purchase?.bill5?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill6, name: purchase?.bill6?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: purchase?.bill7, name: purchase?.bill7?.split('/').pop(), type: 'existing' },
    ].filter(purchase => purchase.file && purchase.file !== null);
    const purchaseUpdate = useSelector(purchaseUpdateSelector).purchasesUpdate;
    const purchasesDelete = useSelector(purchaseUpdateSelector).purchasesDelete;
   

    useEffect(() => {
        const purchaseNew = purchaseUpdate?.findLast(el => el.id == purchase?.id);
        if (purchaseUpdate?.length > 0 && purchaseNew) {
            setPurchaseUpdate(purchaseNew);
            return
        }
    }, [purchaseUpdate])

    useEffect(() => {
        const purchaseDelete = purchasesDelete?.find(el => el == purchase?.id);
        purchaseDelete ? setHidenPurchase(true) : setHidenPurchase(false);
    }, [purchasesDelete])

    useEffect(() => {

        if (purchase?.status == 0) {
            setStatus(0);
            return
        }

        if (purchase?.status == 1 || purchase?.status == 2) {
            setStatus(1);
            return
        }

        if (purchase?.status == 3 || purchase?.status == 6) {
            setStatus(2);
            return
        }

        if (purchase?.status == 4 || purchase?.status == 5 || purchase?.status == 7) {
            setStatus(3);
            return
        }


        if (purchase?.status == 9 || purchase?.status == 8) {
            setStatus(4);
            return
        }
    }, [purchase]);

    const handleOpenPurchase = (e) => {
        const id = e.currentTarget.id
        dispatch(setPurchase({
            id,
            open: true,
            dateCreate: purchase?.date_create,
            payerId: purchase?.payer_id,
            categoryId: purchase?.cat_id,
            positions: purchase?.items,
            isNal: purchase?.is_nal,
            sum: purchase?.sum,
            existingFiles,
            status: purchase?.status,
            reject: purchase?.is_reject,
            vendorId: purchase?.stock_vendor_id,
            contractVendorId: purchase?.stock_vendor_contracts_id,
        }))
    }


    return (
        <div onClick={handleOpenPurchase} id={purchase?.id} className={`${s.purchase} ${hidenPurchase && s.purchase_hiden}`}>
            <div className={`${s.item} ${s.item_date}`}>
                <p>{HandledatePurchaseList(purchase?.date_create)}</p>
            </div>
            <div className={`${s.item} ${s.item_pos}`}>
                {purchase?.items?.map((el) => {
                    return <div key={el.id} className={s.pos}>
                        <p>{el.name}</p>
                        {el.item_id !== 0 && <IconFav />}
                        <span>{el.quantity} {el.unit} по {el.price} ₽</span>
                    </div>
                })}
            </div>
            <div className={`${s.item} ${s.item_sum}`}>
                <p>{addSpaceNumber(purchase?.sum)}</p>
            </div>
            <div className={`${s.item} ${s.item_buyer}`}>
                {purchase?.is_nal && <p>Наличные</p>}
                <p>{purchase?.payer ? purchase?.payer.name : ''}</p>
            </div>
            <div className={`${s.item} ${s.item_seller}`}>
                <p>{purchase?.counterparty_name}</p>
                <span>{purchase?.counterparty_inn && 'ИНН'} {purchase?.counterparty_inn}  {purchase?.counterparty_kpp && 'КПП'} {purchase?.counterparty_kpp}</span>
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