import s from './Order.module.scss';
import { ReactComponent as IconFav } from '../../image/iconFav.svg';
import { ReactComponent as IconView } from '../../image/icon/purchase/iconView.svg';
import { HandledatePurchaseList } from '../../utils/date';
import { addSpaceNumber } from '../../utils/addSpaceNumber';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { Link } from 'react-router-dom';
//slice 
import { setOrder } from '../../store/reducer/purchase/slice';
import { setUpdateAction, setOrderUpdate } from '../../store/reducer/purchaseUpdate/slice';
import { setPurchaseNew} from '../../store/reducer/purchaseUpdate/slice';
import { setPurchase } from '../../store/reducer/purchase/slice';
//selector
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';
//components
import StatusBage from '../WindowOrder/StatusBage/StatusBage';
//API
import { takeOrder } from '../../Api/Api';
//utils
import { dateNow2 } from '../../utils/date';

function Order({ el }) {
    const role = document.getElementById('root_purchases').getAttribute('role');
    const [status, setStatus] = useState(0);
    const [order, setOrderUpdateEl] = useState(el);
    const [hidenPurchase, setHidenPurchase] = useState(false);
    const [isView, setIsView] = useState(true);
    const dispatch = useDispatch();
    const existingFiles = [{ id: uuid(), file: order?.bill, name: order?.bill?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: order?.bill2, name: order?.bill2?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: order?.bill3, name: order?.bill3?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: order?.bill4, name: order?.bill4?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: order?.bill5, name: order?.bill5?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: order?.bill6, name: order?.bill6?.split('/').pop(), type: 'existing' },
    { id: uuid(), file: order?.bill7, name: order?.bill7?.split('/').pop(), type: 'existing' },
    ].filter(order => order.file && order.file !== null);
    console.log(order)

    const orderUpdate = useSelector(purchaseUpdateSelector).orderUpdate;
   /*  const purchasesDelete = useSelector(purchaseUpdateSelector).purchasesDelete; */

      useEffect(() => {
          const orderNew = orderUpdate?.findLast(el => el.id == order?.id);
          
          if (orderUpdate?.length > 0 && orderNew) {
            setOrderUpdateEl(orderNew);
              return
          }
      }, [orderUpdate])

    /*  useEffect(() => {
         const purchaseDeleteFind = purchasesDelete?.find(el => el == purchase?.id);
         purchaseDeleteFind ? setHidenPurchase(true) : setHidenPurchase(false);
     }, [purchasesDelete]) */


    /*  useEffect(() => {
         const lastView = purchase?.logs_view?.find((item) => item.is_view == 0)
         typeof lastView === "undefined"  ? setIsView(true) : setIsView(false);
     }, [purchase]) */

    
        const handleOpenOrder= (e) => {
            const id = e.currentTarget.id
            const purchaseForOpen = {
                id,
                open: true,
                dateCreate: order?.date_create,
                payerId: order?.payer_id,
                categoryId: order?.cat_id,
                comment: order?.comment,
                isNal: order?.is_nal,
                existingFiles,
                status: order?.status,
                person : order?.person,
                personId: order?.person_id,
                logs: order.logs,
            
            }
            dispatch(setOrder(purchaseForOpen));
            setIsView(true)
        }


        const handleTakeOrder = (e) => {
            const id = e.currentTarget.id
            dispatch(setOrder({id: '', open: false}));
            /* setLoadCreate(true); */
            takeOrder({id: order.id})
                .then(res => {
                    const order = res.data.order;
                    const purchase = res.data.purchase;
                    dispatch(setOrderUpdate(order));
                    console.log(res)
                   /*  setLoadCreate(false); */
    
                    const orderLog = {
                        comment: 'Создана заявка на закупку',
                        date: order.date_create,
                        id: id,
                        person: order.person,
                        person_id: order.person_id,
                        sub_comment: order.comment,
                        type: 'add',
                        files: existingFiles
                    }
    
                    const purchaseForOpen = {
                        isOrder: true,
                        id: purchase.id,
                        open: true,
                        payerId: purchase?.payer_id,
                        categoryId: purchase?.cat_id,
                        dateCreate: purchase?.date_create,
                        isNal: purchase?.is_nal,
                        logs: [orderLog, ...purchase?.logs],
                        status: purchase?.status,
                        position: purchase?.person?.position,
                        personId: purchase?.person_id,
                        dateCreate: dateNow2(), 
                    }
                    console.log(purchaseForOpen)
                    dispatch(setPurchaseNew(purchase))
                    setTimeout(() => {
                        dispatch(setPurchase(purchaseForOpen));
                    })
                   /*  setTimeout(() => {
                        handleCloseOrder();
                    }, 200) */
                
                    /* const documents = handleExistingFiles(purchase);
                    setDocuments(documents); */
                    /*    setTimeout(() => {handleClosePurchase()}, 600); */
                })
                .catch(err => console.log(err))
    
        }

    return (
        <div id={order?.id} className={`${s.purchase} ${hidenPurchase && s.purchase_hiden}`}>
            <div id={order?.id} onClick={handleOpenOrder} className={`${s.item} ${s.item_date}`}>
                <p>{HandledatePurchaseList(order?.date_create)}</p>
                <div className={`${s.attention} ${isView && s.attention_hiden}`}><IconView /></div>
            </div>
            <div id={order?.id} onClick={handleOpenOrder} className={`${s.item} ${s.item_pos}`}>
                {order?.comment}
            </div>
            <div id={order?.id} onClick={handleOpenOrder} className={`${s.item} ${s.item_create}`}>
                <p>{order?.person.name} {order?.person.surname}</p>
            </div>
            <div id={order?.id} onClick={handleOpenOrder} className={`${s.item} ${s.item_status}`}>
               <StatusBage status={order?.status}/>
                
            </div>
            {order?.status == 0 && role == 'hr-assist' && <div id={order?.id} onClick={handleTakeOrder} className={s.button}>Взять в работу</div>}
            {order?.status == 0 && role !== 'hr-assist' && <div id={order?.id} onClick={handleOpenOrder} className={s.button}></div>}
            {order?.status !== 0 && <div id={order?.id} onClick={handleOpenOrder} className={s.button}></div>}
        </div>
    )
};

export default Order;