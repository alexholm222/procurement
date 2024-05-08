import s from './AppPurchase.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//components
import Tabs from '../Tabs/Tabs';
import List from '../List/List';
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
//slice
import { setPurchase, setPayers, setVendors, setVendorsContracts, setCategories, setItems } from '../../store/reducer/purchase/slice';
//selectors
import { purchaseUpdateSelector } from '../../store/reducer/purchaseUpdate/selector';
//API 
import { getParameters, getItems } from '../../Api/Api';

const rols = ['administrator', 'leader', 'hr-assist']

function AppPurchase() {
  const [theme, setTheme] = useState('light');
  const [purchases, setPurchases] = useState([]);
  const dispatch = useDispatch();
  const purchaseNew = useSelector(purchaseUpdateSelector).purchaseNew;
  const role = document.getElementById('root_purchases').getAttribute('role');

  useEffect(() => {
    if (purchaseNew?.id) {
      setPurchases([purchaseNew, ...purchases]);
      return
    }
  }, [purchaseNew])

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
    Promise.all([getParameters(), getItems()])
      .then(([res1, res2]) => {
        const vendors = res1.data.vendors;
        const vendorsContracts = res1.data.vendor_contracts;
        const payers = res1.data.payers;
        const categories = res1.data.categories;
        const items = res2.data;
        dispatch(setVendors(vendors));
        dispatch(setVendorsContracts(vendorsContracts));
        dispatch(setPayers(payers));
        dispatch(setCategories(categories));
        dispatch(setItems(items));
      })
      .catch(err => console.log(err))
  }, [])

  const handleOpenPurchase = (e) => {
    const id = e.currentTarget.id
    dispatch(setPurchase({ id: '', open: true }))
  }


  return (
    <div className={s.app}>
      <div className={s.header}>
        <h2 className={s.title}>Закупки{/* <sup>278</sup> */}</h2>
        <div className={s.buttons}>
          <button className={`${s.button} ${s.button_add}`}>
            <p>Создать заявку на закупку</p>
            <IconCreate />
          </button>
          <button onClick={handleOpenPurchase} className={`${s.button} ${s.button_main}`}>
            <p>Добавить закупку</p>
            <IconAdd />
          </button>
        </div>
      </div>
      <Tabs />
      <List purchases={purchases} setPurchases={setPurchases} />
    </div>
  );
}

export default AppPurchase;
