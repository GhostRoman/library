import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Используем useCallback для создания дебаунсированной функции поиска
    const debouncedSearch = useCallback(
        debounce((term) => {
            onSearch(term);
        }, 300),
        [onSearch]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Очистка дебаунсированной функции при размонтировании компонента
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return (
        <div className="search-bar">
            <input
                type="text"
                className="search-input"
                placeholder="Search books..."
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
}

export default SearchBar;
