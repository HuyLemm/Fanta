import React from 'react';
import styles from './People.module.css';

const People = ({ movie, castImages, directorImages }) => {
  return (
    // Khu vực hiển thị danh sách diễn viên và đạo diễn
    <div className={styles.peopleSection}>
      <div className={styles.peopleContainer}>
        {[...movie.director, ...movie.cast].map((person, index) => (
          <div key={index} className={styles.person}>
            <img 
              src={castImages[person] || directorImages[person] || 'https://via.placeholder.com/150'} 
              alt={person} 
              className={styles.personImage} 
            /> {/* Hình ảnh */}
            <p className={styles.personName}>{person}</p> {/* Tên */}
            <p className={styles.personRole}>{movie.director.includes(person) ? 'Director' : 'Actor'}</p> {/* Vai trò */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
