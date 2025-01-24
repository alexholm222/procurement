import s from './Search.module.scss';
import { ReactComponent as IconSearch } from '../../image/iconSearch.svg';
import { ReactComponent as IconСlose } from '../../image/icon/iconClose.svg';
import { useState, useRef, useEffect } from 'react';

function Search({ query, setQuery }) {
    const throttleInProgress = useRef();


    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value)
        if (throttleInProgress.current) {
            return
        }
        throttleInProgress.current = true;
        setTimeout(() => {
            setQuery(value)
            throttleInProgress.current = false;
        });
    }

    const handleReset = () => {
        setQuery('')
    }

    return (
        <div className={s.search}>
            <IconSearch />
            <input onChange={handleSearch} value={query || ''} placeholder='Искать...' type='text'></input>
            <div onClick={handleReset} className={`${s.reset} ${query.length > 0 && s.reset_vis}`}>
                <IconСlose />
            </div>

        </div>
    )
};

export default Search;