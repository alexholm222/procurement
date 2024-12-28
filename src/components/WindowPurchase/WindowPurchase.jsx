import s from './WindowPurchase.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
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
import DocumentsClose from '../Documents/DocumentsClose';
import StatusBage from './StatusBage/StatusBage';
import LoaderButton from '../LoaderButton/LoaderButton';
import Vendors from '../Vendors/Vendors';
import PurchaseAccept from '../PurchaseAccept/PurchaseAccept';
import PurchaseCloseDoc from '../PurchaseAccept/PurchaseCloseDoc';
import PurchaseConfirmPay from '../PurchaseAccept/PurchaseConfirmPay';
import PurchaseReject from '../PurchaseAccept/PurchaseReject';
import DeleteModal from '../DeleteModal/DeleteModal';
import PurchaseReturn from '../PurchaseReturn/PurchaseReturn';
import PurchaseConfirmReturn from '../PurchaseAccept/PurchaseConfirmReturn';
import ErrorModal from '../ErrorModal/ErrorModal';
//slice
import { setPurchase } from '../../store/reducer/purchase/slice';
import { setPurchasesUpdate, setPurchaseNew, setPurchasesDelete, setUpdateAction } from '../../store/reducer/purchaseUpdate/slice';
//selector
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//utils 
import { handleExistingFiles } from '../../utils/handleExistingFiles';
import { HandledatePurchase } from '../../utils/date';

