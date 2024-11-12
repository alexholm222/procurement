import { useEffect, useState, useRef } from 'react';
import s from './DeleteModal.module.scss';
import { ReactComponent as IconClose } from '../../image/iconClose.svg';
import { useDispatch } from 'react-redux';
import { ReactComponent as IconButtonDelete } from '../../image/icon/purchase/iconButtonDelete.svg';
//API
import { deletePurchase, deleteRejectPurchase, deletePurchaseAdmin, deleteOrder } from '../../Api/Api';
//slice
import { setPurchasesDelete, setOrderDelete } from '../../store/reducer/purchaseUpdate/slice';
import { setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
//component
import LoaderButton from '../LoaderButton/LoaderButton';


const DeleteModal = ({ setModal, id, type, loadDelete, setLoadDelete, setLogs, handleClosePurchase }) => {
    const [anim, setAnim] = useState(false);
    const modalRef = useRef();
    const dispatch = useDispatch();
    console.log(type)
    //Фиксация окна при открытии модалки
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = "8px";
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0";
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, []);

    const handleCloseModal = () => {
        setAnim(false);
        setTimeout(() => {
            setModal(false);
        }, 300)
    }

    const handleDelete = () => {
        setLoadDelete(true)
        deletePurchase({ id: id })
            .then(res => {
                console.log(res);
                dispatch(setPurchasesDelete(id));
                handleClosePurchase();
                setLoadDelete(false);
                dispatch(setUpdateAction());
                setAnim(false);
                setTimeout(() => {
                    setModal(false);
                }, 300)
            })
            .catch(err => {
                setAnim(false);
            })
    }

    const handleDeletePurchase = () => {
        setLoadDelete(true)
        deleteRejectPurchase(id)
            .then(res => {
                console.log(res);
                dispatch(setPurchasesDelete(id));
                handleClosePurchase();
                dispatch(setUpdateAction());
                setAnim(false);
                setTimeout(() => {
                    setModal(false);
                    setLoadDelete(false);
                }, 300)
            })
            .catch(err => {
                setAnim(false);
            })
    }

    const handleDeletePurchaseAdmin = () => {
        setLoadDelete(true)
        deletePurchaseAdmin({ id: id })
            .then(res => {
                console.log(res);
                dispatch(setPurchasesDelete(id));
                handleClosePurchase();
                dispatch(setUpdateAction());
                setAnim(false);
                setTimeout(() => {
                    setModal(false);
                    setLoadDelete(false);
                }, 300)
            })
            .catch(err => {
                setAnim(false);
            })
    }

    const handleDeleteOrder = () => {
        setLoadDelete(true)
        deleteOrder({ id: id })
            .then(res => {
                console.log(res);
                dispatch(setOrderDelete(id));
                handleClosePurchase();
                dispatch(setUpdateAction());
                setAnim(false);
                setTimeout(() => {
                    setModal(false);
                    setLoadDelete(false);
                }, 300)
            })
            .catch(err => {
                setAnim(false);
            })
    }


    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleCloseModal();
            return
        }
    }

    const handleConfirmDelete = () => {
        if (type == 'save') {
            handleDelete()
            return
        }

        if (type == 'reject') {
            handleDeletePurchase()
            return
        }

        if (type == 'admin') {
            handleDeletePurchaseAdmin()
            return
        }

        
        if (type == 'order') {
            handleDeleteOrder()
            return
        }
    }




    useEffect(() => {
        document.addEventListener('mousedown', closeModal);
        return () => document.removeEventListener('mousedown', closeModal);
    }, []);

    return (
        <div className={`${s.overlay} ${anim && s.overlay_anim}`}>
            <div ref={modalRef} className={`${s.modal} ${anim && s.modal_anim}`}>
                <div className={s.header}>
                    <h2 className={s.title}>
                        Удаление закупки
                    </h2>
                    <IconClose onClick={handleCloseModal} />
                </div>
                <p className={s.text}>
                    Закупка будет удалена навсегда
                </p>
                <button onClick={handleConfirmDelete} className={s.button}>
                    {loadDelete && <p>Удаляем</p>}
                    {!loadDelete && <p>Удалить</p>}
                    {!loadDelete && <IconButtonDelete />}
                    {loadDelete && <LoaderButton color={'#FFFFFF'} />}
                </button>
            </div>
        </div>
    )
};

export default DeleteModal;