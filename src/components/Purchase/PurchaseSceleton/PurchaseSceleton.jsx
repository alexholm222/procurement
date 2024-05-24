import s from './PurchaseSceleton.module.scss';
import Loader from '../../Loader/Loader';

const PurchaseSceleton = () => {

    return (
        <div className={`${s.purchase}`}>
            <div className={`${s.item} ${s.item_date}`}>
                <div><Loader /></div>
            </div>
            <div className={`${s.item} ${s.item_pos}`}>
                <div className={s.pos}>
                    <p><Loader /></p>
                    <span><Loader /></span>
                </div>

                <div className={s.pos}>
                    <p><Loader /></p>
                    <span><Loader /></span>
                </div>

                <div className={s.pos}>
                    <p><Loader /></p>
                    <span><Loader /></span>
                </div>
            </div>


            <div className={`${s.item} ${s.item_sum}`}>
                <div><Loader /></div>
            </div>
            <div className={`${s.item} ${s.item_buyer}`}>
                <div><Loader /></div>
            </div>
            <div className={`${s.item} ${s.item_seller}`}>
                <p><Loader /></p>
                <span><Loader /></span>
            </div>
            <div className={`${s.item} ${s.item_status}`}>
                <div className={`${s.status}`}>
                    <Loader />
                </div>
                <div className={`${s.status}`}>
                    <Loader />
                </div>
                <div className={`${s.status}`}>
                    <Loader />
                </div>
                <div className={`${s.status}`}>
                    <Loader />
                </div>
            </div>
        </div>
    )
};

export default PurchaseSceleton;