import s from './Documents.module.scss';
import { ReactComponent as IconFolder } from '../../image/iconFolder.svg';
import { ReactComponent as IconDelete } from '../../image/iconDelete.svg';

function Documents() {
    return (
        <div className={s.window}>
            <h3 className={s.title}>Документы</h3>
            <div className={s.files}>
                <div className={s.file}>
                    <IconFolder />
                    <div className={s.block_text}>
                        <p>Чек на покупку Тортиков</p>
                        <span>Загружено 24 декабря в 12:00</span>
                    </div>
                    <div className={s.delete}>
                        <IconDelete />
                    </div>
                </div>
                <div className={s.file}>
                    <IconFolder />
                    <div className={s.block_text}>
                        <p>Чек на покупку Тортиков</p>
                        <span>Загружено 24 декабря в 12:00</span>
                    </div>
                    <div className={s.delete}>
                        <IconDelete />
                    </div>
                </div>

                <div className={s.file}>
                    <IconFolder />
                    <div className={s.block_text}>
                        <p>Чек на покупку Тортиков</p>
                        <span>Загружено 24 декабря в 12:00</span>
                    </div>
                    <div className={s.delete}>
                        <IconDelete />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Documents;