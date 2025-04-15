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

function Purchase({ role, el }) {
    const [status, setStatus] = useState(0);
    const [purchase, setPurchaseUpdate] = useState(el);
    const [hidenPurchase, setHidenPurchase] = useState(false);
    const [isView, setIsView] = useState(true);
    const dispatch = useDispatch();
    const purchaseUpdate = useSelector(purchaseUpdateSelector).purchasesUpdate;
    const purchasesDelete = useSelector(purchaseUpdateSelector).purchasesDelete;

    useEffect(() => {
        const purchaseNew = purchaseUpdate?.findLast(el => el.id == purchase?.id);

        if (purchaseUpdate?.length > 0 && purchaseNew) {
            setPurchaseUpdate(purchaseNew);

            return
        }
    }, [purchaseUpdate])

/*     useEffect(() => {
        const purchaseDeleteFind = purchasesDelete?.find(el => el == purchase?.id);
        purchaseDeleteFind ? setHidenPurchase(true) : setHidenPurchase(false);
    }, [purchasesDelete]) */

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
        lastView?.is_view == 0 ? setIsView(false) : setIsView(true)
    }, [purchase, el])


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
            sum: purchase?.sum,
            inStock: (role == 'administrator' || role == 'director') ? purchase.in_stock : null,
            takeAccount: (role == 'administrator' || role == 'director') ? purchase.take_account : null,

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
    return (
        <Link to={`/purchases2/?purchase=${purchase.id}`} onClick={handleOpenPurchase} id={purchase?.id} className={`${s.purchase} ${hidenPurchase && s.purchase_hiden}`}>
            <div className={`${s.attention} ${isView && s.attention_hidden}`}><IconView /></div>
            <div className={`${s.item} ${s.item_date}`}>
                {purchase?.pay_date && <p>{HandledatePurchaseList(purchase?.pay_date)}</p>}
            </div>
            <div className={`${s.item} ${s.item_pos} ${(role == 'director' || role == 'administrator') && s.item_pos_director}`}>
                {purchase?.items?.map((el) => {
                    return <div key={el.id} className={s.pos}>
                        <p>{el.name}</p>
                        {el.item_id !== 0 && <IconFav />}
                        <span>{el.quantity} {el.type == 'услуга' ? 'услуга' : el.unit} по {addSpaceNumber(el.price)} ₽</span>
                    </div>
                })}
            </div>
            <div className={`${s.item} ${s.item_sum}`}>
                <p>{addSpaceNumber(purchase?.sum)}</p>
            </div>
            <div className={`${s.item} ${s.item_buyer}`}>
                <p>{purchase?.payer ? purchase?.payer?.name : ''}</p>

                {(role == 'administrator' || role == 'director') && !purchase?.is_nal && purchase?.payer?.name !== 'Наличные' && <span>безнал</span>}
            </div>
            <div className={`${s.item} ${s.item_seller} ${(role == 'director' || role == 'administrator') && s.item_seller_director}`}>
                <p>{purchase?.counterparty_name}</p>
                <span>{purchase?.counterparty_inn && 'ИНН'} {purchase?.counterparty_inn}  {purchase?.counterparty_kpp && 'КПП'} {purchase?.counterparty_kpp}</span>
            </div>

            {(role == 'director' || role == 'administrator') && <div className={`${s.item} ${s.item_accounting}`}>
                {!purchase.take_account && <p>нет</p>}
            </div>}
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
        </Link>
    )
};

export default Purchase;