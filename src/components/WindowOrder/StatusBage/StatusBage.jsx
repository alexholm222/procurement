import s from './StatusBage.module.scss';
import { ReactComponent as IconStatusCreate } from '../../../image/icon/purchase/iconStatusCreate.svg';
import { ReactComponent as IconStatusDone } from '../../../image/icon/order/iconDone.svg';


const StatusBage = ({ status }) => {
    return (
        <>
            {status == 0 && <div className={`${s.bage} ${s.bage_create}`}>
                <IconStatusCreate /><p>Заявка создана</p>
            </div>
            }




            {status == 1 && <div className={`${s.bage} ${s.bage_done}`}>
                <IconStatusDone /><p>Взята в работу</p>
            </div>
            }


        </>

    )
};

export default StatusBage;