import s from './App.module.scss';
import Tabs from '../Tabs/Tabs';
import List from '../List/List';
import { ReactComponent as IconAdd } from '../../image/iconAdd.svg';
import { ReactComponent as IconCreate } from '../../image/iconCreate.svg';
import WindowPurchase from '../WindowPurchase/WindowPurchase';

function App() {
  return (
    <div className={s.app}>
      <div className={s.header}>
        <p className={s.title}>Закупки<sup>278</sup></p>
        <div className={s.buttons}>
          <button className={`${s.button} ${s.button_cancle}`}><p>Удалить</p></button>
          {/* <button className={`${s.button} ${s.button_cancle}`}><p>Отозвать</p></button>
          <button className={`${s.button} ${s.button_cancle}`}><p>Запросить возврат</p></button> */}
          <button className={`${s.button} ${s.button_add}`}><p>Сохранить</p></button>
          <button className={`${s.button} ${s.button_add}`}>
            <p>Создать заявку на закупку</p>
            <IconCreate />
          </button>
          {/*  <button className={`${s.button} ${s.button_main}`}><p>Отправить на согласование</p></button> */}
          <button className={`${s.button} ${s.button_main}`}><p>Загрузить закрывающие документы</p></button>
          {/*  <button className={`${s.button} ${s.button_main}`}><p>Принять закупку</p></button>
          <button className={`${s.button} ${s.button_main}`}><p>Закрыть закупку</p></button> */}
          <button className={`${s.button} ${s.button_main}`}>
            <p>Добавить закупку</p>
            <IconAdd />
          </button>
        </div>
      </div>

      {/* <Tabs /> */}
      {/* <List /> */}
      <WindowPurchase />
    </div>
  );
}

export default App;
