import React, { useEffect, useRef } from 'react';
import styles from '../../assets/styles/Carousel.module.css';
import img1 from '../../assets/images/img1.jpg';
import img2 from '../../assets/images/img2.jpg';
import img3 from '../../assets/images/img3.jpg';
import img4 from '../../assets/images/img4.jpg';

const Carousel = () => {
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbnailRef = useRef(null);

  useEffect(() => {
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const carousel = carouselRef.current;
    const slider = sliderRef.current;
    const thumbnailBorder = thumbnailRef.current;
    
    let timeRunning = 3000;
    let timeAutoNext = 7000;
    let runTimeOut;
    let runNextAuto;

    function showSlider(type) {
      let sliderItems = slider.children;
      let thumbnailItems = thumbnailBorder.children;

      if (type === 'next') {
        slider.appendChild(sliderItems[0]);
        thumbnailBorder.appendChild(thumbnailItems[0]);
        carousel.classList.add(styles.next);
      } else {
        slider.prepend(sliderItems[sliderItems.length - 1]);
        thumbnailBorder.prepend(thumbnailItems[thumbnailItems.length - 1]);
        carousel.classList.add(styles.prev);
      }

      clearTimeout(runTimeOut);
      runTimeOut = setTimeout(() => {
        carousel.classList.remove(styles.next);
        carousel.classList.remove(styles.prev);
      }, timeRunning);

      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        next.click();
      }, timeAutoNext);
    }

    next.onclick = () => showSlider('next');
    prev.onclick = () => showSlider('prev');

    runNextAuto = setTimeout(() => {
      next.click();
    }, timeAutoNext);

    return () => {
      clearTimeout(runNextAuto);
      clearTimeout(runTimeOut);
    };
  }, []);

  return (
    <div className={styles.carousel} ref={carouselRef}>
      <div className={styles.list} ref={sliderRef}>
        {[img1, img2, img3, img4].map((src, index) => (
          <div className={styles.item} key={index}>
            <img src={src} alt={`img${index + 1}`} />
            <div className={styles.content}>
              <div className={styles.author}>LUNDEV</div>
              <div className={styles.title}>DESIGN SLIDER</div>
              <div className={styles.topic}>ANIMAL</div>
              <div className={styles.des}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit...
              </div>
              <div className={styles.buttons}>
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.thumbnail} ref={thumbnailRef}>
        {[img1, img2, img3, img4].map((src, index) => (
          <div className={`${styles.item} ${styles.movieThumbnail}`} key={index}>
            <img src={src} alt={`img${index + 1}`} />
            <div className={styles.content}>
              <div className={styles.title}>Name Slider</div>
              <div className={styles.description}>Description</div>
            </div>
            <div className={styles.movieInfo}>
              <h3>AVENGERS</h3>
              <p>10* | T13 | 2020</p>
              <p>Hollywood Sci-fi</p>
              <p>The Avengers were...</p>
              <a href="#">see more</a>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.arrows}>
        <button id="prev">&lt;</button>
        <button id="next">&gt;</button>
      </div>
      <div className={styles.time}></div>
    </div>
  );
};

export default Carousel;
