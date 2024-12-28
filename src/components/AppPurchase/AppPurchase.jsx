import s from './AppPurchase.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
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
  const [role, setRole] = useState('');
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
  const dispatch = useDispatch();
  const purchaseNew = useSelector(purchaseUpdateSelector).purchaseNew;
  const orderNew = useSelector(purchaseUpdateSelector).orderNew;
  const updateAction = useSelector(purchaseUpdateSelector).updateAction;
  const updateOrder = useSelector(purchaseUpdateSelector).updateOrder;
  const updateParametrs = useSelector(updateParametrsSelector).update;
  const purchase = useSelector(purchaseSelector).purchase;
  const order = useSelector(purchaseSelector).order;
  /*   const role = document.getElementById('root_purchases').getAttribute('role'); */
  console.log(role)


  useEffect(() => {
    getProfile()
      .then(res => {
        const data = res.data.data;
        setProfile(data)
        setRole(data.position)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (role == 'administrator' || role == 'hr-assist' || role == 'leader' || role == 'frmanager' || role == 'moderator' || role == 'chief-accountant' || role == 'event-manager') {
      setIsSkilla(true)
    } else {
      setIsSkilla(false)
    }
  }, [role])

  console.log(isSkilla)


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
  }, [updateAction, filterPayDate])

  useEffect(() => {
    getPurchasesAction(filterPayDate)
      .then(res => {
        const data = res.data;
        setPurchaseAction(data);
        setLoadAction(false);
      })
      .catch(err => console.log(err))
  }, [updateAction, filterPayDate])

  useEffect(() => {
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
  }, [updateAction, filterPayDate])

  useEffect(() => {
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
  }, [updateAction, filterPayDate])

  useEffect(() => {
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
  }, [updateAction, filterPayDate])

  useEffect(() => {
    query !== '' && getSearchResult(query)
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        setPurchasesSearch(data);
        cursor !== null && setFirstCursorSearch(cursor)
      })
      .catch(err => console.log(err))
  }, [query])

  useEffect(() => {
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
  }, [updateParametrs])

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
    const id = e.currentTarget.id
    dispatch(setPurchase({ id: '', open: true }))
  }

  const handleOpenOrder = (e) => {
    const id = e.currentTarget.id
    dispatch(setOrder({ id: '', open: true }))
  }


  return (
    <div className={s.app}>
      <div className={s.header}>
        <h2 className={s.title}>Закупки<sup>{purchaseCount}</sup> {profile.name} {profile.position}</h2>
        <div className={s.buttons}>
          {isSkilla && <button disabled={loadParametrs} onClick={handleOpenOrder} className={`${s.button} ${s.button_add}`}>
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
      <Tabs activeTabs={activeTabs} setActiveTabs={setActiveTabs} purchaseAction={purchaseAction}
        purchaseBeznalCount={purchaseBeznalCount} purchaseNalCount={purchaseNalCount} purchaseDelCount={purchaseDelCount}
        loadAction={loadAction} loadOrders={loadOrders} query={query} setQuery={setQuery} orders={orders}
        filterPayDate={filterPayDate} setFilerPayDate={setFilerPayDate} disabled={loadParametrs} role={role} isSkilla={isSkilla}
      />
      {activeTabs == '' && query == '' && <List isSkilla={isSkilla} role={role} purchases={purchases} purchaseCount={purchaseCount} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchases} firstCursor={firstCursor} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
      {activeTabs == 'action' && query == '' && <List isSkilla={isSkilla} role={role} purchases={purchaseAction} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseAction} firstCursor={firstCursorAction} load={loadAction} setLoad={setLoadAction} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
      {activeTabs == 'beznal' && query == '' && <List isSkilla={isSkilla} role={role} purchases={purchaseBeznal} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseBeznal} firstCursor={firstCursorBeznal} load={loadBeznal} setLoad={setLoadBeznal} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
      {activeTabs == 'nal' && query == '' && <List isSkilla={isSkilla} role={role} purchases={purchaseNal} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseNal} firstCursor={firstCursorNal} load={loadNal} setLoad={setLoadNal} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
      {activeTabs == 'del' && query == '' && <List isSkilla={isSkilla} role={role} purchases={purchaseDel} purchaseCountGeneral={purchaseCountGeneral} setPurchases={setPurchaseDel} firstCursor={firstCursorDel} load={loadDel} setLoad={setLoadDel} loadParametrs={loadParametrs} activeTabs={activeTabs} filterPayDate={filterPayDate} />}
      {query !== '' && <ListSearch role={role} purchases={purchasesSearch} setPurchases={setPurchasesSearch} firstCursor={firstCursorSearch} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} query={query} />}
      {activeTabs == 'orders' && isSkilla && query == '' && <ListOrders role={role} orders={orders} loadParametrs={loadParametrs} load={loadOrders} personIsView={personIsView} />}
      {order.open && order.id == '' && <WindowOrder role={role} id={order.id} order={order} loadParametrs={loadParametrs} personIsView={personIsView} />}
      {purchase.open && (purchase.id == '' || purchase.isOrder) && <WindowPurchase id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} role={role} isSkilla={isSkilla}/>}

    </div>
  );
}

export default AppPurchase;
