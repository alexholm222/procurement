import s from './Tabs.module.scss';
import Search from '../Search/Search';
import { ReactComponent as IconFilter } from '../../image/iconFilter.svg';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//components 
import Loader from '../Loader/Loader';
import Filters from '../Filters/Filters';
import CalendarMonth from '../Calendar/CalendarMonth';

//slice 
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';

function Tabs({ activeTabs, setActiveTabs, purchaseAction, loadAction, loadOrders, query, setQuery,
    orders, purchaseBeznalCount, purchaseNalCount, purchaseDelCount, filterPayDate, setFilerPayDate,
    disabled, isSkilla, role, setDateStart, setDateEnd }) {
    const [tabAttention, setTabAttention] = useState(false);
    const [tabAttentionOrders, setTabAttentionOrders] = useState(false);
    const [filtersModal, setFiltersModal] = useState(false);
    const updateAction = useSelector(purchaseUpdateSelector).updateAction;
    const updateOrder = useSelector(purchaseUpdateSelector).updateOrder;
    const handleChoseTab = (e) => {
        const id = e.currentTarget.id;
        setActiveTabs(id);
    }

    useEffect(() => {
        const attentionResult = purchaseAction.map((el) => {
            const isView = el?.logs_view?.find(item => item.is_view == 0)
            return isView
        })

        const isViewResult = attentionResult?.find(el => el?.is_view == 0);
        isViewResult?.is_view == 0 ? setTabAttention(true) : setTabAttention(false)


    }, [purchaseAction, updateAction])

    useEffect(() => {
        const attentionResult = orders.map((el) => {
            const isView = el?.logs_view?.find(item => item.is_view == 0)
            return isView
        })

        const isViewResult = attentionResult?.find(el => el?.is_view == 0);
        isViewResult?.is_view == 0 ? setTabAttentionOrders(true) : setTabAttentionOrders(false)

    }, [orders, updateOrder])

    const handleActiveFilter = () => {
        setFiltersModal(true)
    }
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

                    {isSkilla && <button disabled={orders?.length == 0} onClick={handleChoseTab} id='orders' className={`${s.button} ${activeTabs == 'orders' && s.button_active}`}>
                        <p>Заявки</p>
                        {orders?.length !== 0 && <div className={`${s.counter} ${tabAttentionOrders && s.counter_active}`}>
                            {loadOrders && <Loader />}
                            <p>{orders.length}</p>
                        </div>
                        }
                    </button>
                    }

                    <button disabled={purchaseBeznalCount == 0} onClick={handleChoseTab} id='beznal' className={`${s.button} ${activeTabs == 'beznal' && s.button_active}`}>
                        <p>Безналичная оплата</p>
                    </button>

                    <button disabled={purchaseNalCount == 0} onClick={handleChoseTab} id='nal' className={`${s.button} ${activeTabs == 'nal' && s.button_active}`}>
                        <p>Наличные</p>
                    </button>

                    <button disabled={purchaseDelCount == 0} onClick={handleChoseTab} id='del' className={`${s.button} ${activeTabs == 'del' && s.button_active}`}>
                        <p>Удаленные</p>
                    </button>

                    {/* {(role == 'director' || role == 'administrator') && <button onClick={handleChoseTab} id='report' className={`${s.button} ${activeTabs == 'report' && s.button_active}`}>
                        <p>Отчет</p>
                    </button>
                    } */}


                </div>
            </div>
            {activeTabs == 'report' && <CalendarMonth setDateStart={setDateStart} setDateEnd={setDateEnd} isSkilla={isSkilla} />}
            {activeTabs !== 'orders' && activeTabs !== 'report' && <div onClick={handleActiveFilter} className={`${s.filter} ${filtersModal && s.filter_active} ${disabled && s.filter_disabled} ${filterPayDate[0] !== null && !filtersModal && s.filter_on}`}>
                <div className={`${s.point}`}></div>
                <IconFilter />
                <p>Фильтры</p>
                {filtersModal ? <Filters filterPayDate={filterPayDate} setFilterPayDate={setFilerPayDate} setFiltersModal={setFiltersModal} /> : ''}
            </div>
            }

        </div>
    )
};

export default Tabs;