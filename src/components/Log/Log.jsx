import s from './Log.module.scss';
import { ReactComponent as IconArrow } from '../../image/iconArrowSend.svg';
import { useEffect, useRef, useState } from 'react';
import avatar from '../../image/avatarDef2.png'
import { dateNow, dateForLog } from '../../utils/date';
import Message from './Message';

function Log({logs, personView, role, windowRefImage, scrollTopHeight}) {
    const [text, setText] = useState('');
    const [heightComment, setHeightComment] = useState(40);
    const [messages, setMessages] = useState([{ text: 'Залупка одбренна', time: dateNow(), owner: 0, name: 'Админ' }, { text: 'Залупка одбренна', time: dateNow(), owner: 0, name: 'Админ' }]);
    const [timeNow, setTimeNow] = useState('');
    const [scrollVis, setScrollVis] = useState(false);
    const textRef = useRef();
    const textAreaRef = useRef();
    const chatRef = useRef();
    const windowRef = useRef();
    console.log(personView, logs)

    useEffect(() => {
        setMessages(logs)
        setTimeout(() => {chatRef.current?.scrollIntoView({ behavior: 'smooth',  block: "end" })}, 100)
    },[logs, chatRef])
  /*   function handleComment(e) {
        const comment = e.target.value;
        setText(comment);
        const height = textRef.current.offsetHeight;

        if (comment.length === 0) {
            setHeightComment(40);
        } else {
            setHeightComment(height);
        }
    } */

   /*  function handleSendMessage() {
        setMessages([...messages, { text, time: dateNow(), owner: 1, name: 'Офис менеджер' }]);
        setText('');
        textAreaRef.current.value = '';
        setHeightComment(40);
        setTimeout(() => {
            chatRef.current?.scrollIntoView({ behavior: 'smooth',  block: "end" });
        })


    } */

  /*   function handleKeyEnter(e) {
        console.log(e.keyCode)
        if (e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage();
            textAreaRef.current.blur();
            textAreaRef.current.focus();
        }
    } */


    return (
        <div className={s.log}>
            <div className={s.header}>
                <p>Журнал действий</p>
            </div>
            <div ref={windowRef} className={`${s.chat} ${scrollVis && s.chat_scroll}`}>
                {messages.map((el, index) => {
                    return <Message text={el.comment} key={el.id} id={el.id} time={dateForLog(el.date)} avatar={el.person?.avatar == '' ? avatar : `https://lk.skilla.ru/images/persons/chat/${el.person?.avatar}`} owner={el.person_id == personView}
                        name={el.person?.name} surname={el.person?.surname} next={index >= 1 && el.person_id == personView  && messages?.[index - 1].person_id}
                        prev={index >= 1 && el.person_id !== personView && messages?.[index - 1].person_id} index={index} type={el.type} subcomment={el.sub_comment} files={el.files} windowRef={windowRefImage} scrollTopHeight={scrollTopHeight}/>
                })}
                <div ref={chatRef}></div>
            </div>

            <div className={s.container_text}>
                {/* <textarea onKeyDown={handleKeyEnter} ref={textAreaRef} style={{ height: `${heightComment}px` }} onChange={handleComment} placeholder='Написать комментарий'></textarea>
                <div className={s.invis} ref={textRef}><p>{text}</p></div>
                <button onClick={handleSendMessage}><IconArrow /></button> */}
            </div>
        </div>
    )
}

export default Log;