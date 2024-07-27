import React, { useState, useEffect } from 'react';
import { getCookie } from '../../../utils/Cookies';
import styles from './Profile.module.css';
import { notifyError, notifySuccess, notifyInfo, notifyWarning } from '../../public/Notification/Notification';

const SeeProfile = () => {
    const [profile, setProfile] = useState({
        email: '',
        username: '',
        password: '',
        avatar: ''
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [editField, setEditField] = useState('');
    const token = getCookie('jwt');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://fanta-kappa.vercel.app/user/get-profile', {
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
                    notifyError(`Error fetching profile: ${data.error}`);
                }
                setLoading(false);
            } catch (error) {
                notifyError(`Error fetching profile: ${error.message}`);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (field, value) => {
        try {
            const response = await fetch(`https://fanta-kappa.vercel.app/user/update-profile`, {
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
                notifySuccess(data.message);
                setEditField('');
            } else {
                notifyError(`Error updating profile: ${data.error}`);
            }
        } catch (error) {
            notifyError(`Error updating profile: ${error.message}`);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            notifyWarning('New password and confirm password do not match.');
            return;
        }
        try {
            const response = await fetch('https://fanta-kappa.vercel.app/user/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwords)
            });

            const data = await response.json();
            if (response.ok) {
                notifySuccess(data.message);
                setEditField('');
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                notifyError(`Error updating password: ${data.error}`);
            }
        } catch (error) {
            notifyError(`Error updating password: ${error.message}`);
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
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <img src={profile.avatar} alt="Avatar" className={styles.avatar} />
                <h2 className={styles.username}>{profile.username}</h2>
                {editField === 'avatar' ? (
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="avatar"
                            value={profile.avatar}
                            onChange={handleFieldChange}
                            placeholder="Enter avatar URL"
                            className={styles.inputField}
                        />
                        <button onClick={() => handleUpdate('avatar', profile.avatar)} className={styles.changePhotoBtn}>Confirm</button>
                        <button onClick={handleCancel} className={styles.changePhotoBtn}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setEditField('avatar')} className={styles.changePhotoBtn}>Change photo</button>
                )}
            </div>
            <div className={styles.profileSection}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Email</h3>
                    <div className={styles.formGroup}>
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
                </div>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Username</h3>
                    <div className={styles.formGroup}>
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
                </div>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Password</h3>
                    <div className={styles.formGroup}>
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
                </div>
            </div>
        </div>
    );
};

export default SeeProfile;
