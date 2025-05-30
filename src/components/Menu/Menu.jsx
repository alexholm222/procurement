import s from './Menu.module.scss';
import { Link, useLocation } from 'react-router-dom';

const Menu = ({role, purchaseCount}) => {
      const location = useLocation();
      const path = location.pathname;
      console.log(path)
    return (
        <div className={s.tabs}>
            <Link to={'/new/purchases'}><div id='1' className={`${s.tab} ${(path === '/new/purchases' || path.includes('detail=')) && s.tab_active}`}>Закупки <sup>{purchaseCount}</sup></div></Link>
            <Link to={'/new/purchases/stock'}><div id='2' className={`${s.tab} ${path === '/new/purchases/stock' && s.tab_active}`}>Склад</div></Link>
            {(role == 'director' || role == 'accountant') && <Link to={'/new/purchases/manual'}><div id='3' className={`${s.tab} ${path === '/new/purchases/manual' &&  s.tab_active}`}>Ручной учет</div></Link>}
        </div>
    )
}

export default Menu;