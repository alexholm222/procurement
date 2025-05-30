import s from './Goods.module.scss';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import { ReactComponent as IconPlus } from '../../image/iconPlus.svg';
import { ReactComponent as IconWarning24 } from '../../image/icon/purchase/iconWarning24.svg';
import { ReactComponent as IconDone } from '../../image/iconDone.svg';
import { useEffect, useState } from 'react';
import AddGood from '../AddGood/AddGood';
import { addSpaceNumber } from '../../utils/addSpaceNumber';

function Good({ el, i, goods, setGoods, disabled, setOpenAdd, setPosition, role, status }) {
    const [anim, setAnim] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAnim(true);
        })
    }, []);

    function handleDeleteGood(e) {
        const id = e.currentTarget.id;
        const arrFilter = goods.filter(el => String(el.id) !== id);
        setAnim(false);
        setTimeout(() => {
            setGoods(arrFilter)
        }, 200)
    }

    const handleOpenPosition = () => {
        setPosition(el)
        setOpenAdd(true)
    }

    return (
        <li key={el.id} id={el.id} className={`${s.item} ${anim && s.item_anim} ${((status > 2 && (role == 'administrator' || role == 'director')) || (status > 0 && (role == 'administrator' || role == 'director')) || status == -1) && s.item_disabled}`}>
            <div onClick={handleOpenPosition} className={`${s.pos} ${s.cell}`}>{i + 1}</div>
            <div onClick={handleOpenPosition} className={`${s.name} ${s.cell}`}><p>{el.name}</p></div>
            <div onClick={handleOpenPosition} className={`${s.type} ${s.cell}`}><p>{el.item_id !== 0 ? 'шаблон' : el.type}</p></div>
            <div onClick={handleOpenPosition} className={`${s.num} ${s.cell}`}><p>{el.quantity}</p></div>
            <div onClick={handleOpenPosition} className={`${s.price} ${s.cell}`}><p>{addSpaceNumber(el.price)}</p></div>
            <div onClick={handleOpenPosition} className={`${s.total} ${disabled && s.total_} ${s.cell}`}><p>{addSpaceNumber(el.sum)}</p></div>
            <div className={`${s.delete} ${s.cell} ${disabled && s.delete_disabled} ${((status > 2 && (role == 'administrator' || role == 'director')) || (status > 0 && (role == 'administrator' || role == 'director')) || status == -1) && s.delete_disabled}`}>
                <IconDelete id={el.id} onClick={handleDeleteGood} />
            </div>

        </li>
    )
}

function Goods({ scrollTopHeight, positions, setPositions, windowRef, sum, setSum, isNal, disabled, setIsNormalPrice, status, role, positionReturn, positionReturnDone }) {
    const [openAdd, setOpenAdd] = useState(false);
    const [position, setPosition] = useState({});
    const [isFull, setIsFull] = useState(false);

    console.log(positions)

    useEffect(() => {
        const sum = positions.reduce((acc, el) => acc + Number(el.sum), 0);
        setSum(sum);
    }, [positions]);

    useEffect(() => {
        const result = positionReturn.filter(el => el.is_full == 1);
        result.length > 0 ? setIsFull(true) : setIsFull(false)
    }, [positionReturn])


    const handleOpenAdd = () => {
        setPosition({})
        setOpenAdd(true)
    }



    return (
        <div className={s.goods}>
            {openAdd && <AddGood scrollTopHeight={scrollTopHeight} setOpenAdd={setOpenAdd} setGoods={setPositions} goods={positions} windowRef={windowRef} isNal={isNal} position={position} />}
            <h3 className={s.title}>Позиции</h3>
            <div className={s.table}>
                <div className={s.header}>
                    <div className={`${s.sub} ${s.pos}`}>
                        <p>№</p>
                    </div>
                    <div className={`${s.sub} ${s.name}`}>
                        <p>Наименование</p>
                    </div>

                    <div className={`${s.sub} ${s.type}`}>
                        <p>Тип</p>
                    </div>

                    <div className={`${s.sub} ${s.num}`}>
                        <p>Кол-во</p>
                    </div>

                    <div className={`${s.sub} ${s.price}`}>
                        <p>Цена</p>
                    </div>

                    <div className={`${s.sub} ${s.total} `}>
                        <p>Итого</p>
                    </div>

                    <div className={` ${s.empity} ${((status > 2 && (role == 'administrator' || role == 'director')) || (status > 0 && (role == 'administrator' || role == 'director')) || status == -1 || disabled) && s.empity_dis}`}>

                    </div>
                </div>
                <ul className={`${s.list} ${disabled && s.list_disabled} ${positions.length <= 1 && s.list_first}`}>
                    {<li className={`${s.item} ${s.item_empty} ${positions.length === 0 && s.item_empty_anim}`}>Нет позиций</li>}

                    {positions.map((el, i) => {
                        return <Good key={el.id} el={el} i={i} goods={positions} setGoods={setPositions} setPosition={setPosition} disabled={disabled} setOpenAdd={setOpenAdd} role={role} status={status} />
                    })}
                </ul>
            </div>

            {!isFull && <ul className={s.return}>
                {positionReturn.map(el => {
                    return el.status !== 'confirmed' && <li
                        className={`${s.position} ${el.status == 'confirmed' && s.position_confirmed}`}
                        key={el.id}><IconWarning24 />Запрошен возврат позиции - {el.purchases_item?.name} - {el.quantity} {/* {el.purchases_item?.unit} */} на сумму {el?.quantity == null ? addSpaceNumber(el?.sum) : addSpaceNumber(el.quantity * el.purchases_item?.price)} ₽</li>
                })}
            </ul>}


            {isFull && <ul className={s.return}>
                <li className={`${s.position}`}><IconWarning24 />Запрошен полный возврат закупки</li>
            </ul>}

            {positionReturnDone?.[0]?.is_full !== 1 && <ul className={s.return}>
                {positionReturnDone.map(el => {
                    return <li className={`${s.position}`} key={el.id}><IconDone />Получен возврат позиции - {el.purchases_item?.name} - {el.quantity} {/* {el.purchases_item?.unit} */} на сумму  {el?.quantity == null ? addSpaceNumber(el?.sum) : addSpaceNumber(el.quantity * el.purchases_item?.price)} ₽</li>
                })}
            </ul>}


            {positionReturnDone?.[0]?.is_full == 1 && positionReturnDone.length > 0 && <ul className={s.return}>
                <li className={`${s.position}`}><IconDone />Получен полный возврат закупки</li>
            </ul>}

            <div className={s.footer}>
                {status < 4 && <button onClick={handleOpenAdd} className={`${s.button} ${disabled && s.button_disabled}`}>
                    <IconPlus />
                    <p>Добавить позицию</p>
                </button>
                }
                <p className={s.text}>Итого {addSpaceNumber(sum)} ₽</p>
            </div>

        </div>
    )
};

export default Goods;