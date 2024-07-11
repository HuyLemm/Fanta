// Header.js
import React from 'react';
import FantaLogoType from './FantaLogoType/FantaLogoType';
import Categories from './Categories/Categories';
import Search from './Search/Search';
import Favourite from './MyFavourite/MyFavourite';
import UserIcon from './Icon/Icon';
import styles from './Header.module.css';
import Notification from '../Notification/Notification';
import History from './History/History';

const Header = ({ setCurrentFunction }) => {
  return (
    <header className={styles.header}>
      <Notification />
      <FantaLogoType />
      <div className={styles.navContainer}>
        <Categories />
        <Search />
        <History setCurrentFunction={setCurrentFunction} />
        <Favourite />
        <UserIcon />
      </div>
    </header>
  );
};

export default Header;
