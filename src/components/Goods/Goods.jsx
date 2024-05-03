import s from './Goods.module.scss';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import { ReactComponent as IconPlus } from '../../image/iconPlus.svg';
import { useEffect, useState } from 'react';
import AddGood from '../AddGood/AddGood';
import { addSpaceNumber } from '../../utils/addSpaceNumber';

function Good({ el, i, goods, setGoods }) {
    const [anim, setAnim] = useState(false);
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

    return (
        <li key={el.id} id={el.id} className={`${s.item} ${anim && s.item_anim}`}>
            <div className={`${s.pos} ${s.cell}`}>{i + 1}</div>
            <div className={`${s.name} ${s.cell}`}>{el.name}</div>
            <div className={`${s.type} ${s.cell}`}>{el.unit}</div>
            <div className={`${s.num} ${s.cell}`}>{el.quantity}</div>
            <div className={`${s.price} ${s.cell}`}>{addSpaceNumber(el.price)}</div>
            <div className={`${s.total} ${s.cell}`}>{addSpaceNumber(el.quantity * el.price)}</div>
            <div className={`${s.delete} ${s.cell}`}>
                <IconDelete id={el.id} onClick={handleDeleteGood} />
            </div>
        </li>
    )
}

function Goods({scrollTopHeight, positions, setPositions, windowRef, sum, setSum}) {
    const [openAdd, setOpenAdd] = useState(false);

    useEffect(() => {
        const sum = positions.reduce((acc, el) => acc + el.sum, 0);
        setSum(sum);
      }, [positions])

    const handleOpenAdd = () => {
        setOpenAdd(true)
    }

    return (
        <div className={s.goods}>
            {openAdd && <AddGood scrollTopHeight={scrollTopHeight} setOpenAdd={setOpenAdd} setGoods={setPositions} goods={positions} windowRef={windowRef}/>}
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

                    <div className={`${s.sub} ${s.total}`}>
                        <p>Итого</p>
                    </div>
                </div>
                <ul className={`${s.list} ${positions.length <= 1 && s.list_first}`}>
                    { <li className={`${s.item} ${s.item_empty} ${positions.length === 0 && s.item_empty_anim}`}>Нет позиций</li>}

                    {positions.map((el, i) => {
                        return <Good key={el.id} el={el} i={i} goods={positions} setGoods={setPositions} />
                    })}

                </ul>
            </div>
            <div className={s.footer}>
                <button onClick={handleOpenAdd} className={s.button}>
                    <IconPlus />
                    <p>Добавить позицию</p>
                </button>
                <p className={s.text}>Итого {addSpaceNumber(sum)} ₽</p>
            </div>

        </div>
    )
};

export default Goods;