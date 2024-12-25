import s from './Purchase.module.scss';
import { ReactComponent as IconFav } from '../../image/iconFav.svg';
import { ReactComponent as IconView } from '../../image/icon/purchase/iconView.svg';
import { HandledatePurchaseList } from '../../utils/date';
import { addSpaceNumber } from '../../utils/addSpaceNumber';
import { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { Link } from 'react-router-dom';
//slice 
import { setPurchase } from '../../store/reducer/purchase/slice';
import { setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
//selector
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';

function Purchase({ el }) {
    const role = document.getElementById('root_purchases').getAttribute('role');
    const [status, setStatus] = useState(0);
    const [purchase, setPurchaseUpdate] = useState(el);
    const [hidenPurchase, setHidenPurchase] = useState(false);
    const [isView, setIsView] = useState(true);
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
            dispatch(setUpdateAction())
            return
        }
    }, [purchaseUpdate])

    useEffect(() => {
        const purchaseDeleteFind = purchasesDelete?.find(el => el == purchase?.id);
        purchaseDeleteFind ? setHidenPurchase(true) : setHidenPurchase(false);
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

    useEffect(() => {
        const lastView = purchase?.logs_view?.find((item) => item.is_view == 0)
        typeof lastView === "undefined" ? setIsView(true) : setIsView(false);
    }, [purchase])


    const handleOpenPurchase = (e) => {
        const id = e.currentTarget.id
        const purchaseForOpen = {
            isOrder: false,
            id,
            open: true,
            dateCreate: purchase?.date_create,
            payerId: purchase?.payer_id,
            categoryId: purchase?.cat_id,
            positions: purchase?.items,
            isNal: purchase?.is_nal,
            inStock: role == 'administrator' ? purchase.in_stock : null,
            takeAccount: role == 'administrator' ? purchase.take_account : null,
            sum: purchase?.sum,
            existingFiles,
            status: purchase?.status,
            reject: purchase?.is_reject,
            vendorId: purchase?.stock_vendor_id,
            contractVendorId: purchase?.stock_vendor_contracts_id,
            position: purchase?.person?.position,
            personId: purchase?.person_id,
            log: purchase?.logs_view,
        }
        dispatch(setPurchase(purchaseForOpen));
        setIsView(true)
        localStorage.setItem('purchase', JSON.stringify(purchaseForOpen))
    }

    //не показываем закупку черновик если роль не совпаадет с ролью в закупке и status == 0
    //не показываем кнопки в закупке leader если статус 1 person_id
    //не показываем кнопки в закупке administarator если статус 2
   console.log(purchase)
    return (
        <div onClick={handleOpenPurchase} id={purchase?.id} className={`${s.purchase} ${hidenPurchase && s.purchase_hiden}`}>
            <div className={`${s.item} ${s.item_date}`}>
                {purchase?.pay_date && <p>{HandledatePurchaseList(purchase?.pay_date)}</p>}
                <div className={`${s.attention} ${isView && s.attention_hiden}`}><IconView /></div>
            </div>
            <div className={`${s.item} ${s.item_pos}`}>
                {purchase?.items?.map((el) => {
                    return <div key={el.id} className={s.pos}>
                        <p>{el.name}</p>
                        {el.item_id !== 0 && <IconFav />}
                        <span>{el.quantity} {el.type == 'услуга' ? 'услуга' : el.unit} по {el.price} ₽</span>
                    </div>
                })}
            </div>
            <div className={`${s.item} ${s.item_sum}`}>
                <p>{addSpaceNumber(purchase?.sum)}</p>
            </div>
            <div className={`${s.item} ${s.item_buyer}`}>
                <p>{purchase?.payer ? purchase?.payer?.name : ''}</p>
                {role == 'administrator' && purchase?.is_nal && purchase?.payer?.name !== 'Наличные' && <span>наличные</span>}
                {role == 'administrator' && !purchase?.is_nal && <span>безнал</span>}
            </div>
            <div className={`${s.item} ${s.item_seller}`}>
                <p>{purchase?.counterparty_name}</p>
                <span>{purchase?.counterparty_inn && 'ИНН'} {purchase?.counterparty_inn}  {purchase?.counterparty_kpp && 'КПП'} {purchase?.counterparty_kpp}</span>
            </div>
            {purchase && purchase?.items?.length > 0 && <div className={`${s.item} ${s.item_status}`}>
                <div className={`${s.status} ${(purchase?.status == -1 || purchase.is_reject) && s.status_red} ${(purchase?.status == 1 || purchase?.status == 2) && s.status_yellow} ${purchase?.status > 2 && s.status_done}`}></div>
                <div className={`${s.status} ${purchase?.status == 6 && s.status_yellow} ${purchase?.status >= 3 && purchase?.status !== 6 && s.status_done}`}></div>
                <div className={`${s.status} ${purchase?.status == 3 && s.status_yellow} ${purchase?.status >= 4 && purchase?.status !== 6 && s.status_done}`}></div>
                <div className={`${s.status} ${purchase?.status == 7 && s.status_yellow} ${purchase?.status >= 5 && purchase?.status !== 6 && purchase?.status !== 7 && s.status_done}`}></div>
            </div>
            }

            {(purchase?.items?.length == 0 || !purchase?.items) && <div className={`${s.item} ${s.item_status}`}>
                <div className={`${s.status} ${s.status_blue}`}></div>
                <div className={`${s.status}`}></div>
                <div className={`${s.status}`}></div>
                <div className={`${s.status}`}></div>
            </div>}
        </div>
    )
};

export default memo(Purchase);