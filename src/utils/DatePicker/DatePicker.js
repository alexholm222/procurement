import { DatePicker, Space, ConfigProvider } from 'antd';
import './DatePicker.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import locale from 'antd/locale/ru_RU';

const date = new Date();
const secondDate = new Date(date - (1000 * 60 * 60 * 24))

function DataPicker({ setQueryDate, queryDate, dark, disabled, editStop, check }) {

  const dateFormat = 'DD.MM.YYYY';


  function onChange(date, dateString) {
    setQueryDate(date.format('YYYY-MM-DD'));
  };

  return (
    <Space direction="vertical" size={8}>
      <ConfigProvider locale={locale}>
        {(queryDate !== null && queryDate) && <DatePicker placeholder="Выберите дату" disabled={disabled} className={`${dark ? 'pick_dark' : 'pick'} ${editStop ? 'pick_stop' : 'pick'}`} onChange={onChange} defaultValue={dayjs(queryDate)} format={dateFormat} allowClear={false} />}
        {(queryDate == null || !queryDate) && <DatePicker placeholder={check ? '' : "Выберите дату"} disabled={disabled} className={`${dark ? 'pick_dark' : 'pick'} ${editStop ? 'pick_stop' : 'pick'}`} onChange={onChange} format={dateFormat} allowClear={false} />}
      </ConfigProvider>
    </Space>
  )
};

export default DataPicker;