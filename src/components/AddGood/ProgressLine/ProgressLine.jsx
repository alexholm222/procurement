import s from './ProgressLine.module.scss';
import { ReactComponent as IconTooltip } from '../../../image/icon/iconTooltip.svg'

const ProgressLine = ({ type, num }) => {
    console.log(num)
    return (
        <div className={s.progress}>
            {type == 'unit' && <div className={s.line}>
                <p className={`${s.number} ${(num / 50 * 100) < 9 && num && num > 0 && s.number_hiden} ${s.number_left}`}>0</p>
                <p className={`${s.number} ${(num / 50 * 100) > 81 && s.number_hiden} ${s.number_right}`}>50</p>
                <div style={{ width: `${30 / 50 * 100}%` }} className={s.rate}>
                    <div className={`${s.number} ${Math.abs((num / 50 * 100) - (30 / 50 * 100)) < 22 && s.number_hiden}  ${s.number_rate}`}><p>{`30 шт`}</p><IconTooltip /></div>
                </div>
                <div style={{ width: `${num / 50 * 100}%`}} className={s.current}>
                    <div className={`${s.number} ${(!num || num == 0) && s.number_hiden} ${(num / 50 * 100) > 91 && s.number_current_right} ${s.number_current}`}><p>{`${num} шт`}</p><IconTooltip /></div>
                </div>
            </div>
            }

            {type == 'price' && <div className={s.line}>
                <p className={`${s.number} ${s.number_left}`}>0</p>
                <p className={`${s.number} ${s.number_right}`}>1500</p>
                <div style={{ width: '70%' }} className={s.rate}>
                    <div className={`${s.number} ${s.number_price}`}><p>100 ₽</p></div>
                </div>
            </div>
            }
        </div>
    )
};

export default ProgressLine;