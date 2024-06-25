import React, { useState } from 'react';
import { getCookie } from '../../../utils/Cookies';
import styles from './CreateGenre.module.css';

const CreateGenre = () => {
    const [genreName, setGenreName] = useState('');
    const [message, setMessage] = useState('');
    const token = getCookie('jwt');
    const handleCreateGenre = async () => {
        try {
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
                setGenreName('');
            } else {
                setMessage(`Error creating genre: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error creating genre: ${error.message}`);
        }
    };

    return (
        <div className={styles.outer}>
            <h2 className={styles.h2}>Create Genre</h2>
            <div className={styles.section}>
                <input
                    type="text"
                    value={genreName}
                    onChange={(e) => setGenreName(e.target.value)}
                    placeholder="Genre Name"
                    className={styles.inputField}
                />
                <button onClick={handleCreateGenre} className={styles.btn}>Create Genre</button>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default CreateGenre;
