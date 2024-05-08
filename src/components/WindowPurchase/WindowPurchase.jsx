import s from './WindowPurchase.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
//icon 
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
import { ReactComponent as IconButtonAgreement } from '../../image/icon/purchase/iconButtonAgreement.svg';
import { ReactComponent as IconButtonAgreementRepeat } from '../../image/icon/purchase/iconButtonAgreementRepeat.svg';
import { ReactComponent as IconButtonCancel } from '../../image/icon/purchase/iconButtonCancel.svg';
import { ReactComponent as IconButtonSave } from '../../image/icon/purchase/iconButtonSave.svg';
import { ReactComponent as IconDone } from '../../image/iconDone.svg';
import { ReactComponent as IconArrowBack } from '../../image/icon/purchase/iconArrowBack.svg';
//API
import { getPurchase, savePurchase, createPurchase, createPurchaseAdmin, recalPurchase, deleteRejectPurchase } from '../../Api/Api'
//components
import Log from '../Log/Log';
import Options from '../Options/Options';
import Goods from '../Goods/Goods';
import Documents from '../Documents/Documents';
import StatusBage from './StatusBage/StatusBage';
import LoaderButton from '../LoaderButton/LoaderButton';
import Vendors from '../Vendors/Vendors';
//slice
import { setPurchase } from '../../store/reducer/purchase/slice';
import { setPurchasesUpdate, setPurchaseNew, setPurchasesDelete } from '../../store/reducer/purchaseUpdate/slice';
import { HandledatePurchase } from '../../utils/date';

//utils 
import { handleExistingFiles } from '../../utils/handleExistingFiles';

