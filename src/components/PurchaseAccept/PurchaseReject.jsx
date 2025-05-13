import s from './PurchaseAccept.module.scss';
import { ReactComponent as IconClose } from '../../image/icon/purchase/iconClose.svg';
import { ReactComponent as IconButtonReject } from '../../image/icon/purchase/iconButtonReject.svg';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
//Api
import { rejectPurchase, rejectPayment } from '../../Api/Api';

//slice
import { setPurchasesUpdate } from '../../store/reducer/purchaseUpdate/slice';
import { setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
//components
import FileLoaderAccept from './FileLoaderAccept/FileLoaderAccept';
import LoaderButton from '../LoaderButton/LoaderButton';
//utils 
import { handleExistingFiles } from '../../utils/handleExistingFiles';




const PurchaseReject = ({ setModal, windowRef, id, setStatus, loadAccept, setLoadAccept, acceptSuccess, setAcceptSuccess, setAprovalSuccess, setLogs, setReject, type }) => {
    const [anim, setAnim] = useState(false);
    const [comment, setComment] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [err, setErr] = useState(false);
    const modalRef = useRef();
    const textRef = useRef();
    const dispatch = useDispatch();
  

    useEffect(() => {
        textRef.current.focus();
    }, [textRef])

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

    const handleComment = (e) => {
        const text = e.target.value;
        text.length > 0 ? setDisabled(false) : setDisabled(true)
        setComment(text)
    }


    const handleConfirm = () => {
        setLoadAccept(true)
        if (type == 'reject') {
            rejectPurchase({ id, reject_comment: comment })
                .then(res => {
                    const purchase = res.data.purchase;
                    const order = res.data.purchase.order;
                    setLoadAccept(false);
                    setStatus(purchase.status);
                    setReject(true);
                    dispatch(setPurchasesUpdate(purchase));
                    setAcceptSuccess(true);
                    setAprovalSuccess(false)
                    const orderLog = {
                        comment: 'Создана заявка на закупку',
                        date: purchase.order?.date_create,
                        id: purchase.order?.id,
                        person: purchase.order?.person,
                        person_id: purchase.order?.person_id,
                        sub_comment: purchase.order?.comment,
                        type: 'add',
                        files: handleExistingFiles(purchase?.order),
                    }

                    purchase.order ? setLogs([orderLog, ...order.order_logs?.slice(1), ...purchase.logs]) : setLogs(purchase.logs);
                    dispatch(setUpdateAction());
                })
                .catch(err => console.log(err))
        } else {
            rejectPayment({ id, reject_comment: comment })
                .then(res => {
                    const purchase = res.data.purchase;
                    const order = res.data.purchase.order;
                    setLoadAccept(false);
                    setStatus(purchase.status);
                    setReject(true);
                    dispatch(setPurchasesUpdate(purchase));
                    setAcceptSuccess(true);
                    setAprovalSuccess(false)
                    const orderLog = {
                        comment: 'Создана заявка на закупку',
                        date: purchase.order?.date_create,
                        id: purchase.order?.id,
                        person: purchase.order?.person,
                        person_id: purchase.order?.person_id,
                        sub_comment: purchase.order?.comment,
                        type: 'add',
                        files: handleExistingFiles(purchase?.order),
                    }

                    purchase.order ? setLogs([orderLog, ...order.order_logs?.slice(1), ...purchase.logs]) : setLogs(purchase.logs);
                    dispatch(setUpdateAction());
                })
                .catch(err => console.log(err))
        }

    }


    const handleEnterSend = (e) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            handleConfirm();
        }
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
                        {type == 'reject' && 'Отклонить закупку'}
                        {type == 'rejectPay' && 'Отказ оплаты закупки'}
                    </h2>
                    <IconClose onClick={handleCloseModal} />
                </div>

                <textarea onKeyDown={handleEnterSend} ref={textRef} onChange={handleComment} className={s.comment} placeholder='Комментарий к отказу'></textarea>


                <button disabled={disabled} onClick={handleConfirm} className={s.button}>
                    {loadAccept && <p>Подтверждаем</p>}
                    {!loadAccept && <p>Подтвердить</p>}
                    {loadAccept && <LoaderButton color={'#FFFFFF'} />}
                </button>
                <span className={s.text_err}>{err ? 'Произошла ошибка при добавлении поставщика' : ''}</span>
            </div>

            <div className={`${s.success} ${acceptSuccess && s.success_anim}`}>
                <div className={s.close}><IconClose /></div>
                <div className={s.rejectIcon}><IconButtonReject /></div>
                <h2 className={`${s.title} ${s.title_success}`}>
                    {type == 'reject' && 'Закупка отклонена'}
                    {type == 'rejectPay' && 'Оплата отклонена'}
                </h2>
                <p className={s.text}></p>
            </div>
        </div>
    )
};

export default PurchaseReject;