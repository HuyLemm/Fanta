import React from 'react';
import styles from './styles.module.css';
import indexStyles from './index.module.css';

const Loading = () => {
  return (
    <div className={styles.frame}>
      <div className={styles.grid}>
        <div>
          <span className={indexStyles.loader5}></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;