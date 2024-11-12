import s from './PurchaseReturn.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as IconClose } from '../../image/icon/purchase/iconClose.svg';
import { ReactComponent as IconCheck } from '../../image/icon/purchase/iconCheck.svg';
import { ReactComponent as IconSuccess } from '../../image/icon/purchase/iconSuccess.svg';
import LoaderButton from '../LoaderButton/LoaderButton';
//API
import { refund, confirmRefund } from '../../Api/Api';
//slice
import { setPurchasesUpdate, setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
//utils
import { handleExistingFiles } from '../../utils/handleExistingFiles';


const PurchaseReturn = ({ windowRef, setModal, id, setStatus, loadAccept, setLoadAccept, acceptSuccess, setAcceptSuccess, setLogs, role, positions }) => {
    const [anim, setAnim] = useState(false);
    const [comment, setComment] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [err, setErr] = useState(false);
    const [positionForReturn, setPositionForReturn] = useState([]);

    const modalRef = useRef();
    const textRef = useRef();
    const dispatch = useDispatch();
    console.log(positions, positionForReturn)

    useEffect(() => {
        setAnim(true)
    }, []);

    //Фиксация окна при открытии модалки
    useEffect(() => {
        windowRef.current.style.overflow = "hidden";

        return () => {
            windowRef.current.style.overflow = "auto";
            windowRef.current.style.left = "0";
        };
    }, [windowRef]);

    useEffect(() => {
        const result = positions.map(el => {
            return { id: el.id, quantity: el.quantity }
        })
        setPositionForReturn(result)
    }, [positions])

    const handleCloseModal = () => {
        setAnim(false);
        setAcceptSuccess(false);
        setTimeout(() => {
            setModal(false);
        }, 300)
    }

    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, []);

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

    const handleEnterSend = (e) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            handleConfirm();
        }
    }

    const handleConfirm = () => {
        setLoadAccept(true)
        role !== 'administrator' && refund(id, true, comment, positionForReturn)
            .then(res => {
                console.log(res)
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                setLoadAccept(false);
                setStatus(purchase.status);
                dispatch(setPurchasesUpdate(purchase));
                setAcceptSuccess(true);
                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: purchase.order.date_create,
                    id: purchase.order.id,
                    person: purchase.order.person,
                    person_id: purchase.order.person_id,
                    sub_comment: purchase.order.comment,
                    type: 'add',
                    files: handleExistingFiles(purchase.order),
                }

                purchase.order ? setLogs([orderLog, ...order.order_logs?.slice(1), ...purchase.logs]) : setLogs(purchase.logs);
                dispatch(setUpdateAction());
                console.log(res);
            })
            .catch(err => setErr(false));

        role == 'administrator' && handleConfirmAdmin();
    }

    const handleConfirmAdmin = () => {
        setLoadAccept(true)
        refund(id, true, comment, positionForReturn)
            .then(res => {
                console.log(res);
                confirmRefund(id)
                    .then(res => {
                        console.log(res);
                        const purchase = res.data.purchase;
                        const order = res.data.purchase.order;
                        setLoadAccept(false);
                        setStatus(purchase.status);
                        dispatch(setPurchasesUpdate(purchase));
                        setAcceptSuccess(true);
                        const orderLog = {
                            comment: 'Создана заявка на закупку',
                            date: purchase.order.date_create,
                            id: purchase.order.id,
                            person: purchase.order.person,
                            person_id: purchase.order.person_id,
                            sub_comment: purchase.order.comment,
                            type: 'add',
                            files: handleExistingFiles(purchase.order),
                        }

                        purchase.order ? setLogs([orderLog, ...order.order_logs?.slice(1), ...purchase.logs]) : setLogs(purchase.logs);
                        dispatch(setUpdateAction());
                        console.log(res);
                    })
                    .catch(err => setErr(false))
            })
            .catch(err => setErr(false))
        console.log('возврат')
    }

    return (
        <div className={`${s.overlay} ${anim && !acceptSuccess && s.overlay_anim}`}>

            <div ref={modalRef} className={`${s.modal} ${anim && !acceptSuccess && s.modal_anim}`}>
                <div className={s.header}>
                    <h2 className={s.title}>
                        Запрос возврата
                    </h2>
                    <IconClose onClick={handleCloseModal} />
                </div>

                <div className={s.tabs}>
                    <div className={`${s.tab} ${s.tab_active}`}><p>Частичный</p></div>
                    <div className={`${s.tab} ${s.tab_disabled}`}><p>Полный</p></div>
                </div>

                <ul className={s.position}>
                    {positions.map(el => {
                        return <li id={el.id}>
                            <div className={s.position__header}>
                                <div className={`${s.checkbox} ${s.checkbox_check}`}>
                                    <div>
                                        <IconCheck />
                                    </div>
                                </div>
                                <p>{el.name}</p>
                            </div>
                        </li>
                    })}
                </ul>

                <div className={s.block}>
                    <p className={s.sub}>Причина возврата</p>
                    <textarea onKeyDown={handleEnterSend} ref={textRef} onChange={handleComment} className={s.comment} placeholder='Комментарий к отказу'></textarea>
                </div>

                <button disabled={disabled} onClick={handleConfirm} className={s.button}>
                    {loadAccept &&
                        <p>
                            {role == 'administrator' && 'Оформляем возврат'}
                            {role !== 'administrator' && 'Отправляем запрос на возврат'}
                        </p>}
                    {!loadAccept && <p>
                        {role == 'administrator' && 'Оформить возврат'}
                        {role !== 'administrator' && 'Отправить запрос на возврат'}
                    </p>}
                    {loadAccept && <LoaderButton color={'#FFFFFF'} />}
                </button>
                <span className={s.text_err}>{err ? 'Произошла ошибка при оформлении возврата' : ''}</span>
            </div>

            <div className={`${s.success} ${acceptSuccess && s.success_anim}`}>
                <div className={s.close}><IconClose /></div>
                <IconSuccess />
                <h2 className={`${s.title} ${s.title_success}`}>
                    {role == 'administrator' && 'Возврат оформлен'}
                    {role !== 'administrator' && 'Запрос на возврат отправлен'}
                </h2>
                <p className={s.text}></p>
            </div>
        </div>
    )
};

export default PurchaseReturn;