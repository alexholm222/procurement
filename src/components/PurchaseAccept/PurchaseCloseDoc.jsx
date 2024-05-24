import s from './PurchaseAccept.module.scss';
import { ReactComponent as IconClose } from '../../image/icon/purchase/iconClose.svg';
import { ReactComponent as IconSuccess } from '../../image/icon/purchase/iconSuccess.svg';
import { ReactComponent as IconCheck } from '../../image/icon/purchase/iconCheck.svg';
import { ReactComponent as IconFolder } from '../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
//Api
import { loadCloseDoc } from '../../Api/Api';
//utils
import DataPicker from '../../utils/DatePicker/DatePicker';
import { dateNow2 } from '../../utils/date';
import { handleExistingFiles } from '../../utils/handleExistingFiles';
//slice
import { setPurchasesUpdate } from '../../store/reducer/purchaseUpdate/slice';
//components
import FileLoaderAccept from './FileLoaderAccept/FileLoaderAccept';
import LoaderButton from '../LoaderButton/LoaderButton';

const Document = ({ i, file, files, setFiles, disabled }) => {
    const [animFile, setAnimFile] = useState();
    const [urlFile, setUrlFile] = useState('');
    const conditionDownload = file.name.slice(-3) !== 'pdf' ? file.name : false;
    const conditionTarget = file.name.slice(-3) !== 'pdf' ? '_self' : '_blank';
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true)
        }, 50)
    }, []);

    useEffect(() => {
        const fileUrl = window.URL.createObjectURL(file.file);
        setUrlFile(fileUrl)
    }, [file])

    const handleDelete = (e) => {
        const idTarget = e.currentTarget.id;
        if (idTarget == file.id) {
            setAnimFile(false);
            const filterArr = files.filter(el => el.id != file.id);
            setTimeout(() => {
                setFiles(filterArr);
            }, 200);
        }
    }

    return (
        <div className={`${s.file} ${animFile && s.file_anim}`}>
            <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                <IconFolder />
                <div className={s.block_text}>
                    <p>{file?.name}</p>
                    <span>Загружено {file.date}</span>
                </div>
            </a>
            <div id={file.id} onClick={handleDelete} className={`${s.delete} ${disabled && s.delete_disabled}`}>
                <IconDelete />
            </div>
        </div>
    )
}


const PurchaseCloseDoc = ({ setModal, windowRef, id, setStatus, loadAccept, setLoadAccept, acceptSuccess, setAcceptSuccess, setLogs }) => {
    const [anim, setAnim] = useState(false);
    const [check, setCheck] = useState(false);
    const [date, setDate] = useState('');
    const [documents, setDocuments] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState('');
    const [load, setLoad] = useState(false);
    const [err, setErr] = useState(false);
    const modalRef = useRef();
    const dispatch = useDispatch();
    const role = document.getElementById('root_purchases').getAttribute('role');
   console.log(documents)
    useEffect(() => {
        setAnim(true)
    }, []);

    useEffect(() => {
        setDate(dateNow2())
    }, [])

    //Фиксация окна при открытии модалки
    useEffect(() => {
        windowRef.current.style.overflow = "hidden";

        return () => {
            windowRef.current.style.overflow = "scroll";
            windowRef.current.style.left = "0";
        };
    }, [windowRef]);

    useEffect(() => {
        documents.length > 0 ? setDisabled(false) : setDisabled(true)
    }, [documents])


    const handleCloseModal = () => {
        setAnim(false);
        setAcceptSuccess(false);
        setTimeout(() => {
            setModal(0);
        }, 300)
    }

    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target) && !e.target.closest('.ant-picker-dropdown')) {
            handleCloseModal();
            return
        }
    }


    const handleConfirm = () => {
        setLoadAccept(true)
        const formData = new FormData();
        formData.append('id', id);
        !check && documents.forEach((el, i) => {
            formData.append(`files[${i}]`, el.file, el.name)
        });

        loadCloseDoc(formData)
            .then(res => {
                console.log(res);
                const purchase = res.data.purchase;
                const orderLog = {
                    comment: 'Создана заявка на закупку',
                    date: purchase.order?.date_create,
                    id: purchase.order?.id,
                    person: purchase.order?.person,
                    person_id: purchase.order?.person_id,
                    sub_comment: purchase.order?.comment,
                    type: 'add',
                    files: handleExistingFiles(purchase.order),
                }

                purchase.order ? setLogs([orderLog, ...purchase.logs]) : setLogs(purchase.logs);
                dispatch(setPurchasesUpdate(purchase));
                setStatus(purchase.status);
                setLoadAccept(false)
                setAcceptSuccess(true);
            })
            .catch(err => setErr(true))
    }

    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, []);

    return (
        <div className={`${s.overlay} ${anim && s.overlay_anim}`}>

            <div ref={modalRef} className={`${s.modal} ${anim && !acceptSuccess && s.modal_anim}`}>
                <div className={s.header}>
                    <h2 className={s.title}>
                        Закрывающие документы
                    </h2>
                    <IconClose onClick={handleCloseModal} />
                </div>

                <div className={`${s.fileloader} ${check && s.fileloader_disabled} ${documents?.length > 0 && s.fileloader_hiden}`}>
                    <div className={s.documents}>
                        {documents.map((el, i) => {
                            return <Document key={el.id} i={i} file={el} files={documents} setFiles={setDocuments} disabled={false} />
                        })}
                    </div>
                    <FileLoaderAccept documents={documents} setDocuments={setDocuments} />
                </div>

                <button disabled={disabled} onClick={handleConfirm} className={s.button}>
                    {loadAccept && <p>Загружаем</p>}
                    {!loadAccept && <p>Загрузить</p>}
                    {loadAccept && <LoaderButton color={'#FFFFFF'} />}
                </button>
                <span className={s.text_err}>{err ? 'Произошла ошибка при загрузке документов' : ''}</span>
            </div>

            <div className={`${s.success} ${acceptSuccess && s.success_anim}`}>
                <div className={s.close}><IconClose /></div>
                <IconSuccess />
                <h2 className={`${s.title} ${s.title_success}`}>
                    Документы загружены
                </h2>
                <p className={s.text}></p>

            </div>
        </div>
    )
};

export default PurchaseCloseDoc;