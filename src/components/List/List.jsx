import s from './List.module.scss';
import { useState, useEffect, useRef } from 'react';
import { ReactComponent as IconArrow } from '../../image/iconArrow.svg';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
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
    const [endCursor, setEndCursor] = useState(30);
    const purchase = useSelector(purchaseSelector).purchase;
    const listRef = useRef();


    useEffect(() => {
        setAnim(true)
    }, [])

    useEffect(() => {
        setCursorNext(firstCursor)
    }, [firstCursor])

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

   

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const scrollLoad = () => {
        const loadBottom = listRef.current.getBoundingClientRect().bottom - window.innerHeight < 800;
        const loadTop = window.innerHeight - listRef.current.getBoundingClientRect().top < 800;
        loadBottom && setEndCursor(prevState => prevState + 30)
        loadTop && setEndCursor(30);

    }

    useEffect(() => {
        window.addEventListener('scroll', scrollLoad);
        return () => window.removeEventListener('scroll', scrollLoad)
    }, [])

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

            {!load && <InfiniteScroll
                dataLength={purchases.length}
                next={handleLoadList}
                hasMore={true}
            /*  loader={<h4>Loading...</h4>} */
            >
                <ul className={s.purchases}>
                    {purchases.slice(0, endCursor).map((el, i) => {
                        return <Purchase key={el.id} el={el} />
                    })}
                </ul>
            </InfiniteScroll>
            }
            {purchase.open && purchase.id !== '' && !purchase.isOrder && <WindowPurchase id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} />}
        </div>
    )
};

export default List;