import s from './Log.module.scss';
import { ReactComponent as IconArrow } from '../../image/iconArrowSend.svg';
import { ReactComponent as IconLoadFile } from '../../image/iconLoadFile.svg';
import { useEffect, useRef, useState } from 'react';
import avatar from '../../image/avatarDef2.png'
import { dateNow, timeForLog, handleComparisonDate, dateForLog } from '../../utils/date';
import Message from './Message';
import { sendLog, sendLogOrder } from '../../Api/Api';
import { setOrderUpdate, setUpdateOrder } from '../../store/reducer/purchaseUpdate/slice';
import { useDispatch } from 'react-redux';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import uuid from 'react-uuid';
//components
import DocumentsLog from './DocumentsLog/DocumentsLog';

function Log({ logs, setLogs, personView, id, role, windowRefImage, scrollTopHeight, type, send }) {
    const [text, setText] = useState('');
    const [error, setError] = useState(false);
    const [heightComment, setHeightComment] = useState(40);
    const [messages, setMessages] = useState([{ text: 'Залупка одбренна', time: dateNow(), owner: 0, name: 'Админ' }, { text: 'Залупка одбренна', time: dateNow(), owner: 0, name: 'Админ' }]);
    const [timeNow, setTimeNow] = useState('');
    const [scrollVis, setScrollVis] = useState(false);
    const [files, setFiles] = useState([]);
    const [heihgtFiles, setHeihgtFiles] = useState(0);
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const dispatch = useDispatch();
    const textRef = useRef();
    const textAreaRef = useRef();
    const chatRef = useRef();
    const windowRef = useRef();
    const contentState = editorState.getCurrentContent();
    const fileInputRef = useRef();

    console.log(messages)

    useEffect(() => {
        setMessages(logs)
        setTimeout(() => { chatRef.current?.scrollIntoView({ behavior: 'smooth', block: "end" }) }, 100)
    }, [logs, chatRef])

    useEffect(() => {
        if (files.length > 3) {
            setHeihgtFiles(268);
            return
        }
        if (files.length > 0) {
            setHeihgtFiles(144);
            return
        }

        if (files.length == 0) {
            setHeihgtFiles(0);
            return
        }
    }, [files.length])


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
        const formData = new FormData();
        formData.append('id', id);
        formData.append('comment', text);
        files.forEach((el, i) => {
            formData.append(`files[${i}]`, el.file, el.name)
        });

        type == 'purchase' && sendLog(formData)
            .then(res => {
                const data = res.data;
                console.log(res);
                setLogs([...logs, data.purchase.logs.at(-1)]);
            })
            .catch(err => console.log(err))

        type == 'order' && sendLogOrder(formData)
            .then(res => {
                const data = res.data;
                console.log(res);
                setLogs([...logs, data.order.order_logs.at(-1)]);

            })
            .catch(err => console.log(err))

        setText('');
        textAreaRef.current.value = '';
        setFiles([]);
        setHeightComment(40);
        setTimeout(() => {
            dispatch(setUpdateOrder());
            chatRef.current?.scrollIntoView({ behavior: 'smooth', block: "end" });
        })


    }

    function handleKeyEnter(e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage();
            textAreaRef.current.blur();
            textAreaRef.current.focus();
        }
    }

    /*  const handleDeleteScreen = (id) => {
         const newArray = screenShots.filter(el => el.id !== id);
         setScreenShots(newArray);
     } */


    const handleWriteFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setFiles((prevState) =>
                [...prevState, { file: file, id: uuid(), name: file.name, size: file.size / 1048576, send: true }]
            )
        };
    }


    const handlePastFile = (e) => {
        const file = e.clipboardData.files[0]
        if (file /* && (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") */ && files.length < 3) {
            handleWriteFile(file)
        };
    }

    const handleFile = async (e) => {
        const files = Object.values(e.currentTarget.files);
        console.log(files)
        files.forEach((file) => {
            if (file.size > 15 * 1048576) {
                console.log("большой файл");
                setError(true);
            }
            else {
                setError(false);
                handleWriteFile(file)
                fileInputRef.current && (fileInputRef.current.value = '');
            }
        })
    }



    return (
        <div className={s.log}>
            <div className={s.header}>
                <p>Журнал действий</p>
            </div>
            <div ref={windowRef} className={`${s.chat} ${scrollVis && s.chat_scroll}`}>
                {messages.map((el, index) => {
                    const prev = index >= 1 && el.person_id == messages?.[index - 1].person_id

                    if (handleComparisonDate(el.date, messages?.[index - 1]?.date)/*  && index !== 0 */) {
                        return <Message text={el.comment} key={el.id} id={el.id} time={timeForLog(el.date)} avatar={el.person?.avatar == '' ? avatar : `https://lk.skilla.ru/images/persons/chat/${el.person?.avatar}`} owner={el.person_id == personView}
                            name={el.person?.name} surname={el.person?.surname} next={index >= 1 && el.person_id == personView && messages?.[index - 1].person_id}
                            prev={index >= 1 && el.person_id == messages?.[index - 1].person_id} index={index} type={el.type} subcomment={el.sub_comment} files={el.files} windowRef={windowRefImage} scrollTopHeight={scrollTopHeight} />
                    }

                    if (!handleComparisonDate(el.date, messages?.[index - 1]?.date)/*  || index == 0 */) {
                        return <div className={s.block_date}><p style={{ marginBottom: prev ? '20px' : '' }} className={s.date}>{dateForLog(el.date)}</p>
                            <Message text={el.comment} key={el.id} id={el.id} time={timeForLog(el.date)} avatar={el.person?.avatar == '' ? avatar : `https://lk.skilla.ru/images/persons/chat/${el.person?.avatar}`} owner={el.person_id == personView}
                                name={el.person?.name} surname={el.person?.surname} next={index >= 1 && el.person_id == personView && messages?.[index - 1].person_id}
                                prev={prev} index={index} type={el.type} subcomment={el.sub_comment} files={el.files} windowRef={windowRefImage} scrollTopHeight={scrollTopHeight} />
                        </div>
                    }
                })}
                <div ref={chatRef}></div>
            </div>

            {send && <div className={s.container_text}>

                {/* <div className={s.textedit}><Editor editorState={editorState} onChange={setEditorState} /></div> */}
                <div className={s.block_send}>
                    <textarea onPaste={handlePastFile} onKeyDown={handleKeyEnter} ref={textAreaRef} style={{ height: `${heightComment}px` }} onChange={handleComment} placeholder='Написать комментарий'></textarea>
                    <div style={{height: `${heihgtFiles}px`}} className={`${s.files} ${files.length > 0 && s.files_open}`}><DocumentsLog documents={files} windowRef={windowRefImage} scrollTopHeight={scrollTopHeight} setFiles={setFiles} /></div>
                </div>
                <div className={s.invis} ref={textRef}><p>{text}</p></div>
                <input style={{display: 'none'}} ref={fileInputRef} multiple id="file-send" type='file' accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xlsx" onInput={handleFile}></input>
                <label for="file-send"><IconLoadFile/></label>
                <button onClick={handleSendMessage}><IconArrow /></button>
            </div>
            }


        </div>
    )
}

export default Log;