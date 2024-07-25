import React, { useState, useEffect } from 'react';
import { getCookie } from '../../../utils/Cookies';
import styles from './EditUser.module.css';
import { notifyError, notifySuccess, notifyInfo, notifyWarning } from '../../public/Notification/Notification';

const EditUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editField, setEditField] = useState('');
    const token = getCookie('jwt');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin/get-users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const filteredUsers = data.filter(user => user.role !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                notifyError(`Error fetching users: ${error.message}`);
            }
        };
        fetchUsers();
    }, [token]);

    const handleUserClick = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/get-user-by-id/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSelectedUser(data);
        } catch (error) {
            notifyError(`Error fetching user details: ${error.message}`);
        }
    };

    const handleUserUpdate = async (field, value) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/update-user-by-id/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSelectedUser(prevUser => ({ ...prevUser, [field]: value }));
            notifySuccess('User updated successfully!');
            setEditField('');
        } catch (error) {
            notifyError(`Error updating user: ${error.message}`);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/admin/delete-user-by-id/${selectedUser._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            notifySuccess('User deleted successfully!');
            setUsers(users.filter(user => user._id !== selectedUser._id));
            setSelectedUser(null);
        } catch (error) {
            notifyError(`Error deleting user: ${error.message}`);
        }
    };

    const handleFieldChange = (e) => {
        setSelectedUser({
            ...selectedUser,
            [e.target.name]: e.target.value
        });
    };

    const handleCancel = () => {
        setEditField('');
        setSelectedUser(null);
    };

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.h2}>Edit Users</h2>
            <div className={styles.profileSection}>
                {selectedUser ? (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>User Details</h3>
                        <div className={styles.formGroup}>
                            <label>Username:</label>
                            {editField === 'username' ? (
                                <>
                                    <input
                                        type="text"
                                        name="username"
                                        value={selectedUser.username}
                                        onChange={handleFieldChange}
                                        className={styles.inputField}
                                    />
                                    <button onClick={() => handleUserUpdate('username', selectedUser.username)} className={styles.btn}>Confirm</button>
                                    <button onClick={handleCancel} className={styles.btn}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span>{selectedUser.username}</span>
                                    <button onClick={() => setEditField('username')} className={styles.btn}>Edit</button>
                                </>
                            )}
                        </div>
                        <button onClick={handleDeleteUser} className={styles.btn}>Delete User</button>
                        <button onClick={handleCancel} className={styles.btn}>Cancel</button>
                    </div>
                ) : (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>User List</h3>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th className={styles.fixedWidth}>Username</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td className={styles.fixedWidth}>{user.username}</td>
                                            <td>
                                                <button onClick={() => handleUserClick(user._id)} className={styles.btn}>View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditUser;
