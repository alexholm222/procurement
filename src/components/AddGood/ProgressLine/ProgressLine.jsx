import s from './ProgressLine.module.scss';
import { ReactComponent as IconTooltip } from '../../../image/icon/iconTooltip.svg'

const ProgressLine = ({ type, unit, num, rate, maxRate, price, maxPrice }) => {
    
    return (
        <div className={s.progress}>
            {type == 'unit' && <div className={s.line}>
                <p className={`${s.number} ${(num / maxRate * 100) < 9 && num && num > 0 && s.number_hiden} ${s.number_left}`}>0</p>
                <p className={`${s.number} ${(num / maxRate * 100) > 81 && s.number_hiden} ${s.number_right}`}>{maxRate}</p>
                <div style={{ width: `${rate / maxRate * 100}%` }} className={s.rate}>
                    <div className={`${s.number} ${Math.abs((num / maxRate * 100) - (rate / maxRate * 100)) < 22 && s.number_hiden}  ${s.number_rate}`}><p>{rate} {unit}</p><IconTooltip /></div>
                </div>
                <div style={{ width: `${num / maxRate * 100}%`}} className={s.current}>
                    <div className={`${s.number} ${(!num || num == 0) && s.number_hiden} ${(num / maxRate * 100) > 91 && s.number_current_right} ${s.number_current}`}><p>{num} {unit}</p><IconTooltip /></div>
                </div>
            </div>
            }

            {type == 'price' && <div className={s.line}>
                <p className={`${s.number} ${s.number_left} ${(price/maxPrice * 100) < 5 && price && price > 0 && s.number_hiden}`}>0</p>
                <p className={`${s.number} ${s.number_right} ${(price/maxPrice * 100) > 85 && s.number_hiden}`}>{maxPrice}</p>
                <div style={{ width: `${price/maxPrice * 100}%` }} className={s.current}>
                    <div className={`${s.number} ${s.number_price} ${(!price || price == 0) && s.number_hiden} ${(price/maxPrice * 100) > 90 && s.number_price_right}`}><p>{price} {price && price > 0 && '₽'}</p></div>
                </div>
            </div>
            }
        </div>
    )
};

export default ProgressLine;