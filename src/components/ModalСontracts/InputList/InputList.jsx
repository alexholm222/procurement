import s from './InputList.module.scss';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as IconArrow } from '../../../image/icon/purchase/iconChewron.svg';
import { handleFilter, handleFilterObject } from '../../../utils/filter';

const InputList = ({ open, setOpen, value, setValue, inputRef, list, err, setErr, disabled, type }) => {
    const [listInput, setListInput] = useState(list || []);
    const [valueText, setValueText] = useState(value?.name || []);
    const [count, setCount] = useState(0)
    const itemRef = useRef();

    const handleOpenList = () => {
        if (open) {
            inputRef.current.blur();
            setOpen(false);
            return
        }
        if (!open) {
            setOpen(true);
            return
        }
    }

    const handleСhoose = (e) => {
        const id = e.currentTarget.id;
        const result = list.find(el => el.id == id);
        setValue(result);
        setValueText(result.name)
        setOpen(false);
    }

    const handleChange = (e) => {
        setErr(false);
        const valueTarget = e.target.value;
        setValueText(valueTarget);
        const filterList = type == 'object' ? handleFilterObject(valueTarget, [...list]) : handleFilter(valueTarget, [...list]);
        setListInput(filterList)
        setValue(valueTarget);

        if (e.keyCode == 13 && listInput.length > 0) {
            setValue(filterList[0]);
            setValueText(filterList[0].name)
            setOpen(false);
            setTimeout(() => {
                setListInput(list);
            }, 150)
            return
        }

        if (e.keyCode == 13 && filterList.length == 0) {
            setOpen(false);
            setErr(true);
            console.log('ошибка');
            return
        }
        setTimeout(() => {
            filterList.length > 0 ? setOpen(true) : setOpen(false);
        })
    }
  
    const handleFocusItem = (e) => {
        const items = inputRef.current.querySelectorAll(`li`);
        const itemsLength = items.length;

        if (e.keyCode == 13) {
            setOpen(false);
            return
        }
        
    
        if (e.keyCode === 40 && count < itemsLength) {
            e.preventDefault();
            items[count].focus();
            setValue(listInput[count]);
            setValueText(listInput[count].name)
            setCount(count + 1)
            return
        }

        if (e.keyCode === 38 && count == itemsLength) {
            e.preventDefault();
            console.log('тут')
            items[itemsLength - 2].focus();
            setCount(itemsLength - 2)
            return
        }

        if (e.keyCode === 38 && count !== 0) {
            e.preventDefault();
            items[count - 1].focus();
            setCount(count - 1)
            return
        }    
    }

    const handleFocusInput = () => {
        setOpen(true);
        setCount(0)
    }


    return (
        <div ref={inputRef} onKeyDown={handleFocusItem} className={`${s.input} ${type == 'object' && s.input_object} ${open && s.input_open} ${err && s.input_error} ${disabled && s.input_disabled}`}>
            {type !== 'object' && <input disabled={disabled} onKeyDown={handleChange} onFocus={handleFocusInput} onChange={handleChange} value={valueText || ''} type='text'></input>}
            {type == 'object' &&
                <div className={s.block}>
                    <input disabled={disabled} onKeyDown={handleChange} onFocus={handleFocusInput} onChange={handleChange} value={valueText || ''} type='text'></input>
                    {value?.inn && <div onClick={handleOpenList} className={s.block_inn}>
                        <span className={s.inn}>ИНН: {value?.inn ? value?.inn : ''}</span> <span>КПП: {value?.kpp ? value?.kpp : 'отсутсвует'}</span>
                    </div>
                    }

                    {!value?.inn && <div onClick={handleOpenList} className={s.block_inn}>
                        <span className={s.inn}>ИНН: отсутствует</span>
                    </div>
                    }
                </div>
            }
            {!disabled && type !== 'object' && <div className={s.arrow} onClick={handleOpenList}>
                <IconArrow />
            </div>}
            <ul onKeyDown={handleFocusItem} className={`${s.list} ${type == 'object' && s.list_object} ${open && s.list_open}`} tabIndex="-1">
                {type !== 'object' && listInput.map((el, i) => {
                    return <li ref={itemRef} id={el.id} key={i} onClick={handleСhoose} tabIndex="0">{el.name}</li>
                })}

                {type == 'object' && listInput.map((el, i) => {
                    return <li ref={itemRef} id={el.id} key={i} onClick={handleСhoose} tabIndex="0">
                        <p>{el?.name}</p>
                        {el?.inn?.length > 0 && <span>ИНН: {el?.inn} КПП: {el?.kpp}</span>}
                    </li>
                })}
            </ul>
        </div>
    )
};

export default InputList;
