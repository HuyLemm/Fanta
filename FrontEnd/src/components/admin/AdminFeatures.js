import React, { useState } from 'react';
import { setCookie, getCookie } from '../../utils/Cookies';
import styles from '../../assets/styles/admin.module.css';

const AdminFeatures = () => {
    const [genreName, setGenreName] = useState('');
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
    const [message, setMessage] = useState('');

    const handleCreateGenre = async () => {
        try {
            const token = getCookie('jwt');
            const response = await fetch('http://localhost:5000/admin/create-genre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: genreName })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Genre created successfully: ${JSON.stringify(data)}`);
            } else {
                setMessage(`Error creating genre: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error creating genre: ${error.message}`);
        }
    };

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
        <section className={styles['admin-features']}>
            <div className="admin-features">
                <div className="section">
                    <h2>Create Genre</h2>
                    <input
                        type="text"
                        value={genreName}
                        onChange={(e) => setGenreName(e.target.value)}
                        placeholder="Genre Name"
                        className="input-field"
                    />
                    <button onClick={handleCreateGenre} className="btn">Create Genre</button>
                </div>

                <div className="section">
                    <h2>Create Movie</h2>
                    <input
                        type="text"
                        value={movieData.title}
                        onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                        placeholder="Title"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={movieData.description}
                        onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
                        placeholder="Description"
                        className="input-field"
                    />
                    <input
                        type="date"
                        value={movieData.release_date}
                        onChange={(e) => setMovieData({ ...movieData, release_date: e.target.value })}
                        placeholder="Release Date"
                        className="input-field"
                    />
                    <input
                        type="number"
                        value={movieData.duration}
                        onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
                        placeholder="Duration"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={movieData.genre}
                        onChange={(e) => setMovieData({ ...movieData, genre: e.target.value })}
                        placeholder="Genre Name"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={movieData.director}
                        onChange={(e) => setMovieData({ ...movieData, director: e.target.value })}
                        placeholder="Director"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={movieData.cast}
                        onChange={(e) => setMovieData({ ...movieData, cast: e.target.value })}
                        placeholder="Cast"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={movieData.poster_url}
                        onChange={(e) => setMovieData({ ...movieData, poster_url: e.target.value })}
                        placeholder="Poster URL"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={movieData.trailer_url}
                        onChange={(e) => setMovieData({ ...movieData, trailer_url: e.target.value })}
                        placeholder="Trailer URL"
                        className="input-field"
                    />
                    <button onClick={handleCreateMovie} className="btn">Create Movie</button>
                </div>

                <div className="section">
                    <h2>Update Movie</h2>
                    <input
                        type="text"
                        value={updateData.title}
                        onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                        placeholder="Title"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={updateData.description}
                        onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                        placeholder="Description"
                        className="input-field"
                    />
                    <input
                        type="date"
                        value={updateData.release_date}
                        onChange={(e) => setUpdateData({ ...updateData, release_date: e.target.value })}
                        placeholder="Release Date"
                        className="input-field"
                    />
                    <input
                        type="number"
                        value={updateData.duration}
                        onChange={(e) => setUpdateData({ ...updateData, duration: e.target.value })}
                        placeholder="Duration"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={updateData.genre}
                        onChange={(e) => setUpdateData({ ...updateData, genre: e.target.value })}
                        placeholder="Genre Name"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={updateData.director}
                        onChange={(e) => setUpdateData({ ...updateData, director: e.target.value })}
                        placeholder="Director"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={updateData.cast}
                        onChange={(e) => setUpdateData({ ...updateData, cast: e.target.value })}
                        placeholder="Cast"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={updateData.poster_url}
                        onChange={(e) => setUpdateData({ ...updateData, poster_url: e.target.value })}
                        placeholder="Poster URL"
                        className="input-field"
                    />
                    <input
                        type="text"
                        value={updateData.trailer_url}
                        onChange={(e) => setUpdateData({ ...updateData, trailer_url: e.target.value })}
                        placeholder="Trailer URL"
                        className="input-field"
                    />
                    <button onClick={handleUpdateMovie} className="btn">Update Movie</button>
                </div>

                {message && <p className="message">{message}</p>}
            </div>
        </section>
    );
};

export default AdminFeatures;