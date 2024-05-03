import s from './AppPurchase.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
//components
import Tabs from '../Tabs/Tabs';
import List from '../List/List';
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
//slice
import { setPurchase, setPayers, setVendors, setCategories } from '../../store/reducer/purchase/slice';
//API 
import { getVendors, getPayersList, getCategories } from '../../Api/Api';

function AppPurchase() {
  const [theme, setTheme] = useState('light');
  const [purchases, setPurchases] = useState([]);
  const dispatch = useDispatch();

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
    Promise.all([getVendors(), getPayersList(), getCategories()])
      .then(([res1, res2, res3]) => {
        const vendors = res1.data;
        const payers = res2.data;
        const categories = res3.data;
        dispatch(setVendors(vendors));
        dispatch(setPayers(payers));
        dispatch(setCategories(categories));
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
        <h2 className={s.title}>Закупки<sup>278</sup></h2>
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
