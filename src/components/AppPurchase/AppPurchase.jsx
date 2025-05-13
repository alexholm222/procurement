import s from './AppPurchase.module.scss';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
import { ReactComponent as IconPro } from '../../image/icon/pro.svg';
import { ReactComponent as IconPlus } from '../../image/iconPlus.svg';
//components
import Tabs from '../Tabs/Tabs';
import List from '../List/List';
import ListOrders from '../ListOrders/ListOrders';
import WindowOrder from '../WindowOrder/WindowOrder';
import WindowPurchase from '../WindowPurchase/WindowPurchase';
import ListSearch from '../List/ListSearch';
import Report from '../Report/Report';
import ManualAccounting from '../ManualAccounting/ManualAccounting';
import ModalSuplier from '../ModalSupliers/ModalSuplier';

//slice
import { setPurchase, setPayers, setPayersAll, setVendors, setVendorsContracts, setCategories, setItems, setOrder } from '../../store/reducer/purchase/slice';
//selectors
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';
import { updateParametrsSelector } from '../../store/reducer/updateParametrs/selector';
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//API 
import { getParameters, getCategories, getPayersList, getItems, getPurchases, getPurchasesAction, getOrders, getSearchResult, getProfile, getManualAcc } from '../../Api/Api';
//utils
import { handleCompareDateOrder, setYearNow } from '../../utils/date';
import { sortByDefault } from '../../utils/sortByDefault';

const rols = ['administrator', 'hr-assist', 'chief-accountant', 'leader', 'frmanager', 'moderator', 'event-manager']

