import React, { useState } from 'react';
import { getCookie } from '../../utils/Cookies';
import styles from './admin.module.css';

const UpdateMovie = ({ setMessage }) => {
    const [updateData, setUpdateData] = useState({
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

    const handleUpdateMovie = async () => {
        try {
            const token = getCookie('jwt');
            const response = await fetch(`http://localhost:5000/admin/update-movie`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Movie updated successfully: ${JSON.stringify(data)}`);
            } else {
                setMessage(`Error updating movie: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error updating movie: ${error.message}`);
        }
    };

    return (
        <div className={styles.section}>
            <h2>Update Movie</h2>
            <input
                type="text"
                value={updateData.title}
                onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                placeholder="Title"
                className={styles.inputField}
            />
            <input
                type="text"
                value={updateData.description}
                onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                placeholder="Description"
                className={styles.inputField}
            />
            <input
                type="date"
                value={updateData.release_date}
                onChange={(e) => setUpdateData({ ...updateData, release_date: e.target.value })}
                placeholder="Release Date"
                className={styles.inputField}
            />
            <input
                type="number"
                value={updateData.duration}
                onChange={(e) => setUpdateData({ ...updateData, duration: e.target.value })}
                placeholder="Duration"
                className={styles.inputField}
            />
            <input
                type="text"
                value={updateData.genre}
                onChange={(e) => setUpdateData({ ...updateData, genre: e.target.value })}
                placeholder="Genre Name"
                className={styles.inputField}
            />
            <input
                type="text"
                value={updateData.director}
                onChange={(e) => setUpdateData({ ...updateData, director: e.target.value })}
                placeholder="Director"
                className={styles.inputField}
            />
            <input
                type="text"
                value={updateData.cast}
                onChange={(e) => setUpdateData({ ...updateData, cast: e.target.value })}
                placeholder="Cast"
                className={styles.inputField}
            />
            <input
                type="text"
                value={updateData.poster_url}
                onChange={(e) => setUpdateData({ ...updateData, poster_url: e.target.value })}
                placeholder="Poster URL"
                className={styles.inputField}
            />
            <input
                type="text"
                value={updateData.trailer_url}
                onChange={(e) => setUpdateData({ ...updateData, trailer_url: e.target.value })}
                placeholder="Trailer URL"
                className={styles.inputField}
            />
            <button onClick={handleUpdateMovie} className={styles.btn}>Update Movie</button>
        </div>
    );
};

export default UpdateMovie;
