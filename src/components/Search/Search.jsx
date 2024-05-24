import s from './Search.module.scss';
import { ReactComponent as IconSearch } from '../../image/iconSearch.svg';
import { getSearchResult } from '../../Api/Api';
import { useState, useRef, useEffect } from 'react';

function Search({ query, setQuery}) {
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

    return (
        <div className={s.search}>
            <IconSearch />
            <input onChange={handleSearch} value={query || ''} placeholder='Искать...' type='text'></input>
        </div>
    )
};

export default Search;