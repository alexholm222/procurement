import s from './Search.module.scss';
import { ReactComponent as IconSearch } from '../../image/iconSearch.svg';

function Search() {
    return (
        <div className={s.search}>
            <IconSearch />
            <input placeholder='Искать...' type='text'></input>
        </div>
    )
};

export default Search;