import React, { useState, useEffect } from 'react';
import { getCookie } from '../../../utils/Cookies';
import styles from './EditUser.module.css';
import { notifyError, notifySuccess, notifyInfo,notifyWarning } from '../../public/Notification/Notification';

// Xử lý chỉnh sửa người dùng
const EditUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editField, setEditField] = useState('');
    const token = getCookie('jwt');
    useEffect(() => {
        // Gọi API về BE để lấy tất cả người dùng
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
                // Filter out users with admin role
                const filteredUsers = data.filter(user => user.role !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                notifyError(`Error fetching users: ${error.message}`);
            }
        };
        fetchUsers();
    }, []);

    // Lấy thông tin với user ID được chọn tương ứng
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

    // Chỉnh sửa thông tin với user ID được chọn tương ứng
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

    // Xóa tài khoản user ID được chọn tương ứng
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
        <div className={styles.outer}>
            <h2 className={styles.h2}>Edit Users</h2>
            <div className={styles.section}>
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
        </div>
    );
};

export default EditUser;
