import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './HomePage.module.css';
import Carousel from './Carousel/Carousel';
import GenreSection from './GenreSection/GenreSection';
import Footer from '../../components/public/Footer/Footer';
import Notification from '../../components/public/Notification/Notification';

function HomePage() {
  const location = useLocation(); // Hook to get the current location
  const [type, setType] = useState(null); // State to store the type query parameter

  useEffect(() => {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type');
    setType(typeParam);

    // Handle page refresh logic to prevent unwanted reload loops
    if (!sessionStorage.getItem('isRefreshed')) {
      sessionStorage.setItem('isRefreshed', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('isRefreshed');
    }
  }, [location.search]);

  return (
    <div className={styles.homePage}>
      <Notification />
      <Carousel type={type} />
      <GenreSection type={type} />
      <Footer />
    </div>
  );
}

export default HomePage;
