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
import { baseUrl } from '../../Api/Api';

const DocumentClose = ({ i, file, disabled, windowRef, scrollTopHeight }) => {
    const [animFile, setAnimFile] = useState();
    const [urlFile, setUrlFile] = useState('');
    const [isImage, setIsImage] = useState(false);
    const [modalImage, setModalImage] = useState(false);
    const conditionDownload = file.file.slice(-3) !== 'pdf' && file.file.slice(-3) !== 'png' && file.file.slice(-3) !== 'jpg' ? file.file : false;
    const conditionTarget = file.type == 'existing' && file.file.slice(-3) !== 'pdf' && file.file.slice(-3) !== 'png' && file.file.slice(-3) !== 'jpg' ? '_self' : '_blank';

    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true)
        }, 50)
    }, []);

    useEffect(() => {
        setIsImage(file.file.slice(-3) == 'png' || file.file.slice(-3) == 'jpg')
    }, [file])

    useEffect(() => {
        const link = file.file.slice(0, 5) == 'bill_' ? `https://lk.skilla.ru/images/stock/${file.file}` : `${baseUrl}file/${file.file}`;
        setUrlFile(link);

    }, [file])


    const handeOpenImageModal = () => {
        setModalImage(true)
    }

    return (
        <div style={{ marginTop: i + 1 > 2 && animFile ? '12px' : '', marginLeft: (i + 1) % 2 == 0 && animFile ? '12px' : '' }} className={`${s.file} ${i > 2} ${animFile && s.file_anim}`}>
            {!isImage && <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                {file?.file?.slice(-3) !== 'pdf' && file?.file?.slice(-3) !== 'doc' && file?.file?.slice(-3) !== 'ocx' && file?.file?.slice(-3) !== 'lsx' && file?.file?.slice(-3) !== 'xls' && <IconFolder />}
                {file?.file?.slice(-3) == 'pdf' && <img src={iconPdf}></img>}
                {(file?.file?.slice(-3) == 'xls' || file?.file?.slice(-3) == 'lsx') && <img src={IconExcel}></img>}
                {file?.file?.slice(-3) == 'doc' || file?.file?.slice(-3) == 'ocx' && <img src={iconWord}></img>}
                <div className={s.block_text}>
                    <p>{file?.file}</p>
                    {/*   <span>Размер {file.size.toFixed(2)}</span> */}
                </div>
            </a>
            }

            {isImage && <div className={s.link} target={conditionTarget} onClick={handeOpenImageModal}>
                <div className={s.picture}>
                    <img src={urlFile}></img>
                </div>
                <div className={s.block_text}>
                    <p>{file?.file}</p>
                    {/*   <span>Размер {file.size.toFixed(2)}</span> */}
                </div>
            </div>
            }
            {modalImage && <ModalImage img={urlFile} setOpenImage={setModalImage} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />}
        </div>
    )
}


const DocumentsClose = ({ documents, disabled, windowRef, scrollTopHeight }) => {
    return (
        <div className={`${s.window} ${s.window_close} ${disabled && documents.length == 0 && s.window_disabled}`}>
            <h3 className={s.title}>Закрывающие документы</h3>
            <div style={{ height: `${Math.ceil(documents.length / 2) * 86}px` }} className={s.files}>

                {documents.map((el, i) => {
                    return <DocumentClose key={el.id} i={i} file={el} files={documents} type={el.type ? el.type : ''} disabled={disabled} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />
                })}

            </div>


        </div>
    )
};

export default DocumentsClose;