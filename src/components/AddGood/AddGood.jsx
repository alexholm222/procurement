import { useEffect, useRef, useState } from 'react';
import s from './AddGood.module.scss';
import { ReactComponent as IconClose } from '../../image/iconClose.svg';
import { ReactComponent as IconArrowDown } from '../../image/iconArrowDown.svg';
import uuid from 'react-uuid';
//components
import ProgressLine from './ProgressLine/ProgressLine';
const typeList = ['товар', 'услуга', 'шаблон'];

function AddGood({ scrollTopHeight, setOpenAdd, goods, setGoods, windowRef }) {
    const [anim, setAnim] = useState(false);
    const [name, setName] = useState('');
    const [num, setNum] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('товар');
    const [unit, setUnit] = useState('шт');
    const [patternState, setPatternState] = useState(false);
    const [openList, setOpenList] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    
    const modalRef = useRef();
    const listRef = useRef();
   
    useEffect(() => {
        setAnim(true);
    
    }, []);

    useEffect(() => {
        windowRef.current.style.overflow = "hidden";
        windowRef.current.style.left = "-4px";
        /* windowRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
        }); */
        return () => {
            windowRef.current.style.overflow = "auto";
            windowRef.current.style.left = "0";
        };
    }, [windowRef]);

    useEffect(() => {
        if (name == '' || num <= 0 || num == '' || price <= 0 || price == '') {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false)
        }
    }, [name, num, price]);

    useEffect(() => {
        type == 'шаблон' ? setPatternState(true) : setPatternState(false);
    }, [type]);

    function handleClose() {
        setAnim(false);

        setTimeout(() => {
            setOpenAdd(false);
        }, 300)
    }

    function closeModal(e) {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target) && !openList) {
            handleClose();
            return
        }

        if (listRef.current && !listRef.current.contains(e.target) && openList) {
            setOpenList(false);
            return
        }
    }

    function handleAddGood() {
        setGoods([...goods, {item_id: 0, name, quantity: Number(num), unit: unit, price: Number(price), per_unit: false, type: type, sum: num * price, id: uuid()}]); 
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

    function handleOpenList() {
        openList ? setOpenList(false) : setOpenList(true);
    }

    function handleChoseType(e) {
        const value = e.currentTarget.textContent;
        console.log(value)
        setType(value)
    }


    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, [openList]);


    return (
        <div style={{top: `${scrollTopHeight}px`}} className={`${s.window} ${anim && s.window_anim}`}>
            <div ref={modalRef} className={`${s.add} ${anim && s.add_anim}`}>
                <div className={s.header}>
                    <p className={s.title}>Добавление позиции</p>
                    <IconClose onClick={handleClose} />
                </div>

                <p className={s.sub}>Наименование позиции</p>

                <div className={`${s.good} ${openList && s.good_list}`}>
                    <input onChange={handleChangeName} className={s.input} value={name || ''} placeholder='Не указано' type='text'></input>
                    <div className={s.line}></div>
                    <div ref={listRef} onClick={handleOpenList} className={`${s.type} ${openList && s.type_open}`}>
                        <p>{type}</p>
                        <IconArrowDown />
                        <ul className={`${s.list} ${openList && s.list_open}`}>
                            {typeList.map((el) => {
                                return <li onClick={handleChoseType}>{el}</li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className={`${s.container_slide} ${patternState && s.container_pattern}`}>
                    <div className={`${s.container}`}>
                        <div className={s.block}>
                            <p className={s.sub}>Количество</p>
                            <div className={s.good}>
                                <input className={s.input} onChange={handleChangeNum} value={num || ''} placeholder='Не указано' type='number'></input>
                                <span className={s.sub}>шт</span>
                            </div>
                        </div>

                        <div className={`${s.block}`}>
                            <p className={s.sub}>Цена за единицу</p>
                            <div className={s.good}>
                                <input className={s.input} onChange={handleChangePrice} value={price || ''} placeholder='Не указано' type='number'></input>
                                <span className={s.sub}>руб</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${s.container}`}>
                        <div className={s.container_2}>
                            <div className={s.block}>
                                <p className={s.sub}>Количество</p>
                                <div className={s.good}>
                                    <input className={s.input} onChange={handleChangeNum} value={num || ''} placeholder='Не указано' type='number'></input>
                                    <span className={s.sub}>шт</span>
                                </div>
                            </div>

                            <div className={`${s.block}`}>
                                <p className={s.sub}>Цена за единицу</p>
                                <div className={s.good}>
                                    <input className={s.input} onChange={handleChangePrice} value={price || ''} placeholder='Не указано' type='number'></input>
                                    <span className={s.sub}>руб</span>
                                </div>
                            </div>
                        </div>

                        <div className={s.container_2}>
                            <div className={s.block}>
                                <ProgressLine type={'unit'} num={num} />
                                <ProgressLine type={'price'} />
                            </div>

                            <div className={s.block}>

                            </div>
                        </div>

                    </div>
                </div>

                <div className={s.container_option}>

                </div>

                <button disabled={buttonDisabled} onClick={handleAddGood} className={s.button}>Добавить в закупку</button>
            </div>
        </div>
    )
};

export default AddGood;