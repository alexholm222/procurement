import s from './Documents.module.scss';
import { useEffect, useState } from 'react';
import { detect } from 'jschardet'
import { ReactComponent as IconFolder } from '../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import iconPdf from '../../image/icon/order/iconPdf.png';
import iconWord from '../../image/icon/order/iconWord.png';
import IconExcel from '../../image/icon/order/iconExcel.png';
import FileLoader from '../FileLoader/FileLoader';
import ModalImage from './ModalImage/ModalImage';
import { baseUrl } from '../../Api/Api';

const DocumentClose = ({ i, file, disabled, windowRef, scrollTopHeight }) => {
    const [animFile, setAnimFile] = useState();
    const [fileName, setFileName] = useState('');
    const [urlFile, setUrlFile] = useState('');
    const [isImage, setIsImage] = useState(false);
    const [modalImage, setModalImage] = useState(false);
    const conditionDownload = file?.file?.slice(-3) !== 'pdf' && file?.file?.slice(-3) !== 'png' && file?.file?.slice(-3) !== 'jpg' ? true : false;
    const conditionTarget = file?.type == 'existing' && file?.file?.slice(-3) !== 'pdf' && file?.file?.slice(-3) !== 'png' && file?.file?.slice(-3) !== 'jpg' ? '_self' : '_blank';

    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true)
        }, 50)
    }, []);

    useEffect(() => {
        const fileName = file?.file?.includes('uploads') ? file?.file?.split('/').pop() : file?.file?.split('filename=').pop().split('&').shift()
        setIsImage(fileName.slice(-3) == 'png' || fileName.slice(-3) == 'jpg')
    }, [file])

    useEffect(() => {
        const name = file.file?.includes('purchases') ? file.file?.split('/').pop() : file.file?.split('filename=').pop().split('&').shift()
        setFileName(decodeURI(name))

        const link = file.file.slice(0, 5) == 'bill_' ? `https://lk.skilla.ru/images/stock/${file.file}` : file.file.includes('purchases') ? `${baseUrl}file/${file.file}` : file.file;
        setUrlFile(link);


    }, [file])


    const handeOpenImageModal = () => {
        setModalImage(true)
    }

    return (
        <div style={{ marginTop: i + 1 > 2 && animFile ? '12px' : '', marginLeft: (i + 1) % 2 == 0 && animFile ? '12px' : '' }} className={`${s.file} ${i > 2} ${animFile && s.file_anim}`}>
            {!isImage && <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                {fileName?.slice(-3) !== 'pdf' && fileName?.slice(-3) !== 'doc' && fileName?.slice(-3) !== 'ocx' && fileName?.slice(-3) !== 'rtf' && fileName?.slice(-3) !== 'lsx' && fileName?.slice(-3) !== 'xls' && <IconFolder />}
                {fileName?.slice(-3) == 'pdf' && <img src={iconPdf}></img>}
                {(fileName?.slice(-3) == 'xls' || fileName?.slice(-3) == 'lsx') && <img src={IconExcel}></img>}
                {(fileName?.slice(-3) == 'doc' || fileName?.slice(-3) == 'ocx' || fileName?.slice(-3) == 'rtf') && <img src={iconWord}></img>}
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
            {modalImage && <ModalImage img={urlFile} setOpenImage={setModalImage} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />}
        </div>
    )
}


const DocumentsClose = ({ documents, disabled, windowRef, scrollTopHeight, loadDocuments }) => {
    return (
        <div className={`${s.window} ${s.window_close} ${(loadDocuments || documents.length == 0) && s.window_disabled}`}>
            <h3 className={s.title}>Закрывающие документы</h3>
            <div style={{ height: `${Math.ceil(documents.length / 2) * 86}px` }} className={s.files}>

                {documents.map((el, i) => {
                    return el.file && <DocumentClose key={el.id} i={i} file={el} files={documents} type={el.type ? el.type : ''} disabled={disabled} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                })}

            </div>


        </div>
    )
};

export default DocumentsClose;