function AppPurchase() {
  const [theme, setTheme] = useState('light');
  const [anim, setAnim] = useState(false);
  /*   const [role, setRole] = useState(''); */
  const [profile, setProfile] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [purchaseCountGeneral, setPurchaseCountGeneral] = useState('');
  const [purchaseCount, setPurchaseCount] = useState('');
  const [purchasesSearch, setPurchasesSearch] = useState([]);
  const [query, setQuery] = useState('');
  const [firstCursor, setFirstCursor] = useState(null);
  const [firstCursorSearch, setFirstCursorSearch] = useState(null);
  const [load, setLoad] = useState(true);
  const [purchaseAction, setPurchaseAction] = useState([]);
  const [firstCursorAction, setFirstCursorActoin] = useState('');
  const [loadAction, setLoadAction] = useState(true);
  const [purchaseBeznal, setPurchaseBeznal] = useState([]);
  const [purchaseBeznalCount, setPurchaseBeznalCount] = useState('');
  const [firstCursorBeznal, setFirstCursorBeznal] = useState(null);
  const [loadBeznal, setLoadBeznal] = useState(true);
  const [purchaseNal, setPurchaseNal] = useState([]);
  const [purchaseNalCount, setPurchaseNalCount] = useState('');
  const [firstCursorNal, setFirstCursorNal] = useState(null);
  const [loadNal, setLoadNal] = useState(true);
  const [purchaseDel, setPurchaseDel] = useState([]);
  const [purchaseDelCount, setPurchaseDelCount] = useState('');
  const [firstCursorDel, setFirstCursorDel] = useState(null);
  const [loadDel, setLoadDel] = useState(true);
  const [loadParametrs, setLoadParametrs] = useState(true);
  const [loadOrders, setLoadOrders] = useState(true);
  const [activeTabs, setActiveTabs] = useState('');
  const [orders, setOrders] = useState([]);
  const [personIsView, setPersonIsView] = useState({});
  const [filterPayDate, setFilerPayDate] = useState([null, null]);
  const [headerHidden, setHeaderHidden] = useState(true);
  const [categoriesAll, setCategoriesAll] = useState([]);
  const [dateStart, setDateStart] = useState('2025-01-01');
  const [dateEnd, setDateEnd] = useState('2025-01-31')
  const [manualAcc, setManualAcc] = useState(false);
  const [modalVendor, setModalVendor] = useState(false);
  const [manualFirstData, setManualFirstData] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  const dispatch = useDispatch();
  const purchaseNew = useSelector(purchaseUpdateSelector).purchaseNew;
  const orderNew = useSelector(purchaseUpdateSelector).orderNew;
  const updateAction = useSelector(purchaseUpdateSelector).updateAction;
  const updateOrder = useSelector(purchaseUpdateSelector).updateOrder;
  const updateParametrs = useSelector(updateParametrsSelector).update;
  const purchase = useSelector(purchaseSelector).purchase;
  const order = useSelector(purchaseSelector).order;
  const role = document.getElementById('root_purchases').getAttribute('role');
  const ispro = document.getElementById('root_purchases').getAttribute('ispro');
  const isskilla = document.getElementById('root_purchases').getAttribute('isskilla') == 1 ? true : false;
  const token = document.getElementById('root_purchases').getAttribute('token');
  const isTest = token == 'Bearer 2109|7d9OHVhjO02gY9rrbjV5rTfCpFs4iVShk6TtSrCg' ? true : false;
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname + location.search;

  useEffect(() => {
    setAnim(true)
  }, [])

  useEffect(() => {
    getProfile()
      .then(res => {
        const data = res.data.data;
        setProfile(data)
      })
      .catch(err => console.log(err))
  }, [])


  useEffect(() => {
    if (query !== '') {
      setActiveTabs('');
      return
    }
  }, [query])

  useEffect(() => {
    activeTabs !== '' && setQuery('');
  }, [activeTabs]);

  useEffect(() => {
    if (query == '') {
      setPurchasesSearch([]);
      return
    }
  }, [])


  useEffect(() => {
    if (orderNew?.id) {
      setOrders([orderNew, ...orders]);
      return
    }
  }, [orderNew])

  useEffect(() => {
    if (theme == '') {
      const userMedia = window.matchMedia('(prefers-color-scheme: light)')
      if (userMedia.matches) return setTheme('light')
      return setTheme('dark')
    }
  }, [theme])
  document.documentElement.dataset.theme = theme;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    })

    return () => {
      document.removeEventListener('dragover', (e) => {
        e.preventDefault();
      })
    }
  }, []);

  useEffect(() => {
    getCategories()
      .then(res => {
        const data = res.data;
        setCategoriesAll(data);
      })
      .catch(err => console.log(err))

    getPayersList()
      .then(res => {
        const data = res.data;
        dispatch(setPayersAll(data));
        localStorage.setItem('payersAll', JSON.stringify(data));
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }

    getPurchases('', filterPayDate)
      .then(res => {
        const data = res.data.data;
        const total = res.data.total;
        const cursor = res.data.next_page_url;
        setPurchases(data);
        cursor !== null && setFirstCursor(cursor);
        setPurchaseCount(total == 0 ? '' : total);
        load && setPurchaseCountGeneral(total);

        setLoad(false);
      })
      .catch(err => console.log(err))
  }, [updateAction, filterPayDate, isskilla])

  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }
    getPurchasesAction(filterPayDate)
      .then(res => {
        const data = res.data;
        setPurchaseAction(data);
        setLoadAction(false);
      })
      .catch(err => console.log(err))
  }, [updateAction, filterPayDate, isskilla])

  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }
    getPurchases('beznal', filterPayDate)
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        const total = res.data.total;
        setPurchaseBeznal(data);
        cursor !== null && setFirstCursorBeznal(cursor)
        setLoadBeznal(false);
        setPurchaseBeznalCount(total)
      })
      .catch(err => console.log(err))
  }, [updateAction, filterPayDate, isskilla])

  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }
    getPurchases('nal', filterPayDate)
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        const total = res.data.total;
        setPurchaseNal(data);
        cursor !== null && setFirstCursorNal(cursor)
        setLoadNal(false);
        setPurchaseNalCount(total)
      })
      .catch(err => console.log(err))
  }, [updateAction, filterPayDate, isskilla])

  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }
    getPurchases('del', filterPayDate)
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        const total = res.data.total;
        setPurchaseDel(data);
        cursor !== null && setFirstCursorDel(cursor)
        setLoadDel(false);
        setPurchaseDelCount(total)
      })
      .catch(err => console.log(err))
  }, [updateAction, filterPayDate, isskilla])

  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }
    query !== '' && getSearchResult(query)
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        setPurchasesSearch(data);
        cursor !== null && setFirstCursorSearch(cursor)
      })
      .catch(err => console.log(err))
  }, [query, isskilla])

  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }
    setLoadParametrs(true)
    Promise.all([getParameters(), getItems()])
      .then(([res1, res2]) => {
        const vendors = res1.data.vendors;
        const vendorsContracts = res1.data.vendor_contracts;
        const payers = res1.data.payers;
        sortByDefault(payers)
        const categories = res1.data.categories;
        sortByDefault(categories)
        const items = res2.data;
        dispatch(setVendors(vendors));
        localStorage.setItem('vendors', JSON.stringify(vendors));
        dispatch(setVendorsContracts(vendorsContracts));
        localStorage.setItem('vendorsContracts', JSON.stringify(vendorsContracts));
        dispatch(setPayers(payers));
        localStorage.setItem('payers', JSON.stringify(payers));
        dispatch(setCategories(categories));
        localStorage.setItem('categories', JSON.stringify(categories));
        dispatch(setItems(items));
        localStorage.setItem('items', JSON.stringify(items));
        setLoadParametrs(false);
      })
      .catch(err => console.log(err))
  }, [updateParametrs, isskilla])

  //загрузка закупки по ссылке
  useEffect(() => {
    if (ispro == 0 && !isskilla) {
      return
    }
    if (path.includes('/purchases/detail=') && !purchase.id) {
      const idPurchase = Number(path.split('detail=').pop());
      setHeaderHidden(true)
      const purchaseForOpen = {
        isOrder: false,
        id: idPurchase,
        open: true,
      }
      dispatch(setPurchase(purchaseForOpen));
      localStorage.setItem('purchase', JSON.stringify(purchaseForOpen))
      document.title = `Закупка`;
      return
    }

  }, [path, purchase, isskilla])

  useEffect(() => {

    if (path.includes('/purchases/manual') && (role == 'director' || role == 'accountant' || role == 'administrator')) {
      setManualAcc(true)
      setHeaderHidden(false)
      document.title = `Ручной учет`;
      return
    }

    if (ispro == 0 && !isskilla && !path.includes('/purchases/manual')) {
      return
    }


    if (!path.includes('/purchases/detail=') && !path.includes('/purchases/create') && !path.includes('/purchases/manual')) {
      setHeaderHidden(false)
      handleClosePurchase()
      document.title = `Закупки`;
      return
    }

    if (path.includes('/purchases/create') && !purchase.id) {
      dispatch(setPurchase({ id: '', open: true }))
      document.title = `Закупка`;
      return
    }


  }, [path, isskilla])

  //orders
  useEffect(() => {
    getOrders()
      .then(res => {
        const filterOrders = res.data.order.filter(el => el.status == 0 || (el.status == 1 && handleCompareDateOrder(el.date_create)))
        setOrders(filterOrders);
        setPersonIsView(res.data.person_view);
        setLoadOrders(false);
      })
      .catch(err => console.log(err))
  }, [updateOrder]);

  useEffect(() => {
    getManualAcc(setYearNow())
      .then(res => {
        const data = res.data.data;
        setManualFirstData(data);
        setTimeout(() => {
          setFirstLoad(false)
        }, 50)

      })
      .catch(err => console.log(err))
  }, []);


  const handleOpenPurchase = (e) => {
    dispatch(setPurchase({ id: '', open: true }))
    navigate('new/purchases/create')
  }

  const handleClosePurchase = () => {
    setTimeout(() => {
      dispatch(setPurchase({ id: '', open: false }))
    }, 150);
  }

  const handleOpenOrder = (e) => {
    const id = e.currentTarget.id
    dispatch(setOrder({ id: '', open: true }))
  }

  const handlePro = () => {
    document?.getElementById('pro-open')?.click();
  }

  const handleManualOpen = (e) => {
    const id = e.currentTarget.id;
    id == 2 ? setManualAcc(true) : setManualAcc(false)
  }

  const handleOpenVendorModal = () => {
    setModalVendor(true)
  }

  return (
    <>
      {(ispro == 1 || isskilla || (ispro == 0 && manualAcc)) && <div id='purchasesApp' className={`${s.app} ${anim && s.app_anim} ${isskilla && s.app_skilla}`}>
        {!headerHidden && <div className={s.header}>
          {isskilla && <h2 className={s.title}>Закупки<sup>{purchaseCount}</sup></h2>}
          {!isskilla &&
            <div className={s.tabs}>
              <Link to={'/new/purchases'}><div id='1' onClick={handleManualOpen} className={`${s.tab} ${purchaseCountGeneral !== '' && s.tab_load} ${!manualAcc && s.tab_active}`}>Закупки<sup>{purchaseCount}</sup></div></Link>
           {/*    <Link to={'/new/purchases/stock'}><div id='3' className={`${s.tab} ${manualAcc && s.tab_actie}`}>Склад</div></Link> */}
              {(role == 'director' || role == 'accountant' || role == 'administrator') && <Link to={'/new/purchases/manual'}><div id='2' onClick={handleManualOpen} className={`${s.tab} ${manualAcc && s.tab_active}`}>Ручной учет</div></Link>}
            </div>}

          <div className={s.buttons}>
            {isskilla && <button disabled={loadParametrs} onClick={handleOpenOrder} className={`${s.button} ${s.button_add}`}>
              <p>Создать заявку на закупку</p>
              <IconCreate />
            </button>
            }

            {!manualAcc && <button disabled={loadParametrs} onClick={handleOpenPurchase} className={`${s.button} ${s.button_main}`}>
              <p>Добавить закупку</p>
              <IconAdd />
            </button>
            }

            {manualAcc && <button onClick={handleOpenVendorModal} className={`${s.button} ${s.button_add}`}>
              <p>Добавить поставщика</p>
              <IconPlus />
            </button>
            }

          </div>
        </div>
        }

        {manualAcc && <ManualAccounting modalVendor={modalVendor} setModalVendor={setModalVendor} manualFirstData={manualFirstData} firstLoad={firstLoad} />}

        {!manualAcc && <>
          {!headerHidden && <Tabs activeTabs={activeTabs} setActiveTabs={setActiveTabs} purchaseAction={purchaseAction}
            purchaseBeznalCount={purchaseBeznalCount} purchaseNalCount={purchaseNalCount} purchaseDelCount={purchaseDelCount}
            loadAction={loadAction} loadOrders={loadOrders} query={query} setQuery={setQuery} orders={orders}
            filterPayDate={filterPayDate} setFilerPayDate={setFilerPayDate} disabled={loadParametrs} role={role} isSkilla={isskilla}
            setDateStart={setDateStart} setDateEnd={setDateEnd}
          />
          }
          {activeTabs == '' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchases} purchaseCount={purchaseCount} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchases} firstCursor={firstCursor} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
          {activeTabs == 'action' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseAction} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseAction} firstCursor={firstCursorAction} load={loadAction} setLoad={setLoadAction} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
          {activeTabs == 'beznal' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseBeznal} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseBeznal} firstCursor={firstCursorBeznal} load={loadBeznal} setLoad={setLoadBeznal} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
          {activeTabs == 'nal' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseNal} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseNal} firstCursor={firstCursorNal} load={loadNal} setLoad={setLoadNal} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
          {activeTabs == 'del' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseDel} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseDel} firstCursor={firstCursorDel} load={loadDel} setLoad={setLoadDel} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
          {query !== '' && <ListSearch role={role} isSkilla={isskilla} purchases={purchasesSearch} setPurchases={setPurchasesSearch} firstCursor={firstCursorSearch} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} query={query} />}
          {activeTabs == 'orders' && isskilla && query == '' && <ListOrders role={role} orders={orders} loadParametrs={loadParametrs} load={loadOrders} personIsView={personIsView} />}
          {activeTabs == 'report' && <Report isSkilla={isskilla} categoriesAll={categoriesAll} dateStart={dateStart} dateEnd={dateEnd} />}
          {order.open && order.id == '' && <WindowOrder role={role} id={order.id} order={order} loadParametrs={loadParametrs} personIsView={personIsView} />}
          {purchase.open && (purchase.id == '' || purchase.isOrder) && <WindowPurchase id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} role={role} isSkilla={isskilla} />}
        </>}



      </div>
      }
      {ispro == 0 && !isskilla && !manualAcc && <div className={`${s.pro} ${anim && s.pro_vis}`}>
        <p onClick={handlePro}>Закупки доступны только для обладателей <span><IconPro /></span> версии</p>
      </div>}
    </>
  );
}

export default AppPurchase;
