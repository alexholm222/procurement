import s from './ModalImage.module.scss';
import { ReactComponent as IconClose } from '../../../image/iconClose.svg';
import { useEffect, useRef, useState } from 'react';

function ModalImage({ img, setOpenImage, windowRef, scrollTopHeight }) {
    const [anim, setAnim] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        windowRef.current.style.overflow = "hidden";

        return () => {
            windowRef.current.style.overflowY = "scroll";
            windowRef.current.style.left = "0";
        };
    }, [windowRef])

    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    },[])


    function closeModal(e) {
        e.stopPropagation()
        if(modalRef.current && !modalRef.current.contains(e.target)) {
            setAnim(false);

            setTimeout(() => {
                setOpenImage(false);
            }, 200)
            
        }
    }
    useEffect(() => {
        document.addEventListener('mouseup', closeModal);

        return () => document.removeEventListener('mouseup', closeModal);
    }, []);

    return (
        <div style={{ top: `${scrollTopHeight}px` }} className={`${s.modal_image} ${anim && s.modal_image_anim}`}>
            <IconClose onClick={closeModal} />
            <img className={`${s.pic} ${anim && s.pic_anim}`} ref={modalRef} src={img}></img>
        </div>
    )
};

export default ModalImage;