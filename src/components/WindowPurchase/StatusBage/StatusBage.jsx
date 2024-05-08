import s from './StatusBage.module.scss';
import { ReactComponent as IconStatusCreate } from '../../../image/icon/purchase/iconStatusCreate.svg';
import { ReactComponent as IconStatusLoader } from '../../../image/icon/purchase/IconStatusLoader.svg';
import { ReactComponent as IconStatusDone } from '../../../image/icon/purchase/iconStatusDone.svg'; 
import { ReactComponent as IconStatusReject } from '../../../image/icon/purchase/iconStatusReject.svg';
import { ReactComponent as IconStatusForPayment } from '../../../image/icon/purchase/iconStatusForPayment.svg'; 
import { ReactComponent as IconStatusPaid } from '../../../image/icon/purchase/iconStatusPaid.svg';
import { ReactComponent as IconStatusReceived } from '../../../image/icon/purchase/iconStatusReceived.svg';


const StatusBage = ({ status, reject, role }) => {
    return (
        <>
         {status == 0 && !reject && <div className={`${s.bage} ${s.bage_create}`}>
                <IconStatusCreate /><p>Создана</p>
            </div>
            }

            {(status == 1 || status == 2) && !reject && <div className={`${s.bage} ${s.bage_anim}`}>
                <IconStatusLoader /><p>{role == 'administrator' ? 'Согласование' : 'Ожидает согласования'}</p>
            </div>
            }

            {status == 6 && !reject && <div className={`${s.bage} ${s.bage_blue}`}>
                <IconStatusForPayment /><p>На оплату</p>
            </div>
            }

            {status == 3 && !reject && <div className={`${s.bage} ${s.bage_blue} ${s.bage_anim_blue}`}>
                <IconStatusLoader /><p>Ожидает оплаты</p>
            </div>
            }

            {status == 4 && !reject && <div className={`${s.bage} ${s.bage_blue}`}>
                <IconStatusPaid /><p>Оплачена</p>
            </div>
            }

            {(status == 5 || status == 7) && !reject && <div className={s.bage}>
                <IconStatusReceived /><p>Получено</p>
            </div>
            }

            {status == 9 && !reject && <div className={`${s.bage} ${s.bage_done}`}>
                <IconStatusDone /><p>Завершена</p>
            </div>
            }

            {reject && <div className={`${s.bage} ${s.bage_reject}`}>
                <IconStatusReject /><p>Отклонена</p>
            </div>
            }
        </>

    )
};

export default StatusBage;