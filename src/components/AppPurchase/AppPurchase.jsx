import s from './AppPurchase.module.scss';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
import { ReactComponent as IconPro } from '../../image/icon/pro.svg';
//components
import Tabs from '../Tabs/Tabs';
import List from '../List/List';
import ListOrders from '../ListOrders/ListOrders';
import WindowOrder from '../WindowOrder/WindowOrder';
import WindowPurchase from '../WindowPurchase/WindowPurchase';
import ListSearch from '../List/ListSearch';

//slice
import { setPurchase, setPayers, setVendors, setVendorsContracts, setCategories, setItems, setOrder } from '../../store/reducer/purchase/slice';
//selectors
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';
import { updateParametrsSelector } from '../../store/reducer/updateParametrs/selector';
import { purchaseSelector } from '../../store/reducer/purchase/selector';
//API 
import { getParameters, getItems, getPurchases, getPurchasesAction, getOrders, getSearchResult, getProfile } from '../../Api/Api';
//utils
import { handleCompareDateOrder } from '../../utils/date';
import { sortByDefault } from '../../utils/sortByDefault';

const rols = ['administrator', 'hr-assist', 'chief-accountant', 'leader', 'frmanager', 'moderator', 'event-manager']

function AppPurchase() {
  const [theme, setTheme] = useState('light');
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
  const [isSkilla, setIsSkilla] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(true);
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
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

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
    if (path.includes('purchases2/purchase=') && !purchase.id) {
      const idPurchase = Number(path.split('purchase=').pop());
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
    if (ispro == 0 && !isskilla) {
      return
    }
    if (!path.includes('purchases2/purchase=') && !path.includes('purchases2/new')) {
      setHeaderHidden(false)
      handleClosePurchase()
      document.title = `Закупки`;
      return
    }

    if (path.includes('purchases2/new') && !purchase.id) {
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
  }, [updateOrder])

  const handleOpenPurchase = (e) => {
    dispatch(setPurchase({ id: '', open: true }))
    navigate('purchases2/new')
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

  return (
    <>
      {(ispro == 1 || isskilla) && <div id='purchasesApp' className={`${s.app} ${isskilla && s.app_skilla}`}>
        {!headerHidden && <div className={s.header}>
          <h2 className={s.title}>Закупки<sup>{purchaseCount}</sup> {profile.name} {profile.position}</h2>
          <div className={s.buttons}>
            {isskilla && <button disabled={loadParametrs} onClick={handleOpenOrder} className={`${s.button} ${s.button_add}`}>
              <p>Создать заявку на закупку</p>
              <IconCreate />
            </button>
            }

            <button disabled={loadParametrs} onClick={handleOpenPurchase} className={`${s.button} ${s.button_main}`}>
              <p>Добавить закупку</p>
              <IconAdd />
            </button>
          </div>
        </div>
        }
        {!headerHidden && <Tabs activeTabs={activeTabs} setActiveTabs={setActiveTabs} purchaseAction={purchaseAction}
          purchaseBeznalCount={purchaseBeznalCount} purchaseNalCount={purchaseNalCount} purchaseDelCount={purchaseDelCount}
          loadAction={loadAction} loadOrders={loadOrders} query={query} setQuery={setQuery} orders={orders}
          filterPayDate={filterPayDate} setFilerPayDate={setFilerPayDate} disabled={loadParametrs} role={role} isSkilla={isskilla}
        />
        }
        {activeTabs == '' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchases} purchaseCount={purchaseCount} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchases} firstCursor={firstCursor} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
        {activeTabs == 'action' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseAction} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseAction} firstCursor={firstCursorAction} load={loadAction} setLoad={setLoadAction} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
        {activeTabs == 'beznal' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseBeznal} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseBeznal} firstCursor={firstCursorBeznal} load={loadBeznal} setLoad={setLoadBeznal} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
        {activeTabs == 'nal' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseNal} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseNal} firstCursor={firstCursorNal} load={loadNal} setLoad={setLoadNal} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
        {activeTabs == 'del' && query == '' && <List isSkilla={isskilla} role={role} purchases={purchaseDel} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseDel} firstCursor={firstCursorDel} load={loadDel} setLoad={setLoadDel} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
        {query !== '' && <ListSearch role={role} purchases={purchasesSearch} setPurchases={setPurchasesSearch} firstCursor={firstCursorSearch} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} query={query} />}
        {activeTabs == 'orders' && isskilla && query == '' && <ListOrders role={role} orders={orders} loadParametrs={loadParametrs} load={loadOrders} personIsView={personIsView} />}
        {order.open && order.id == '' && <WindowOrder role={role} id={order.id} order={order} loadParametrs={loadParametrs} personIsView={personIsView} />}
        {purchase.open && (purchase.id == '' || purchase.isOrder) && <WindowPurchase id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} role={role} isSkilla={isskilla} />}

      </div>
      }
      {(ispro == 0 && !isskilla) && <div className={s.pro}>
        <p onClick={handlePro}>Закупки доступны только для обладателей <span><IconPro /></span> версии</p>
      </div>}
    </>
  );
}

export default AppPurchase;
