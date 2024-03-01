import s from './Options.module.scss';
import { ReactComponent as IconChewron } from '../../image/iconChewron.svg';
import { useState, useRef } from 'react';

function Options({data, sub}) {
    const [activeType, setActiveType] = useState(0);
    const [lastType, setLastType] = useState(0);
    const [transformType, setTransformType] = useState(0);
    const [disableRight, setDisabledRight] = useState(false);
    const buttonRef = useRef();
    const buttonLast = useRef();

    function handleSelectType(e) {
        const id = e.currentTarget.id;
        setActiveType(Number(id)); 
        const position1 = buttonRef.current.getBoundingClientRect().left
        const position = e.currentTarget.getBoundingClientRect().right
        
        if(position - position1 > 912) {
            handleTypeRight();
            return
        }
        
    }

    function handleTypeRight() {
        const position1 = buttonRef.current.getBoundingClientRect().left
        const position = buttonLast.current.getBoundingClientRect().right
        console.log(position - position1)

       
        
        if(position - position1 > 950) {
            setDisabledRight(false);
            const width = buttonRef.current.offsetWidth;
            setTransformType(transformType - width - 4);
            setLastType(lastType + 1);
        
        } 

        if(position - position1 < 1161) {
            setDisabledRight(true);
            return
        }
        
       
      
    }

    function handleTypeLeft() {
        setDisabledRight(false);
        if (lastType !== 0) {
            setLastType(lastType - 1)

            setTimeout(() => {
                const width = buttonRef.current.offsetWidth;
                setTransformType(transformType + width + 4);
            })
            return
        }
    }

    return (
        <div className={s.options}>
            
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
                            {data.map((el, index) => {
                                return <div key={index} ref={lastType === index ? buttonRef : index === data.length - 1 ? buttonLast : null} onClick={handleSelectType} id={index} className={`${s.button} ${activeType === index && s.button_active}`}>
                                    <p>{el}</p>
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