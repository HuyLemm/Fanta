import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fantaImage from '../../../assets/images/fanta.png';
import userIcon from '../../../assets/images/user.png';
import guestIcon from '../../../assets/images/guest.png';
import adminIcon from '../../../assets/images/admin.jpg';
import styles from './fanta.module.css';
import { AuthContext } from '../../auth/AuthContext';
import { getCookie } from '../../../utils/Cookies';

const FantaLogo = () => {
  const { authStatus, setAuthStatus } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);
  const token = getCookie('jwt');

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

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleUserClick = () => {
    navigate('/user');
  };

  const handleLogout = async (e) => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setAuthStatus({
          checking: false,
          loggedIn: false,
          role: null,
          avatar: null,
        });
        navigate('/');
      } else {
        console.error('Error logging out:', data.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (
      (dropdownRef.current && !dropdownRef.current.contains(event.target))
    ) {
      setShowDropdown(false);
    }

    if (
      (categoriesRef.current && !categoriesRef.current.contains(event.target))
    ) {
      setShowCategories(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  // const toggleCategories = () => {
  //   setShowCategories((prevShowCategories) => !prevShowCategories);
  // };

  const handleCategoryClick = (genre) => {
    navigate(`/genre/${genre.name}`);
  };

  const renderUserIcon = () => {
    if (authStatus.checking) {
      return <div>Loading...</div>;
    }

    if (!authStatus.loggedIn) {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={guestIcon} alt="Guest Icon" />
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleLoginClick} className={styles.loginButton}>Login</button>
          </div>
        </div>
      );
    }

    const handleImageError = (event) => {
      event.target.src = userIcon; // Sử dụng hình ảnh mặc định nếu avatar không tải được
    };

    const userAvatar = authStatus.avatar || userIcon;

    if (authStatus.role === 'admin') {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={adminIcon} alt="Admin Icon" className={styles.adminpic} onError={handleImageError} />
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleAdminClick} className={styles.adminButton}>Admin Panel</button>
            <button onClick={handleLogout} className={styles.loginButton}>Logout</button>
          </div>
        </div>
      );
    }

    if (authStatus.role === 'user') {
      return (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <img src={userAvatar} alt="User Icon" onError={handleImageError} />
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={handleUserClick} className={styles.userButton}>User Profile</button>
            <button onClick={handleLogout} className={styles.loginButton}>Logout</button>
          </div>
        </div>
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const renderGenresInColumns = (genres, genresPerColumn) => {
    const columns = [];
    for (let i = 0; i < genres.length; i += genresPerColumn) {
      columns.push(genres.slice(i, i + genresPerColumn));
    }
    return columns;
  };

  const genresColumns = renderGenresInColumns(genres, 5);

  const handleFavoriteClick = () => {
    if (token) {
      navigate('/favorite');
    } else {
      navigate('/login'); // Hoặc hiển thị thông báo yêu cầu đăng nhập
    }
  };

  return (
    <header className={styles.header}>
      <a href="/">
        <img src={fantaImage} className={styles.fanta} alt="Fanta" />
      </a>
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
      <div className={styles.categoriesAndFavorite}>
        <div
          className={styles.categoriesContainer}
          ref={categoriesRef}
          onMouseLeave={() => setShowCategories(false)}
        >
          <button
            className={styles.categoriesButton}
            onMouseEnter={() => setShowCategories(true)}
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
        <button className={styles.favoriteButton} onClick={handleFavoriteClick}>My Favorite</button>
      </div>
      {renderUserIcon()}
    </header>
  );
};

export default FantaLogo;
