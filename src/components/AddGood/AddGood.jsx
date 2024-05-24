import { useEffect, useRef, useState } from 'react';
import s from './AddGood.module.scss';
import { ReactComponent as IconClose } from '../../image/iconClose.svg';
import { ReactComponent as IconArrowDown } from '../../image/iconArrowDown.svg';
import uuid from 'react-uuid';
import { useSelector } from 'react-redux';
//utils
import { handleFilter } from '../../utils/filter';
//components
import ProgressLine from './ProgressLine/ProgressLine';
//slice
import { purchaseSelector } from '../../store/reducer/purchase/selector';
const typeList = ['товар', 'услуга'];
const typeList2 = ['товар', 'услуга'];

function AddGood({ scrollTopHeight, setOpenAdd, goods, setGoods, windowRef, isNal }) {
    const [anim, setAnim] = useState(false);
    const [itemId, setItemId] = useState(0);
    const [name, setName] = useState('');
    const [num, setNum] = useState('');
    const [price, setPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [rate, setRate] = useState(0);
    const [maxRate, setMaxRate] = useState(0);
    const [type, setType] = useState('товар');
    const [unit, setUnit] = useState('шт');
    const [patterList, setPatternList] = useState([]);
    const [patternId, setPatternId] = useState('');
    const [patternState, setPatternState] = useState(false);
    const [openPatternList, setOpenPatternList] = useState(false);
    const [openList, setOpenList] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [perUnit, setPerUnit] = useState(1)
    const items = useSelector(purchaseSelector).items;
    const modalRef = useRef();
    const listRef = useRef();
    const listPatternRef = useRef();
    const inputRefFocus = useRef();
    console.log(patterList)

    useEffect(() => {
        setAnim(true);
    }, []);

    useEffect(() => {
        windowRef.current.style.overflow = "hidden";

        return () => {
            windowRef.current.style.overflowY = "scroll";
            windowRef.current.style.left = "0";
        };
    }, [windowRef]);

    useEffect(() => {
        setPatternList(items)
    }, [items])

    useEffect(() => {
        if (name == '' || num <= 0 || num == '' || price <= 0 || price == '') {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false)
        }
    }, [name, num, price]);

    useEffect(() => {
        patternId !== '' ? setPatternState(true) : setPatternState(false);
    }, [patternId]);

    function handleClose() {
        setAnim(false);

        setTimeout(() => {
            setOpenAdd(false);
        }, 300)
    }

    useEffect(() => {
        if (patterList.length == 0) {
            setPatternId('')
        }
    }, [patterList]);

    useEffect(() => {
        inputRefFocus.current && inputRefFocus.current.focus();
        setOpenPatternList(false)
    }, [inputRefFocus]);

    function closeModal(e) {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target) && !openList && !openPatternList) {
            handleClose();
            return
        }

        if (listRef.current && !listRef.current.contains(e.target) && openList) {
            setOpenList(false);
            return
        }

        if (listPatternRef.current && !listPatternRef.current.contains(e.target) && openPatternList) {
            setOpenPatternList(false);
            return
        }
    }

    function handleAddGood() {
        setGoods([...goods, { item_id: itemId, name, quantity: Number(num), unit: unit, price: Number(price), per_unit: perUnit, type: type, sum: perUnit == 1 ? num * price : price, id: uuid(), maxPrice }]);
        handleClose()
    }


    function handleChangeName(e) {
        setName(e.target.value);
        setOpenPatternList(true);
        const newList = handleFilter(e.target.value, items);
        console.log(newList)
        setPatternList(newList);
    }

    function handleChangeNum(e) {
        setNum(e.target.value)
    }

    function handleChangePrice(e) {
        setPrice(Number(e.target.value))
    }

    function handleOpenList() {
        openList ? setOpenList(false) : setOpenList(true);
    }

    function handleChoseType(e) {
        const value = e.currentTarget.textContent;
        console.log(value)
        setType(value)
    }

    const handleChosePattern = (e) => {
        const id = e.currentTarget.id;
        const pattern = items.find(el => el.id == id);
        const maxrate = pattern.rate * 2;
        setItemId(pattern.id)
        setName(pattern.name);
        setUnit(pattern.unit);
        setMaxPrice(pattern.max_price);
        setRate(pattern.rate);
        setMaxRate(maxrate);
        setPatternId(id);
        setOpenPatternList(false);
    }

    const handleOpenPatternList = () => {
        setOpenPatternList(true);
    }

    const handlePriceOne = () => {
        setPerUnit(1)
    }

    const handlePrice = () => {
        setPerUnit(0)
    }

    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, [openList, openPatternList]);


    return (
        <div style={{ top: `${scrollTopHeight}px` }} className={`${s.window} ${anim && s.window_anim}`}>
            <div ref={modalRef} className={`${s.add} ${anim && s.add_anim}`}>
                <div className={s.header}>
                    <p className={s.title}>Добавление позиции</p>
                    <IconClose onClick={handleClose} />
                </div>

                <p className={s.sub}>Наименование позиции</p>

                <div className={`${s.good} ${openList && s.good_list}`}>
                    <div style={{ width: '100%' }} ref={listPatternRef}>
                        <input onClick={handleOpenPatternList} ref={inputRefFocus} onFocus={() => setOpenPatternList(true)} onChange={handleChangeName} className={s.input} value={name || ''} placeholder='Не указано' type='text'></input>
                        <ul className={`${s.pattern_list} ${openPatternList && s.pattern_list_open}`}>
                            {patterList.map((el) => {
                                return el.active && <li onClick={handleChosePattern} key={el.id} id={el.id}><p>{el.name}</p></li>

                            })}
                        </ul>
                    </div>

                    <div className={s.line}></div>
                    <div ref={listRef} onClick={handleOpenList} className={`${s.type} ${openList && !patternState && s.type_open} ${patternState && s.type_disabled}`}>
                        <p>{patternState ? 'шаблон' : type}</p>
                        <IconArrowDown />
                        <ul className={`${s.list} ${openList && !patternState && s.list_open}`}>
                            {(isNal ? typeList2 : typeList).map((el) => {
                                return <li onClick={handleChoseType}>{el}</li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className={s.container_big}>
                    <div className={`${s.container_slide} ${patternState && s.container_pattern}`}>
                        <div className={`${s.container}`}>
                            <div className={s.block}>
                                <p className={s.sub}>Количество</p>
                                <div className={s.good}>
                                    <input className={s.input} onChange={handleChangeNum} value={num || ''} placeholder='Не указано' type='number'></input>
                                    <span className={s.sub}>{unit}</span>
                                </div>
                            </div>

                            <div className={`${s.block}`}>
                                <div className={s.container_sub}>
                                    <p onClick={handlePriceOne} className={`${s.sub} ${s.sub_price} ${perUnit == 1 && s.sub_price_active}`}>Цена за единицу</p>
                                    <p onClick={handlePrice} className={`${s.sub} ${s.sub_price} ${perUnit == 0 && s.sub_price_active}`}>Цена за все</p>
                                </div>
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
                                        <span className={s.sub}>{unit}</span>
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
                                    <ProgressLine type={'unit'} unit={unit} num={num} rate={rate} maxRate={maxRate} />
                                    <ProgressLine type={'price'} maxPrice={maxPrice} price={price} />
                                </div>

                                <div className={s.block}>

                                </div>
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