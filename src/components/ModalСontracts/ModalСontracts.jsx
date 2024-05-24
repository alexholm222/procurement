import s from './ModalСontracts.module.scss';
import { ReactComponent as IconClose } from '../../image/icon/purchase/iconClose.svg';
import { ReactComponent as IconSuccess } from '../../image/icon/purchase/iconSuccess.svg';
import { ReactComponent as IconCheck } from '../../image/icon/purchase/iconCheck.svg';
import { ReactComponent as IconDelete } from '../../image/icon/purchase/iconDelete.svg';
import { ReactComponent as IconDone } from '../../image/icon/purchase/iconDone.svg';
import { ReactComponent as IconWarning } from '../../image/icon/purchase/iconWarning.svg';
import iconFolder from '../../image/icon/purchase/iconFolder.png'
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
//components
import InputList from './InputList/InputList';
import DataPicker from '../../utils/DatePicker/DatePicker';
import FileLoader from './FileLoader/FileLoader';
//API 
import { addContract, editContract, baseUrl } from '../../Api/Api';
//slice
import { setParametrsUpdate } from '../../store/reducer/updateParametrs/slice';


const File = ({ file, files, setFiles, setOldFiles, id, type, disabled }) => {
    const [animFile, setAnimFile] = useState(type == 'existing' ? true : false);
    const [viewing, setViewing] = useState(false);
    const [urlFile, setUrlFile] = useState('');
    const conditionDownload = type == 'existing' ? true : type !== 'existing' && file.name.slice(-3) !== 'pdf' ? file.name : false;
    const conditionTarget = type == 'existing' && file.slice(-3) !== 'pdf' ? '_self' : '_blank';

    useEffect(() => {
        if (type == 'existing') {
            const link = `${baseUrl}file/${file}`;
            setUrlFile(link);
        } else {
            const fileUrl = window.URL.createObjectURL(file.file);
            setUrlFile(fileUrl)
        }
    }, [file])

    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true);
        })
    }, []);

    const handleDelete = (e) => {
        const idTarget = e.currentTarget.id;
        if (idTarget == id) {
            setAnimFile(false);
            const filterArr = files.filter(el => el.id != id);
            type == 'existing' && setOldFiles(prevState => [...prevState, file]);
            setTimeout(() => {
                setFiles(filterArr);
            }, 200)
        }
    }

    const handleOpenFile = () => {
        setViewing(true)
    }
    return (
        <div className={`${s.file} ${animFile && s.file_anim} ${disabled && s.file_disabled}`}>
            <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                <div onClick={handleOpenFile}>
                    <img src={iconFolder}></img>
                    <p>
                        {type == 'existing' && file.split('/').pop()}
                        {type !== 'existing' && file?.name}
                    </p>
                </div>
            </a>
            {!disabled && <div onClick={handleDelete} id={id} className={s.delete}>
                <IconDelete />
            </div>}
        </div>
    )
}


