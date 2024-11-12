import s from './WindowPurchase.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
//icon 
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
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
import { ReactComponent as IconButtonReturn } from '../../image/icon/purchase/iconButtonReturn.svg';
//API
import {
    getPurchase, savePurchase, createPurchase, createPurchaseAdmin,
    recalPurchase, deleteRejectPurchase, approveAdmin, rejectPurchase,
    createPayment, confirmPayment, rejectPayment, endPurchase,
    deletePurchase, createPurchaseLeader, approveLeader
} from '../../Api/Api'
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
import PurchaseReturn from '../PurchaseReturn/PurchaseReturn';
//slice
import { setPurchase } from '../../store/reducer/purchase/slice';
import { setPurchasesUpdate, setPurchaseNew, setPurchasesDelete, setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
//utils 
import { handleExistingFiles } from '../../utils/handleExistingFiles';
import { HandledatePurchase } from '../../utils/date';

function WindowPurchase({ id, purchase, loadParametrs }) {
    const role = document.getElementById('root_purchases').getAttribute('role');
    const [anim, setAnim] = useState(false);
    const [personId, setPersonId] = useState(purchase.personId || -1);
    const [idCreate, setIdCreate] = useState(id || '');
    const [disabled, setDisabled] = useState(purchase?.status > 0 && role !== 'administrator' ? true : false);
    const [disabledButton, setDisabledButton] = useState(false);
    const [loadSave, setLoadSave] = useState(false);
    const [loadAproval, setLoadAproval] = useState(false);
    const [loadRecall, setLoadRecall] = useState(false);
    const [loadDelete, setLoadDelete] = useState(false);
    const [loadAccept, setLoadAccept] = useState(false);
    const [loadCloseDoc, setLoadCloseDoc] = useState(false);
    const [loadPay, setLoadPay] = useState(false);
    const [acceptSuccess, setAcceptSuccess] = useState(false);
    const [closeDocSuccess, setCloseDocSuccess] = useState(false);
    const [paySuccess, setPaySuccess] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [aprovalSuccess, setAprovalSuccess] = useState(false);
    const [recallSuccess, setRecallSuccess] = useState(false);
    const [scrollTopHeight, setScrollTopHeight] = useState(0);
    const [status, setStatus] = useState(-2);
    const [reject, setReject] = useState(purchase.reject || false)
    const [logs, setLogs] = useState(purchase.logs || []);
    const [updateLogs, setUpdateLogs] = useState(0)
    const [dateCreate, setDateCreate] = useState(purchase.dateCreate || '');
    const [positions, setPositions] = useState(purchase.positions || []);
    const [sum, setSum] = useState(purchase.sum || 0);
    const [vendorId, setVendorId] = useState(purchase?.vendorId || '');
    const [contractVendorId, setContractVendorId] = useState(/* purchase?.contractVendorId || */ '');
    const [payerId, setPayerId] = useState(purchase?.payerId || '');
    const [paymentType, setPaymentType] = useState(purchase.isNal ? 'nal' : 'beznal')
    const [categoryId, setCategoryId] = useState(purchase?.categoryId || '');
    const [isNal, setIsNal] = useState(purchase.isNal || false);
    const [inStock, setInStock] = useState(false);
    const [documents, setDocuments] = useState(purchase.existingFiles || []);
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [isPattern, setIsPattern] = useState(false);
    const [isNormalPrice, setIsNormalPrice] = useState(true);
    const [modalAccept, setModalAccept] = useState(false);
    const [modalDoc, setModalDoc] = useState(false);
    const [modalPay, setModalPay] = useState(false);
    const [modalPayNal, setModalPayNal] = useState(false);
    const [modalPayNal2, setModalPayNal2] = useState(false);
    const [modalReject, setModalReject] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState('save');
    const [typeReject, setTypeReject] = useState('reject');
    const [owner, setOwner] = useState(purchase.personId || 0);
    const [personView, setPersonView] = useState(purchase.personId || 0);
    const [order, setOrder] = useState({});
    const [payDate, setPayDate] = useState('');
    const [returnModal, setReturnModal] = useState(false);
    console.log(payDate)
    const dispatch = useDispatch();
    const windowRef = useRef();
    console.log(status, purchase)

    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, []);

    //запиываем статус закпки
    useEffect(() => {
        typeof purchase.status !== 'undefined' && setStatus(purchase?.status)
    }, [purchase.status])

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
            document.body.style.paddingRight = "0";
        };
    }, []);
    console.log(logs)

    //Загрузка закупки 
    useEffect(() => {
        if (idCreate) {
            getPurchase(idCreate)
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    console.log(data)
                    const orderLog = {
                        comment: 'Создана заявка на закупку',
                        date: data.order?.date_create,
                        id: data.order?.id,
                        person: data.order?.person,
                        person_id: data.order?.person_id,
                        sub_comment: data.order?.comment,
                        type: 'add',
                        files: handleExistingFiles(data.order),
                    }
                    console.log(data.logs)

                    data?.order_logs && data?.order_logs !== null ? setLogs([orderLog, ...data?.order_logs?.order_logs?.slice(1), ...data.logs]) : setLogs(data.logs);

                    setPersonView(data.person_view.id);
                    setPersonId(data.purchase.person_id);
                    data.order && setOrder(data.order);
                    dispatch(setPurchasesUpdate({ ...res.data.purchase, items: res.data.purchase_items, payer: res.data.payer, logs_view: [{ is_view: 1 }] }))
                })
                .catch(err => console.log(err))
            return
        }
    }, [idCreate]);

    useEffect(() => {
        const payment = paymentType == 'nal' ? true : false
        setIsNal(payment);
    }, [paymentType])

    console.log(isPattern, isNormalPrice)
    //Определяем есть ли в закупке товары по шаблону и если ли среди них с превышенной максимальной ценой
    useEffect(() => {
        const el = positions.find(el => el.item_id == 0);
        el ? setIsPattern(false) : setIsPattern(true);
    }, [positions]);

    //Определяем в закупке по шаблону все ли позиции имеют цену не превышающую максимальную
    useEffect(() => {
        if (isPattern) {
            const el = positions.find(el => el.price > el.maxPrice);
            el ? setIsNormalPrice(false) : setIsNormalPrice(true)
        }
        console.log(positions)

    }, [positions, isPattern])

    //Блокируем изменения
    useEffect(() => {
        if (role !== 'administrator' && status > 0) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [status])

    //disabled кнопок
    useEffect(() => {
        setSaveSuccess(false)
        if (payerId == '' || categoryId == '' || positions.length == 0 || (vendorId == '' && !isNal)) {
            setDisabledButton(true)
        } else {
            setDisabledButton(false)
        }

    }, [payerId, categoryId, positions, vendorId, contractVendorId, isNal]);

    useEffect(() => {

        if ((status == 0 || status == 1 || status == 2 || status == -2) && role == 'administrator') {
            setInStock(true);
        } else {
            setInStock(purchase.inStock)
        }
    }, [purchase, role]);

    useEffect(() => {
        if (categoryId == 12) {
            setInStock(false);
            return
        }
    }, [categoryId])

    const handleClosePurchase = () => {
        setAnim(false)

        setTimeout(() => {
            dispatch(setPurchase({ id: '', open: false }))
        }, 150);
    }

    const handleScrollTop = (e) => {
        const scroll = windowRef.current.scrollTop;
        setScrollTopHeight(scroll)
    }

    const handleOpenModalAccept = () => {
        setModalAccept(true)
    }

    const handleOpenModalDoc = () => {
        setModalDoc(true)
    }

    const handleInStock = () => {
        inStock ? setInStock(false) : setInStock(true);
    }

    const handleSave = () => {
        setLoadSave(true);
        const formData = new FormData();
        formData.append('id', id);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', isNal ? 1 : 0);
        formData.append('person_id', role == 'administrator' ? '43' : '3651')
        /* vendorId !== null && vendorId && */ formData.append('stock_vendor_id', vendorId);
        /* contractVendorId !== null && contractVendorId && */ formData.append('stock_vendor_contracts_id', contractVendorId);
        positions.forEach((item, index) => {
            Object.keys(item).forEach((key) => {
                formData.append(`items[${index}][${key}]`, item[key]);
            });
        });

        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });

        deleteFiles.forEach((item) => formData.append("old_files[]", item.file))

        savePurchase(formData)
            .then(res => {
                const purchase = res.data.purchase;
                console.log(purchase)
                idCreate == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                idCreate == '' && setIdCreate(purchase.id);
                setStatus(purchase.status);
                setLoadSave(false);
                setSaveSuccess(true);
                /* const documents = handleExistingFiles(purchase);
                setDocuments(documents); */
                /*    setTimeout(() => {handleClosePurchase()}, 600); */
            })
            .catch(err => console.log(err))

    }

    const handleAproval = () => {
        setLoadAproval(true);
        const formData = new FormData();
        formData.append('id', idCreate);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', isNal ? 1 : 0);
        isNal == 1 && formData.append('pay_date', payDate);
        vendorId !== null && vendorId && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && contractVendorId && formData.append('stock_vendor_contracts_id', contractVendorId);
        formData.append('is_pattern', isPattern ? 1 : 0);
        formData.append('is_price_normal', isNormalPrice ? 1 : 0);
        role == 'administrator' && formData.append('in_stock', inStock ? 1 : 0);
        positions.forEach((item, index) => {
            Object.keys(item).forEach((key) => {
                formData.append(`items[${index}][${key}]`, item[key]);
            });
        });

        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });

        deleteFiles.forEach((item) => formData.append("old_files[]", item.file));

        if (role == 'administrator') {
            createPurchaseAdmin(formData)
                .then(res => {
                    console.log('Созданная админом закупка', res.data)
                    const purchase = res.data.purchase;
                    setOwner(purchase.person_id)
                    idCreate == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                    idCreate == '' && setIdCreate(purchase.id);
                    setStatus(purchase.status);
                    setLoadAproval(false);
                    setReject(purchase.is_reject);
                    setAprovalSuccess(true);
                    setLogs(purchase.logs);
                    dispatch(setUpdateAction());
                    /* handleClosePurchase(); */
                })
                .catch(err => console.log(err))
            return
        } else {
            createPurchase(formData)
                .then(res => {
                    const purchase = res.data.purchase;
                    const order = res.data.purchase.order;
                    setOwner(purchase.person_id)
                    console.log('закупка создана админом', purchase)
                    idCreate == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                    idCreate == '' && setIdCreate(purchase.id);
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
                    setLoadAproval(false);
                    setStatus(purchase.status);
                    setReject(purchase.is_reject);
                    setAprovalSuccess(true);
                    dispatch(setUpdateAction());
                    /* handleClosePurchase(); */
                })
                .catch(err => console.log(err))
            return
        }
    }

    const handleAprovalLeader = () => {
        setLoadAproval(true);
        const formData = new FormData();
        formData.append('id', idCreate);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', isNal ? 1 : 0);
        vendorId !== null && vendorId && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && contractVendorId && formData.append('stock_vendor_contracts_id', contractVendorId);
        formData.append('is_pattern', isPattern ? 1 : 0);
        formData.append('is_price_normal', isNormalPrice ? 1 : 0);
        role == 'administrator' && formData.append('in_stock', inStock ? 1 : 0);
        positions.forEach((item, index) => {
            Object.keys(item).forEach((key) => {
                formData.append(`items[${index}][${key}]`, item[key]);
            });
        });

        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });

        deleteFiles.forEach((item) => formData.append("old_files[]", item.file));
        createPurchaseLeader(formData)
            .then(res => {
                console.log('Созданная админом закупка', res.data)
                const purchase = res.data.purchase;
                setOwner(purchase.person_id)
                idCreate == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                idCreate == '' && setIdCreate(purchase.id);
                setStatus(purchase.status);
                setLoadAproval(false);
                setReject(purchase.is_reject);
                setAprovalSuccess(true);
                setLogs(purchase.logs);
                dispatch(setUpdateAction());
                /* handleClosePurchase(); */
            })
            .catch(err => console.log(err))
        return
    }


    const handleConfirmAproval = () => {
        setLoadAproval(true);
        const formData = new FormData();
        console.log(id)
        formData.append('id', idCreate);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', isNal ? 1 : 0);
        isNal == 1 && formData.append('pay_date', payDate);
        vendorId !== null && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && formData.append('stock_vendor_contracts_id', contractVendorId);
        role == 'administrator' && formData.append('in_stock', inStock ? 1 : 0);
        formData.append('is_pattern', isPattern ? 1 : 0);
        formData.append('is_price_normal', isNormalPrice ? 1 : 0);
        positions.forEach((item, index) => {
            Object.keys(item).forEach((key) => {
                formData.append(`items[${index}][${key}]`, item[key]);
            });
        });

        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });

        deleteFiles.forEach((item) => formData.append("old_files[]", item.file));

        approveAdmin(formData)
            .then(res => {
                console.log('Закупка согласованна админом и отправлена на оплату', res.data)
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                setOwner(purchase.person_id)
                idCreate == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                idCreate == '' && setIdCreate(purchase.id);
                setStatus(purchase.status);
                setLoadAproval(false);
                setReject(purchase.is_reject);
                setAprovalSuccess(true);
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
                dispatch(setUpdateAction());
                /* handleClosePurchase(); */
            })
            .catch(err => console.log(err))
    }

    const handleConfirmAprovalLeader = () => {
        setLoadAproval(true);
        const formData = new FormData();
        console.log(id)
        formData.append('id', idCreate);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', isNal ? 1 : 0);
        vendorId !== null && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && formData.append('stock_vendor_contracts_id', contractVendorId);
        role == 'administrator' && formData.append('in_stock', inStock ? 1 : 0);
        formData.append('is_pattern', isPattern ? 1 : 0);
        formData.append('is_price_normal', isNormalPrice ? 1 : 0);
        positions.forEach((item, index) => {
            Object.keys(item).forEach((key) => {
                formData.append(`items[${index}][${key}]`, item[key]);
            });
        });

        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });

        deleteFiles.forEach((item) => formData.append("old_files[]", item.file));

        approveLeader(formData)
            .then(res => {
                console.log('Закупка согласованна админом и отправлена на оплату', res.data)
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                setOwner(purchase.person_id)
                idCreate == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                idCreate == '' && setIdCreate(purchase.id);
                setStatus(purchase.status);
                setLoadAproval(false);
                setReject(purchase.is_reject);
                setAprovalSuccess(true);
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
                dispatch(setUpdateAction());
                /* handleClosePurchase(); */
            })
            .catch(err => console.log(err))
    }

    const handleRejectPurchase = () => {
        setModalReject(true);
        setTypeReject('reject')
    }



    const handleRecall = () => {
        setLoadRecall(true)
        recalPurchase(idCreate)
            .then(res => {
                setAprovalSuccess(false)
                console.log(res);
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                setLoadRecall(false);
                setStatus(purchase.status);
                dispatch(setPurchasesUpdate(purchase))
                setRecallSuccess(true);
                setReject(purchase.is_reject);
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
                dispatch(setUpdateAction());
                /* handleClosePurchase(); */

            })
            .catch(err => console.log(err))
    }
    //удаление отклоненой закупки
    const handleDeletePurchase = () => {
        setDeleteType('reject')
        setDeleteModal(true)
    }
    //удаление любой закупки админом
    const handleDeleteAdmin = () => {
        setDeleteType('admin')
        setDeleteModal(true)
    }

    //Удаление сохраненой закупки
    const handleDelete = () => {
        setDeleteType('save')
        setDeleteModal(true)
    }
    //подтвержление оплаты админом
    const handleConfirmPayment = () => {
        setModalPay(true)
    }

    //отклонение оплаты админом
    const handleRejectPayment = () => {
        setModalReject(true);
        setTypeReject('rejectPay')
    }

    //бухгалтер
    const handleCreatePayment = () => {
        setAprovalSuccess(false);
        setLoadAproval(true)
        createPayment({ id: Number(idCreate) })
            .then(res => {
                console.log(res);
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                setStatus(purchase.status);
                dispatch(setPurchasesUpdate(purchase))
                setLoadAproval(false);
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
                dispatch(setUpdateAction());
                /* handleClosePurchase(); */
            })
            .catch(err => console.log(err))
    }

    //Все 
    const handleEndPurchase = () => {
        setLoadAproval(true)
        endPurchase({ id: idCreate })
            .then(res => {
                console.log(res);
                const purchase = res.data.purchase;
                const order = res.data.purchase.order;
                setStatus(purchase.status);
                dispatch(setPurchasesUpdate(purchase))
                setLoadAproval(false);
                setAprovalSuccess(true);
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
                dispatch(setUpdateAction());
                handleClosePurchase();
            })
            .catch(err => console.log(err))
    }

    const handleReturnModal = () => {
        setReturnModal(true)
    }


    return (
        <div ref={windowRef} onScroll={handleScrollTop} className={`${s.window} ${anim && s.window_anim}`}>
            <div className={s.container}>
                <div className={s.header}>
                    <h2><IconArrowBack onClick={handleClosePurchase} />
                        {id /* && !order.id */ && `Закупка от ${HandledatePurchase(dateCreate)}`}
                        {/*  {id && order.id && `Закупка по заявке (${order.person.name} ${order.person.surname}) от ${HandledatePurchase(dateCreate)}`} */}
                        {!id && `Создание закупки`}
                        <StatusBage status={status} reject={reject} role={role} /></h2>
                    <div className={s.buttons}>

                        {role == 'administrator' && status !== -2 && <button onClick={handleDeleteAdmin} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Удалить</p>
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonDelete />}
                        </button>}

                        {role !== 'administrator' && purchase.position !== 'administrator' && status == 0 && !reject && <button onClick={handleDelete} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Удалить</p>
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonDelete />}
                        </button>}


                        {role !== 'administrator' && purchase.position !== 'administrator' && reject && <button onClick={handleDeletePurchase} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Удалить</p>
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonDelete />}
                        </button>}


                        {/* кнопки возврата */}
                        {(status == 4 || status == 9 || status == 5 || status == 7) && <button onClick={handleReturnModal} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            {role == 'administrator' && <p>Оформить возврат</p>}
                            {role !== 'administrator' && <p>Запросить возврат</p>}
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonReturn />}
                        </button>}


                        {status == -2 && <button disabled={(loadSave || loadAproval || disabledButton) ? true : false} onClick={handleSave} className={`${s.button} ${s.button_add} ${saveSuccess && s.button_success}`}>
                            {loadSave && <p>Сохраняем</p>}
                            {!loadSave && !saveSuccess && <p>Сохранить</p>}
                            {!loadSave && saveSuccess && <p>Сохранено</p>}
                            {loadSave && <LoaderButton color={'var(--color-button-accent)'} />}
                            {!loadSave && !saveSuccess && <IconButtonSave />}
                            {!loadSave && saveSuccess && <IconDone />}
                        </button>}

                        {role !== 'administrator' && purchase.position !== 'administrator' && status == 0 && !reject && <button disabled={(loadSave || loadAproval || disabledButton) ? true : false} onClick={handleSave} className={`${s.button} ${s.button_add} ${saveSuccess && s.button_success}`}>
                            {loadSave && <p>Сохраняем</p>}
                            {!loadSave && !saveSuccess && <p>Сохранить</p>}
                            {!loadSave && saveSuccess && <p>Сохранено</p>}
                            {loadSave && <LoaderButton color={'var(--color-button-accent)'} />}
                            {!loadSave && !saveSuccess && <IconButtonSave />}
                            {!loadSave && saveSuccess && <IconDone />}
                        </button>}

                        {role == 'administrator' && status == 0 && !reject && <button disabled={(loadSave || loadAproval || disabledButton) ? true : false} onClick={handleSave} className={`${s.button} ${s.button_add} ${saveSuccess && s.button_success}`}>
                            {loadSave && <p>Сохраняем</p>}
                            {!loadSave && !saveSuccess && <p>Сохранить</p>}
                            {!loadSave && saveSuccess && <p>Сохранено</p>}
                            {loadSave && <LoaderButton color={'var(--color-button-accent)'} />}
                            {!loadSave && !saveSuccess && <IconButtonSave />}
                            {!loadSave && saveSuccess && <IconDone />}
                        </button>}





                        {role == 'leader' && (!isPattern || !isNormalPrice) && purchase.position !== 'administrator' && status == 0 && !reject && <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role == 'leader' && (!isPattern || !isNormalPrice) && status == -2 && !reject && <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role == 'leader' && isPattern && isNormalPrice && purchase.position !== 'administrator' && status == 0 && !reject && <button onClick={handleAprovalLeader} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на оплату</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на оплату</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на оплату</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role == 'leader' && isPattern && isNormalPrice && status == -2 && !reject && <button onClick={handleAprovalLeader} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на оплату</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на оплату</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на оплату</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role == 'leader' && purchase.position == 'leader' && (status == 1 || status == 2) && !reject && <button onClick={handleRecall} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Отозвать</p>
                            {loadRecall && <LoaderButton color={'#E75A5A'} />}
                            {!loadRecall && <IconButtonCancel />}
                        </button>}

                        {role == 'leader' && purchase.position !== 'administrator' && reject && <button onClick={handleAproval} disabled={loadSave || disabledButton} className={`${s.button} ${s.button_main}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на повторное согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreementRepeat />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role == 'leader' && status == 2 && !reject &&
                            <button onClick={handleConfirmAprovalLeader} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadAproval && <p>{'Отправляем на оплату'}</p>}
                                {!loadAproval && !aprovalSuccess && <p>{'Согласовать и отправить на оплату'}</p>}
                                {!loadAproval && aprovalSuccess && <p>{'Отправлено на оплату'}</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreementAdmin />}
                                {!loadAproval && aprovalSuccess && <IconDone />}
                            </button>
                        }


                        {role !== 'administrator' && role !== 'leader' && purchase.position !== 'administrator' && status == 0 && !reject && <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role !== 'administrator' && role !== 'leader' && status == -2 && !reject && <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role !== 'administrator' && role !== 'leader' && (status == 1 || status == 2) && !reject && <button onClick={handleRecall} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Отозвать</p>
                            {loadRecall && <LoaderButton color={'#E75A5A'} />}
                            {!loadRecall && <IconButtonCancel />}
                        </button>}

                        {role !== 'administrator' && role !== 'leader' && purchase.position !== 'administrator' && reject && <button onClick={handleAproval} disabled={loadSave || disabledButton} className={`${s.button} ${s.button_main}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на повторное согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreementRepeat />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}


                {/*         <button className={`${s.button} ${s.button_cancle}`}><p>Запросить возврат</p></button> */}
                        {/*   <button className={`${s.button} ${s.button_main}`}><p>Загрузить закрывающие документы</p></button> */}
                        {/*  <button className={`${s.button} ${s.button_main}`}><p>Закрыть закупку</p></button> */}

                        {status == 4 && role !== "chief-accountant" && <button onClick={handleOpenModalAccept} className={`${s.button} ${s.button_main}`}>
                            {loadAccept && <p>Принимаем закупку</p>}
                            {!loadAccept && <p>Принять закупку</p>}
                            {loadAccept && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAccept && <IconButtonAccept />}
                        </button>}

                        {status == 5 && role !== "chief-accountant" && <button onClick={handleEndPurchase} className={`${s.button} ${s.button_main}`}>
                            {loadAproval && <p>Закрываем закупку</p>}
                            {!loadAproval && <p>Закрыть закупку</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && <IconButtonClose />}
                        </button>}

                        {status == 7 && role !== "chief-accountant" && <button onClick={handleOpenModalDoc} className={`${s.button} ${s.button_main}`}>
                            {loadCloseDoc && <p>Загружаем закрывающие документы</p>}
                            {!loadCloseDoc && <p>Загрузить закрывающие документы</p>}
                            {loadCloseDoc && <LoaderButton color={'#FFFFFF'} />}
                            {!loadCloseDoc && <IconButtonCloseDoc />}
                        </button>}


                        {role == 'administrator' && (status == 1 || status == 2 || status == 6) && !reject &&
                            <button onClick={handleRejectPurchase} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                                <p>Отклонить</p>
                                {loadRecall && <LoaderButton color={'#E75A5A'} />}
                                {!loadRecall && <IconButtonReject />}
                            </button>
                        }

                        {role == 'administrator' && (status == 1 || status == 2)/*  && !reject  */ &&
                            <button onClick={() => isNal ? setModalPayNal(true) : handleConfirmAproval()} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadAproval && <p>{isNal ? 'Проводим закупку' : 'Отправляем на оплату'}</p>}
                                {!loadAproval && !aprovalSuccess && <p>{isNal ? 'Провести закупку' : 'Согласовать и отправить на оплату'}</p>}
                                {!loadAproval && aprovalSuccess && <p>{isNal ? 'Закупка проведена' : 'Отправлено на оплату'}</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreementAdmin />}
                                {!loadAproval && aprovalSuccess && <IconDone />}
                            </button>
                        }

                        {role == 'administrator' && status == 0 && reject &&
                            <button onClick={() => isNal ? setModalPayNal(true) : handleConfirmAproval()} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadAproval && <p>{isNal ? 'Проводим закупку' : 'Отправляем на оплату'}</p>}
                                {!loadAproval && !aprovalSuccess && <p>{isNal ? 'Провести закупку' : 'Согласовать и отправить на оплату'}</p>}
                                {!loadAproval && aprovalSuccess && <p>{isNal ? 'Закупка проведена' : 'Отправлено на оплату'}</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreementAdmin />}
                                {!loadAproval && aprovalSuccess && <IconDone />}
                            </button>
                        }

                        {role == 'administrator' && (status == 0 || status == -2) && !reject &&
                            <button onClick={() => isNal ? setModalPayNal2(true) : handleAproval()} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} /* ${aprovalSuccess && s.button_success} */`}>
                                {loadAproval && <p>{isNal ? 'Проводим закупку' : 'Отправляем на оплату'}</p>}
                                {!loadAproval && !aprovalSuccess && <p>{isNal ? 'Провести закупку' : 'Отправить на оплату'}</p>}
                                {!loadAproval && aprovalSuccess && <p>{isNal ? 'Закупка проведена' : 'Отправлено на оплату'}</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreementAdmin />}
                                {/* {!loadAproval && aprovalSuccess && <IconDone />} */}
                            </button>
                        }

                        {role == 'administrator' && status == 3 && !reject &&
                            <button onClick={handleRejectPayment} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                                <p>Отказать в оплате</p>
                                {loadRecall && <LoaderButton color={'#E75A5A'} />}
                                {!loadRecall && <IconButtonReject />}
                            </button>
                        }

                        {role == 'administrator' && status == 3 && !reject &&
                            <button onClick={handleConfirmPayment} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadPay && <p>Подтверждаем оплату</p>}
                                {!loadPay && !paySuccess && <p>Подтвердить оплату</p>}
                                {!loadPay && paySuccess && <p>Оплачено</p>}
                                {loadPay && <LoaderButton color={'#FFFFFF'} />}
                                {!loadPay && !paySuccess && <IconButtonAgreementAdmin />}
                                {!loadPay && paySuccess && <IconDone />}
                            </button>
                        }


                        {(role == 'chief-accountant' || role == 'administrator') && status == 6 && !reject &&
                            <button onClick={handleCreatePayment} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main}`}>
                                {loadAproval && <p>Подтверждаем создание платежа</p>}
                                {!loadAproval && <p>Подтвердить создание платежа</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && <IconButtonAgreementAdmin />}
                            </button>
                        }

                    </div>
                </div>
                <div className={s.main}>
                    <div className={s.param}>

                        <h3 className={s.title}>Параметры</h3>
                        <Options type={'categories'} sub={'Тип закупки'} categoryId={Number(categoryId)} setCategoryId={setCategoryId} purchaseId={id} disabled={disabled /* || loadSave */} />
                        <Options type={'payers'} sub={'Покупатель'} payerId={Number(payerId)} setPayerId={setPayerId} isNal={isNal} setPaymentType={setPaymentType} purchaseId={id} disabled={disabled /* || loadSave || loadAproval */} />
                        <Vendors hiden={isNal} vendorId={vendorId} setVendorId={setVendorId} contractVendorId={contractVendorId} setContractVendorId={setContractVendorId} disabled={disabled/*  || loadSave || loadAproval */} loadParametrs={loadParametrs} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                        {role == 'administrator' && <div onClick={handleInStock} className={`${s.check} ${(status !== 0 && status !== 1 && status !== 2 && status !== -2) || categoryId == 12 && s.check_disabled}`}>
                            <div className={`${s.checkbox} ${inStock && s.checkbox_check} ${(status !== 0 && status !== 1 && status !== 2 && status !== -2) || categoryId == 12 && s.checkbox_disabled}`}>
                                <div>
                                    <IconCheck />
                                </div>
                            </div>
                            <p>Учитывать закупку на остатках склада</p>
                        </div>
                        }
                    </div>
                    <Goods
                        positions={positions}
                        setPositions={setPositions}
                        windowRef={windowRef}
                        sum={sum}
                        scrollTopHeight={scrollTopHeight}
                        setSum={setSum}
                        isNal={isNal}
                        disabled={disabled}
                    />
                    <Documents documents={documents} setDocuments={setDocuments} disabled={disabled} setDeleteFiles={setDeleteFiles} setSaveSuccess={setSaveSuccess} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                    <Log logs={logs} setLogs={setLogs} id={idCreate} personView={personView} role={purchase.position} windowRefImage={windowRef} scrollTopHeight={scrollTopHeight} sendStatus={true} type={'purchase'} send={status !== -2 ? true : false} />

                    {modalAccept ? <PurchaseAccept setModal={setModalAccept} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadAccept} setLoadAccept={setLoadAccept} acceptSuccess={acceptSuccess} setAcceptSuccess={setAcceptSuccess} setLogs={setLogs} /> : ''}
                    {modalDoc ? <PurchaseCloseDoc setModal={setModalDoc} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadCloseDoc} setLoadAccept={setLoadCloseDoc} acceptSuccess={closeDocSuccess} setAcceptSuccess={setCloseDocSuccess} setLogs={setLogs} /> : ''}
                    {modalPay ? <PurchaseConfirmPay setModal={setModalPay} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadPay} setLoadAccept={setLoadPay} acceptSuccess={paySuccess} setAcceptSuccess={setPaySuccess} setLogs={setLogs} type={'beznal'} /> : ''}
                    {modalPayNal ? <PurchaseConfirmPay setModal={setModalPayNal} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadAproval} /* setLoadAccept={setLoadAproval} */
                        acceptSuccess={aprovalSuccess} setAcceptSuccess={setAprovalSuccess} setLogs={setLogs} type={'nal'} handleConfirmAproval={handleConfirmAproval} handleAproval={handleAproval} setPayDate={setPayDate} /> : ''}

                    {modalPayNal2 ? <PurchaseConfirmPay setModal={setModalPayNal2} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadAproval} /* setLoadAccept={setLoadAproval} */
                        acceptSuccess={aprovalSuccess} setAcceptSuccess={setAprovalSuccess} setLogs={setLogs} type={'nal2'} handleConfirmAproval={handleConfirmAproval} handleAproval={handleAproval} setPayDate={setPayDate} /> : ''}
                    {modalReject ? <PurchaseReject setModal={setModalReject} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadRecall} setLoadAccept={setLoadRecall} acceptSuccess={recallSuccess} setAcceptSuccess={setRecallSuccess} setLogs={setLogs} setReject={setReject} type={typeReject} /> : ''}
                    {deleteModal ? <DeleteModal setModal={setDeleteModal} id={idCreate} type={deleteType} setLoadDelete={setLoadDelete} loadDelete={loadDelete} setLogs={setLogs} handleClosePurchase={handleClosePurchase} /> : ''}
                    {returnModal ? <PurchaseReturn windowRef={windowRef} setModal={setReturnModal} id={idCreate} setStatus={setStatus} loadAccept={loadAccept} setLoadAccept={setLoadAccept} acceptSuccess={acceptSuccess} setAcceptSuccess={setAcceptSuccess} setLogs={setLogs} role={role} positions={positions}/> : ''}
                </div>
            </div>
        </div>

    )
};

export default WindowPurchase;