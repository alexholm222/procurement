import s from './Log.module.scss';
import { ReactComponent as IconArrow } from '../../image/iconArrowSend.svg';
import { useEffect, useRef, useState } from 'react';
import avatar from '../../image/avatar.png'
import { dateNow } from '../../utils/date';
import Message from './Message';

function Log() {
    const [text, setText] = useState('');
    const [heightComment, setHeightComment] = useState(40);
    const [messages, setMessages] = useState([{ text: 'Залупка одбренна', time: dateNow(), owner: 0, name: 'Админ' }, { text: 'Залупка одбренна', time: dateNow(), owner: 0, name: 'Админ' }]);
    const [timeNow, setTimeNow] = useState('');
    const [scrollVis, setScrollVis] = useState(false);
    const textRef = useRef();
    const textAreaRef = useRef();
    const chatRef = useRef();
    const windowRef = useRef();
    function handleComment(e) {
        const comment = e.target.value;
        setText(comment);
        const height = textRef.current.offsetHeight;

        if (comment.length === 0) {
            setHeightComment(40);
        } else {
            setHeightComment(height);
        }
    }

    function handleSendMessage() {
        setMessages([...messages, { text, time: dateNow(), owner: 1, name: 'Офис менеджер' }]);
        setText('');
        textAreaRef.current.value = '';
        setHeightComment(40);
        setTimeout(() => {
            chatRef.current?.scrollIntoView({ behavior: 'smooth' });
        })


    }

    function handleKeyEnter(e) {
        console.log(e.keyCode)
        if (e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage();
            textAreaRef.current.blur();
            textAreaRef.current.focus();
        }
    }


    return (
        <div className={s.log}>
            <div className={s.header}>
                <p>Журнал действий</p>
            </div>
            <div ref={windowRef} className={`${s.chat} ${scrollVis && s.chat_scroll}`}>
                {messages.map((el, index) => {
                    return <Message text={el.text} key={index} time={el.time} avatar={avatar} owner={el.owner}
                        name={el.name} next={index >= 1 && el.owner !== 1 && messages?.[index - 1].owner}
                        prev={index >= 1 && el.owner === 1 && messages?.[index - 1].owner} index={index} type={''} />
                })}
                <div ref={chatRef}></div>
            </div>

            <div className={s.container_text}>
                <textarea onKeyDown={handleKeyEnter} ref={textAreaRef} style={{ height: `${heightComment}px` }} onChange={handleComment} placeholder='Написать комментарий'></textarea>
                <div className={s.invis} ref={textRef}><p>{text}</p></div>
                <button onClick={handleSendMessage}><IconArrow /></button>
            </div>
        </div>
    )
}

export default Log;