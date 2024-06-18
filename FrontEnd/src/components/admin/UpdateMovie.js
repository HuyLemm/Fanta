import React, { useState } from 'react';
import { getCookie } from '../../utils/Cookies';
import styles from './admin.module.css';

const UpdateMovie = () => {
    const [searchTitle, setSearchTitle] = useState('');
    const [movieData, setMovieData] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const [editFieldValue, setEditFieldValue] = useState('');
    const [message, setMessage] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSearchMovie = async () => {
        try {
            const token = getCookie('jwt');
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
            const token = getCookie('jwt');
            const updatedMovieData = { ...movieData, [field]: value };

            if (field === 'release_date') {
                updatedMovieData[field] = new Date(value).toISOString(); // Convert date back to ISO string before sending
            } else if (field === 'director' || field === 'cast' || field === 'genre') {
                updatedMovieData[field] = value.split(',').map(item => item.trim()); // Convert comma-separated string back to array
            }
            const response = await fetch(`http://localhost:5000/admin/update-movie`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedMovieData)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Movie updated successfully: ${JSON.stringify(data)}`);
                data.release_date = formatDate(data.release_date); // Format date before setting
                setMovieData(data);
                setIsEditing(null);
            } else {
                setMessage(`Error updating movie: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error updating movie: ${error.message}`);
        }
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.h2}>Update Movie</h2>
            {movieData ? (
                <>
                    {Object.keys(movieData).map((key) => (
                        key !== '_id' && (
                            <div key={key} className={styles.inputGroup}>
                                <label>{key.charAt(0).toUpperCase() + key.slice(1)}: </label> {/* Add space after colon */}
                                {isEditing === key ? (
                                    <>
                                        <input
                                            type={key === 'release_date' ? 'date' : 'text'}
                                            value={editFieldValue}
                                            onChange={(e) => setEditFieldValue(e.target.value)}
                                            className={styles.inputField}
                                        />
                                        <button
                                            onClick={() => handleUpdateMovie(key, editFieldValue)}
                                            className={styles.btn}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => { setIsEditing(null); setEditFieldValue(''); }}
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
                                                    onClick={() => { setIsEditing(key); setEditFieldValue(movieData[key]); }}
                                                    className={styles.btn}
                                                >
                                                    Update
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span>{Array.isArray(movieData[key]) ? movieData[key].join(', ') : movieData[key]}</span>
                                                <button
                                                    onClick={() => { setIsEditing(key); setEditFieldValue(movieData[key]); }}
                                                    className={styles.btn}
                                                >
                                                    Update
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    ))}
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
