import s from './Tabs.module.scss';
import Search from '../Search/Search';
import { ReactComponent as IconFilter } from '../../image/iconFilter.svg';

function Tabs() {
    return (
        <div className={s.tabs}>
            <div className={s.block}>
                <Search/>
                <div className={s.block_buttons}>
                    <button className={`${s.button} ${s.button_active}`}>
                        <p>Все</p>
                    </button>

                    <button className={`${s.button}`}>
                        <p>Требуют действий</p>
                        <div className={s.counter}>
                            <p>2</p>
                        </div>
                    </button>

                    <button className={`${s.button}`}>
                        <p>Заявки</p>
                        <div className={s.counter}>
                            <p>2</p>
                        </div>
                    </button>

                    <button className={`${s.button}`}>
                        <p>Безналичная оплата</p>
                    </button>

                    <button className={`${s.button}`}>
                        <p>Наличные</p>
                    </button>

                    <button className={`${s.button}`}>
                        <p>Удаленные</p>
                    </button>
                </div>
            </div>

            <div className={s.filter}>
                <IconFilter/>
                <p>Фильтры</p>
            </div>
        </div>
    )
};

export default Tabs;