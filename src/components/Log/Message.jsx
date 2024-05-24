import { useEffect, useState } from 'react';
import s from './Log.module.scss';
import { ReactComponent as IconChatComment } from '../../image/iconChatComment.svg';
import { ReactComponent as IconDone } from '../../image/iconDone.svg';
import { ReactComponent as IconDone2 } from '../../image/iconDone2.svg';
import { ReactComponent as IconReject } from '../../image/iconReject.svg';
import DocumentsLog from './DocumentsLog/DocumentsLog';

function Message({ text, time, avatar, owner, name, surname, next, prev, index, id, type, subcomment, files, windowRef, scrollTopHeight}) {
    const [anim, setAnim] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [bigImage, setBigImage] = useState('');
    const status = 'Создана заявка на закупку';
    console.log(files)
    const comment = 'купить десять упаковок хозяйственного мыла для кухни подойти к Юле и узнать какие комлюктеры нужно купить для нового кабинета продажников';
    useEffect(() => {
        setTimeout(() => {
            setAnim(true);
        }, 50)

    }, [])

    function handleOpenImg(e) {
        const link = e.currentTarget.src;
        setOpenImage(true);
        setBigImage(link)
    }


    return (
        <>
            {!owner &&
                <div id={id} className={`${s.message} ${anim && s.message_anim} ${owner === prev && s.message_y}`}>
                    <div className={s.left}>
                        {(owner !== prev || index === 0) && <p className={s.title}>
                            {name} {surname}
                        </p>
                        }
                        <div className={s.text}>
                            {/*         <p>{text}</p> */}
                            <div className={s.status}>
                                <p>{text}</p>
                                {type !== "add" && type !== "receive" && type !== "reject" && <IconDone />}
                                {type == "receive" && <IconDone2 />}
                                {type == 'reject' && <IconReject />}

                            </div>

                            {subcomment && <div className={s.comment}>
                                <IconChatComment />
                                <p>{subcomment}</p>
                            </div>
                            }
                            {files && files?.length > 0 && <DocumentsLog documents={files} windowRef={windowRef} scrollTopHeight={scrollTopHeight}/>}

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

            {owner &&
                <div id={id} className={`${s.message} ${s.message_get} ${owner === next && s.message_y} ${anim && s.message_anim}`}>
                    <div className={s.right}>
                        <div className={s.avatar}>
                            {(owner !== next || index === 0) && <img src={avatar}></img>}
                        </div>
                    </div>
                    <div className={`${s.left} ${s.left_get}`}>
                        {(owner !== next || index === 0) &&
                            <p className={s.title}>
                                {name} {surname}
                            </p>
                        }
                        <div className={`${s.text} ${s.text_get}`}>
                            <div className={s.status}>
                                <p>{text}</p>
                                {type !== "add" && type !== "receive" && type !== "reject" && <IconDone />}
                                {type == "receive" && <IconDone2 />}
                                {type == 'reject' && <IconReject />}
                            </div>

                            {subcomment && <div className={s.comment}>
                                <IconChatComment />
                                <p>{subcomment}</p>
                            </div>
                            }

                            {files && files?.length > 0 && <DocumentsLog documents={files} windowRef={windowRef} scrollTopHeight={scrollTopHeight}/>}
                            <span>{time}</span>
                        </div>
                    </div>

                </div>
            }
        </>

    )
};

export default Message;