import s from './CheckBox.module.scss';
import { ReactComponent as IconCheck } from '../../image/icon/purchase/iconCheck.svg';

const CheckBox = ({active}) => {
    return (
        <div className={`${s.checkbox} ${active && s.checkbox_active}`}>
        <div>
            <IconCheck />
        </div>
    </div>
    )
};

export default CheckBox;