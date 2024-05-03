import s from './WindowPurchase.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
//icon
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
import { ReactComponent as IconButtonAgreement } from '../../image/icon/purchase/iconButtonAgreement.svg';
import { ReactComponent as IconButtonSave } from '../../image/icon/purchase/iconButtonSave.svg'
//API
import { getPurchase, savePurchase } from '../../Api/Api'
//components
import Log from '../Log/Log';
import Options from '../Options/Options';
import Goods from '../Goods/Goods';
import Documents from '../Documents/Documents';
//slice
import { setPurchase } from '../../store/reducer/purchase/slice';
import { HandledatePurchase } from '../../utils/date';


function WindowPurchase({ id, purchase }) {
    const [anim, setAnim] = useState(false);
    const [scrollTopHeight, setScrollTopHeight] = useState(0);
    const [dateCreate, setDateCreate] = useState(purchase.dateCreate || '');
    const [positions, setPositions] = useState(purchase.positions || []);
    const [sum, setSum] = useState(purchase.sum || 0);
    const [vendorId, setVendorId] = useState(0);
    const [contractVendorId, setContractVendorId] = useState(0);
    const [payerId, setPayerId] = useState(purchase.payerId || '');
    const [categoryId, setCategoryId] = useState(purchase.categoryId || '');
    const [isNal, setIsNal] = useState(payerId == '51' ? true : false);
    const [documents, setDocuments] = useState(purchase.existingFiles || []);
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const dispatch = useDispatch();
    const windowRef = useRef();
    console.log(files, oldFiles )
    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, []);

    useEffect(() => {
       const oldFiles = documents.filter(el => el.type == 'existing');
       const files = documents.filter(el => el.type !== 'existing');
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

                })
                .catch(err => console.log(err))
            return
        }
    }, [id]);

    useEffect(() => {
        if (payerId == 51) {
            setIsNal(true)
        } else {
            setIsNal(false)
        }
    }, [payerId])

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

    const handleSave = () => {
        const data = {
            cat_id: categoryId,
            payer_id: payerId,
            is_nal: isNal,
            stock_vendor_id: 1,
            items: positions,
            file: files.map(el => el.file),
            oldFile: oldFiles.map(el => el.file)
        }

        savePurchase(data)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    return (
        <div ref={windowRef} onScroll={handleScrollTop} className={`${s.window} ${anim && s.window_anim}`}>
            <div className={s.container}>
                <div className={s.header}>
                    <h2>{id ? `Закупка от ${HandledatePurchase(dateCreate)}` : `Создание залупки`}</h2>
                    <div className={s.buttons}>
                        <button onClick={handleSave} className={`${s.button} ${s.button_add}`}><p>Сохранить</p><IconButtonSave /></button>
                        <button className={`${s.button} ${s.button_main}`}><p>Отправить на согласование</p><IconButtonAgreement /></button>
                        {/*   <button className={`${s.button} ${s.button_cancle}`}><p>Удалить</p></button> */}
                        {/* <button className={`${s.button} ${s.button_cancle}`}><p>Отозвать</p></button>
          <button className={`${s.button} ${s.button_cancle}`}><p>Запросить возврат</p></button> */}
                        {/*   <button className={`${s.button} ${s.button_main}`}><p>Загрузить закрывающие документы</p></button> */}
                        {/*  <button className={`${s.button} ${s.button_main}`}><p>Принять закупку</p></button>
          <button className={`${s.button} ${s.button_main}`}><p>Закрыть закупку</p></button> */}
                    </div>
                </div>
                <div className={s.main}>
                    <div className={s.param}>
                        <h3 className={s.title}>Параметры</h3>
                        <p onClick={handleClosePurchase}>закрыть</p>
                        <Options type={'categories'} sub={'Тип закупки'} categoryId={categoryId} setCategoryId={setCategoryId} />
                        <Options type={'payers'} sub={'Покупатель'} payerId={payerId} setPayerId={setPayerId} />
                    </div>
                    <Goods positions={positions} setPositions={setPositions} windowRef={windowRef} sum={sum} scrollTopHeight={scrollTopHeight} setSum={setSum} />
                    <Documents documents={documents} setDocuments={setDocuments} />
                    {/* <Log /> */}
                </div>
            </div>
        </div>

    )
};

export default WindowPurchase;