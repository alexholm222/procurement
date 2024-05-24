import s from './List.module.scss';
import { useState, useEffect, useRef } from 'react';
import { ReactComponent as IconArrow } from '../../image/iconArrow.svg';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Api
import { getSearchCursor } from '../../Api/Api'
//component
import Purchase from '../Purchase/Purchase';
import WindowPurchase from '../WindowPurchase/WindowPurchase';
import PurchaseSceleton from '../Purchase/PurchaseSceleton/PurchaseSceleton';
//selectors
import { purchaseSelector } from '../../store/reducer/purchase/selector';


function ListSearch({ purchases, setPurchases, firstCursor, loadParametrs, load, setLoad, activeTabs, query }) {
    const [anim, setAnim] = useState(false)
    const [cursorNext, setCursorNext] = useState('');
    const purchase = useSelector(purchaseSelector).purchase;
    const throttleInProgress = useRef();
    const listRef = useRef();

    useEffect(() => {
        setAnim(true)
    }, [])

    useEffect(() => {
        setCursorNext(firstCursor)
    },[firstCursor])

    useEffect(() => {
        window.addEventListener('scroll', handleThrottleScroll);
        return () => window.removeEventListener('scroll', handleThrottleScroll)
    }, [cursorNext]);

    const handleLoadList = () => {
        getSearchCursor(cursorNext, query)
            .then(res => {
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

    console.log(purchases)

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
        const load = listRef?.current?.getBoundingClientRect()?.bottom - window.innerHeight < 2800;
     /*    load && handlePurchasesList(cursorNext); */
    }

    function handleThrottleScroll() {
        if (throttleInProgress.current) {
            return
        }
        throttleInProgress.current = true;
        setTimeout(() => {
            scrollLoad()
            throttleInProgress.current = false;
        }, 1800);
    }

    return (
        <div style={{ pointerEvents: loadParametrs ? 'none' : '' }} ref={listRef} className={`${s.list} ${anim && s.list_anim}`}>
            <div className={s.header}>
                <div className={`${s.item} ${s.item_date}`}>
                    <p>Дата</p>
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
            {purchase.open && purchase.id !== '' && <WindowPurchase id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} />}
        </div>
    )
};

export default ListSearch;