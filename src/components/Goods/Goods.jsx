import s from './Goods.module.scss';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import { ReactComponent as IconPlus } from '../../image/iconPlus.svg';
import { useEffect, useState } from 'react';
import AddGood from '../AddGood/AddGood';
import { addSpaceNumber } from '../../utils/addSpaceNumber';

function Good({ el, i, goods, setGoods, disabled, setOpenAdd, setPosition }) {
    const [anim, setAnim] = useState(false);
    console.log(el)

    useEffect(() => {
        setTimeout(() => {
            setAnim(true);
        })
    }, []);

    function handleDeleteGood(e) {
        const id = e.currentTarget.id;
        const arrFilter = goods.filter(el => String(el.id) !== id);
        console.log(arrFilter)
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
        <li key={el.id} id={el.id} className={`${s.item} ${anim && s.item_anim}`}>
            <div onClick={handleOpenPosition} className={`${s.pos} ${s.cell}`}>{i + 1}</div>
            <div onClick={handleOpenPosition} className={`${s.name} ${s.cell}`}>{el.name}</div>
            <div onClick={handleOpenPosition} className={`${s.type} ${s.cell}`}>{el.item_id !== 0 ? 'шаблон' : el.type}</div>
            <div onClick={handleOpenPosition} className={`${s.num} ${s.cell}`}>{el.quantity}</div>
            <div onClick={handleOpenPosition} className={`${s.price} ${s.cell}`}>{addSpaceNumber(el.price)}</div>
            <div onClick={handleOpenPosition} className={`${s.total} ${disabled && s.total_2} ${s.cell}`}>{addSpaceNumber(el.sum)}</div>
            <div className={`${s.delete} ${s.cell} ${disabled && s.delete_disabled}`}>
                <IconDelete id={el.id} onClick={handleDeleteGood} />
            </div>

        </li>
    )
}

function Goods({ scrollTopHeight, positions, setPositions, windowRef, sum, setSum, isNal, disabled, setIsNormalPrice }) {
    const [openAdd, setOpenAdd] = useState(false);
    const [position, setPosition] = useState({});

    useEffect(() => {
        const sum = positions.reduce((acc, el) => acc + el.sum, 0);
        console.log(sum)
        setSum(sum);
    }, [positions]);


    const handleOpenAdd = () => {
        setPosition({})
        setOpenAdd(true)
    }

    return (
        <div className={s.goods}>
            {openAdd && <AddGood scrollTopHeight={scrollTopHeight} setOpenAdd={setOpenAdd} setGoods={setPositions} goods={positions} windowRef={windowRef} isNal={isNal} position={position}/>}
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

                    <div className={`${s.sub} ${s.total} ${disabled && s.total_2}`}>
                        <p>Итого</p>
                    </div>
                </div>
                <ul className={`${s.list} ${disabled && s.list_disabled} ${positions.length <= 1 && s.list_first}`}>
                    {<li className={`${s.item} ${s.item_empty} ${positions.length === 0 && s.item_empty_anim}`}>Нет позиций</li>}

                    {positions.map((el, i) => {
                        return <Good key={el.id} el={el} i={i} goods={positions} setGoods={setPositions} setPosition={setPosition} disabled={disabled} setOpenAdd={setOpenAdd}/>
                    })}

                </ul>
            </div>
            <div className={s.footer}>
                <button onClick={handleOpenAdd} className={`${s.button} ${disabled && s.button_disabled}`}>
                    <IconPlus />
                    <p>Добавить позицию</p>
                </button>
                <p className={s.text}>Итого {addSpaceNumber(sum)} ₽</p>
            </div>

        </div>
    )
};

export default Goods;