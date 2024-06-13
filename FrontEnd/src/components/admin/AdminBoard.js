import React, { useState, useRef, useEffect } from 'react';
import { setCookie, getCookie } from '../../utils/Cookies';
import styles from '../../assets/styles/board.module.css';
import boardIcon from '../../assets/images/board.png';

const AdminBoard =() =>{
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const function1 = () => {
        // function của admin
      };

    const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const toggleDropdown = (event) => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
    };

    return (
        <div className={styles.panel}>
        <div className={styles.boardContainer} ref={dropdownRef}>
          <div className={styles.boardIcon} onClick={toggleDropdown}>
            <img src={boardIcon} className={styles.boardIcon}/>
          </div>
          <div className={`${styles.dropdown} ${showDropdown ? styles.dropdownVisible : ''}`}>
            <button onClick={function1} className={styles.adminButton}>function1</button>
            <button onClick={function1} className={styles.adminButton}>function2</button>
          </div>
        </div>
        </div>
    );
};

export default AdminBoard;