function WindowPurchase({ id, purchase }) {
    const role = document.getElementById('root_purchases').getAttribute('role');
    const [anim, setAnim] = useState(false);
    const [idCreate, setIdCreate] = useState(id || '');
    const [disabled, setDisabled] = useState(purchase?.status > 0 && role !== 'administrator' ? true : false);
    const [disabledButton, setDisabledButton] = useState(true);
    const [loadSave, setLoadSave] = useState(false);
    const [loadAproval, setLoadAproval] = useState(false);
    const [loadRecall, setLoadRecall] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [aprovalSuccess, setAprovalSuccess] = useState(false);
    const [recallSuccess, setRecallSuccess] = useState(false);
    const [scrollTopHeight, setScrollTopHeight] = useState(0);
    const [status, setStatus] = useState((purchase?.status == 0 ? 0 : purchase?.status) || -2);
    const [reject, setReject] = useState(purchase.reject || false)
    const [logs, setLogs] = useState([]);
    const [dateCreate, setDateCreate] = useState(purchase.dateCreate || '');
    const [positions, setPositions] = useState(purchase.positions || []);
    const [sum, setSum] = useState(purchase.sum || 0);
    const [vendorId, setVendorId] = useState(purchase?.vendorId || null);
    const [contractVendorId, setContractVendorId] = useState(purchase?.contractVendorId);
    const [payerId, setPayerId] = useState(purchase?.payerId || '');
    const [paymentType, setPaymentType] = useState(purchase.isNal ? 'nal' : 'beznal')
    const [categoryId, setCategoryId] = useState(purchase?.categoryId || '');
    const [isNal, setIsNal] = useState(purchase.isNal || false);
    const [documents, setDocuments] = useState(purchase.existingFiles || []);
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [isPattern, setIsPattern] = useState(false);
    const [isNormalPrice, setIsNormalPrice] = useState(true);
    const dispatch = useDispatch();
    const windowRef = useRef();
    console.log(role, purchase)
    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, []);

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
            getPurchase(id)
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    setLogs(data.logs);
                })
                .catch(err => console.log(err))
            return
        }
    }, [id]);

    useEffect(() => {
        const payment = paymentType == 'nal' ? true : false
        setIsNal(payment);
    }, [paymentType])

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

    //Определяем есть ли в закупке товары по шаблону и если ли среди них с превышенной максимальной ценой
    useEffect(() => {
        const patternItems = positions.filter(el => el.item_id > 0);
        console.log(patternItems)
        patternItems.length > 0 ? setIsPattern(true) : setIsPattern(false);
    }, [positions]);

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
        if (payerId == '' || categoryId == '' || positions.length == 0) {
            setDisabledButton(true)
        } else {
            setDisabledButton(false)
        }

    }, [payerId, categoryId, positions, documents])

    const handleSave = () => {
        setLoadSave(true);
        const formData = new FormData();
        formData.append('id', id);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', isNal ? 1 : 0);
        vendorId !== null && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && formData.append('stock_vendor_contracts_id', contractVendorId);
        positions.forEach((item, index) => {
            Object.keys(item).forEach((key) => {
                formData.append(`items[${index}][${key}]`, item[key]);
            });
        });

        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el, el.name)
        });

        deleteFiles.forEach((item) => formData.append("old_files[]", item.file))


        if (role == 'administrator' && id == '') {
            createPurchaseAdmin(formData)
                .then(res => {
                    console.log('Созданная админом закупка', res.data)
                    const purchase = res.data.purchase;
                    dispatch(setPurchaseNew(purchase));
                    setLoadSave(false);
                    setSaveSuccess(true);
                })
                .catch(err => console.log(err))
        } else {
            savePurchase(formData)
                .then(res => {
                    const purchase = res.data.purchase;
                    console.log(purchase)
                    id == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                    id == '' && setIdCreate(purchase.id)
                    setLoadSave(false);
                    setSaveSuccess(true);
                    /*  const documents = handleExistingFiles(purchase);
                     setDocuments(documents); */
                    console.log(res)
                })
                .catch(err => console.log(err))
        }
    }

    const handleAproval = () => {
        setLoadAproval(true);
        const formData = new FormData();
        formData.append('id', id);
        formData.append('cat_id', categoryId);
        formData.append('payer_id', payerId);
        formData.append('is_nal', isNal ? 1 : 0);
        vendorId !== null && formData.append('stock_vendor_id', vendorId);
        contractVendorId !== null && formData.append('stock_vendor_contracts_id', contractVendorId);
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

        createPurchase(formData)
            .then(res => {
                const purchase = res.data.purchase;
                id == '' ? dispatch(setPurchaseNew(purchase)) : dispatch(setPurchasesUpdate(purchase));
                id == '' && setIdCreate(purchase.id);
                /*  const documents = handleExistingFiles(purchase);
                 setDocuments(documents); */
                setLoadAproval(false);
                setStatus(purchase.status);
                purchase?.is_reject && setReject(purchase.is_reject);
                setAprovalSuccess(true);
            })
            .catch(err => console.log(err))
    }

    const handleRecall = () => {
        setLoadRecall(true)
        recalPurchase(idCreate)
            .then(res => {
                setAprovalSuccess(false)
                console.log(res);
                const purchase = res.data.purchase;
                setLoadRecall(false);
                setStatus(purchase.status);
                dispatch(setPurchasesUpdate(purchase))
                setRecallSuccess(true);

            })
            .catch(err => console.log(err))
    }

    const handleDeletePurchase = () => {
        deleteRejectPurchase(idCreate)
            .then(res => {
                console.log(res);
                setPurchasesDelete(idCreate);
                handleClosePurchase();
            })
            .catch(err => console.log(err))
    }

    return (
        <div ref={windowRef} onScroll={handleScrollTop} className={`${s.window} ${anim && s.window_anim}`}>
            <div className={s.container}>
                <div className={s.header}>
                    <h2><IconArrowBack onClick={handleClosePurchase} />{id ? `Закупка от ${HandledatePurchase(dateCreate)}` : `Создание закупки`} <StatusBage status={status} reject={reject} role={role} /></h2>
                    <div className={s.buttons}>
                        {(status == 0 || status == -2) && !reject && <button disabled={(loadSave || loadAproval || disabledButton) ? true : false} onClick={handleSave} className={`${s.button} ${s.button_add} ${saveSuccess && s.button_success}`}>
                            {loadSave && <p>Сохраняем</p>}
                            {!loadSave && !saveSuccess && <p>Сохранить</p>}
                            {!loadSave && saveSuccess && <p>Сохранено</p>}
                            {loadSave && <LoaderButton color={'#002CFB'} />}
                            {!loadSave && !saveSuccess && <IconButtonSave />}
                            {!loadSave && saveSuccess && <IconDone />}
                        </button>}
                        {(status == 0 || status == -2) && !reject && <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                            {loadAproval && <p>Отправляем на согласование</p>}
                            {!loadAproval && !aprovalSuccess && <p>Отправить на согласование</p>}
                            {!loadAproval && aprovalSuccess && <p>Отправлено на согласование</p>}
                            {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                            {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                            {!loadAproval && aprovalSuccess && <IconDone />}
                        </button>}
                        {role !== 'administrator' && (status == 1 || status == 2) && !reject && <button onClick={handleRecall} disabled={loadSave || disabledButton} className={`${s.button} ${s.button_cancle}`}><p>Отозвать</p><IconButtonCancel /></button>}
                        {reject && <button onClick={handleDeletePurchase} disabled={loadSave || disabledButton} className={`${s.button} ${s.button_cancle}`}><p>Удалить</p></button>}
                        {reject && <button onClick={handleRecall} disabled={loadSave || disabledButton} className={`${s.button} ${s.button_main}`}><p>Отправить на повторное согласование</p><IconButtonAgreementRepeat /></button>}
                        {/* <button className={`${s.button} ${s.button_cancle}`}><p>Запросить возврат</p></button> */}
                        {/*   <button className={`${s.button} ${s.button_main}`}><p>Загрузить закрывающие документы</p></button> */}
                        {/*  <button className={`${s.button} ${s.button_main}`}><p>Принять закупку</p></button>
          <button className={`${s.button} ${s.button_main}`}><p>Закрыть закупку</p></button> */}


                        {role == 'administrator' && (status == 1 || status == 2) && !reject &&
                            <button onClick={handleRecall} disabled={loadSave || disabledButton} className={`${s.button} ${s.button_cancle}`}><p>Отклонить</p><IconButtonCancel /></button>
                        }

                        {role == 'administrator' && (status == 1 || status == 2) && !reject &&
                            <button onClick={handleAproval} disabled={loadSave || loadAproval || disabledButton} className={`${s.button} ${s.button_main} ${aprovalSuccess && s.button_success}`}>
                                {loadAproval && <p>Отправляем на оплату</p>}
                                {!loadAproval && !aprovalSuccess && <p>Согласовать и отправить на оплату</p>}
                                {!loadAproval && aprovalSuccess && <p>Отправлено на оплату</p>}
                                {loadAproval && <LoaderButton color={'#FFFFFF'} />}
                                {!loadAproval && !aprovalSuccess && <IconButtonAgreement />}
                                {!loadAproval && aprovalSuccess && <IconDone />}
                            </button>
                        }

                    </div>
                </div>
                <div className={s.main}>
                    <div className={s.param}>

                        <h3 className={s.title}>Параметры</h3>
                        <Options type={'categories'} sub={'Тип закупки'} categoryId={Number(categoryId)} setCategoryId={setCategoryId} purchaseId={id} disabled={disabled} />
                        <Options type={'payers'} sub={'Покупатель'} payerId={Number(payerId)} setPayerId={setPayerId} isNal={isNal} setPaymentType={setPaymentType} purchaseId={id} disabled={disabled} />
                        <Vendors hiden={isNal} vendorId={vendorId} setVendorId={setVendorId} contractVendorId={contractVendorId} setContractVendorId={setContractVendorId} disabled={disabled} />
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
                    <Documents documents={documents} setDocuments={setDocuments} disabled={disabled} setDeleteFiles={setDeleteFiles} />
                    {/*  <Log /> */}
                </div>
            </div>
        </div>

    )
};

export default WindowPurchase;