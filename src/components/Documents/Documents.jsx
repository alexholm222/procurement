import s from './Documents.module.scss';
import { useEffect, useState } from 'react';
import { ReactComponent as IconFolder } from '../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';
import FileLoader from '../FileLoader/FileLoader';
import { baseUrl } from '../../Api/Api';

const Document = ({ i, file, files, setFiles, type }) => {
    const [animFile, setAnimFile] = useState(false);
    const [urlFile, setUrlFile] = useState('');
    const conditionDownload = file.type == 'existing' ? true : type !== 'existing' && file.name.slice(-3) !== 'pdf' ? file.name : false;
    const conditionTarget = file.type == 'existing' && file.name.slice(-3) !== 'pdf' ? '_self' : '_blank';

    useEffect(() => {
        setTimeout(() => {
            setAnimFile(true)
        }, 50)
    }, []);

    useEffect(() => {
        if (file.type == 'existing') {
            const link = `${baseUrl}file/${file.file}`;
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
            setTimeout(() => {
                setFiles(filterArr);
            }, 200)
        }
    }

    return (
        <div style={{ marginTop: i + 1 > 2 && animFile ? '12px' : '', marginLeft: (i + 1) % 2 == 0 && animFile ? '12px' : '' }} className={`${s.file} ${i > 2} ${animFile && s.file_anim}`}>
            <a className={s.link} target={conditionTarget} download={conditionDownload} href={urlFile}>
                <IconFolder />
                <div className={s.block_text}>
                    <p>{file?.name}</p>
                    <span>Загружено {file.date}</span>
                </div>
            </a>
            <div id={file.id} onClick={handleDelete} className={s.delete}>
                <IconDelete />
            </div>
        </div>
    )
}


const Documents = ({ documents, setDocuments }) => {
    return (
        <div className={s.window}>
            <h3 className={s.title}>Документы</h3>
            <div style={{ height: `${Math.ceil(documents.length / 2) * 74}px` }} className={s.files}>

                {documents.map((el, i) => {
                    return <Document key={el.id} i={i} file={el} files={documents} setFiles={setDocuments} type={el.type ? el.type : ''} />
                })}

            </div>

            <FileLoader files={documents} setFiles={setDocuments} />
        </div>
    )
};

export default Documents;