const ModalСontracts = ({ setModal, payers, vendors, setContractVendorId, setVendorId, setAddType, windowRef }) => {
    const [anim, setAnim] = useState(false);
    const [success, setSuccess] = useState(false);
    const [buyer, setBuyer] = useState(payers[0]);
    const [bayerListOpen, setBayerListOpen] = useState(false);
    const [bayerListError, setBayerListError] = useState(false);
    const [provider, setProvider] = useState({});
    const [providerListOpen, setProviderListOpen] = useState(false);
    const [providerListError, setProviderListError] = useState(false);
    const [check, setCheck] = useState(false);
    const [number, setNumber] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [files, setFiles] = useState([]);
    const [filesExist, setFilesExist] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);
    const [fileForSend, setFileForSend] = useState([]);
    const [hidenFileLoader, setHidenFileLoader] = useState(false);
    const [load, setLoad] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [save, setSave] = useState(false);
    const modalRef = useRef();
    const inputBayerRef = useRef();
    const inputProviderRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        windowRef.current.style.overflow = "hidden";

        return () => {
            windowRef.current.style.overflow = "scroll";
            windowRef.current.style.left = "0";
        };
    }, [windowRef]);

    useEffect(() => {
        setAnim(true)
    }, []);



    useEffect(() => {
        if (provider.id && buyer.id && number && (files.length > 0 || filesExist.length > 0)) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [provider, buyer, number, files, filesExist]);

    useEffect(() => {
        (filesExist.length + files.length) >= 7 ? setTimeout(() => { setHidenFileLoader(true) }, 100) : setHidenFileLoader(false);
    }, [files, filesExist])

    useEffect(() => {
        const filesSend = files.map((el) => {
            return el.file
        });
        setFileForSend(filesSend)
    }, [files])


    const handleCloseModal = () => {
        setAnim(false);
        setSuccess(false);
        setTimeout(() => {
            setModal(0);
        }, 300)
    }

    const closeModal = (e) => {
        e.stopPropagation()
        if (modalRef.current && !modalRef.current.contains(e.target) && !e.target.closest('.ant-picker-dropdown') && !bayerListOpen && !providerListOpen) {
            handleCloseModal();
            return
        }

        if (bayerListOpen && inputBayerRef.current && !inputBayerRef.current.contains(e.target)) {
            setBayerListOpen(false);
            return
        }

        if (providerListOpen && inputProviderRef.current && !inputProviderRef.current.contains(e.target)) {
            setProviderListOpen(false);
            return
        }
    }

    const handleConfirm = () => {
        setLoad(true);
        const formData = new FormData();
        formData.append('payer_id', buyer.id);
        formData.append('vendor_id', provider.id);
        formData.append('contract_number', number);
        !check && formData.append('start_date', startDate);
        !check && formData.append('end_date', endDate);

        fileForSend.forEach((el, i) => {
            console.log(el);
            formData.append(`files[${i}]`, el, el.name)
        });
        addContract(formData)
            .then(res => {
                console.log(res)
                const id = res.data.contract.id;
                const vendorId = res.data.contract.vendor_id;
                setContractVendorId(id);
                setVendorId(vendorId);
                setAddType('contract')
                setTimeout(() => {
                    setLoad(false);
                    setSuccess(true);
                    dispatch(setParametrsUpdate());
                }, 200)
            })
            .catch(err => console.log(err))
    }


    const handleNumber = (e) => {
        const value = e.target.value;
        setNumber(value)
    }

    const handleCheck = () => {
        if (check) {
            setCheck(false);
            /*  setStartDate('');
             setEndDate(''); */
            return
        }
        if (!check) {
            setCheck(true);
            setStartDate('');
            setEndDate('')
            return
        }
    }


    useEffect(() => {
        document.addEventListener('mousedown', closeModal);

        return () => document.removeEventListener('mousedown', closeModal);
    }, [bayerListOpen, providerListOpen]);

    return (
        <div className={`${s.overlay} ${anim && s.overlay_anim}`}>

            <div ref={modalRef} className={`${s.modal} ${anim && !success && s.modal_anim}`}>
                <div className={s.header}>
                    <h2 className={s.title}>
                        Новый договор
                    </h2>
                    <IconClose onClick={handleCloseModal} />
                </div>

                <p className={s.sub}>Покупатель</p>
                <InputList
                    setOpen={setBayerListOpen}
                    open={bayerListOpen}
                    value={buyer}
                    setValue={setBuyer}
                    inputRef={inputBayerRef}
                    list={payers}
                    err={bayerListError}
                    setErr={setBayerListError}
                    disabled={disabled}
                />

                <p className={s.sub}>Поставщик</p>
                <InputList
                    setOpen={setProviderListOpen}
                    open={providerListOpen}
                    value={provider}
                    setValue={setProvider}
                    inputRef={inputProviderRef}
                    list={vendors}
                    err={providerListError}
                    setErr={setProviderListError}
                    disabled={disabled}
                    type={'object'}
                />


                <p className={s.sub}>Номер договора</p>
                <input disabled={disabled} onChange={handleNumber} value={number || ''} type='number' className={s.input}></input>

                <p className={s.sub}>Срок действия договора</p>
                <div className={s.container}>
                    <DataPicker queryDate={startDate} setQueryDate={setStartDate} disabled={check || disabled} check={check} editStop={false} />
                    <p>-</p>
                    <DataPicker queryDate={endDate} setQueryDate={setEndDate} disabled={check || disabled} check={check} editStop={false} />
                </div>


                <div onClick={handleCheck} className={`${s.check} ${disabled && s.check_hidden}`}>
                    <div className={`${s.checkbox} ${check && s.checkbox_check}`}>
                        <div>
                            <IconCheck />
                        </div>
                    </div>
                    <p>Бессрочный договор</p>
                </div>

                <p className={s.sub}>Договор</p>
                {(files.length > 0 || filesExist.length > 0) && <div className={s.container_files}>
                    {files.map((el, i) => {
                        return <File key={el.id} id={el.id} file={el} setFiles={setFiles} files={files} />
                    })}

                    {filesExist.map((el, i) => {
                        return <File key={el.id} id={el.id} file={el.file} setFiles={setFilesExist} files={filesExist} setOldFiles={setOldFiles} type={'existing'} disabled={disabled} />
                    })}
                </div>
                }
                <div className={`${s.container_fileloader} ${(hidenFileLoader || disabled) && s.container_fileloader_hiden}`}>
                    <FileLoader files={files} setFiles={setFiles} />
                </div>

                <button disabled={buttonDisabled} onClick={handleConfirm} className={s.button}>
                    {load ? 'Сохраняем...' : 'Подтвердить'}

                </button>
            </div>

            <div className={`${s.success} ${success && s.success_anim}`}>
                <div className={s.close}><IconClose /></div>
                <IconSuccess />
                <h2 className={`${s.title} ${s.title_success}`}>
                    Договор добавлен
                </h2>
                <p className={s.text}>{provider?.name}</p>

            </div>
        </div>
    )
};

export default ModalСontracts;