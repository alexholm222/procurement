import s from './Loader.module.scss';

const Loader = ({load}) => {
    return (
        <div className={`${s.overlay}`}>
            <div className={`${s.loader}`}></div>
        </div>
    )
};

export default Loader;
