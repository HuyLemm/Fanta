import React, { useState } from 'react';
import { getCookie } from '../../../utils/Cookies';
import styles from './CreateGenre.module.css';
import Notification, { notifyError, notifySuccess, notifyInfo,notifyWarning } from '../../../components/public/Notification/Notification';
// Xử lý hàm tạo thể loại
const CreateGenre = () => {
    const [genreName, setGenreName] = useState('');
    const token = getCookie('jwt');

    // Xử lý call API đến backend để tạo thể loại
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
                notifyInfo(`Genre created successfully: ${JSON.stringify(data)}`);
                setGenreName('');
            } else {
                notifyError(`Error creating genre: ${data.error}`);
            }
        } catch (error) {
            notifyError(`Error creating genre: ${error.message}`);
        }
    };

    return (
        // Section create genre
        <div className={styles.outer}>
            <Notification />
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
            </div>
        </div>
    );
};

export default CreateGenre;
