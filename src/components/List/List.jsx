import s from './List.module.scss';
import { useState, useEffect, useRef } from 'react';
import { ReactComponent as IconArrow } from '../../image/iconArrow.svg';
import { useSelector } from 'react-redux';
//Api
import { getPurchases, getPurchasesCursor } from '../../Api/Api'
//component
import Purchase from '../Purchase/Purchase';
import WindowPurchase from '../WindowPurchase/WindowPurchase';
//selectors
import { purchaseSelector } from '../../store/reducer/purchase/selector';


function List({ purchases, setPurchases }) {
    const [cursorNext, setCursorNext] = useState('');
    const purchase = useSelector(purchaseSelector).purchase;
    const throttleInProgress = useRef();
    const listRef = useRef();
   

    useEffect(() => {
        handlePurchasesList(cursorNext)
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleThrottleScroll);
        return () => window.removeEventListener('scroll', handleThrottleScroll)
    }, [cursorNext]);

    const handlePurchasesList = () => {
        if (cursorNext == '') {
            getPurchases()
                .then(res => {
                    const data = res.data.data;
                    const cursor = res.data.next_page_url;
                    setPurchases([...purchases, ...data]);
                    setCursorNext(cursor);
                })
                .catch(err => console.log(err))
            return
        }

        if (cursorNext !== '' && cursorNext !== null) {
            getPurchasesCursor(cursorNext)
                .then(res => {
                    const data = res.data.data;
                    const cursor = res.data.next_page_url;
                    setPurchases([...purchases, ...data]);
                    setCursorNext(cursor);
                })
                .catch(err => console.log(err))
            return
        }

        if (cursorNext == null) {
            return
        }
    }

    const scrollLoad = () => {
        const load = listRef?.current?.getBoundingClientRect()?.bottom - window.innerHeight < 2800;
        load && handlePurchasesList(cursorNext);
    }

    function handleThrottleScroll() {
        if (throttleInProgress.current) {
            return
        }
        throttleInProgress.current = true;
        setTimeout(() => {
            scrollLoad()
            throttleInProgress.current = false;
        }, 500);
    }

    return (
        <div ref={listRef} className={s.list}>
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
            <ul className={s.purchases}>
                {purchases?.map((el, i) => {
                    return <Purchase key={el.id} el={el} />
                })}
            </ul>
            {purchase.open && <WindowPurchase id={purchase.id} purchase={purchase}/>}
        </div>
    )
};

export default List;