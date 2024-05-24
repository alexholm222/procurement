import s from './Tabs.module.scss';
import Search from '../Search/Search';
import { ReactComponent as IconFilter } from '../../image/iconFilter.svg';
//components 
import Loader from '../Loader/Loader';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//slice 
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';

function Tabs({ activeTabs, setActiveTabs, purchaseAction, loadAction, query, setQuery }) {
    const [tabAttention, setTabAttention] = useState(false);
    const updateAction = useSelector(purchaseUpdateSelector).updateAction;
    const handleChoseTab = (e) => {
        const id = e.currentTarget.id;
        setActiveTabs(id);
    }

    useEffect(() => {
        const attentionResult = purchaseAction.map((el) => {
            const isView = el?.logs_view.find(item => item.is_view == 0)
            return isView
        })

        const isViewResult = attentionResult.find(el => el?.is_view == 0);
        isViewResult?.is_view == 0 ? setTabAttention(true) : setTabAttention(false)

        console.log(attentionResult, isViewResult)

    }, [purchaseAction, updateAction])
    return (
        <div className={s.tabs}>
            <div className={s.block}>
                <Search query={query} setQuery={setQuery} />
                <div className={s.block_buttons}>
                    <button onClick={handleChoseTab} id='' className={`${s.button} ${activeTabs == '' && s.button_active}`}>
                        <p>Все</p>
                    </button>

                    <button disabled={purchaseAction?.length == 0} onClick={handleChoseTab} id='action' className={`${s.button} ${activeTabs == 'action' && s.button_active}`}>
                        <p>Требуют действий</p>
                        {purchaseAction?.length !== 0 && <div className={`${s.counter} ${tabAttention && s.counter_active}`}>
                            {loadAction && <Loader />}
                            <p>{purchaseAction.length}</p>
                        </div>
                        }
                    </button>

                    <button onClick={handleChoseTab} id='orders' className={`${s.button} ${activeTabs == 'orders' && s.button_active}`}>
                        <p>Заявки</p>
                        {/*  <div className={s.counter}>
                            <p>2</p>
                        </div> */}
                    </button>

                    <button onClick={handleChoseTab} id='beznal' className={`${s.button} ${activeTabs == 'beznal' && s.button_active}`}>
                        <p>Безналичная оплата</p>
                    </button>

                    <button onClick={handleChoseTab} id='nal' className={`${s.button} ${activeTabs == 'nal' && s.button_active}`}>
                        <p>Наличные</p>
                    </button>

                    <button onClick={handleChoseTab} id='del' className={`${s.button} ${activeTabs == 'del' && s.button_active}`}>
                        <p>Удаленные</p>
                    </button>
                </div>
            </div>

            <div className={s.filter}>
                <IconFilter />
                <p>Фильтры</p>
            </div>
        </div>
    )
};

export default Tabs;