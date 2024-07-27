import React, { useState } from 'react';
import FantaLogoType from './FantaLogoType/FantaLogoType';
import Categories from './Categories/Categories';
import Search from './Search/Search';
import Favourite from './MyFavourite/MyFavourite';
import UserIcon from './Icon/Icon';
import styles from './Header.module.css';
import Notification from '../Notification/Notification';
import History from './History/History';
import { FaBars } from 'react-icons/fa';

const Header = ({ setCurrentFunction }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className={styles.header}>
      <Notification />
      <FantaLogoType />
      <div className={styles.navContainer}>
        <Favourite />
        <Categories />
        <Search />
        <History setCurrentFunction={setCurrentFunction} />
        <UserIcon />
      </div>
      <div className={styles.searchmobile}>
        <Search />
        <UserIcon />
      </div>
      <div className={styles.hamburgerMenu}>
        <FaBars onClick={toggleMenu} />
        {showMenu && (
          <div className={styles.menu}>
            <Favourite />
            <Categories />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;