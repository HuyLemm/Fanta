import React from 'react';
import FantaLogoType from './FantaLogoType/FantaLogoType';
import Categories from './Categories/Categories';
import Search from './Search/Search';
import Favourite from './MyFavourite/MyFavourite';
import UserIcon from './Icon/Icon';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <FantaLogoType />
      <div className={styles.navContainer}>
        <Categories />
        <Search />
        <Favourite/>
        <UserIcon />
      </div>
    </header>
  );
};

export default Header;
