import s from './DocumentsLog.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as IconFolder } from '../../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../../image/iconDelete.svg';
import { ReactComponent as IconCloseShot } from '../../../image/iconCloseShot.svg';
import iconPdf from '../../../image/icon/order/iconPdf.png';
import iconWord from '../../../image/icon/order/iconWord.png';
import FileLoader from '../../FileLoader/FileLoader';
import ModalImage from './ModalImage/ModalImage';
import { baseUrl } from '../../../Api/Api';

const DocumentLog = ({ i, files, file, windowRef, scrollTopHeight, type, send, name, setFiles }) => {
    const [animFile, setAnimFile] = useState();
    const [urlFile, setUrlFile] = useState('');
    const [isImage, setIsImage] = useState(false);
    const [modalImage, setModalImage] = useState(false);
    const conditionDownload = name.slice(-3) !== 'pdf' && name.slice(-3) !== 'png' && name.slice(-3) !== 'jpg' ? name : false;
    const conditionTarget = name.slice(-3) !== 'pdf' && name.slice(-3) !== 'png' && name.slice(-3) !== 'jpg' ? '_self' : '_blank';

    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true)
        }, 50)
    }, []);

    useEffect(() => {
        setIsImage(name.slice(-3) == 'png' || name.slice(-3) == 'jpg')

    }, [file])

    useEffect(() => {
        if (send) {
            const fileUrl = window.URL.createObjectURL(file.file);
            setUrlFile(fileUrl)
        } else {
            const link = file.file.slice(0, 5) == 'bill_' ? `https://lk.skilla.ru/images/stock/${file.file}` : `${baseUrl}file/${file.file}`;
            console.log(file.file.slice(0, 5), file)
            setUrlFile(link);
        }
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



    const handeOpenImageModal = () => {
        setModalImage(true)
    }

    return (
        <div style={{margin: send ? '12px 16px 0 0' : ''}} className={`${s.file} ${i > 2} ${animFile && s.file_anim}`}>
            {type == 'doc' && <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                {name.slice(-3) !== 'pdf' && name.slice(-3) !== 'doc' && name.slice(-3) !== 'ocx' && <IconFolder />}
                {name.slice(-3) == 'pdf' && <img src={iconPdf}></img>}
                {name.slice(-3) == 'doc' || name.slice(-3) == 'ocx' && <img src={iconWord}></img>}
                <div className={s.block_text}>
                    <p>{name}</p>
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

            {send && <div onClick={handleDelete} id={file.id} className={s.overlay}>
                <IconCloseShot />
            </div>
            }

            {modalImage && <ModalImage img={urlFile} setOpenImage={setModalImage} windowRef={windowRef} scrollTopHeight={scrollTopHeight} />}
        </div>
    )
}


const DocumentsLog = ({ documents, windowRef, scrollTopHeight, setFiles }) => {
    return (
        <div className={`${s.window}`}>
            <h3 className={s.title}>Вложения:</h3>
            <div className={s.files}>

                {documents?.map((el, i) => {
                    const name = el.name ? el.name : el.file.split('/').pop();
                    return <DocumentLog key={el.id} i={i} file={el} files={documents} windowRef={windowRef} scrollTopHeight={scrollTopHeight} type={(name.slice(-3) == 'png' || name.slice(-3) == 'jpg') ? 'image' : 'doc'} name={name} send={el.send} setFiles={setFiles} />
                })}

            </div>

        </div>
    )
};

export default DocumentsLog;