import s from './List.module.scss';
import { useState, useEffect, useRef } from 'react';
import { ReactComponent as IconArrow } from '../../image/iconArrow.svg';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Api
import { getPurchasesCursor } from '../../Api/Api'
//component
import Purchase from '../Purchase/Purchase';
import WindowPurchase from '../WindowPurchase/WindowPurchase';
import PurchaseSceleton from '../Purchase/PurchaseSceleton/PurchaseSceleton';
//selectors
import { purchaseSelector } from '../../store/reducer/purchase/selector';


function List({ purchases, setPurchases, firstCursor, loadParametrs, load, setLoad, activeTabs }) {
    const [anim, setAnim] = useState(false)
    const [cursorNext, setCursorNext] = useState('');
    const purchase = useSelector(purchaseSelector).purchase;
    const throttleInProgress = useRef();
    const timerDebounceRef = useRef();
    const listRef = useRef();
    console.log(purchases)

    useEffect(() => {
        setAnim(true)
    }, [])

    useEffect(() => {
        setCursorNext(firstCursor)
    }, [firstCursor])

    useEffect(() => {
        window.addEventListener('scroll', handleDebounceScroll);
        return () => window.removeEventListener('scroll', handleDebounceScroll)
    }, [cursorNext, load]);

    const handleLoadList = () => {
        getPurchasesCursor(cursorNext, activeTabs)
            .then(res => {
                console.log(res)
                const data = res.data.data;
                const cursor = res.data.next_page_url;
                setPurchases(prevState => [...prevState, ...data]);
                setCursorNext(cursor);
                setTimeout(() => {
                    setLoad(false);
                }, 250)
            })
            .catch(err => console.log(err))
    }


    const handlePurchasesList = () => {

        if (cursorNext == '' || cursorNext == null) {
            return
        }

        if (cursorNext !== '' && cursorNext !== null && activeTabs !== 'action') {
            handleLoadList()
            return
        }

        if (cursorNext == null) {
            return
        }
    }

    const scrollLoad = () => {
        const loadScroll = listRef?.current?.getBoundingClientRect()?.bottom - window.innerHeight < 500;
        loadScroll && !load && handlePurchasesList(cursorNext);
    }

    function handleDebounceScroll() {
        // Если ID таймена установлено - сбрасываем таймер
        if (timerDebounceRef.current) {
            clearTimeout(timerDebounceRef.current);
        }
        // Запускаем таймер, возвращаемое ID таймера
        // записываем в timerDebounceRef
        timerDebounceRef.current = setTimeout(() => {
            // Вызываем увеличение счётчика кол-ва
            // выполнения бизнес логики приложения с Debounce
            scrollLoad()
        }, 200);
    }

    return (
        <div style={{ pointerEvents: loadParametrs ? 'none' : '' }} ref={listRef} className={`${s.list} ${anim && s.list_anim}`}>
            <div className={s.header}>
                <div className={`${s.item} ${s.item_date}`}>
                    <p>Дата оплаты</p>
                </div>
                <div className={`${s.item} ${s.item_pos}`}>
                    <p>Позиции</p>
                </div>
                <div className={`${s.item} ${s.item_sum}`}>
                    <p>Сумма</p>
                </div>
                <div className={`${s.item} ${s.item_buyer}`}>
                    <p>Покупатель</p>
                    <IconArrow />
                </div>
                <div className={`${s.item} ${s.item_seller}`}>
                    <p>Продавец</p>
                    <IconArrow />
                </div>
                <div className={`${s.item} ${s.item_status}`}>
                    <p>Статус</p>
                    <IconArrow />
                </div>
            </div>
            {load && <ul className={s.purchases}>
                {[...Array(18)]?.map((el, i) => {
                    return <PurchaseSceleton key={i} />
                })}
            </ul>
            }

            {!load && <ul className={s.purchases}>
                {purchases.map((el, i) => {
                    return <Purchase key={el.id} el={el} />
                })}
            </ul>
            }
            {purchase.open && purchase.id !== '' && !purchase.isOrder && <WindowPurchase id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} />}
        </div>
    )
};

export default List;