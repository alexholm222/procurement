import { useState, useRef, useEffect, memo } from 'react';
import s from './Cell.module.scss';
import { ReactComponent as IconDone } from '../../../image/icon/iconDone.svg';
//API
import { saveManualData } from '../../../Api/Api';
//utils
import { addSpaceNumber } from '../../../utils/addSpaceNumber';

const Cell = memo(({ data, month, year, vendorId }) => {
    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState(data || 0);
    const [valueEdit, setValueEdit] = useState(data || 0);
    const [changeState, setChangeState] = useState(false);
    const [err, setErr] = useState(false)
    const inputRef = useRef();
    const modalRef = useRef();

    useEffect(() => {
        setValue(data)
        setValueEdit(data)
    }, [data])


    const handleEditMode = () => {
        setEditMode(true)

    }

    useEffect(() => {
        editMode && inputRef.current && setTimeout(() => {
            inputRef.current.focus()
        }, 100)
    }, [inputRef, editMode])

    const handleCloseEditMode = () => {
        setEditMode(false)

        setTimeout(() => {
            setValueEdit(value)
            setErr(false)
        }, 100)

    }


    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target) && editMode) {
            handleCloseEditMode();
        }
    }

    const handleChangeValue = (e) => {
        setValueEdit(e.target.value);
        setErr(false)
    }

    const handleEnter = (e) => {
        console.log(e.code)
        e.code == 'Enter' && handleSave();
    }

    const handleSave = () => {
        const amount = valueEdit == '' ? 0 : valueEdit;

        saveManualData(vendorId, year, month, amount)
            .then(res => {
                const data = res.data.data;
                setValue(data.amount)
                console.log(res)
                setTimeout(() => {
                    setEditMode(false)
                }, 50)
                value !== valueEdit && setChangeState(true)
            })
            .catch(err => {
                setErr(true)
            })



    }


    useEffect(() => {
        document.addEventListener('mousedown', closeModal);
        return () => document.removeEventListener('mousedown', closeModal);
    }, [editMode]);


    return (
        <div className={s.cell}>
            <div onClick={handleEditMode} className={s.data}>
                <p>
                    {changeState && <span><IconDone /></span>}
                    {addSpaceNumber(value)}
                </p>
            </div>
            <div onKeyDown={handleEnter} ref={modalRef} className={`${s.modal} ${editMode && s.modal_vis}`}>
                <input type='number' ref={inputRef} onChange={handleChangeValue} value={valueEdit || ''}></input>
                {!err && <button className={s.save} onClick={handleSave}>Cохранить <IconDone /></button>}
                {err && <p className={s.error}>Ошибка!</p>}
            </div>
        </div>
    )
}
)

export default Cell;