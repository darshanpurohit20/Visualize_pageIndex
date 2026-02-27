/**
 * SearchBar - Floating search component for filtering nodes by title.
 */
import React, { useState, useCallback } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search sections by title..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button className="search-clear" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
