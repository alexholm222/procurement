import { useEffect, useState } from 'react';
import s from './Log.module.scss';
import { ReactComponent as IconChatComment } from '../../image/iconChatComment.svg';
import { ReactComponent as IconDone } from '../../image/iconDone.svg';
import ModalImage from './ModalImage';
import volk from '../../image/volk.jpg';

function Message({ text, time, avatar, owner, name, next, prev, index }) {
    const [anim, setAnim] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [bigImage, setBigImage] = useState('');
    const status = 'Создана заявка на закупку';
    const subcomment = 'Позиции к закупке:';
    const comment = 'купить десять упаковок хозяйственного мыла для кухни подойти к Юле и узнать какие комлюктеры нужно купить для нового кабинета продажников';
    useEffect(() => {
        setAnim(true);
    }, [])

    function handleOpenImg(e) {
        const link = e.currentTarget.src;
        setOpenImage(true);
        setBigImage(link)
    }

   
    return (
        <>
            {owner === 1 &&
                <div className={`${s.message} ${anim && s.message_anim} ${owner === prev && s.message_y}`}>
                    <div className={s.left}>
                        {(owner !== prev || index === 0) && <p className={s.title}>
                            {name}
                        </p>
                        }
                        <div className={s.text}>
                            {/* <p>{text}</p> */}
                            <div className={s.status}>
                                <p>{status}</p>
                                {/* <IconDone/> */}
                            </div>

                            <p>{subcomment}</p>
                            <div className={s.comment}>
                                <IconChatComment />
                                <p>{comment}</p>
                            </div>

                            <div className={s.attachments}>
                                <p>Вложения:</p>
                                <div className={s.container_image}>
                                    {openImage &&
                                       <ModalImage img={bigImage} setOpenImage={setOpenImage}/>
                                    }
                                    <div className={s.image}>
                                        <img onClick={handleOpenImg} src={volk}></img>
                                    </div>

                                    <div className={s.image}>
                                        <img src={volk}></img>
                                    </div>

                                    <div className={s.image}>
                                        <img src={volk}></img>
                                    </div>

                                    <div className={s.image}>
                                        <img src={volk}></img>
                                    </div>

                                    <div className={s.image}>
                                        <img src={volk}></img>
                                    </div>

                                    <div className={s.image}>
                                        <img src={volk}></img>
                                    </div>
                                </div>
                            </div>

                            <span>{time}</span>
                        </div>
                    </div>
                    <div className={s.right}>
                        <div className={s.avatar}>
                            {(owner !== prev || index === 0) && <img src={avatar}></img>}
                        </div>
                    </div>
                </div>
            }

            {owner === 0 &&
                <div className={`${s.message} ${s.message_get} ${owner === next && s.message_y} ${anim && s.message_anim}`}>
                    <div className={s.right}>
                        <div className={s.avatar}>
                            {(owner !== next || index === 0) && <img src={avatar}></img>}
                        </div>
                    </div>
                    <div className={`${s.left} ${s.left_get}`}>
                        {(owner !== next || index === 0) &&
                            <p className={s.title}>
                                {name}
                            </p>
                        }
                        <div className={`${s.text} ${s.text_get}`}>
                            <p>{text}</p>
                            <span>{time}</span>
                        </div>
                    </div>

                </div>
            }
        </>

    )
};

export default Message;