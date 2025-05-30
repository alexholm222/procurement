import s from './PurchaseAccept.module.scss';
import { ReactComponent as IconClose } from '../../image/icon/purchase/iconClose.svg';
import { ReactComponent as IconSuccess } from '../../image/icon/purchase/iconSuccess.svg';
import { ReactComponent as IconCheck } from '../../image/icon/purchase/iconCheck.svg';
import { ReactComponent as IconFolder } from '../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
//Api
import { confirmRefund, rejectRefund } from '../../Api/Api';
//utils
import DataPicker from '../../utils/DatePicker/DatePicker';
import { dateNow2 } from '../../utils/date';
//slice
import { setPurchasesUpdate } from '../../store/reducer/purchaseUpdate/slice';
import { setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
//components
import FileLoaderAccept from './FileLoaderAccept/FileLoaderAccept';
import LoaderButton from '../LoaderButton/LoaderButton';
//utils 
import { handleExistingFiles } from '../../utils/handleExistingFiles';




const PurchaseConfirmReturn = ({ setModal, windowRef, id, setStatus, loadAccept, setLoadAccept, acceptSuccess, setAcceptSuccess, setLogs, 
    setPositionReturn, setPositions, setReturnDone, setPositionReturnDone, setError }) => {
    const [anim, setAnim] = useState(false);
    const [err, setErr] = useState(false);
    const [loadReject, setLoadReject] = useState(false)
    const modalRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        setAnim(true)
    }, []);



    //Фиксация окна при открытии модалки
    useEffect(() => {
        windowRef.current.style.overflow = "hidden";
        /* windowRef.current.style.paddingRight = "8px"; */
        return () => {
            windowRef.current.style.overflowY = "auto";
            windowRef.current.style.paddingRight = "0";
        };
    }, [windowRef]);


    const handleCloseModal = () => {
        setAnim(false);
        setAcceptSuccess(false);
        setTimeout(() => {
            setModal(0);
        }, 300)
    }

    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target) && !e.target.closest('.ant-picker-dropdown')) {
            handleCloseModal();
            return
        }
    }


    const handleConfirmAll = () => {
        setLoadAccept(true);
        confirmRefund(id)
            .then(res => {
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                const returnPos = purchase.return_items.filter(el => el.status == 'requested')
                const returnPosDone = purchase.return_items.filter(el => el.status == 'confirmed');
                setPositionReturnDone(returnPosDone)
                returnPosDone.length > 0 ? setReturnDone(true) : setReturnDone(false)
                setStatus(purchase.status);
                dispatch(setPurchasesUpdate(purchase))
                setLoadAccept(false);
                setAcceptSuccess(true);
                setPositionReturn(returnPos);
                setPositions(purchase.items)
                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: purchase.order?.date_create,
                    id: purchase.order?.id,
                    person: purchase.order?.person,
                    person_id: purchase.order?.person_id,
                    sub_comment: purchase.order?.comment,
                    type: 'add',
                    files: handleExistingFiles(purchase.order),
                }

                purchase.order ? setLogs([orderLog, ...order.order_logs?.slice(1), ...purchase.logs]) : setLogs(purchase.logs);
                /* dispatch(setUpdateAction()); */
                handleCloseModal()
            })
            .catch(err => {
                const data = err.response?.data?.message;
          
                if(data?.message.includes('Quantity')) {
                    setError(`Невозможно провести возврат, проверьте остатки позиций на складе`)
                } else {
                    setError('Ошибка на сервере')
                }
                setLoadAccept(false);
               
                setModal(false)
            } )
    }

    const handleReject = () => {
        setLoadReject(true);
        rejectRefund(id)
            .then(res => {
                /*    dispatch(setUpdateAction()); */
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                
                /*  const returnPos = purchase.return_items.filter(el => el.status == 'requested')
                 const returnPosDone = purchase.return_items.filter(el => el.status == 'confirmed');
                 setPositionReturnDone(returnPosDone)
                 returnPosDone.length > 0 ? setReturnDone(true) : setReturnDone(false) */
     /*            setStatus(purchase.status); */
                dispatch(setPurchasesUpdate(purchase))
                setLoadReject(false);
                setAcceptSuccess(true);
                setPositionReturn([]);
                setPositions(purchase.items)
                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: purchase.order?.date_create,
                    id: purchase.order?.id,
                    person: purchase.order?.person,
                    person_id: purchase.order?.person_id,
                    sub_comment: purchase.order?.comment,
                    type: 'add',
                    files: handleExistingFiles(purchase.order),
                }

                purchase.order ? setLogs([orderLog, ...order.order_logs?.slice(1), ...purchase.logs]) : setLogs(purchase.logs);
             
                handleCloseModal()
            })
            .catch(err => console.log(err))
    }


    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, []);

    return (
        <div className={`${s.overlay} ${anim && s.overlay_anim}`}>

            <div ref={modalRef} className={`${s.modal} ${anim && !acceptSuccess && s.modal_anim}`}>
                <div className={s.header}>
                    <h2 className={s.title}>
                        Подтвердить возврат
                    </h2>
                    <IconClose onClick={handleCloseModal} />
                </div>



                <div className={s.buttons}>
                    <button onClick={handleConfirmAll} className={s.button}>
                        {loadAccept && <p>Подтверждаем</p>}
                        {!loadAccept && <p>Подтвердить</p>}
                        {loadAccept && <LoaderButton color={'#FFFFFF'} />}
                    </button>

                    <button onClick={handleReject} className={`${s.button} ${s.button_reject}`}>
                        {loadReject && <p>Отклоняем</p>}
                        {!loadReject && <p>Отклонить</p>}
                        {loadReject && <LoaderButton color={'#E75A5A'} />}
                    </button>
                </div>

                <span className={s.text_err}>{err ? 'Произошла ошибка' : ''}</span>
            </div>

            <div className={`${s.success} ${acceptSuccess && s.success_anim}`}>
                <div className={s.close}><IconClose /></div>
                <IconSuccess />
                <h2 className={`${s.title} ${s.title_success}`}>
                    Возврат подтвержден
                </h2>
                <p className={s.text}></p>

            </div>
        </div>
    )
};

export default PurchaseConfirmReturn;