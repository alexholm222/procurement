import s from './FileLoaderAccept.module.scss';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import uuid from 'react-uuid';

function FileLoaderAccept({ documents, setDocuments, setSaveSuccess }) {
    const [error, setError] = useState(false);
    const [anim, setAnim] = useState('loader');
    const fileInputRef = useRef();
    const fileLast = documents.length == 0 ? 0 : documents.length - 1;

    useEffect(() => {
        if (documents?.[fileLast]?.file && !error) {
            setTimeout(() => {
                setAnim('loader')
            })
            return
        }
        if (documents?.[fileLast]?.file && !error) {
            setTimeout(() => {
                setAnim('loader')
            })
            return
        }

        if (error) {
            setTimeout(() => {
                setAnim('error')
            })
            return
        }
    }, [documents])


    const handleWriteFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result)

            setDocuments((prevState) =>
                [...prevState, {
                    id: uuid(),
                    file: file,
                    name: file.name,
                    size: file.size / 1048576,
                    fileBase64: reader.result,
                }]
            )
        };
    }

    const handleFile = async (e) => {
        const file = e.currentTarget.files[0];
        if (file.size > 15 * 1048576) {
            console.log("большой файл");
            setError(true)
        }
        else {
            setError(false);
            handleWriteFile(file)
            fileInputRef.current && (fileInputRef.current.value = '');
        }
    }

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("File(s) dropped");
        const file = event.dataTransfer.files[0]
        if (file && (file.type === "image/png" || file.type === "application/pdf" || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === "image/jpg" || file.type === "image/jpeg")) {
            handleWriteFile(file)
        };
    }

    function fonDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        setAnim('drag');
    }

    const handleDrag = (e) => {
        e.preventDefault();
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        setAnim('loader')
    }

    return (
        <div onDragOver={fonDragOver} onDragEnter={handleDrag} onDragLeave={handleDragLeave} className={`${s.files}`}>

            <div onDrop={handleDrop} className={`${s.loader} ${anim == 'drag' && s.loader_drag} ${(anim == 'loader' || anim == 'drag') && s.loader_anim}`}>

                <div className={`${s.container} ${anim == 'drag' && s.container_hiden}`}>
                    <input ref={fileInputRef} multiple id="image-input-accept" type='file' accept=".png,.jpg,.jpeg,.pdf,.doc,.docx" onInput={handleFile}></input>
                    <p className={`${s.text}`}>Перетащите <label for="image-input-accept">загрузите документ</label></p>
                    <p className={`${s.sub}`}>Файл обьемом до 20 Mбайт</p>
                </div>
                <p className={`${s.text} ${s.text_drag} ${anim == 'drag' && s.text_drag_active}`}>Отпустите файл здесь...</p>
            </div>



            {/*  <div className={`${s.error} ${anim == 'error' && s.error_anim}`}>

                    <p>Файл обьемом до 20 Mбайт</p>
                    <input ref={fileInputRef} id="image-input" type='file' accept=".png,.jpg,.jpeg,.gif" onInput={handleFile}></input>
                    <label for="image-input">загрузить другое изображение</label>
                </div> */}

        </div>

    )
};

export default FileLoaderAccept;