function WindowPurchase({ id, purchase, loadParametrs, role, isSkilla }) {
    console.log(role)
    const categories = useSelector(purchaseSelector).categories;
    const payers = useSelector(purchaseSelector).payers;
    const [anim, setAnim] = useState(false);
    const [personId, setPersonId] = useState(purchase.personId || -1);
    const [idCreate, setIdCreate] = useState(id || '');
    const [disabled, setDisabled] = useState(purchase?.status > 0 && role !== 'administrator' ? true : false);
    const [disabledButton, setDisabledButton] = useState(false);
    const [loadSave, setLoadSave] = useState(false);
    const [loadAproval, setLoadAproval] = useState(false);
    const [loadRecall, setLoadRecall] = useState(false);
    const [loadDelete, setLoadDelete] = useState(false);
    const [loadReturn, setLoadReturn] = useState(false);
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
    const [dateCreate, setDateCreate] = useState(purchase.dateCreate || '');
    const [positions, setPositions] = useState(purchase.positions || []);
    const [sum, setSum] = useState(purchase.sum || 0);
    const [vendorId, setVendorId] = useState(purchase?.vendorId || '');
    const [contractVendorId, setContractVendorId] = useState(/* purchase?.contractVendorId || */ '');
    const [payerId, setPayerId] = useState(purchase?.payerId || '');
    const [paymentType, setPaymentType] = useState(false)
    const [categoryId, setCategoryId] = useState(purchase?.categoryId || '');
    const [inStock, setInStock] = useState(purchase?.inStock || false);
    const [takeAccount, setTakeAccount] = useState(purchase?.takeAccount || false)
    const [documents, setDocuments] = useState(/* purchase.existingFiles ||  */[]);
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
    const [modalConfirmReturn, setModalConfirmReturn] = useState(false);
    const [positionReturn, setPositionReturn] = useState([]);
    const [positionReturnDone, setPositionReturnDone] = useState([]);
    const [returnDone, setReturnDone] = useState(false);
    const [closeDocs, setCloseDocs] = useState([]);
    const [error, setError] = useState('');
    const [loadPurchase, setLoadPurchase] = useState(false)
    const dispatch = useDispatch();
    const windowRef = useRef();

    console.log(purchase)


    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, []);

    console.log(vendorId)

    //устанавливаем значения чекбоксов
    useEffect(() => {
        setTakeAccount(purchase?.takeAccount)
        setInStock(purchase?.inStock)
    }, [purchase])

    //определяем настройки категории
    useEffect(() => {
        if (categoryId !== purchase?.categoryId) {
            const result = categories.find(el => el.id == categoryId);
            console.log(result, categoryId)
            result?.in_stock == 1 ? setInStock(true) : setInStock(false)
            result?.take_account_cat == 1 ? setTakeAccount(true) : setTakeAccount(false)
            return
        }
    }, [categoryId])


    //определяем настрйоки покупателя
    useEffect(() => {
        const result = payers.find(el => el.id == payerId);
        console.log(result)
        result?.payment_type == 'nal' ? setPaymentType(true) : setPaymentType(false)
    }, [payerId])

    useEffect(() => {
        paymentType && setVendorId('')
    }, [paymentType])

    console.log('id при создании', idCreate)


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

    //Загрузка закупки 
    useEffect(() => {
        if (id) {
            setLoadPurchase(true)
            getPurchase(id)
                .then(res => {
                    const data = res.data;
                    const docs = data.files;
                    const purchase = data.purchase;
                    setCloseDocs(docs)
                    setPositions(data.purchase_items)
                    const returnPos = data.purchase_return_items.filter(el => el.status == 'requested')
                    setPositionReturn(returnPos)
                    const returnPosDone = data.purchase_return_items.filter(el => el.status == 'confirmed');
                    setPositionReturnDone(returnPosDone)
                    returnPosDone.length > 0 ? setReturnDone(true) : setReturnDone(false)
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

                    const existingFiles = [{ id: uuid(), file: purchase?.bill, name: purchase?.bill?.includes('uploads') ? purchase?.bill?.split('/').pop() : purchase?.bill?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: purchase?.bill2, name: purchase?.bill2?.includes('uploads') ? purchase?.bill2?.split('/').pop() : purchase?.bill2?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: purchase?.bill3, name: purchase?.bill3?.includes('uploads') ? purchase?.bill3?.split('/').pop() : purchase?.bill3?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: purchase?.bill4, name: purchase?.bill4?.includes('uploads') ? purchase?.bill4?.split('/').pop() : purchase?.bill4?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: purchase?.bill5, name: purchase?.bill5?.includes('uploads') ? purchase?.bill5?.split('/').pop() : purchase?.bill5?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: purchase?.bill6, name: purchase?.bill6?.includes('uploads') ? purchase?.bill6?.split('/').pop() : purchase?.bill6?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    { id: uuid(), file: purchase?.bill7, name: purchase?.bill7?.includes('uploads') ? purchase?.bill7?.split('/').pop() : purchase?.bill7?.split('filename=').pop().split('&').shift(), type: 'existing' },
                    ].filter(purchase => purchase.file && purchase.file !== null);
                    console.log(existingFiles)
                    setDocuments(existingFiles)

                    data?.order_logs && data?.order_logs !== null ? setLogs([orderLog, ...data?.order_logs?.order_logs?.slice(1), ...data.logs]) : setLogs(data.logs);

                    setPersonView(data.person_view.id);
                    setPersonId(data.purchase.person_id);

                    data.order && setOrder(data.order);
                    setLoadPurchase(false)
                    /*  dispatch(setPurchasesUpdate({ ...res.data.purchase, items: res.data.purchase_items, payer: res.data.payer, logs_view: [{ is_view: 1 }] })) */
                })
                .catch(err => console.log(err))
            return
        }
    }, [id]);

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
    }, [positions, isPattern])

    //Блокируем изменения
    useEffect(() => {
        if ((role !== 'administrator' && role !== 'director' && status > 0) || ((role == 'administrator' || role == 'director') && status > 2)) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [status, role])

    //disabled кнопок
    useEffect(() => {
        setSaveSuccess(false)
        if (payerId == '' || categoryId == '' || positions.length == 0 || (vendorId == '' && !paymentType)) {
            setDisabledButton(true)
        } else {
            setDisabledButton(false)
        }

    }, [payerId, categoryId, positions, vendorId, contractVendorId, paymentType]);


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

    const handleTakeAccount = () => {
        takeAccount ? setTakeAccount(false) : setTakeAccount(true);
    }

    const handleSave = () => {
        setLoadSave(true);
        const formData = new FormData();
        formData.append('id', idCreate);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', paymentType ? 1 : 0);
        /*  formData.append('person_id', role == 'administrator' ? '43' : '3651') */
        formData.append('in_stock', inStock ? 1 : 0);
        formData.append('take_account', takeAccount ? 1 : 0);
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
                setPositions(purchase.items)
                setStatus(purchase.status);
                setLoadSave(false);
                setSaveSuccess(true);
                dispatch(setUpdateAction());
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
        formData.append('is_nal', paymentType ? 1 : 0);
        paymentType && formData.append('pay_date', payDate);
        vendorId !== null && vendorId && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && contractVendorId && formData.append('stock_vendor_contracts_id', contractVendorId);
        formData.append('is_pattern', isPattern ? 1 : 0);
        formData.append('is_price_normal', isNormalPrice ? 1 : 0);
        formData.append('in_stock', inStock ? 1 : 0);
        formData.append('take_account', takeAccount ? 1 : 0);
        positions.forEach((item, index) => {
            Object.keys(item).forEach((key) => {
                formData.append(`items[${index}][${key}]`, item[key]);
            });
        });

        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });

        deleteFiles.forEach((item) => formData.append("old_files[]", item.file));

        if ((role == 'administrator' || role == 'director')) {
            idCreate == '' && createPurchaseAdmin(formData)
                .then(res => {
                    console.log('Созданная админом закупка', res.data)
                    const purchase = res.data.purchase;
                    setOwner(purchase.person_id)
                    idCreate == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                    idCreate == '' && setIdCreate(purchase.id);
                    setStatus(purchase.status);
                    setLoadAproval(false);
                    setReject(purchase.is_reject);
                    setPositions(purchase.items);
                    setLogs(purchase.logs);
                    setAprovalSuccess(true);
                    dispatch(setUpdateAction());
                })
                .catch(err => console.log(err))

            idCreate !== '' && handleConfirmAproval()
            return
        } else {
            createPurchase(formData)
                .then(res => {
                    const purchase = res.data.purchase;
                    const order = res.data.purchase.order;
                    setOwner(purchase.person_id)
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
                    setPositions(purchase.items)
                    setAprovalSuccess(true);
                    dispatch(setUpdateAction());
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
        formData.append('is_nal', paymentType ? 1 : 0);
        vendorId !== null && vendorId && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && contractVendorId && formData.append('stock_vendor_contracts_id', contractVendorId);
        formData.append('is_pattern', isPattern ? 1 : 0);
        formData.append('is_price_normal', isNormalPrice ? 1 : 0);
        formData.append('in_stock', inStock ? 1 : 0);
        formData.append('take_account', takeAccount ? 1 : 0);
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
                setPositions(purchase.items)
                dispatch(setUpdateAction());
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
        formData.append('is_nal', paymentType ? 1 : 0);
        paymentType == 1 && formData.append('pay_date', payDate);
        vendorId !== null && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && formData.append('stock_vendor_contracts_id', contractVendorId);
        formData.append('in_stock', inStock ? 1 : 0);
        formData.append('take_account', takeAccount ? 1 : 0);
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
                dispatch(setUpdateAction());
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


            })
            .catch(err => {
                const data = err.response.data;
                const message = data.message;
                setError(message)
                dispatch(setUpdateAction());
            })
    }

    const handleConfirmAprovalLeader = () => {
        setLoadAproval(true);
        const formData = new FormData();
        console.log(id)
        formData.append('id', idCreate);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', paymentType ? 1 : 0);
        vendorId !== null && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && formData.append('stock_vendor_contracts_id', contractVendorId);
        formData.append('in_stock', inStock ? 1 : 0);
        formData.append('take_account', takeAccount ? 1 : 0);
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

    const handleReturnConfirmModal = () => {
        setModalConfirmReturn(true)
    }


    console.log(role)

    return (
        <div ref={windowRef} onScroll={handleScrollTop} className={`${s.window} ${anim && s.window_anim}`}>
            <div className={s.container}>
                <div className={s.header}>
                    <h2><IconArrowBack onClick={handleClosePurchase} />
                        {id /* && !order.id */ && `Закупка от ${HandledatePurchase(dateCreate)}`}
                        {/*  {id && order.id && `Закупка по заявке (${order.person.name} ${order.person.surname}) от ${HandledatePurchase(dateCreate)}`} */}
                        {!id && `Создание закупки`}
                        <StatusBage status={status} returnDone={returnDone} positionReturn={positionReturn} reject={reject} role={role} /></h2>
                    {!loadPurchase && <div className={s.buttons}>

                        {(role == 'administrator' || role == 'director') && status !== -2 && <button onClick={handleDeleteAdmin} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Удалить</p>
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonDelete />}
                        </button>}

                        {role !== 'administrator' && role !== 'director' && purchase.position == role && (status == 0 || status == -3) && !reject && <button onClick={handleDelete} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Удалит 1</p>
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonDelete />}
                        </button>}


                        {role !== 'administrator' && role !== 'director' && purchase.position == role && reject && <button onClick={handleDeletePurchase} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Удалить</p>
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonDelete />}
                        </button>}


                        {/* кнопки возврата */}
                        {(status == 9 || status == 5 || status == 7 || status == 4) && positionReturn.length == 0 && !returnDone && <button onClick={handleReturnModal} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            {(role == 'administrator' || role == 'director') && <p>Оформить возврат</p>}
                            {role !== 'administrator' && role !== 'director' && <p>Запросить возврат</p>}
                            {loadDelete && <LoaderButton color={'#E75A5A'} />}
                            {!loadDelete && <IconButtonReturn />}
                        </button>}

                        {(status == 9 || status == 5 || status == 7 || status == 4) && positionReturn.length > 0 && (role == 'administrator' || role == 'director') && <button onClick={handleReturnConfirmModal} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Подтвердить возврат</p>
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

                        {role !== 'administrator' && purchase.position !== 'administrator' && role !== 'director' && purchase.position !== 'director' && (status == -3) && !reject && <button disabled={(loadSave || loadAproval || disabledButton) ? true : false} onClick={handleSave} className={`${s.button} ${s.button_add} ${saveSuccess && s.button_success}`}>
                            {loadSave && <p>Сохраняем</p>}
                            {!loadSave && !saveSuccess && <p>Сохранить</p>}
                            {!loadSave && saveSuccess && <p>Сохранено</p>}
                            {loadSave && <LoaderButton color={'var(--color-button-accent)'} />}
                            {!loadSave && !saveSuccess && <IconButtonSave />}
                            {!loadSave && saveSuccess && <IconDone />}
                        </button>}

                        {(role == 'administrator' || role == 'director') && status == 0 && !reject && <button disabled={(loadSave || loadAproval || disabledButton) ? true : false} onClick={handleSave} className={`${s.button} ${s.button_add} ${saveSuccess && s.button_success}`}>
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

                        {role == 'leader' && isPattern && isNormalPrice && purchase.position !== 'administrator' && status == 0 && !reject && <button onClick={handleAprovalLeader} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main}`}>
                            {loadAproval && <p>Отправляем на оплату</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на оплату</p>}

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


                        {role !== 'administrator' && role !== 'director' && role !== 'leader' && purchase.position !== 'administrator' && purchase.position !== 'director' && (status == 0 || status == -3) && !reject && <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role !== 'administrator' && role !== 'director' && role !== 'leader' && status == -2 && !reject && <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}

                        {role !== 'administrator' && role !== 'director' && role !== 'leader' && (status == 1 || status == 2) && !reject && <button onClick={handleRecall} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                            <p>Отозвать</p>
                            {loadRecall && <LoaderButton color={'#E75A5A'} />}
                            {!loadRecall && <IconButtonCancel />}
                        </button>}

                        {role !== 'administrator' && role !== 'director' && role !== 'leader' && purchase.position !== 'administrator' && purchase.position !== 'director' && reject && <button onClick={handleAproval} disabled={loadSave || disabledButton} className={`${s.button} ${s.button_main}`}>
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


                        {(role == 'administrator' || role == 'director') && (status == 1 || status == 2 || status == 6) && !reject &&
                            <button onClick={handleRejectPurchase} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                                <p>Отклонить</p>
                                {loadRecall && <LoaderButton color={'#E75A5A'} />}
                                {!loadRecall && <IconButtonReject />}
                            </button>
                        }

                        {(role == 'administrator' || role == 'director') && (status == 1 || status == 2)/*  && !reject  */ &&
                            <button onClick={() => paymentType ? setModalPayNal(true) : handleConfirmAproval()} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadAproval && <p>{paymentType ? 'Проводим закупку' : 'Отправляем на оплату'}</p>}
                                {!loadAproval && !aprovalSuccess && <p>{paymentType ? 'Провести закупку' : 'Согласовать и отправить на оплату'}</p>}
                                {!loadAproval && aprovalSuccess && <p>{paymentType ? 'Закупка проведена' : 'Отправлено на оплату'}</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreementAdmin />}
                                {!loadAproval && aprovalSuccess && <IconDone />}
                            </button>
                        }

                        {(role == 'administrator' || role == 'director') && status == 0 && reject &&
                            <button onClick={() => paymentType ? setModalPayNal(true) : handleConfirmAproval()} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadAproval && <p>{paymentType ? 'Проводим закупку' : 'Отправляем на оплату'}</p>}
                                {!loadAproval && !aprovalSuccess && <p>{paymentType ? 'Провести закупку' : 'Согласовать и отправить на оплату'}</p>}
                                {!loadAproval && aprovalSuccess && <p>{paymentType ? 'Закупка проведена' : 'Отправлено на оплату'}</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreementAdmin />}
                                {!loadAproval && aprovalSuccess && <IconDone />}
                            </button>
                        }

                        {(role == 'administrator' || role == 'director') && (status == 0 || status == -2) && !reject &&
                            <button onClick={() => paymentType ? setModalPayNal2(true) : handleAproval()} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} /* ${aprovalSuccess && s.button_success} */`}>
                                {loadAproval && <p>{paymentType ? 'Проводим закупку' : 'Отправляем на оплату'}</p>}
                                {!loadAproval && !aprovalSuccess && <p>{paymentType ? 'Провести закупку' : 'Отправить на оплату'}</p>}
                                {!loadAproval && aprovalSuccess && <p>{paymentType ? 'Закупка проведена' : 'Отправлено на оплату'}</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreementAdmin />}
                                {/* {!loadAproval && aprovalSuccess && <IconDone />} */}
                            </button>
                        }

                        {(role == 'administrator' || role == 'director') && status == 3 && !reject &&
                            <button onClick={handleRejectPayment} disabled={loadSave} className={`${s.button} ${s.button_cancle}`}>
                                <p>Отказать в оплате</p>
                                {loadRecall && <LoaderButton color={'#E75A5A'} />}
                                {!loadRecall && <IconButtonReject />}
                            </button>
                        }

                        {(role == 'administrator' || role == 'director') && status == 3 && !reject &&
                            <button onClick={handleConfirmPayment} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadPay && <p>Подтверждаем оплату</p>}
                                {!loadPay && !paySuccess && <p>Подтвердить оплату</p>}
                                {!loadPay && paySuccess && <p>Оплачено</p>}
                                {loadPay && <LoaderButton color={'#FFFFFF'} />}
                                {!loadPay && !paySuccess && <IconButtonAgreementAdmin />}
                                {!loadPay && paySuccess && <IconDone />}
                            </button>
                        }


                        {isSkilla && (role == 'chief-accountant' || role == 'administrator') && status == 6 && !reject &&
                            <button onClick={handleCreatePayment} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main}`}>
                                {loadAproval && <p>Подтверждаем создание платежа</p>}
                                {!loadAproval && <p>Подтвердить создание платежа</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && <IconButtonAgreementAdmin />}
                            </button>
                        }

                        {!isSkilla && status == 6 && !reject &&
                            <button onClick={handleCreatePayment} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main}`}>
                                {loadAproval && <p>Подтверждаем создание платежа</p>}
                                {!loadAproval && <p>Подтвердить создание платежа</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && <IconButtonAgreementAdmin />}
                            </button>
                        }

                    </div>}
                </div>
                <div className={s.main}>
                    <div className={s.param}>

                        <h3 className={s.title}>Параметры</h3>
                        <Options type={'categories'} sub={'Тип закупки'} categoryId={Number(categoryId)} setCategoryId={setCategoryId} purchaseId={id} disabled={disabled /* || loadSave */} />
                        <Options type={'payers'} sub={'Покупатель'} payerId={Number(payerId)} setPayerId={setPayerId} purchaseId={id} disabled={disabled /* || loadSave || loadAproval */} />
                        <Vendors hiden={paymentType} role={role} vendorId={vendorId} setVendorId={setVendorId} contractVendorId={contractVendorId} setContractVendorId={setContractVendorId} disabled={disabled/*  || loadSave || loadAproval */} loadParametrs={loadParametrs} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                        <div>
                            {(role == 'administrator' || role == 'director') && <div onClick={handleInStock} className={`${s.check} ${(status !== 0 && status !== 1 && status !== 2 && status !== -2) && s.check_disabled}`}>
                                <div className={`${s.checkbox} ${inStock && s.checkbox_check} ${(status !== 0 && status !== 1 && status !== 2 && status !== -2) && s.checkbox_disabled}`}>
                                    <div>
                                        <IconCheck />
                                    </div>
                                </div>
                                <p>Учитывать закупку на остатках склада</p>
                            </div>
                            }

                            {(role == 'administrator' || role == 'director') && <div onClick={handleTakeAccount} className={`${s.check} ${(status !== 0 && status !== 1 && status !== 2 && status !== -2) && s.check_disabled}`}>
                                <div className={`${s.checkbox} ${takeAccount && s.checkbox_check} ${(status !== 0 && status !== 1 && status !== 2 && status !== -2) && s.checkbox_disabled}`}>
                                    <div>
                                        <IconCheck />
                                    </div>
                                </div>
                                <p>Учитывать закупку в финансовых итогах</p>
                            </div>
                            }
                        </div>

                    </div>
                    <Goods
                        positions={positions}
                        setPositions={setPositions}
                        windowRef={windowRef}
                        sum={sum}
                        scrollTopHeight={scrollTopHeight}
                        setSum={setSum}
                        isNal={paymentType}
                        disabled={disabled}
                        status={status}
                        positionReturn={positionReturn}
                        positionReturnDone={positionReturnDone}
                        role={role}
                    />
                    <Documents documents={documents} setDocuments={setDocuments} disabled={disabled} setDeleteFiles={setDeleteFiles} setSaveSuccess={setSaveSuccess} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                    {(status == 5 || status == 9) && closeDocs.length > 0 && <DocumentsClose documents={closeDocs} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />}
                    <Log logs={logs} setLogs={setLogs} id={idCreate} personView={personView} role={purchase.position} windowRefImage={windowRef} scrollTopHeight={scrollTopHeight} sendStatus={true} type={'purchase'} send={status !== -2 ? true : false} />

                    {modalAccept ? <PurchaseAccept setModal={setModalAccept} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadAccept} setLoadAccept={setLoadAccept} acceptSuccess={acceptSuccess} setAcceptSuccess={setAcceptSuccess} setLogs={setLogs} setCloseDocs={setCloseDocs} /> : ''}
                    {modalDoc ? <PurchaseCloseDoc role={role} setModal={setModalDoc} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadCloseDoc} setLoadAccept={setLoadCloseDoc} acceptSuccess={closeDocSuccess} setAcceptSuccess={setCloseDocSuccess} setLogs={setLogs} setCloseDocs={setCloseDocs} /> : ''}
                    {modalPay ? <PurchaseConfirmPay role={role} setModal={setModalPay} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadPay} setLoadAccept={setLoadPay} acceptSuccess={paySuccess} setAcceptSuccess={setPaySuccess} setLogs={setLogs} type={'beznal'} /> : ''}
                    {modalPayNal ? <PurchaseConfirmPay role={role} setModal={setModalPayNal} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadAproval} /* setLoadAccept={setLoadAproval} */
                        acceptSuccess={aprovalSuccess} setAcceptSuccess={setAprovalSuccess} setLogs={setLogs} type={'nal'} handleConfirmAproval={handleConfirmAproval} handleAproval={handleAproval} setPayDate={setPayDate} /> : ''}

                    {modalPayNal2 ? <PurchaseConfirmPay role={role} setModal={setModalPayNal2} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadAproval} /* setLoadAccept={setLoadAproval} */
                        acceptSuccess={aprovalSuccess} setAcceptSuccess={setAprovalSuccess} setLogs={setLogs} type={'nal2'} handleConfirmAproval={handleConfirmAproval} handleAproval={handleAproval} setPayDate={setPayDate} /> : ''}
                    {modalReject ? <PurchaseReject role={role} setModal={setModalReject} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadRecall} setLoadAccept={setLoadRecall} acceptSuccess={recallSuccess} setAcceptSuccess={setRecallSuccess} setAprovalSuccess={setAprovalSuccess} setLogs={setLogs} setReject={setReject} type={typeReject} /> : ''}
                    {deleteModal ? <DeleteModal setModal={setDeleteModal} id={idCreate} type={deleteType} setLoadDelete={setLoadDelete} loadDelete={loadDelete} setLogs={setLogs} handleClosePurchase={handleClosePurchase} /> : ''}
                    {returnModal ? <PurchaseReturn windowRef={windowRef} setModal={setReturnModal} id={idCreate} setStatus={setStatus} loadAccept={loadReturn} setLoadAccept={setLoadReturn} acceptSuccess={acceptSuccess} setAcceptSuccess={setAcceptSuccess} setLogs={setLogs} role={role} positions={positions} setPositionReturn={setPositionReturn} setPositions={setPositions} /> : ''}
                    {modalConfirmReturn ? <PurchaseConfirmReturn setModal={setModalConfirmReturn} windowRef={windowRef} id={idCreate} setStatus={setStatus} loadAccept={loadReturn} setLoadAccept={setLoadReturn}
                        acceptSuccess={aprovalSuccess} setAcceptSuccess={setAprovalSuccess} setLogs={setLogs} setPositionReturn={setPositionReturn}
                        setPositions={setPositions} setReturnDone={setReturnDone} setPositionReturnDone={setPositionReturnDone} /> : ''}

                    {error !== '' && <ErrorModal setError={setError} windowRef={windowRef} error={error} handleClosePurchase={handleClosePurchase} />}

                </div>
            </div>
        </div>


    )
};

export default WindowPurchase;