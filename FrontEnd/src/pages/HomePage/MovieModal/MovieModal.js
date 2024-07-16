import React from 'react';
import Modal from 'react-modal';
import YouTube from 'react-youtube';
import styles from './MovieModal.module.css';
import { BiSolidLike } from "react-icons/bi";

Modal.setAppElement('#root');

const MovieModal = ({ isOpen, onRequestClose, movie }) => {
  if (!movie) return null;

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = getYouTubeId(movie.trailer_url);

  const videoOptions = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      mute: 1,
      iv_load_policy: 3,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.content}>
        <button className={styles.closeButton} onClick={onRequestClose}>&times;</button>
        <div className={styles.videoWrapper}>
          {trailerId && (
            <YouTube
              videoId={trailerId}
              opts={videoOptions}
              className={styles.video}
            />
          )}
          <div className={styles.buttons}>
            <button className={styles.playButton}>Play</button>
            <button className={styles.telepartyButton}>Start a Teleparty</button>
            <button className={styles.addToListButton}><BiSolidLike /></button>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.left}>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.description}>{movie.brief_description}</p>
            <div className={styles.cast}>
              <h2 className={styles.sect}>Cast:</h2>
            <p>{movie.cast.join(', ')}</p>
          </div>
          </div>
          <div className={styles.meta}>
            <div> <h2 className={styles.sect}>Date: </h2>{movie.release_date}</div>
            <div><h2 className={styles.sect}>Genre: </h2>{movie.genre.join(', ')}</div>
            <div><h2 className={styles.sect}>Director: </h2>{movie.director.join(', ')}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MovieModal;
