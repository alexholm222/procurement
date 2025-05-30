import s from './Options.module.scss';
import { ReactComponent as IconChewron } from '../../image/iconChewron.svg';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
//selector
import { purchaseSelector } from '../../store/reducer/purchase/selector';

function Options({ payers, type, sub, purchaseId, payerId, setPayerId, categoryId, setCategoryId, disabled }) {
    const [lastType, setLastType] = useState(0);
    const [transformType, setTransformType] = useState(0);
    const [disableRight, setDisabledRight] = useState(true);
    const [disabledEffect, setDisabledEffect] = useState(false);
    const [list, setList] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [activeId, setActiveId] = useState('');
    const buttonRef = useRef();
    const buttonLast = useRef();
    const activeRef = useRef();
    /* const payersActive = useSelector(purchaseSelector).payers;
    const payersAll = useSelector(purchaseSelector).payersAll;
    const payers = purchaseId == '' ? payersActive : payersAll; */
    const categories = useSelector(purchaseSelector).categories;
    const position3 = buttonLast?.current?.getBoundingClientRect().left;
    const position1 = buttonRef?.current?.getBoundingClientRect().left;
    const positionActive = activeRef?.current?.getBoundingClientRect().left;

    useEffect(() => {
        if (type == 'categories') {
            setList(categories);
            setActiveId(categoryId);

        }
    }, [type, categories, purchaseId, categoryId]);

    useEffect(() => {
        if (type == 'categories' && firstLoad) {
            purchaseId == '' && setCategoryId(categories?.[0]?.id)
            setFirstLoad(false);
        }
    }, [categories, firstLoad]);

    useEffect(() => {
        if (type == 'payers') {
            setList(payers);
            //payerId == 0 ? 21 : payerId это убрать как зальем обновление !!!!!!!!!!!!!
            setActiveId(payerId);


        }
    }, [type, payers, purchaseId, payerId, firstLoad]);

    useEffect(() => {

        if (type == 'payers' && firstLoad && payers.length > 0) {
            purchaseId == '' && setPayerId(payers?.[0]?.id)
            setFirstLoad(false);
        }
    }, [payers, firstLoad]);


    useEffect(() => {
        if (position3 < 1200 && !disabledEffect) {
            setDisabledRight(true);
        } else {
            setDisabledRight(false)
        }

    }, [position3, disabledEffect])

    useEffect(() => {
        const activebutton = list[list.length - 1]?.id == activeId ? position3 : positionActive;
        if (activebutton > 1050 && firstLoad) {
            handleTypeRight();

            return
        }


    }, [positionActive, position3, firstLoad])


    function handleSelectType(e) {
        const id = e.currentTarget.id;
        type == 'payers' && setPayerId(Number(id));
        type == 'categories' && setCategoryId(Number(id));
        /*  setActiveId(Number(id)) */
        const position = e.currentTarget.getBoundingClientRect().right

        if (position - position1 > 912) {
            handleTypeRight();
            return
        }

    }

    function handleTypeRight() {
        if (position3 > 800) {
            const width = buttonRef?.current?.offsetWidth;
            setDisabledEffect(false);
            setTransformType(transformType - width - 4);
            setLastType(lastType + 1);
            return
        }
    }

    function handleTypeLeft() {
        setDisabledRight(false);
        setDisabledEffect(true);
        if (lastType !== 0) {
            setLastType(lastType - 1)

            setTimeout(() => {
                const width = buttonRef?.current?.offsetWidth;
                setTransformType(transformType + width + 4);
            })
            return
        }
    }

    return (
        <div className={`${s.options}`}>

            <div className={s.container}>
                <p className={s.sub}>
                    {sub}
                </p>
                <div className={s.buttons}>
                    <div onClick={handleTypeLeft} className={`${s.arrow} ${s.arrow_left} ${lastType === 0 && s.disarrow}`}>
                        <IconChewron />
                    </div>
                    <div className={`${s.block} ${disabled && s.block_disabled}`}>
                        <div className={s.center} style={{ transform: `translateX(${transformType}px)` }}>
                            {list.map((el, i) => {
                                return <div key={el.id} ref={lastType === i ? buttonRef : i === list.length - 1 ? buttonLast : activeId === el.id ? activeRef : null}
                                    onClick={handleSelectType} id={el.id}
                                    className={`${s.button} ${disabled && s.button_disabled} ${!el.active && s.button_noactove} ${activeId === el.id && s.button_active}`}>
                                    <p>{el.name}</p>
                                </div>
                            })}
                        </div>
                    </div>

                    <div onClick={handleTypeRight} className={`${s.arrow} ${s.arrow_right} ${disableRight && s.disarrow}`}>
                        <IconChewron />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Options;