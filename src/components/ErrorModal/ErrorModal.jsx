import s from './ErrorModal.module.scss';
import { useState, useEffect, useRef } from 'react';
import { ReactComponent as IconClose } from '../../image/icon/purchase/iconClose.svg';
import { ReactComponent as IconError } from '../../image/icon/iconError.svg';



const ErrorModal = ({ setError, error, handleClosePurchase, windowRef }) => {
    const [anim, setAnim] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        setAnim(true)
    }, []);

    useEffect(() => {
        windowRef.current.style.overflow = "hidden";

        return () => {
            windowRef.current.style.overflow = "auto";
            windowRef.current.style.left = "0";
        };
    }, [windowRef]);

    const handleCloseModal = () => {
        setAnim(false);
        setTimeout(() => {
            setError('');
            handleClosePurchase()
        }, 300)
    }

    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleCloseModal();
            return
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, []);
    return (
        <div className={`${s.overlay} ${anim && s.overlay_anim}`}>
            <div ref={modalRef} className={`${s.modal} ${anim && s.modal_anim}`}>
            
                    <h2 className={s.title}>
                        Ошибка
                    </h2>
                    <div className={s.close}>
                    <IconClose onClick={handleCloseModal} />
                    </div>
                  
                

                <div className={s.error}>
                    <IconError />
                </div>

                <p className={s.text}>{error}</p>
            </div>
        </div>
    )
};

export default ErrorModal;