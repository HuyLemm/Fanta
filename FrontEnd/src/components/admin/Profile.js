import React, { useState, useEffect } from 'react';
import { getCookie } from '../../utils/Cookies';
import styles from './admin.module.css';

const SeeProfile = () => {
    const [profile, setProfile] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [editField, setEditField] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getCookie('jwt');
                const response = await fetch('http://localhost:5000/admin/get-profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setProfile(data);
                } else {
                    setMessage(`Error fetching profile: ${data.error}`);
                }
                setLoading(false);
            } catch (error) {
                setMessage(`Error fetching profile: ${error.message}`);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (field, value) => {
        try {
            const token = getCookie('jwt');
            const response = await fetch('http://localhost:5000/admin/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            });

            const data = await response.json();
            if (response.ok) {
                setProfile(prevProfile => ({ ...prevProfile, [field]: value }));
                setMessage(data.message);
                setEditField('');
            } else {
                setMessage(`Error updating profile: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error updating profile: ${error.message}`);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage('New password and confirm password do not match.');
            return;
        }
        try {
            const token = getCookie('jwt');
            const response = await fetch('http://localhost:5000/admin/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwords)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setEditField('');
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setMessage(`Error updating password: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error updating password: ${error.message}`);
        }
    };

    const handleFieldChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordFieldChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleCancel = () => {
        setEditField('');
        setPasswords({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.section}>
            <h2 className={styles.h2}>Admin Profile</h2>
            <div className={styles['form-group']}>
                <label>Email: </label>
                {editField === 'email' ? (
                    <>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleFieldChange}
                            className={styles.inputField}
                        />
                        <button onClick={() => handleUpdate('email', profile.email)} className={styles.btn}>Confirm</button>
                        <button onClick={handleCancel} className={styles.btn}>Cancel</button>
                    </>
                ) : (
                    <>
                        <span>{profile.email}</span>
                        <button onClick={() => setEditField('email')} className={styles.btn}>Update</button>
                    </>
                )}
            </div>
            <div className={styles['form-group']}>
                <label>Username: </label>
                {editField === 'username' ? (
                    <>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleFieldChange}
                            className={styles.inputField}
                        />
                        <button onClick={() => handleUpdate('username', profile.username)} className={styles.btn}>Confirm</button>
                        <button onClick={handleCancel} className={styles.btn}>Cancel</button>
                    </>
                ) : (
                    <>
                        <span>{profile.username}</span>
                        <button onClick={() => setEditField('username')} className={styles.btn}>Update</button>
                    </>
                )}
            </div>
            <div className={styles['form-group']}>
                <label>Password: </label>
                {editField === 'password' ? (
                    <>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handlePasswordFieldChange}
                            placeholder="Current Password"
                            className={styles.inputField}
                        />
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordFieldChange}
                            placeholder="New Password"
                            className={styles.inputField}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordFieldChange}
                            placeholder="Confirm New Password"
                            className={styles.inputField}
                        />
                        <button onClick={handlePasswordUpdate} className={styles.btn}>Confirm</button>
                        <button onClick={handleCancel} className={styles.btn}>Cancel</button>
                    </>
                ) : (
                    <>
                        <span>********</span>
                        <button onClick={() => setEditField('password')} className={styles.btn}>Update</button>
                    </>
                )}
            </div>
            <p>{message}</p>
        </div>
    );
};

export default SeeProfile;
