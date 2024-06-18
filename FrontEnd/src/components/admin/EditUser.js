import React, { useState, useEffect } from 'react';
import { getCookie } from '../../utils/Cookies';
import styles from './admin.module.css';

const EditUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [editField, setEditField] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getCookie('jwt');
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
                // Filter out users with admin role
                const filteredUsers = data.filter(user => user.role !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                setMessage(`Error fetching users: ${error.message}`);
            }
        };
        fetchUsers();
    }, []);

    const handleUserClick = async (userId) => {
        try {
            const token = getCookie('jwt');
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
            setMessage(`Error fetching user details: ${error.message}`);
        }
    };

    const handleUserUpdate = async (field, value) => {
        try {
            const token = getCookie('jwt');
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
            setMessage('User updated successfully!');
            setEditField('');
        } catch (error) {
            setMessage(`Error updating user: ${error.message}`);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const token = getCookie('jwt');
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

            setMessage('User deleted successfully!');
            setUsers(users.filter(user => user._id !== selectedUser._id));
            setSelectedUser(null);
        } catch (error) {
            setMessage(`Error deleting user: ${error.message}`);
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
        <div className={styles.section}>
            <h2 className={styles.h2}>Edit Users</h2>
            {message && <p>{message}</p>}
            {selectedUser ? (
                <div className={styles['form-group']}>
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
                    <button onClick={handleDeleteUser} className={styles.btn}>Delete User</button>
                    <button onClick={handleCancel} className={styles.btn}>Cancel</button>
                </div>
            ) : (
                <div>
                    <h3>User List</h3>
                    <div className={styles['table-container']}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles['fixed-width']}>Username</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td className={styles['fixed-width']}>{user.username}</td>
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
    );
};

export default EditUser;
