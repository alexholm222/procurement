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
import { getParameters, getItems, getPurchases, getPurchasesAction, getOrders, getSearchResult } from '../../Api/Api';
//utils
import { handleCompareDateOrder } from '../../utils/date';

const rols = ['administrator', 'hr-assist', 'chief-accountant', 'leader', 'frmanager', 'moderator', 'event-manager']

function AppPurchase() {
  const [theme, setTheme] = useState('light');
  const [purchases, setPurchases] = useState([]);
  const [purchasesSearch, setPurchasesSearch] = useState([]);
  const [query, setQuery] = useState('');
  const [firstCursor, setFirstCursor] = useState('');
  const [firstCursorSearch, setFirstCursorSearch] = useState('');
  const [load, setLoad] = useState(true);
  const [purchaseAction, setPurchaseAction] = useState([]);
  const [firstCursorAction, setFirstCursorActoin] = useState('');
  const [loadAction, setLoadAction] = useState(true);
  const [purchaseBeznal, setPurchaseBeznal] = useState([]);
  const [firstCursorBeznal, setFirstCursorBeznal] = useState('');
  const [loadBeznal, setLoadBeznal] = useState(true);
  const [purchaseNal, setPurchaseNal] = useState([]);
  const [firstCursorNal, setFirstCursorNal] = useState('');
  const [loadNal, setLoadNal] = useState(true);
  const [purchaseDel, setPurchaseDel] = useState([]);
  const [firstCursorDel, setFirstCursorDel] = useState('');
  const [loadDel, setLoadDel] = useState(true);
  const [loadParametrs, setLoadParametrs] = useState(true);
  const [loadOrders, setLoadOrders] = useState(true);
  const [activeTabs, setActiveTabs] = useState('');
  const [orders, setOrders] = useState([]);
  const [personIsView, setPersonIsView] = useState({})
  const dispatch = useDispatch();
  const purchaseNew = useSelector(purchaseUpdateSelector).purchaseNew;
  const orderNew = useSelector(purchaseUpdateSelector).orderNew;
  const updateAction = useSelector(purchaseUpdateSelector).updateAction;
  const updateOrder = useSelector(purchaseUpdateSelector).updateOrder;
  const updateParametrs = useSelector(updateParametrsSelector).update;
  const purchase = useSelector(purchaseSelector).purchase;
  const order = useSelector(purchaseSelector).order;
  const role = document.getElementById('root_purchases').getAttribute('role');

 

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
    if (purchaseNew?.id) {
      setPurchases([purchaseNew, ...purchases]);
      return
    }
  }, [purchaseNew])

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
    getPurchases('')
      .then(res => {
        console.log(res)
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        setPurchases(data);
        setFirstCursor(cursor)
        setLoad(false);
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    getPurchasesAction()
      .then(res => {
        const data = res.data;
        setPurchaseAction(data);
        setLoadAction(false);
      })
      .catch(err => console.log(err))
  }, [updateAction])

  useEffect(() => {
    getPurchases('beznal')
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        setPurchaseBeznal(data);
        setFirstCursorBeznal(cursor)
        setLoadBeznal(false);
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    getPurchases('nal')
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        setPurchaseNal(data);
        setFirstCursorNal(cursor)
        setLoadNal(false);
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    getPurchases('del')
      .then(res => {
        const data = res.data.data;
        const cursor = res.data.next_page_url;
        setPurchaseDel(data);
        setFirstCursorDel(cursor)
        setLoadDel(false);
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    query !== '' && getSearchResult(query)
      .then(res => {
        const data = res.data.data;
        setPurchasesSearch(data);
        setFirstCursorSearch(res.data.next_page_url)
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
        const categories = res1.data.categories;
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
        console.log(res)
        const filterOrders = res.data.order.filter(el => el.status == 0 || (el.status == 1 && handleCompareDateOrder(el.date_create)))
        setOrders(filterOrders);
        setPersonIsView(res.data.person_view);
        console.log('обновились заявки', res);
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
        <h2 className={s.title}>Закупки{/* <sup>278</sup> */}</h2>
        <div className={s.buttons}>
          <button disabled={loadParametrs} onClick={handleOpenOrder} className={`${s.button} ${s.button_add}`}>
            <p>Создать заявку на закупку</p>
            <IconCreate />
          </button>

          <button disabled={loadParametrs} onClick={handleOpenPurchase} className={`${s.button} ${s.button_main}`}>
            <p>Добавить закупку</p>
            <IconAdd />
          </button>
        </div>
      </div>
      <Tabs activeTabs={activeTabs} setActiveTabs={setActiveTabs} purchaseAction={purchaseAction} loadAction={loadAction} loadOrders={loadOrders} query={query} setQuery={setQuery} orders={orders}/>
      {activeTabs == '' && query == '' && <List purchases={purchases} setPurchases={setPurchases} firstCursor={firstCursor} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} />}
      {activeTabs == 'action' && query == '' && <List purchases={purchaseAction} setPurchases={setPurchaseAction} firstCursor={firstCursorAction} load={loadAction} setLoad={setLoadAction} loadParametrs={loadParametrs} activeTabs={activeTabs} />}
      {activeTabs == 'beznal' && query == '' && <List purchases={purchaseBeznal} setPurchases={setPurchaseBeznal} firstCursor={firstCursorBeznal} load={loadBeznal} setLoad={setLoadBeznal} loadParametrs={loadParametrs} activeTabs={activeTabs} />}
      {activeTabs == 'nal' && query == '' && <List purchases={purchaseNal} setPurchases={setPurchaseNal} firstCursor={firstCursorNal} load={loadNal} setLoad={setLoadNal} loadParametrs={loadParametrs} activeTabs={activeTabs} />}
      {activeTabs == 'del' && query == '' && <List purchases={purchaseDel} setPurchases={setPurchaseDel} firstCursor={firstCursorDel} load={loadDel} setLoad={setLoadDel} loadParametrs={loadParametrs} activeTabs={activeTabs} />}
      {query !== '' && <ListSearch purchases={purchasesSearch} setPurchases={setPurchasesSearch} firstCursor={firstCursorSearch} load={load} setLoad={setLoad} loadParametrs={loadParametrs} activeTabs={activeTabs} query={query} />}
      {activeTabs == 'orders' && query == '' && <ListOrders orders={orders} loadParametrs={loadParametrs} load={loadOrders} personIsView={personIsView} />}
      {order.open && order.id == '' && <WindowOrder id={order.id} order={order} loadParametrs={loadParametrs} personIsView={personIsView} />}
      {purchase.open && (purchase.id == '' || purchase.isOrder) && <WindowPurchase id={purchase.id} purchase={purchase} loadParametrs={loadParametrs} />}
    </div>
  );
}

export default AppPurchase;
