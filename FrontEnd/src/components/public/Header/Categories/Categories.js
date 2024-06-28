import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';

const Categories = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/public/get-genres-movie');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleClickOutside = (event) => {
    if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
      setShowCategories(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (genre) => {
    navigate(`/genre/${genre.name}`);
  };

  const renderGenresInColumns = (genres, genresPerColumn) => {
    const columns = [];
    for (let i = 0; i < genres.length; i += genresPerColumn) {
      columns.push(genres.slice(i, i + genresPerColumn));
    }
    return columns;
  };

  const genresColumns = renderGenresInColumns(genres, 5);

  return (
    <div className={styles.categoriesContainer} ref={categoriesRef}>
      <button
        className={styles.categoriesButton}
        onMouseEnter={() => setShowCategories(true)}
        onMouseLeave={() => setShowCategories(false)}
      >
        Categories
      </button>
      {showCategories && (
        <div
          className={styles.categoriesDropdown}
          onMouseEnter={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
        >
          {genresColumns.map((column, index) => (
            <div key={index} className={styles.categoryColumn}>
              {column.map((genre) => (
                <button
                  key={genre._id}
                  className={styles.categoryItem}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleCategoryClick(genre)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
