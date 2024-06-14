import React, { useState } from 'react';
import { getCookie } from '../../utils/Cookies';
import styles from '../../assets/styles/admin.module.css';

const CreateMovie = () => {
    const [movieData, setMovieData] = useState({
        title: '',
        description: '',
        release_date: '',
        duration: '',
        genre: '',
        director: '',
        cast: '',
        poster_url: '',
        trailer_url: ''
    });
    const [message, setMessage] = useState('');

    const handleCreateMovie = async () => {
        try {
            const token = getCookie('jwt');
            const response = await fetch('http://localhost:5000/admin/create-movie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(movieData)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Movie created successfully: ${JSON.stringify(data)}`);
            } else {
                setMessage(`Error creating movie: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error creating movie: ${error.message}`);
        }
    };

    return (
        <div className={styles.section}>
            <h2>Create Movie</h2>
            <input
                type="text"
                value={movieData.title}
                onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                placeholder="Title"
                className={styles.inputField}
            />
            <input
                type="text"
                value={movieData.description}
                onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
                placeholder="Description"
                className={styles.inputField}
            />
            <input
                type="date"
                value={movieData.release_date}
                onChange={(e) => setMovieData({ ...movieData, release_date: e.target.value })}
                placeholder="Release Date"
                className={styles.inputField}
            />
            <input
                type="number"
                value={movieData.duration}
                onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
                placeholder="Duration"
                className={styles.inputField}
            />
            <input
                type="text"
                value={movieData.genre}
                onChange={(e) => setMovieData({ ...movieData, genre: e.target.value })}
                placeholder="Genre Name"
                className={styles.inputField}
            />
            <input
                type="text"
                value={movieData.director}
                onChange={(e) => setMovieData({ ...movieData, director: e.target.value })}
                placeholder="Director"
                className={styles.inputField}
            />
            <input
                type="text"
                value={movieData.cast}
                onChange={(e) => setMovieData({ ...movieData, cast: e.target.value })}
                placeholder="Cast"
                className={styles.inputField}
            />
            <input
                type="text"
                value={movieData.poster_url}
                onChange={(e) => setMovieData({ ...movieData, poster_url: e.target.value })}
                placeholder="Poster URL"
                className={styles.inputField}
            />
            <input
                type="text"
                value={movieData.trailer_url}
                onChange={(e) => setMovieData({ ...movieData, trailer_url: e.target.value })}
                placeholder="Trailer URL"
                className={styles.inputField}
            />
            <button onClick={handleCreateMovie} className={styles.btn}>Create Movie</button>
            <p>{message}</p>
        </div>
    );
};

export default CreateMovie;
