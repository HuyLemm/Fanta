import React, { useState } from 'react';

const AdminForm = () => {
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
    const [message, setMessage] = useState('');

    const handleCreateGenre = async () => {
        try {
            const response = await fetch('http://localhost:5000/admin/create-genre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: genreName })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Genre created successfully: ' + JSON.stringify(data));
            } else {
                setMessage('Error creating genre: ' + data.error);
            }
        } catch (error) {
            setMessage('Error creating genre: ' + error.message);
        }
    };

    const handleCreateMovie = async () => {
        try {
            const response = await fetch('http://localhost:5000/admin/create-movie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Movie created successfully: ' + JSON.stringify(data));
            } else {
                setMessage('Error creating movie: ' + data.error);
            }
        } catch (error) {
            setMessage('Error creating movie: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Create Genre</h2>
            <input
                type="text"
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                placeholder="Genre Name"
            />
            <button onClick={handleCreateGenre}>Create Genre</button>

            <h2>Create Movie</h2>
            <input
                type="text"
                value={movieData.title}
                onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                placeholder="Title"
            />
            <input
                type="text"
                value={movieData.description}
                onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
                placeholder="Description"
            />
            <input
                type="date"
                value={movieData.release_date}
                onChange={(e) => setMovieData({ ...movieData, release_date: e.target.value })}
                placeholder="Release Date"
            />
            <input
                type="number"
                value={movieData.duration}
                onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
                placeholder="Duration"
            />
            <input
                type="text"
                value={movieData.genre}
                onChange={(e) => setMovieData({ ...movieData, genre: e.target.value })}
                placeholder="Genre Name"
            />
            <input
                type="text"
                value={movieData.director}
                onChange={(e) => setMovieData({ ...movieData, director: e.target.value })}
                placeholder="Director"
            />
            <input
                type="text"
                value={movieData.cast}
                onChange={(e) => setMovieData({ ...movieData, cast: e.target.value })}
                placeholder="Cast"
            />
            <input
                type="text"
                value={movieData.poster_url}
                onChange={(e) => setMovieData({ ...movieData, poster_url: e.target.value })}
                placeholder="Poster URL"
            />
            <input
                type="text"
                value={movieData.trailer_url}
                onChange={(e) => setMovieData({ ...movieData, trailer_url: e.target.value })}
                placeholder="Trailer URL"
            />
            <button onClick={handleCreateMovie}>Create Movie</button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminForm;
