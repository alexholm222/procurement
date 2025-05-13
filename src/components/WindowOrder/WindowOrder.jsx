import s from './WindowOrder.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
//icon 

import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
import { ReactComponent as IconTakeWork } from '../../image/icon/order/iconTakeWork.svg';

import { ReactComponent as IconArrowBack } from '../../image/icon/purchase/iconArrowBack.svg';
import { ReactComponent as IconButtonDelete } from '../../image/icon/purchase/iconButtonDelete.svg';
//API
import { getOrderFiles, createOrder, takeOrder, getOrder, createPurchaseFromOrder } from '../../Api/Api';
//components
import Log from '../Log/Log';
import Options from '../Options/Options';
import Documents from '../Documents/Documents';
import StatusBage from './StatusBage/StatusBage';
import LoaderButton from '../LoaderButton/LoaderButton';
import DeleteModal from '../DeleteModal/DeleteModal';
//slice
import { setOrder } from '../../store/reducer/purchase/slice';
import { setOrderUpdate, setOrderNew, setUpdateOrder } from '../../store/reducer/purchaseUpdate/slice';
import { setPurchase } from '../../store/reducer/purchase/slice';
import { setPurchaseNew } from '../../store/reducer/purchaseUpdate/slice';
//selector
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//utils 
import { handleExistingFiles } from '../../utils/handleExistingFiles';
import { HandledatePurchase, dateNow2 } from '../../utils/date';


