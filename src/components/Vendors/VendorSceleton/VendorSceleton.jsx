import s from './VendorSceleton.module.scss';
import Loader from '../../Loader/Loader';

const VendorSceleton = ({loadVendor}) => {

    return (
        <div className={`${s.block} ${loadVendor && s.block_vis}`}>
            <div className={`${s.number}`}>
               <div><Loader/></div>
            </div>
            <div className={`${s.name}`}>
            <div><Loader/></div>
            </div>
        </div>
    )
};

export default VendorSceleton;