import s from './Purchase.module.scss';
import { ReactComponent as IconFav } from '../../image/iconFav.svg';

function Purchase() {
    return (
        <div className={s.purchase}>
            <div className={`${s.item} ${s.item_date}`}>
                <p>14 сентября</p>
            </div>
            <div className={`${s.item} ${s.item_pos}`}>
                <div className={s.pos}>
                    <p>Полотенце бумажное (упаковка)</p>
                    <IconFav />
                    <span>15 шт по 289 ₽</span>
                </div>

                <div className={s.pos}>
                    <p>Полотенце бумажное (упаковка)</p>
                    <IconFav />
                    <span>15 шт по 289 ₽</span>
                </div>

                <div className={s.pos}>
                    <p>Полотенце бумажное (упаковка)</p>
                    <IconFav />
                    <span>15 шт по 289 ₽</span>
                </div>
            </div>
            <div className={`${s.item} ${s.item_sum}`}>
                <p>6 349 333</p>
            </div>
            <div className={`${s.item} ${s.item_buyer}`}>
                <p>ООО “Скилла Инновации”</p>
            </div>
            <div className={`${s.item} ${s.item_seller}`}>
                <p>Продавец</p>
                <span>ИНН 7653462867  КПП 483749734985</span>
            </div>
            <div className={`${s.item} ${s.item_status}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
};

export default Purchase;