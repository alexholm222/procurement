import s from './DocumentsLog.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as IconFolder } from '../../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../../image/iconDelete.svg';
import iconPdf from '../../../image/icon/order/iconPdf.png';
import iconWord from '../../../image/icon/order/iconWord.png';
import FileLoader from '../../FileLoader/FileLoader';
import ModalImage from './ModalImage/ModalImage';
import { baseUrl } from '../../../Api/Api';

const DocumentLog = ({ i, file, windowRef, scrollTopHeight, type }) => {
    const [animFile, setAnimFile] = useState();
    const [urlFile, setUrlFile] = useState('');
    const [isImage, setIsImage] = useState(false);
    const [modalImage, setModalImage] = useState(false);
    const conditionDownload = file.name.slice(-3) !== 'pdf' && file.name.slice(-3) !== 'png' && file.name.slice(-3) !== 'jpg' ? file.name : false;
    const conditionTarget = file.name.slice(-3) !== 'pdf' && file.name.slice(-3) !== 'png' && file.name.slice(-3) !== 'jpg' ? '_self' : '_blank';
    console.log(file)
    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true)
        }, 50)
    }, []);

    useEffect(() => {
        setIsImage(file.name.slice(-3) == 'png' || file.name.slice(-3) == 'jpg')
    }, [file])

    useEffect(() => {
        const link = file.file.slice(0, 5) == 'bill_' ? `https://lk.skilla.ru/images/stock/${file.file}` : `${baseUrl}file/${file.file}`;
        console.log(file.file.slice(0, 5), file)
        setUrlFile(link);
    }, [file])



    const handeOpenImageModal = () => {
        setModalImage(true)
    }

    return (
        <div className={`${s.file} ${i > 2} ${animFile && s.file_anim}`}>
            {type == 'doc' && <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                {file.name.slice(-3) !== 'pdf' && file.name.slice(-3) !== 'doc' && file.name.slice(-3) !== 'ocx' && <IconFolder />}
                {file.name.slice(-3) == 'pdf' && <img src={iconPdf}></img>}
                {file.name.slice(-3) == 'doc' || file.name.slice(-3) == 'ocx' && <img src={iconWord}></img>}
                <div className={s.block_text}>
                    <p>{file?.name}</p>
                    {/*   <span>Размер {file.size.toFixed(2)}</span> */}
                </div>
            </a>
            }

            {type == 'image' && <div className={s.link} target={conditionTarget} onClick={handeOpenImageModal}>
                <div className={s.picture}>
                    <img src={urlFile}></img>
                </div>

            </div>
            }

            {modalImage && <ModalImage img={urlFile} setOpenImage={setModalImage} windowRef={windowRef} scrollTopHeight={scrollTopHeight}/>}
        </div>
    )
}


const DocumentsLog = ({ documents, windowRef, scrollTopHeight }) => {
    return (
        <div className={`${s.window}`}>
            <h3 className={s.title}>Вложения:</h3>
            <div className={s.files}>

                {documents?.map((el, i) => {
                    return <DocumentLog key={el.id} i={i} file={el} files={documents} windowRef={windowRef} scrollTopHeight={scrollTopHeight} type={(el.name.slice(-3) == 'png' || el.name.slice(-3) == 'jpg') ? 'image' : 'doc'}/>
                })}

            </div>

        </div>
    )
};

export default DocumentsLog;