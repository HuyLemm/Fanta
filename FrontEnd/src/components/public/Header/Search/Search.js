import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Search.module.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for movies..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>Search</button>
    </form>
  );
};

export default Search;
