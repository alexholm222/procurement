import s from './List.module.scss';
import {ReactComponent as IconArrow} from '../../image/iconArrow.svg';
import Purchase from '../Purchase/Purchase';

function List() {
    return (
        <div className={s.list}>
            <div className={s.header}>
                <div className={`${s.item} ${s.item_date}`}>
                    <p>Дата</p>
                </div>
                <div className={`${s.item} ${s.item_pos}`}>
                    <p>Позиции</p>
                </div>
                <div className={`${s.item} ${s.item_sum}`}>
                    <p>Сумма</p>
                </div>
                <div className={`${s.item} ${s.item_buyer}`}>
                    <p>Покупатель</p>
                    <IconArrow/>
                </div>
                <div className={`${s.item} ${s.item_seller}`}>
                    <p>Продавец</p>
                    <IconArrow/>
                </div>
                <div className={`${s.item} ${s.item_status}`}>
                    <p>Статус</p>
                    <IconArrow/>
                </div>
            </div>

            <Purchase/>
            <Purchase/>
            <Purchase/>
            <Purchase/>
        </div>
    )
};

export default List;