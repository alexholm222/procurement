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


function List({ isSkilla, role, purchases, purchaseCount, purchaseCountGeneral, setPurchases, firstCursor, loadParametrs, load, setLoad, activeTabs, filterPayDate }) {
    const [anim, setAnim] = useState(false)
    const [cursorNext, setCursorNext] = useState(null);
    const [endCursor, setEndCursor] = useState(30);
    const purchase = useSelector(purchaseSelector).purchase;
    const listRef = useRef();
    const isskilla = document.getElementById('root_purchases').getAttribute('isskilla') == 1 ? true : false;

    useEffect(() => {
        setAnim(true)
    }, [])

    useEffect(() => {
        setCursorNext(firstCursor)
    }, [firstCursor])

    const handleLoadList = () => {
        cursorNext !== null && getPurchasesCursor(cursorNext, activeTabs, filterPayDate)
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



    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

  /*   const scrollLoad = () => {
        const loadBottom = listRef.current.getBoundingClientRect().bottom - window.innerHeight < 800;
        const loadTop = window.innerHeight - listRef.current.getBoundingClientRect().top < 800;
        loadBottom && setEndCursor(prevState => prevState + 30)
        loadTop && setEndCursor(30);

    } */

   /*  useEffect(() => {
        window.addEventListener('scroll', scrollLoad);
        return () => window.removeEventListener('scroll', scrollLoad)
    }, []) */

    return (
        <div style={{ pointerEvents: loadParametrs ? 'none' : '' }} ref={listRef} className={`${s.list} ${!isskilla && s.list_nomargin} ${anim && s.list_anim}`}>
            <div className={s.header}>
                <div className={`${s.item} ${s.item_date}`}>
                    <p>Дата оплаты</p>
                </div>
                <div className={`${s.item} ${s.item_pos} ${(role == 'director' || role == 'administrator') && s.item_pos_director}`}>
                    <p>Позиции</p>
                </div>
                <div className={`${s.item} ${s.item_sum}`}>
                    <p>Сумма</p>
                </div>
                <div className={`${s.item} ${s.item_buyer}`}>
                    <p>Покупатель</p>

                </div>
                <div className={`${s.item} ${s.item_seller} ${(role == 'director' || role == 'administrator') && s.item_seller_director}`}>
                    <p>Продавец</p>
                </div>

                {(role == 'director' || role == 'administrator') && <div className={`${s.item} ${s.item_accounting}`}>
                    <p>Учет в итогах</p>
                </div>}

                <div className={`${s.item} ${s.item_status}`}>
                    <p>Статус</p>
                    {/* <IconArrow /> */}
                </div>

                {<ul className={`${s.purchases} ${s.purchases__loader} ${!load && s.purchases__loader_hidden}`}>
                {[...Array(18)]?.map((el, i) => {
                    return <PurchaseSceleton key={i} role={role}/>
                })}
            </ul>
            }
            </div>
           

            {/* !load &&  */<InfiniteScroll
                dataLength={purchases.length}
                next={handleLoadList}
                hasMore={true}
                scrollableTarget = {!isskilla ? "purchasesApp" : null}
            /*  loader={<h4>Loading...</h4>} */
            >
                <ul className={s.purchases}>
                    {purchases/* .slice(0, endCursor) */.map((el, i) => {
                        return <Purchase key={el.id} el={el} role={role} isSkilla={isSkilla} />
                    })}
                </ul>
            </InfiniteScroll>
            }
            {purchaseCountGeneral == 0 && purchases.length == 0 && <div className={s.empty}><p>Закупки не добавлены</p></div>}
            {purchases.length == 0 && purchaseCountGeneral !== 0 && <div className={s.empty}><p>По выбранным фильтрам нет закупок</p></div>}
            {purchase.open && purchase.id !== '' && !purchase.isOrder && <WindowPurchase role={role} isSkilla={isSkilla} id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} />}
        </div>
    )
};

export default List;