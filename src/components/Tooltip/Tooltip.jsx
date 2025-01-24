import s from './Tooltip.module.scss';
import { ReactComponent as TooltipIcon } from '../../image/icon/iconTooltip.svg';
import { useState } from 'react';

const Tooltip = ({ text }) => {
    const [openTooltip, setOpenTooltip] = useState(false);

    const handleMouseEnter = () => {
        setOpenTooltip(true)
    }

    const handleMouseLeave = () => {
        setOpenTooltip(false)
    }
    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={s.tooltip}>
            <div className={s.icon}>
                <TooltipIcon />
            </div>

            <div className={`${s.container} ${openTooltip && s.container_vis}`}>
                <p>{text}</p>
            </div>
        </div>
    )
};

export default Tooltip;