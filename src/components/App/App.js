import s from './App.module.scss';
import Tabs from '../Tabs/Tabs';

function App() {
  return (
    <div className={s.app}>
      <div className={s.header}>
        <p className={s.title}>Закупки<sup>278</sup></p>
        <div className={s.buttons}>
          <button className={`${s.button} ${s.button_cancle}`}><p>Удалить</p></button>
          <button className={`${s.button} ${s.button_add}`}><p>Сохранить</p></button>
          <button className={`${s.button} ${s.button_main}`}><p>Отправить на согласование</p></button>
        </div>
      </div>

      <Tabs/>
    </div>
  );
}

export default App;
