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


const DeleteModal = ({ windowRef, setModal, id, type, loadDelete, setLoadDelete, setLogs, handleClosePurchase }) => {
    const [anim, setAnim] = useState(false);
    const modalRef = useRef();
    const dispatch = useDispatch();
    //Фиксация окна при открытии модалки
   
     useEffect(() => {
        windowRef.current.style.overflow = "hidden";
       /*  windowRef.current.style.paddingRight = "8px"; */
        return () => {
            windowRef.current.style.overflowY = "auto";
            windowRef.current.style.paddingRight = "0";
        };
    }, [windowRef]);

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
                dispatch(setPurchasesDelete(id));
               
                setLoadDelete(false);
               
                setAnim(false);
                setTimeout(() => {
                    handleClosePurchase();
                    setModal(false);
                    dispatch(setUpdateAction());
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
                dispatch(setPurchasesDelete(id));
              
                setAnim(false);
                setTimeout(() => {
                    handleClosePurchase();
                    setModal(false);
                    setLoadDelete(false);
                    dispatch(setUpdateAction());
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
                dispatch(setPurchasesDelete(id));
             
                setAnim(false);
                setTimeout(() => {
                    handleClosePurchase();
                    setModal(false);
                    setLoadDelete(false);
                    dispatch(setUpdateAction());
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
                dispatch(setOrderDelete(id));
                dispatch(setUpdateAction());
                setAnim(false);
                setTimeout(() => {
                    setModal(false);
                    setLoadDelete(false);
                    handleClosePurchase();
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