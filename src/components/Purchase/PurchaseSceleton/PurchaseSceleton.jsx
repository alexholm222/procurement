import s from './PurchaseSceleton.module.scss';
import Loader from '../../Loader/Loader';

const PurchaseSceleton = ({ role }) => {

    return (
        <div className={`${s.purchase}`}>
            <div className={`${s.item} ${s.item_date}`}>
                <div><Loader /></div>
            </div>
            <div className={`${s.item} ${s.item_pos} ${(role == 'director' || role == 'administrator') && s.item_pos_director}`}>
                <div className={s.pos}>
                    <p><Loader /></p>
                    <span><Loader /></span>
                </div>

               {/*  <div className={s.pos}>
                    <p><Loader /></p>
                    <span><Loader /></span>
                </div>

                <div className={`${s.pos} ${(role == 'director' || role == 'administrator') && s.pos_director}`}>
                    <p><Loader /></p>
                    <span><Loader /></span>
                </div> */}
            </div>


            <div className={`${s.item} ${s.item_sum}`}>
                <div><Loader /></div>
            </div>
            <div className={`${s.item} ${s.item_buyer}`}>
                <div><Loader /></div>
            </div>
            <div className={`${s.item} ${s.item_seller} ${(role == 'director' || role == 'administrator') && s.item_seller_director}`}>
                <p><Loader /></p>
                <span><Loader /></span>
            </div>
            {(role == 'director' || role == 'administrator') && <div className={`${s.accounting}`}>
            </div>}

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