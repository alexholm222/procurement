import s from './WindowPurchase.module.scss';
import Log from '../Log/Log';
import Options from '../Options/Options';
import Goods from '../Goods/Goods';
import Documents from '../Documents/Documents';
const type = ['Основная деятельность', 'Второстепенная деятельность', 'Третий тип', 'Четвертый тип', 'Пятыsdfsdfsdfsfdй тип', 'Шестой тип', 'Седьмой тип', 'Шеsdfsdfsdfстой тип', '8 ngjygyjgyjgyjgyjbg', '9gyjgyjgyjgyj тип', 'Шеsdfsdfsdfстой тип', '8 ngjygyjgyjgyjgyjbg', '9gyjgyjgyjgyj тип'];
const buyer = ['Наличные', 'ИП Никольский И.Е.', 'ИП Упоров К.А.', 'ООО “Скилла Инновации”', 'ООО “Скилла”', 'ООО “Грузчиков Логистика”', 'ООО “Скилла Инновации”', 'ООО “Скилла”', 'ООО “Грузчиков Логистика”']

function WindowPurchase() {
    return (
        <div className={s.window}>
            <div className={s.param}>
                <h3 className={s.title}>Параметры</h3>
                <Options data={type} sub={'Тип закупки'} />
                <Options data={buyer} sub={'Покупатель'} />
            </div>
            <Goods />
            <Documents />
            <Log />
        </div>
    )
};

export default WindowPurchase;