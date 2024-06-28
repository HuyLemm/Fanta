import React, { useState } from 'react';
import { getCookie } from '../../../utils/Cookies';
import styles from './CreateMovie.module.css';

// Hàm xử lý tạo phim
const CreateMovie = () => {
    const [movieData, setMovieData] = useState({
        title: '',
        brief_description: '',
        full_description: '',
        release_date: '',
        genre: '',
        director: '',
        cast: '',
        poster_url: '',
        background_url: '',
        trailer_url: '',
        type: 'movie',
        duration: '',
        streaming_url: '',
        episodes: [] // Only for series
    });
    const [message, setMessage] = useState('');
    const [numEpisodes, setNumEpisodes] = useState(0); // Number of episodes for series
    const token = getCookie('jwt');

    // Gọi API về backend để xử lý
    const handleCreateMovie = async () => {
        try {
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
                setMovieData({
                    title: '',
                    brief_description: '',
                    full_description: '',
                    release_date: '',
                    genre: '',
                    director: '',
                    cast: '',
                    poster_url: '',
                    background_url: '',
                    trailer_url: '',
                    type: 'movie',
                    duration: '',
                    streaming_url: '',
                    episodes: []
                });
                setNumEpisodes(0);
            } else {
                setMessage(`Error creating movie: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error creating movie: ${error.message}`);
        }
    };

    const handleEpisodeChange = (index, field, value) => {
        const updatedEpisodes = [...movieData.episodes];
        updatedEpisodes[index] = { ...updatedEpisodes[index], [field]: value };
        setMovieData({ ...movieData, episodes: updatedEpisodes });
    };

    // Xử lý tạo ra nhiều episodes
    const renderEpisodeInputs = () => {
        return Array.from({ length: numEpisodes }, (_, index) => (
            <div key={index} className={styles.episodeContainer}>
                <h3>Episode {index + 1}</h3>
                <input
                    type="text"
                    placeholder="Episode Title"
                    onChange={(e) => handleEpisodeChange(index, 'title', e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    onChange={(e) => handleEpisodeChange(index, 'duration', e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="text"
                    placeholder="Streaming URL"
                    onChange={(e) => handleEpisodeChange(index, 'streaming_url', e.target.value)}
                    className={styles.inputField}
                />
            </div>
        ));
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.h2}>Create Movie</h2>
            <input
                type="text"
                value={movieData.title}
                onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                placeholder="Title"
                className={styles.inputField}
                wrap="soft"
            />
              <textarea
                value={movieData.brief_description}
                onChange={(e) => setMovieData({ ...movieData, brief_description: e.target.value })}
                placeholder="Brief Description"
                className={styles.textAreaFieldbrief}
            />
            <textarea
                value={movieData.full_description}
                onChange={(e) => setMovieData({ ...movieData, full_description: e.target.value })}
                placeholder="Full Description"
                className={styles.textAreaFieldfull}
                wrap="soft"
            />
            <input
                type="date"
                value={movieData.release_date}
                onChange={(e) => setMovieData({ ...movieData, release_date: e.target.value })}
                placeholder="Release Date"
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
                value={movieData.background_url}
                onChange={(e) => setMovieData({ ...movieData, background_url: e.target.value })}
                placeholder="Background URL"
                className={styles.inputField}
            />
            <input
                type="text"
                value={movieData.trailer_url}
                onChange={(e) => setMovieData({ ...movieData, trailer_url: e.target.value })}
                placeholder="Trailer URL"
                className={styles.inputField}
            />

            {/* Section tạo type theo series hay movies */}
            <select
                value={movieData.type}
                onChange={(e) => setMovieData({ ...movieData, type: e.target.value })}
                className={styles.inputField}
            >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
            </select>

            {movieData.type === 'movie' && (
                <>
                    <input
                        type="number"
                        value={movieData.duration}
                        onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
                        placeholder="Duration (minutes)"
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={movieData.streaming_url}
                        onChange={(e) => setMovieData({ ...movieData, streaming_url: e.target.value })}
                        placeholder="Streaming URL"
                        className={styles.inputField}
                    />
                </>
            )}
            {movieData.type === 'series' && (
                <div className={styles.episodeSetup}>
                    <input
                        type="number"
                        value={numEpisodes}
                        onChange={(e) => setNumEpisodes(parseInt(e.target.value) || 0)}
                        placeholder="Number of Episodes"
                        className={styles.inputField}
                    />
                    {renderEpisodeInputs()}
                </div>
            )}
            <button onClick={handleCreateMovie} className={styles.btn}>Create Movie</button>
            <p>{message}</p>
        </div>
    );
};

export default CreateMovie;
