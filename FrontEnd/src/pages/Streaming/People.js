import React from 'react';
import styles from './Streaming.module.css';

const People = ({ movie, castImages, directorImages }) => {
  return (
    <div className={styles.peopleSection}>
      <div className={styles.peopleContainer}>
        {[...movie.director, ...movie.cast].map((person, index) => (
          <div key={index} className={styles.person}>
            <img src={castImages[person] || directorImages[person] || 'https://via.placeholder.com/150'} alt={person} className={styles.personImage} />
            <p className={styles.personName}>{person}</p>
            <p className={styles.personRole}>{movie.director.includes(person) ? 'Director' : 'Actor'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
