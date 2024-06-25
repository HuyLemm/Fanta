import React, { useState, useEffect } from 'react';
import { getCookie } from '../../../utils/Cookies';
import styles from './UpdateMovie.module.css';

const UpdateMovie = () => {
    const [searchTitle, setSearchTitle] = useState('');
    const [movieData, setMovieData] = useState(null);
    const [isEditingField, setIsEditingField] = useState(null);
    const [editFieldValue, setEditFieldValue] = useState('');
    const [numEpisodes, setNumEpisodes] = useState(0); // Number of episodes for series
    const [message, setMessage] = useState('');
    const token = getCookie('jwt');

    useEffect(() => {
        if (movieData && movieData.type === 'series') {
            setNumEpisodes(movieData.episodes.length);
        } else {
            setNumEpisodes(0);
        }
    }, [movieData]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSearchMovie = async () => {
        try {
            const response = await fetch(`http://localhost:5000/admin/find-movie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: searchTitle })
            });

            const data = await response.json();
            if (response.ok) {
                if (data) {
                    data.release_date = formatDate(data.release_date); // Format date before setting
                    setMovieData(data);
                    setMessage('');
                } else {
                    setMessage('Movie not found.');
                }
            } else {
                setMessage(`Error finding movie: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error finding movie: ${error.message}`);
        }
    };

    const handleUpdateMovie = async (field, value) => {
        try {
            const updatedMovieData = { ...movieData, [field]: value };

            if (field === 'release_date') {
                updatedMovieData[field] = new Date(value).toISOString(); // Convert date back to ISO string before sending
            } else if (field === 'director' || field === 'cast' || field === 'genre') {
                updatedMovieData[field] = value.split(',').map(item => item.trim()); // Convert comma-separated string back to array
            } else if (field === 'type') {
                if (value === 'movie') {
                    updatedMovieData.episodes = [];
                } else {
                    updatedMovieData.duration = '';
                    updatedMovieData.streaming_url = '';
                }
            }

            const response = await fetch(`http://localhost:5000/admin/update-movie`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ updatedMovieData, originalTitle: movieData.title })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Movie updated successfully: ${JSON.stringify(data)}`);
                data.release_date = formatDate(data.release_date); // Format date before setting
                setMovieData(data);
                setIsEditingField(null);
            } else {
                setMessage(`Error updating movie: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error updating movie: ${error.message}`);
        }
    };

    const handleEpisodeChange = (index, field, value) => {
        const updatedEpisodes = [...movieData.episodes];
        updatedEpisodes[index] = { ...updatedEpisodes[index], [field]: value };
        setMovieData({ ...movieData, episodes: updatedEpisodes });
    };

    const renderEpisodeInputs = () => {
        return Array.from({ length: numEpisodes }, (_, index) => (
            <div key={index} className={styles.episodeContainer}>
                <h3>Episode {index + 1}</h3>
                <input
                    type="text"
                    placeholder="Episode Title"
                    value={movieData.episodes[index]?.title || ''}
                    onChange={(e) => handleEpisodeChange(index, 'title', e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={movieData.episodes[index]?.duration || ''}
                    onChange={(e) => handleEpisodeChange(index, 'duration', e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="date"
                    placeholder="Release Date"
                    value={formatDate(movieData.episodes[index]?.release_date) || ''}
                    onChange={(e) => handleEpisodeChange(index, 'release_date', e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="text"
                    placeholder="Streaming URL"
                    value={movieData.episodes[index]?.streaming_url || ''}
                    onChange={(e) => handleEpisodeChange(index, 'streaming_url', e.target.value)}
                    className={styles.inputField}
                />
            </div>
        ));
    };

    return (
        <div className={styles.h2}>
            <h2 className={styles.h2}>Update Movie</h2>
            {movieData ? (
                <>
                    {Object.keys(movieData).map((key) => (
                        key !== '_id' && key !== 'episodes' && (
                            <div key={key} className={styles.inputGroup}>
                                <label>{key.charAt(0).toUpperCase() + key.slice(1)}: </label>
                                {isEditingField === key ? (
                                    <>
                                        {key === 'type' ? (
                                            <select
                                                value={editFieldValue}
                                                onChange={(e) => setEditFieldValue(e.target.value)}
                                                className={styles.inputField}
                                            >
                                                <option value="movie">Movie</option>
                                                <option value="series">Series</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={key === 'release_date' ? 'date' : 'text'}
                                                value={editFieldValue}
                                                onChange={(e) => setEditFieldValue(e.target.value)}
                                                className={styles.inputField}
                                            />
                                        )}
                                        <button
                                            onClick={() => handleUpdateMovie(key, editFieldValue)}
                                            className={styles.btn}
                                        >
                                            Update Movie
                                        </button>
                                        <button
                                            onClick={() => { setIsEditingField(null); setEditFieldValue(''); }}
                                            className={styles.btn}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {key === 'poster_url' || key === 'background_url' ? (
                                            <>
                                                <img src={movieData[key]} alt={key} className={styles.imagePreview} />
                                                <button
                                                    onClick={() => { setIsEditingField(key); setEditFieldValue(movieData[key]); }}
                                                    className={styles.btn}
                                                >
                                                    Update Movie
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span>{Array.isArray(movieData[key]) ? movieData[key].join(', ') : movieData[key]}</span>
                                                <button
                                                    onClick={() => { setIsEditingField(key); setEditFieldValue(movieData[key]); }}
                                                    className={styles.btn}
                                                >
                                                    Update Movie
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    ))}
                    {isEditingField === 'type' && movieData.type === 'movie' && (
                        <>
                            <div className={styles.inputGroup}>
                                <label>Duration: </label>
                                <input
                                    type="number"
                                    value={movieData.duration}
                                    onChange={(e) => setEditFieldValue(e.target.value)}
                                    placeholder="Duration (minutes)"
                                    className={styles.inputField}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Streaming URL: </label>
                                <input
                                    type="text"
                                    value={movieData.streaming_url}
                                    onChange={(e) => setEditFieldValue(e.target.value)}
                                    placeholder="Streaming URL"
                                    className={styles.inputField}
                                />
                            </div>
                        </>
                    )}
                    {isEditingField === 'type' && movieData.type === 'series' && (
                        <div className={styles.episodeSetup}>
                            <div className={styles.inputGroup}>
                                <label>Number of Episodes: </label>
                                <input
                                    type="number"
                                    value={numEpisodes}
                                    onChange={(e) => setNumEpisodes(parseInt(e.target.value) || 0)}
                                    className={styles.inputField}
                                />
                            </div>
                            {renderEpisodeInputs()}
                        </div>
                    )}
                    <p>{message}</p>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        placeholder="Enter movie title to search"
                        className={styles.inputField}
                    />
                    <button onClick={handleSearchMovie} className={styles.btn}>Search Movie</button>
                </>
            )}
        </div>
    );
};

export default UpdateMovie;
