import s from './Options.module.scss';
import { ReactComponent as IconChewron } from '../../image/iconChewron.svg';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
//selector
import { purchaseSelector } from '../../store/reducer/purchase/selector';

function Options({ type, sub, purchaseId, payerId, setPayerId, categoryId, setCategoryId, setPaymentType, isNal, disabled }) {
    const [lastType, setLastType] = useState(0);
    const [transformType, setTransformType] = useState(0);
    const [disableRight, setDisabledRight] = useState(true);
    const [disabledEffect, setDisabledEffect] = useState(false);
    const [list, setList] = useState([]);
    const [activeId, setActiveId] = useState(1 || '');
    const buttonRef = useRef();
    const buttonLast = useRef();
    const activeRef = useRef();
    const payers = useSelector(purchaseSelector).payers;
    const categories = useSelector(purchaseSelector).categories;
    const position3 = buttonLast?.current?.getBoundingClientRect().left;
    const position1 = buttonRef?.current?.getBoundingClientRect().left;
    const positionActive = activeRef?.current?.getBoundingClientRect().left;

    useEffect(() => {
        if (type == 'categories') {
            setList(categories);
            setCategoryId(Number(activeId));
            purchaseId ? setActiveId(categoryId) : setActiveId(categories[0].id);
            return
        }

        if (type == 'payers') {
            setList(payers);
            setPayerId(Number(activeId));
            const payerNal = payers.find(el => el.payment_type == 'nal')
            purchaseId ? setActiveId(isNal && !payerId  ? payerNal.id :  payerId) : setActiveId(payers[0].id);
            return
        }
    }, []);

    /*   useEffect(() => {
          if(positionActive && positionActive > 900) {
              handleTypeRight();
          }
        
      },[positionActive]) */

    useEffect(() => {
        if (position3 < 1200 && !disabledEffect) {
            setDisabledRight(true);
        } else {
            setDisabledRight(false)
        }

    }, [position3, lastType, disabledEffect])


    function handleSelectType(e) {
        const id = e.currentTarget.id;
        const payment = payers.find(el => el.id == id);
        type == 'payers' && setPayerId(Number(id));
        type == 'payers' && setPaymentType(payment.payment_type);
        type == 'categories' && setCategoryId(Number(id));
        setActiveId(Number(id))
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
        <div className={`${s.options} ${disabled && s.options_disabled}`}>

            <div className={s.container}>
                <p className={s.sub}>
                    {sub}
                </p>
                <div className={s.buttons}>
                    <div onClick={handleTypeLeft} className={`${s.arrow} ${s.arrow_left} ${lastType === 0 && s.disarrow}`}>
                        <IconChewron />
                    </div>
                    <div className={s.block}>
                        <div className={s.center} style={{ transform: `translateX(${transformType}px)` }}>
                            {list.map((el, i) => {
                                return <div key={el.id} ref={lastType === i ? buttonRef : i === list.length - 1 ? buttonLast : activeId === el.id ? activeRef : null} onClick={handleSelectType} id={el.id} className={`${s.button} ${disabled && s.button_disabled} ${activeId === el.id && s.button_active}`}>
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