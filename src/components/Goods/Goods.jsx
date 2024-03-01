import s from './Goods.module.scss';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import { ReactComponent as IconPlus } from '../../image/iconPlus.svg';
import { useState } from 'react';
import AddGood from '../AddGood/AddGood';

function Goods() {
    const [goods, setGoods] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    console.log(goods)
    function handleOpenAdd() {
        setOpenAdd(true)
    }

    function handleDeleteGood(e) {
        const id = Number(e.currentTarget.id);
        console.log(id)
        const arrFilter = goods.filter(el => el.id !== id);
        
            setGoods(arrFilter)
        

    }

    return (
        <div className={s.goods}>
            {openAdd && <AddGood setOpenAdd={setOpenAdd} setGoods={setGoods} goods={goods} />}
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
                <ul className={s.list}>
                    {goods.length === 0 && <li className={`${s.item} ${s.item_empty}`}>Нет позиций</li>}

                    {goods.map((el, index) => {
                        return <li key={el.id} id={el.id} className={`${s.item}`}>
                            <div className={`${s.pos} ${s.cell}`}>{index + 1}</div>
                            <div className={`${s.name} ${s.cell}`}>{el.name}</div>
                            <div className={`${s.type} ${s.cell}`}>{`Товар`}</div>
                            <div className={`${s.num} ${s.cell}`}>{el.num}</div>
                            <div className={`${s.price} ${s.cell}`}>{el.price}</div>
                            <div className={`${s.total} ${s.cell}`}>{el.num * el.price}</div>
                            <div className={`${s.delete} ${s.cell}`}>
                                <IconDelete id={el.id} onClick={handleDeleteGood} />
                            </div>
                        </li>
                    })}

                </ul>
            </div>
            <div className={s.footer}>
                <button onClick={handleOpenAdd} className={s.button}>
                    <IconPlus />
                    <p>Добавить позицию</p>
                </button>
                <p className={s.text}>Итого 16 000 ₽</p>
            </div>

        </div>
    )
};

export default Goods;