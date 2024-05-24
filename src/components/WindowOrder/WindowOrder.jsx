import s from './WindowOrder.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
//icon 
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
import { ReactComponent as IconTakeWork } from '../../image/icon/order/iconTakeWork.svg';
import { ReactComponent as IconButtonAgreement } from '../../image/icon/purchase/iconButtonAgreement.svg';
import { ReactComponent as IconButtonAgreementAdmin } from '../../image/icon/purchase/iconButtonAgreementAdmin.svg';
import { ReactComponent as IconButtonAgreementRepeat } from '../../image/icon/purchase/iconButtonAgreementRepeat.svg';
import { ReactComponent as IconButtonCancel } from '../../image/icon/purchase/iconButtonCancel.svg';
import { ReactComponent as IconButtonReject } from '../../image/icon/purchase/iconButtonReject.svg';
import { ReactComponent as IconButtonSave } from '../../image/icon/purchase/iconButtonSave.svg';
import { ReactComponent as IconDone } from '../../image/iconDone.svg';
import { ReactComponent as IconArrowBack } from '../../image/icon/purchase/iconArrowBack.svg';
import { ReactComponent as IconButtonDelete } from '../../image/icon/purchase/iconButtonDelete.svg';
import { ReactComponent as IconButtonAccept } from '../../image/icon/purchase/iconButtonAccept.svg';
import { ReactComponent as IconButtonClose } from '../../image/icon/purchase/iconButtonClose.svg';
import { ReactComponent as IconButtonCloseDoc } from '../../image/icon/purchase/iconButtonCloseDoc.svg';
import { ReactComponent as IconCheck } from '../../image/icon/purchase/iconCheck.svg';
//API
import { createOrder, takeOrder } from '../../Api/Api';
//components
import Log from '../Log/Log';
import Options from '../Options/Options';
import Goods from '../Goods/Goods';
import Documents from '../Documents/Documents';
import StatusBage from './StatusBage/StatusBage';
import LoaderButton from '../LoaderButton/LoaderButton';
import Vendors from '../Vendors/Vendors';
import PurchaseAccept from '../PurchaseAccept/PurchaseAccept';
import PurchaseCloseDoc from '../PurchaseAccept/PurchaseCloseDoc';
import PurchaseConfirmPay from '../PurchaseAccept/PurchaseConfirmPay';
import PurchaseReject from '../PurchaseAccept/PurchaseReject';
import DeleteModal from '../DeleteModal/DeleteModal';
//slice
import { setOrder } from '../../store/reducer/purchase/slice';
import { setOrderUpdate, setOrderNew, setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
import { setPurchase } from '../../store/reducer/purchase/slice';
import { setPurchaseNew } from '../../store/reducer/purchaseUpdate/slice';
//utils 
import { handleExistingFiles } from '../../utils/handleExistingFiles';
import { HandledatePurchase, dateNow2 } from '../../utils/date';


function WindowOrder({ id, order, personIsView, loadParametrs }) {
    const role = document.getElementById('root_purchases').getAttribute('role');
    console.log(order)
    const [anim, setAnim] = useState(false);
    const [paymentType, setPaymentType] = useState('');
    const [personId, setPersonId] = useState(order.personId || -1);
    const [idCreate, setIdCreate] = useState(order.id || '');
    const [disabled, setDisabled] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    const [loadCreate, setLoadCreate] = useState(false);
    const [loadAproval, setLoadAproval] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [aprovalSuccess, setAprovalSuccess] = useState(false);
    const [scrollTopHeight, setScrollTopHeight] = useState(0);
    const [status, setStatus] = useState(order.status || -2);
    const [logs, setLogs] = useState(order.logs || []);
    const [updateLogs, setUpdateLogs] = useState(0)
    const [comment, setComment] = useState(order.comment || '');
    const [dateCreate, setDateCreate] = useState(order.dateCreate || '');
    const [payerId, setPayerId] = useState(order?.payerId || '');
    const [categoryId, setCategoryId] = useState(order?.categoryId || '');
    const [isNal, setIsNal] = useState(order.isNal || false);
    const [documents, setDocuments] = useState(order.existingFiles || []);
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [isPattern, setIsPattern] = useState(false);
    const [isNormalPrice, setIsNormalPrice] = useState(true);
    const [modalAccept, setModalAccept] = useState(false);
    const [modalDoc, setModalDoc] = useState(false);
    const [modalPay, setModalPay] = useState(false);
    const [modalReject, setModalReject] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState('save');
    const [typeReject, setTypeReject] = useState('reject');
    const [owner, setOwner] = useState(order.personId || 0);
    const [personView, setPersonView] = useState(personIsView.id || 0)
    const dispatch = useDispatch();
    const windowRef = useRef();

    console.log(idCreate, status, personView, order)


    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, []);

    useEffect(() => {
        status !== -2 && setDisabled(true)
    }, [status])

    useEffect(() => {
        if (comment == '') {
            setDisabledButton(true);
        } else {
            setDisabledButton(false);
        }
    }, [comment])

    useEffect(() => {
        const payment = paymentType == 'nal' ? true : false
        setIsNal(payment);
    }, [paymentType])

    //запиываем статус закпки
    useEffect(() => {
        typeof order.status !== 'undefined' && setStatus(order?.status)
    }, [order.status])

    //записываем закупку в локальное хранилище

    useEffect(() => {
        const oldFiles = documents.filter(el => el.type == 'existing').map(el => el.file);
        const files = documents.filter(el => el.type !== 'existing').map(el => el.file);
        setOldFiles(oldFiles)
        setFiles(files)
    }, [documents])

    //Фиксация окна при открытии закупки
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = "8px";
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = 0;
        };
    }, []);


    useEffect(() => {
        if (id !== '' && status !== 1) {
            const orderLog = {
                comment: 'Создана заявка на закупку',
                date: order.dateCreate,
                id: order.id,
                person: order.person,
                person_id: order.personId,
                sub_comment: order.comment,
                type: 'add',
                files: order.existingFiles,
            }
            setLogs([orderLog]);
            return
        }

        if (id !== '' && status == 1) {
            const orderLog = {
                comment: 'Создана заявка на закупку',
                date: order.dateCreate,
                id: order.id,
                person: order.person,
                person_id: order.personId,
                sub_comment: order.comment,
                type: 'add',
                files: order.existingFiles,
            }

            setLogs(prevState => [orderLog, ...prevState]);
            return
        }
    }, [])

    const handleCloseOrder = () => {
        setAnim(false)

        setTimeout(() => {
            dispatch(setOrder({ id: '', open: false }))
        }, 150);
    }

    const handleScrollTop = (e) => {
        const scroll = windowRef.current.scrollTop;
        setScrollTopHeight(scroll)
    }

    const handleComment = (e) => {
        const value = e.target.value;
        setComment(value)
        console.log(value)
    }

    const handleCreateOrder = () => {
        setLoadCreate(true);
        const formData = new FormData();
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('name', 'заявка');
        formData.append('comment', comment);
        formData.append('is_nal', isNal ? 1 : 0);
        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });
        /* deleteFiles.forEach((item) => formData.append("old_files[]", item.file)) */

        createOrder(formData)
            .then(res => {
                const order = res.data.purchase_order;
                console.log(res)
                idCreate == '' && dispatch(setOrderNew(order))
                idCreate == '' && setIdCreate(order.id)
                setStatus(order.status);
                setLoadCreate(false);
                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: order.date_create,
                    id: order.id,
                    person: order.person,
                    person_id: order.person_id,
                    sub_comment: order.comment,
                    type: 'add',
                    files: handleExistingFiles(order)
                }
                setLogs([orderLog])
            })
            .catch(err => console.log(err))
    }

    const handleTakeOrder = () => {
        setLoadCreate(true);
        takeOrder({ id: idCreate })
            .then(res => {
                const order = res.data.order;
                const purchase = res.data.purchase;
                dispatch(setOrderUpdate(order));
                console.log(res)
                setStatus(1);
                setLoadCreate(false);

                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: order.date_create,
                    id: order.id,
                    person: order.person,
                    person_id: order.person_id,
                    sub_comment: order.comment,
                    type: 'add',
                    files: handleExistingFiles(order)
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
                console.log(purchase)
                dispatch(setPurchaseNew(purchase))
                dispatch(setPurchase(purchaseForOpen));
                setTimeout(() => {
                    handleCloseOrder();
                }, 200)

                /* const documents = handleExistingFiles(purchase);
                setDocuments(documents); */
                /*    setTimeout(() => {handleClosePurchase()}, 600); */
            })
            .catch(err => console.log(err))

    }




    return (
        <div ref={windowRef} onScroll={handleScrollTop} className={`${s.window} ${anim && s.window_anim}`}>
            <div className={s.container}>
                <div className={s.header}>
                    <h2><IconArrowBack onClick={handleCloseOrder} />{id ? `Заявка от ${HandledatePurchase(dateCreate)}` : `Создание заявки`} <StatusBage status={status} role={role} /></h2>
                    <div className={s.buttons}>
                        {status == -2 && <button disabled={disabledButton} onClick={handleCreateOrder} className={`${s.button} ${s.button_main}`}>
                            {loadCreate && <p>Создаем заявку</p>}
                            {!loadCreate && <p>Создать заявку</p>}
                            {loadCreate && <LoaderButton color={'#FFFFFF'} />}
                            {!loadCreate && <IconCreate />}
                        </button>}

                        {status == 0 && role == 'hr-assist' && <button disabled={false} onClick={handleTakeOrder} className={`${s.button} ${s.button_main}`}>
                            {loadCreate && <p>Берем в работу</p>}
                            {!loadCreate && <p>Взять в работу</p>}
                            {loadCreate && <LoaderButton color={'#FFFFFF'} />}
                            {!loadCreate && <IconTakeWork />}
                        </button>}



                    </div>
                </div>
                <div className={s.main}>
                    <div className={s.param}>

                        <h3 className={s.title}>Параметры</h3>
                        <Options type={'categories'} sub={'Тип закупки'} categoryId={Number(categoryId)} setCategoryId={setCategoryId} purchaseId={id} disabled={disabled /* || loadSave */} />
                        <Options type={'payers'} sub={'Покупатель'} payerId={Number(payerId)} setPayerId={setPayerId} isNal={isNal} setPaymentType={setPaymentType} purchaseId={id} disabled={disabled /* || loadSave || loadAproval */} />
                    </div>
                    <div className={s.comment}>
                        <h3 className={s.title}>Позиции к закупке</h3>
                        <textarea onChange={handleComment} value={comment || ''} placeholder='Напиши здесь позиции и описание к ним'></textarea>
                    </div>
                    <Documents documents={documents} setDocuments={setDocuments} disabled={disabled} setDeleteFiles={setDeleteFiles} setSaveSuccess={setCreateSuccess} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                    <Log logs={logs} personView={personView} role={order.position} windowRefImage={windowRef} scrollTopHeight={scrollTopHeight} />

                </div>
            </div>
        </div>

    )
};

export default WindowOrder;