function WindowOrder({ id, role, order, personIsView, loadParametrs }) {
    const payersActive = useSelector(purchaseSelector).payers;
    const payersAll = useSelector(purchaseSelector).payersAll;
    const [anim, setAnim] = useState(false);
    const [paymentType, setPaymentType] = useState('');
    const [personId, setPersonId] = useState(order.personId || -1);
    const [idCreate, setIdCreate] = useState(order.id || '');
    const [disabled, setDisabled] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    const [loadCreate, setLoadCreate] = useState(false);
    const [loadDelete, setLoadDelete] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [scrollTopHeight, setScrollTopHeight] = useState(0);
    const [status, setStatus] = useState(order.status || -2);
    const [logs, setLogs] = useState(order.logs || []);
    const [updateLogs, setUpdateLogs] = useState(0)
    const [comment, setComment] = useState(order.comment || '');
    const [dateCreate, setDateCreate] = useState(order.dateCreate || '');
    const [payerId, setPayerId] = useState(order?.payerId || '');
    const [categoryId, setCategoryId] = useState(order?.categoryId || '');
    const [isNal, setIsNal] = useState(order.isNal || false);
    const [documents, setDocuments] = useState([]);
    const [files, setFiles] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState('save');
    const [typeReject, setTypeReject] = useState('reject');
    const [owner, setOwner] = useState(order.personId || 0);
    const [personView, setPersonView] = useState(personIsView.id || 0)
    const [loadDocuments, setLoadDocuments] = useState(false);
    const [payers, setPayers] = useState([])
    const dispatch = useDispatch();
    const windowRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, []);

    useEffect(() => {
        const result = payersActive.find(el => el.id == payerId);

        const payers = (result?.id || id == '') ? payersActive : payersAll;
        setPayers(payers)
    }, [payersAll, payersActive])

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

    useEffect(() => {
        id !== '' && setLoadDocuments(true)
        id !== '' && getOrderFiles(id)
            .then(res => {

                const order = res.data.order;
                const existingFiles = [
                    { id: uuid(), file: order?.bill, name: order?.bill?.includes('uploads') ? order?.bill?.split('/').pop() : order?.bill?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: order?.bill2, name: order?.bill2?.includes('uploads') ? order?.bill2?.split('/').pop() : order?.bill2?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: order?.bill3, name: order?.bill3?.includes('uploads') ? order?.bill3?.split('/').pop() : order?.bill3?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: order?.bill4, name: order?.bill4?.includes('uploads') ? order?.bill4?.split('/').pop() : order?.bill4?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: order?.bill5, name: order?.bill5?.includes('uploads') ? order?.bill5?.split('/').pop() : order?.bill5?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: order?.bill6, name: order?.bill6?.includes('uploads') ? order?.bill6?.split('/').pop() : order?.bill6?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: order?.bill7, name: order?.bill7?.includes('uploads') ? order?.bill7?.split('/').pop() : order?.bill7?.split('filename=').pop().split('&').shift(), type: 'existing' },
                ].filter(order => order.file && order.file !== null);
                setDocuments(existingFiles)
                setLoadDocuments(false)
            })
            .catch(err => console.log(err))
    }, [id])



    useEffect(() => {
        const files = documents.filter(el => el.type !== 'existing').map(el => el.file);
        setFiles(files)
    }, [documents])

    //Фиксация окна при открытии закупки
    useEffect(() => {
        document.body.style.overflow = "hidden";
   /*      document.body.style.paddingRight = "8px"; */
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
                files: /* order.existingFiles */[],
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
                files: /* order.existingFiles */[],
            }

            setLogs(prevState => [orderLog, ...prevState]);
            return
        }
    }, []);


    //Загрузка заявки 
    useEffect(() => {
        if (idCreate) {
            getOrder(idCreate)
                .then(res => {
                    const data = res.data;
                    const logs = data.order.order_logs.slice(1);
                    setLogs(prevState => [...prevState, ...logs])
                    /*  const orderLog = {
                         comment: 'Создана заявка на закупку',
                         date: data.order?.date_create,
                         id: data.order?.id,
                         person: data.order?.person,
                         person_id: data.order?.person_id,
                         sub_comment: data.order?.comment,
                         type: 'add',
                         files: handleExistingFiles(data.order),
                     }
                     data.order ? setLogs([orderLog, ...data.logs]) : setLogs(data.logs); */
                    /*  dispatch(setPurchasesUpdate({ ...res.data.purchase, items: res.data.purchase_items, payer: res.data.payer, logs_view: [{ is_view: 1 }] })) */

                    dispatch(setOrderUpdate({ ...data.order, logs_view: [{ is_view: 1 }] }));
                    dispatch(setUpdateOrder())
                })
                .catch(err => console.log(err))
            return
        }
    }, [idCreate]);

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
                idCreate == '' && dispatch(setOrderNew(order))
                idCreate == '' && setIdCreate(order.id)
                setStatus(order.status);
                setLoadCreate(false);
                setOwner(order.person_id);
                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: order.date_create,
                    id: order.id,
                    person: order.person,
                    person_id: order.person_id,
                    sub_comment: order.comment,
                    type: 'add',
                    files: []/*  handleExistingFiles(order) */
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

                /*   const purchaseForOpen = {
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
                  dispatch(setPurchaseNew(purchase))
                  dispatch(setPurchase(purchaseForOpen)); */
                dispatch(setUpdateOrder())
                /*  setTimeout(() => {
                     handleCloseOrder();
                 }, 200) */

                /* const documents = handleExistingFiles(purchase);
                setDocuments(documents); */
                /*    setTimeout(() => {handleClosePurchase()}, 600); */
            })
            .catch(err => console.log(err))
    }

    const handleCreatePurchaseFromOrder = () => {
        setLoadCreate(true);
        createPurchaseFromOrder({ id: idCreate })
            .then(res => {
                const order = res.data.order;
                const purchase = res.data.purchase;
                dispatch(setOrderUpdate(order));
                setStatus(2);
                setLoadCreate(false);

                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: order.date_create,
                    id: order.id,
                    person: order.person,
                    person_id: order.person_id,
                    sub_comment: order.comment,
                    type: 'add',
                    files: []/* handleExistingFiles(order) */
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
                dispatch(setPurchaseNew(purchase))
                dispatch(setPurchase(purchaseForOpen));
                dispatch(setUpdateOrder())
                setTimeout(() => {
                    handleCloseOrder();
                }, 200)

                /* const documents = handleExistingFiles(purchase);
                setDocuments(documents); */
                /*    setTimeout(() => {handleClosePurchase()}, 600); */
            })
            .catch(err => console.log(err))
    }

    const handleDelete = () => {
        setDeleteType('order')
        setDeleteModal(true)
    }




    return (
        <div ref={windowRef} onScroll={handleScrollTop} className={`${s.window} ${anim && s.window_anim}`}>
            <div className={s.container}>
                <div className={s.header}>
                    <h2><IconArrowBack onClick={handleCloseOrder} />{id ? `Заявка от ${HandledatePurchase(dateCreate)}` : `Создание заявки`} <StatusBage status={status} role={role} /></h2>
                    <div className={s.buttons}>

                        {(role == 'administrator' || personView == owner) && status !== -2 && <button onClick={handleDelete} disabled={disabledButton} className={`${s.button} ${s.button_cancle}`}>
                            <p>Удалить</p>
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonDelete />}
                        </button>}


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

                        {status == 1 && (role == 'hr-assist' || owner == personView) && <button disabled={false} onClick={handleCreatePurchaseFromOrder} className={`${s.button} ${s.button_main}`}>
                            {loadCreate && <p>Создаем закупку</p>}
                            {!loadCreate && <p>Создать закупку</p>}
                            {loadCreate && <LoaderButton color={'#FFFFFF'} />}
                            {!loadCreate && <IconTakeWork />}
                        </button>}

                        {/*  {status == 1 && owner == personView && <button disabled={false} onClick={handleCreatePurchaseFromOrder} className={`${s.button} ${s.button_main}`}>
                            {loadCreate && <p>Создаем закупку</p>}
                            {!loadCreate && <p>Создать закупку</p>}
                            {loadCreate && <LoaderButton color={'#FFFFFF'} />}
                            {!loadCreate && <IconTakeWork />}
                        </button>} */}

                    </div>
                </div>
                <div className={s.main}>
                    <div className={s.param}>

                        <h3 className={s.title}>Параметры</h3>
                        <Options type={'categories'} sub={'Тип закупки'} payers={payers} categoryId={Number(categoryId)} setCategoryId={setCategoryId} purchaseId={id} disabled={disabled /* || loadSave */} />
                        <Options type={'payers'} sub={'Покупатель'} payers={payers} payerId={Number(payerId)} setPayerId={setPayerId} isNal={isNal} setPaymentType={setPaymentType} purchaseId={id} disabled={disabled /* || loadSave || loadAproval */} />
                    </div>
                    <div className={s.comment}>
                        <h3 className={s.title}>Позиции к закупке</h3>
                        <textarea disabled={disabled} onChange={handleComment} value={comment || ''} placeholder='Напиши здесь позиции и описание к ним'></textarea>
                    </div>
                    <Documents documents={documents} setDocuments={setDocuments} disabled={disabled} setDeleteFiles={setDeleteFiles} setSaveSuccess={setCreateSuccess} windowRef={windowRef} scrollTopHeight={scrollTopHeight} loadDocuments={loadDocuments} />
                    <Log logs={logs} setLogs={setLogs} personView={personView} role={order.position} windowRefImage={windowRef} scrollTopHeight={scrollTopHeight} send={status !== -2} id={idCreate} type={'order'} />
                    {deleteModal ? <DeleteModal windowRef={windowRef} setModal={setDeleteModal} id={idCreate} type={deleteType} setLoadDelete={setLoadDelete} loadDelete={loadDelete} setLogs={setLogs} handleClosePurchase={handleCloseOrder} /> : ''}
                </div>
            </div>
        </div>

    )
};

export default WindowOrder;