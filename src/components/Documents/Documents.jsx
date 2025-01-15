import s from './Documents.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as IconFolder } from '../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import iconPdf from '../../image/icon/order/iconPdf.png';
import iconWord from '../../image/icon/order/iconWord.png';
import IconExcel from '../../image/icon/order/iconExcel.png';
import FileLoader from '../FileLoader/FileLoader';
import ModalImage from './ModalImage/ModalImage';
import LoaderButton from '../LoaderButton/LoaderButton';
import { baseUrl } from '../../Api/Api';

const Document = ({ i, file, files, setFiles, type, disabled, setDeleteFiles, setSaveSuccess, windowRef, scrollTopHeight }) => {
    const [animFile, setAnimFile] = useState();
    const [urlFile, setUrlFile] = useState('');
    const [fileName, setFileName] = useState('')
    const [isImage, setIsImage] = useState(false);
    const [conditionDownload, setConditionDownload] = useState(false);
    const [modalImage, setModalImage] = useState(false);
    const conditionTarget = file.type == 'existing' && file.name.slice(-3) !== 'pdf' && file.name.slice(-3) !== 'png' && file.name.slice(-3) !== 'jpg' ? '_self' : '_blank';

    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true)
        }, 50)
    }, []);

    useEffect(() => {

    })

    useEffect(() => {
        const name = file?.name;
        setFileName(decodeURI(name)) 
        setIsImage(file.name.slice(-3) == 'png' || file.name.slice(-3) == 'jpg')
        const download = file.name.slice(-3) !== 'pdf' && file.name.slice(-3) !== 'png' && file.name.slice(-3) !== 'jpg' ? true : false;
        setConditionDownload(download)
    }, [file])

    useEffect(() => {
        if (file.type == 'existing') {
            const link = file.file.slice(0, 5) == 'bill_' ? `https://lk.skilla.ru/images/stock/${file.file}` : file.file.includes('uploads') ? `${baseUrl}file/${file.file}` : `${file.file}`;
            setUrlFile(link);
        } else {
            const fileUrl = window.URL.createObjectURL(file.file);
            setUrlFile(fileUrl)
        }
    }, [file])

    const handleDelete = (e) => {
        const idTarget = e.currentTarget.id;
        if (idTarget == file.id) {
            setAnimFile(false);
            const filterArr = files.filter(el => el.id != file.id);
            file.type == 'existing' && setDeleteFiles(prevState => [...prevState, file])
            setTimeout(() => {
                setFiles(filterArr);
            }, 200);
            setSaveSuccess(false)
        }
    }

    const handeOpenImageModal = () => {
        setModalImage(true)
    }

    return (
        <div style={{ marginTop: i + 1 > 2 && animFile ? '12px' : '', marginLeft: (i + 1) % 2 == 0 && animFile ? '12px' : '' }} className={`${s.file} ${i > 2} ${animFile && s.file_anim}`}>
            {!isImage && <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                {fileName.slice(-3) !== 'pdf' && fileName.slice(-3) !== 'doc' && fileName.slice(-3) !== 'ocx' && fileName.slice(-3) !== 'lsx' && fileName.slice(-3) !== 'xls' && <IconFolder />}
                {fileName.slice(-3) == 'pdf' && <img src={iconPdf}></img>}
                {(fileName.slice(-3) == 'xls' || fileName.slice(-3) == 'lsx') && <img src={IconExcel}></img>}
                {fileName.slice(-3) == 'doc' || fileName.slice(-3) == 'ocx' && <img src={iconWord}></img>}
                <div className={s.block_text}>
                    <p>{fileName}</p>
                    {/*   <span>Размер {file.size.toFixed(2)}</span> */}
                </div>
            </a>
            }

            {isImage && <div className={s.link} target={conditionTarget} onClick={handeOpenImageModal}>
                <div className={s.picture}>
                    <img src={urlFile}></img>
                </div>
                <div className={s.block_text}>
                    <p>{fileName}</p>
                    {/*   <span>Размер {file.size.toFixed(2)}</span> */}
                </div>
            </div>
            }
            <div id={file.id} onClick={handleDelete} className={`${s.delete} ${disabled && s.delete_disabled}`}>
                <IconDelete />
            </div>
            {modalImage && <ModalImage img={urlFile} setOpenImage={setModalImage} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />}
        </div>
    )
}


const Documents = ({ documents, setDocuments, disabled, setDeleteFiles, setSaveSuccess, windowRef, scrollTopHeight, type, loadDocuments, loadPurchasePage }) => {

    return (
        <div className={`${s.window} ${type == 'close' && s.window_close} ${loadPurchasePage && s.window_disabled}`}>
            {type !== 'close' && <h3 className={s.title}>Документы</h3>}
            {type == 'close' && <h3 className={s.title}>Закрывающие документы</h3>}
            <div style={{ height: `${Math.ceil(documents.length / 2) * 86}px` }} className={s.files}>

                <div className={`${s.loader} ${loadDocuments && s.loader_vis}`}><LoaderButton /></div>
                {documents.map((el, i) => {
                    return <Document key={el.id} i={i} file={el} files={documents} setFiles={setDocuments} type={el.type ? el.type : ''} disabled={disabled} setDeleteFiles={setDeleteFiles} setSaveSuccess={setSaveSuccess} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                })}
                {/* (disabled && documents.length == 0 && !loadDocuments) */}
            </div>
            {type !== 'close' && <div className={`${s.fileLoader} ${disabled && !loadDocuments && s.fileLoader_disabled} ${loadDocuments && s.fileLoader_load}`}>
                <FileLoader files={documents} setFiles={setDocuments} setSaveSuccess={setSaveSuccess} />
            </div>
            }

            {<div className={`${s.empity} ${disabled && documents.length == 0 && !loadDocuments && s.empity_vis}`}>
                <p>Документов к закупке нет</p>
                
                </div>}

        </div>
    )
};

export default Documents;