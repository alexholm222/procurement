import { useRef, useState, useEffect } from 'react';
import s from './Years.module.scss';
import { ReactComponent as Arrow } from '../../image/icon/arrow.svg';

const Years = ({ years, selected, setSelected }) => {
    const [openList, setOpenList] = useState(false);
    const modalRef = useRef();

    const handleOpenList = () => {
        openList ? setOpenList(false) : setOpenList(true)
    }

    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setOpenList(false)
        }
    }

    const handleSelected = (e) => {
        const year = e.currentTarget.textContent;
        setSelected(year)
    }

    useEffect(() => {
        document.addEventListener('mousedown', closeModal);
        return () => document.removeEventListener('mousedown', closeModal);
    }, []);

    return (
        <div ref={modalRef} onClick={handleOpenList} className={s.cel}>
            <p className={s.selected}>{selected}</p>
            <div className={`${s.arrow} ${openList && s.arrow_open}`}><Arrow /></div>

            <ul style={{ height: openList ? `${years.length * 44}px` : '0' }} className={s.list}>
                {years.map(el => {
                    return <li className={`${selected == el && s.active}`} onClick={handleSelected}>{el}</li>
                })}
            </ul>
        </div>
    )
};

export default Years;