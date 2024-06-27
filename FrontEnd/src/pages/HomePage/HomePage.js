import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './HomePage.module.css';
import Carousel from './Carousel/Carousel';
import GenreSection from './GenreSection/GenreSection';
import Footer from '../../components/public/Footer/Footer';

function HomePage() {
  const location = useLocation();
  const [type, setType] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type');
    setType(typeParam);

    if (!sessionStorage.getItem('isRefreshed')) {
      sessionStorage.setItem('isRefreshed', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('isRefreshed');
    }
  }, [location.search]);

  return (
    <div className={styles.homePage}>
      <Carousel type={type} />
      <GenreSection type={type} />
      <Footer/>
    </div>
  );
}

export default HomePage;
