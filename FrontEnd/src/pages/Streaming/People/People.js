import React, { useEffect, useState } from 'react';
import styles from './People.module.css';
import { getCookie } from '../../../utils/Cookies';

const People = ({ movie }) => {
  const [castImages, setCastImages] = useState({});
  const [directorImages, setDirectorImages] = useState({});
  const token = getCookie('jwt');

  const getCastAndDirectorImages = async (cast, director) => {
    try {
      const response = await fetch('http://localhost:5000/public/get-cast-and-director-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cast, director })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setCastImages(data.castImages);
      setDirectorImages(data.directorImages);
      console.log('Fetched cast and director images:', data);
    } catch (error) {
      console.log('Fetch images error:', error);
    }
  };

  useEffect(() => {
    getCastAndDirectorImages(movie.cast, movie.director);
  }, [movie.cast, movie.director]);

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
