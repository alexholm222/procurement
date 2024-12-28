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


const PurchaseReturn = ({ windowRef, setModal, id, setStatus, loadAccept, setLoadAccept, acceptSuccess, setAcceptSuccess, setLogs, role, positions, setPositionReturn, setPositions }) => {
    const [anim, setAnim] = useState(false);
    const [full, setFull] = useState(false);
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
        if (comment.length > 0 && positionForReturn.length > 0 && !full) {
            setDisabled(false)
            return
        }

        if ((comment.length == 0 || positionForReturn.length == 0) && !full) {
            setDisabled(true)
            return
        }

        if (comment.length > 0 && full) {
            setDisabled(false)
            return
        }

        if (comment.length == 0 && full) {
            setDisabled(true)
            return
        }


    }, [positionForReturn, comment, full])


    const handleAddPosition = (e) => {
        const id = Number(e.currentTarget.id);
        const result = positionForReturn.filter(el => el.id == id)
        const filter = positionForReturn.filter(el => el.id !== id)
        const position = positions.find(el => el.id == id)
        console.log(result, id)

        if (result.length == 0) {
            setPositionForReturn(prevState => [...prevState, { id: position?.id, quantity: position?.quantity }])
            return
        }

        if (result.length !== 0) {
            setPositionForReturn(filter)
            return
        }
    }

    const handleChangeQuantity = (e) => {
        const id = Number(e.currentTarget.id);
        console.log(id)
        const value = Number(e.currentTarget.value);
        const index = positionForReturn.findIndex(el => el.id == id);
        const maxQuantity = Number(positions.find(el => el.id == id).quantity);
        console.log(value)
        const copyArr = [...positionForReturn]
        copyArr[index] = { id: id, quantity: value > maxQuantity ? maxQuantity : value <= 0 ? '' : value }
        setPositionForReturn(copyArr)


    }

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

        setComment(text)
    }

    const handleEnterSend = (e) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            handleConfirm();
        }
    }

    const handleActiveTab = (e) => {
        const id = e.currentTarget.id;
        id == 1 ? setFull(false) : setFull(true)
    }

    const handleConfirm = () => {
        setLoadAccept(true)

        refund(id, full, comment, full ? [] : positionForReturn)
            .then(res => {
                console.log(res)
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                const returnPos = purchase.return_items.filter(el => el.status == 'requested')
                setLoadAccept(false);
                setStatus(purchase.status);
                dispatch(setPurchasesUpdate(purchase));
                setAcceptSuccess(true);
                setPositionReturn(returnPos);
                setPositions(purchase.items)
                setLogs(purchase.logs);
                dispatch(setUpdateAction());

            })
            .catch(err => setErr(false));
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
                    <div id='1' onClick={handleActiveTab} className={`${s.tab} ${!full && s.tab_active}`}><p>Частичный</p></div>
                    <div id='2' onClick={handleActiveTab} className={`${s.tab} ${full && s.tab_active}`}><p>Полный</p></div>
                </div>

                <ul className={`${s.position} ${full && s.position_hidden}`}>
                    {positions.map(el => {
                        return <li id={el.id}>
                            <div className={s.position__header}>
                                <div onClick={handleAddPosition} id={el.id} className={`${s.checkbox} ${positionForReturn.find(elem => elem.id == el.id) && s.checkbox_check}`}>
                                    <div>
                                        <IconCheck />
                                    </div>
                                </div>
                                <p>{el.name}</p>
                            </div>

                            <div className={`${s.container} ${positionForReturn.find(elem => elem.id == el.id) && s.container_vis}`}>
                                <div className={s.block}>
                                    <p className={s.sub}>Количество</p>
                                    <div className={s.count}>
                                        <input id={el.id} onChange={handleChangeQuantity} max={el.quantity} type='number' value={positionForReturn.find(elem => elem.id == el.id)?.quantity}></input>
                                        <p className={`${s.sub} ${s.sub_count}`}>{el.unit}</p>
                                    </div>
                                </div>

                                <div className={s.block}>
                                    <p className={s.sub}>Цена</p>
                                    <div className={s.count}>
                                        <input disabled max={el.quantity} value={el.price} type='number' placeholder={`${el.price}`}></input>
                                        <p className={`${s.sub} ${s.sub_count}`}>руб</p>
                                    </div>
                                </div>

                                <div className={s.block}>
                                    <p className={s.sub}>Итого</p>
                                    <div className={s.count}>
                                        <input disabled max={el.quantity} type='number' placeholder={`${el.quantity}`} value={el.price * positionForReturn.find(elem => elem.id == el.id)?.quantity}></input>
                                        <p className={`${s.sub} ${s.sub_count}`}>руб</p>
                                    </div>
                                </div>
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
                            {(role == 'administrator' || role == 'director') && 'Оформляем возврат'}
                            {role !== 'administrator' && role !== 'director' && 'Отправляем запрос на возврат'}
                        </p>}
                    {!loadAccept && <p>
                        {(role == 'administrator' || role == 'director') && 'Оформить возврат'}
                        {role !== 'administrator' && role !== 'director' && 'Отправить запрос на возврат'}
                    </p>}
                    {loadAccept && <LoaderButton color={'#FFFFFF'} />}
                </button>
                <span className={s.text_err}>{err ? 'Произошла ошибка при оформлении возврата' : ''}</span>
            </div>

            <div className={`${s.success} ${acceptSuccess && s.success_anim}`}>
                <div className={s.close}><IconClose /></div>
                <IconSuccess />
                <h2 className={`${s.title} ${s.title_success}`}>
                    Запрос на возврат отправлен
                </h2>
                <p className={s.text}></p>
            </div>
        </div>
    )
};

export default PurchaseReturn;