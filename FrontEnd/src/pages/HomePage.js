import React, { useEffect, useRef } from 'react';
import styles from '../assets/styles/HomePage.module.css';
import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';

const HomePage = () => {
  const nextDom = useRef(null);
  const prevDom = useRef(null);
  const carouselDom = useRef(null);
  const SliderDom = useRef(null);
  const thumbnailBorderDom = useRef(null);

  useEffect(() => {
    const SliderItemsDom = SliderDom.current.querySelectorAll(`.${styles.carousel} .${styles.list} .${styles.item}`);
    const thumbnailItemsDom = thumbnailBorderDom.current.querySelectorAll(`.${styles.item}`);

    if (SliderItemsDom.length > 0 && thumbnailItemsDom.length > 0) {
      thumbnailBorderDom.current.appendChild(thumbnailItemsDom[0]);
    }

    let timeRunning = 3000;
    let timeAutoNext = 7000;

    const showSlider = (type) => {
      if (SliderItemsDom.length > 0 && thumbnailItemsDom.length > 0) {
        if (type === 'next') {
          SliderDom.current.appendChild(SliderItemsDom[0]);
          thumbnailBorderDom.current.appendChild(thumbnailItemsDom[0]);
          carouselDom.current.classList.add(styles.next);
        } else {
          SliderDom.current.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
          thumbnailBorderDom.current.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
          carouselDom.current.classList.add(styles.prev);
        }
        setTimeout(() => {
          carouselDom.current.classList.remove(styles.next);
          carouselDom.current.classList.remove(styles.prev);
        }, timeRunning);
      }
    };

    if (nextDom.current && prevDom.current) {
      nextDom.current.onclick = () => showSlider('next');
      prevDom.current.onclick = () => showSlider('prev');
    }

    const runNextAuto = setInterval(() => {
      showSlider('next');
    }, timeAutoNext);

    return () => clearInterval(runNextAuto);
  }, []);

  return (
    <div className={styles.homepage}>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/">Contacts</a>
          <a href="/">Info</a>
        </nav>
      </header>

      <div className={styles.carousel} ref={carouselDom}>
        <div className={styles.list} ref={SliderDom}>
          <CarouselItem imgSrc={img1} />
          <CarouselItem imgSrc={img2} />
          <CarouselItem imgSrc={img3} />
          <CarouselItem imgSrc={img4} />
        </div>
        <div className={styles.thumbnail} ref={thumbnailBorderDom}>
          <div className={`${styles.item} ${styles.movieThumbnail}`}>
            <img src={img1} alt="Avengers" />
            <div className={styles.content}>
              <div className={styles.title}>Name Slider</div>
              <div className={styles.description}>Description</div>
            </div>
            <div className={styles.movieInfo}>
              <h3>AVENGERS</h3>
              <p>10* | T13 | 2020</p>
              <p>Hollywood Sci-fi</p>
              <a href="#">see more</a>
            </div>
          </div>
          <div className={styles.item}>
            <img src={img2} alt="Slider" />
            <div className={styles.content}>
              <div className={styles.title}>Name Slider</div>
              <div className={styles.description}>Description</div>
            </div>
          </div>
          <div className={styles.item}>
            <img src={img3} alt="Slider" />
            <div className={styles.content}>
              <div className={styles.title}>Name Slider</div>
              <div className={styles.description}>Description</div>
            </div>
          </div>
          <div className={styles.item}>
            <img src={img4} alt="Slider" />
            <div className={styles.content}>
              <div className={styles.title}>Name Slider</div>
              <div className={styles.description}>Description</div>
            </div>
          </div>
        </div>
        <div className={styles.arrows}>
          <button ref={prevDom}>{'<'}</button>
          <button ref={nextDom}>{'>'}</button>
        </div>
        <div className={styles.time}></div>
      </div>

      <GenreSection title="Action Movies" />
      <GenreSection title="Comedy Movies" />
    </div>
  );
};

const CarouselItem = ({ imgSrc }) => (
  <div className={styles.item}>
    <img src={imgSrc} alt="Slide" />
    <div className={styles.content}>
      <div className={styles.author}>LUNDEV</div>
      <div className={styles.title}>DESIGN SLIDER</div>
      <div className={styles.topic}>ANIMAL</div>
      <div className={styles.des}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde...
      </div>
      <div className={styles.buttons}>
        <button>SEE MORE</button>
        <button>SUBSCRIBE</button>
      </div>
    </div>
  </div>
);

const GenreSection = ({ title }) => (
  <div className={styles.genreSection}>
    <h2>{title}</h2>
    <div className={styles.genreList}>
      <button className={styles.prevGenre}>{'<'}</button>
      <div className={styles.genreItems}>
        <div className={styles.item}>
          <img src={img1} alt="Movie 1" />
          <div className={styles.content}>
            <div className={styles.title}>Movie 1</div>
            <div className={styles.description}>Description</div>
          </div>
        </div>
      </div>
      <button className={styles.nextGenre}>{'>'}</button>
    </div>
  </div>
);

export default HomePage;
