import { useEffect, useRef, useState } from 'react';
import s from './AddGood.module.scss';
import { ReactComponent as IconClose } from '../../image/iconClose.svg';
import { ReactComponent as IconArrowDown } from '../../image/iconArrowDown.svg';

function AddGood({ setOpenAdd, goods, setGoods }) {
    const [anim, setAnim] = useState(false);
    const [name, setName] = useState('');
    const [num, setNum] = useState('');
    const [price, setPrice] = useState('');
    const modalRef = useRef();
    console.log(name)
    useEffect(() => {
        setAnim(true)
    }, []);

    function handleClose() {
        setAnim(false);

        setTimeout(() => {
            setOpenAdd(false);
        }, 300)
    }

    function closeModal(e) {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleClose();
        }
    }

    function handleAddGood() {
        setGoods([...goods, {name, num, price, id: price*num*name.length}]);
        handleClose()
    }

    function handleChangeName(e) {
        setName(e.target.value)
    }

    function handleChangeNum(e) {
        setNum(e.target.value)
    }

    function handleChangePrice(e) {
        setPrice(e.target.value)
    }

    useEffect(() => {
        document.addEventListener('mouseup', closeModal);

        return () => document.removeEventListener('mouseup', closeModal);
    }, []);


    return (
        <div className={`${s.window} ${anim && s.window_anim}`}>
            <div ref={modalRef} className={`${s.add} ${anim && s.add_anim}`}>
                <div className={s.header}>
                    <p className={s.title}>Добавление позиции</p>
                    <IconClose onClick={handleClose} />
                </div>

                <p className={s.sub}>Наименование позиции</p>

                <div className={s.good}>
                    <input onChange={handleChangeName} className={s.input} value={name || ''} placeholder='Не указано' type='text'></input>
                    <div className={s.type}>
                        <p>Товар</p>
                        <IconArrowDown />
                    </div>
                </div>

                <div className={s.container}>
                    <div className={s.block}>
                        <p className={s.sub}>Количество</p>
                        <div className={s.good}>
                            <input className={s.input} onChange={handleChangeNum} value={num || ''} placeholder='Не указано' type='text'></input>
                            <span className={s.sub}>шт</span>
                        </div>
                    </div>

                    <div className={s.block}>
                        <p className={s.sub}>Цена за единицу</p>
                        <div className={s.good}>
                            <input className={s.input} onChange={handleChangePrice} value={price || ''} placeholder='Не указано' type='text'></input>
                            <span className={s.sub}>руб</span>
                        </div>
                    </div>
                </div>

                <button onClick={handleAddGood} className={s.button}>Добавить в закупку</button>
            </div>
        </div>
    )
};

export default AddGood;