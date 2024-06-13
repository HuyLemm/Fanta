import React, { useState } from 'react';

const LogoutButton = () => {
  const [message, setMessage] = useState('');

  // chức năng cho server cho đăng xuất
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include', // Đảm bảo gửi cookie trong yêu cầu
      });

      const data = await response.json(); // Chuyển đổi phản hồi thành JSON

      if (response.ok) {
        setMessage(data.message); // Sử dụng thuộc tính message từ phản hồi
      } else {
        setMessage('Logout failed: ' + data.message || response.statusText); // Xử lý lỗi
      }
    } catch (error) {
      setMessage('Logout error: ' + error.message); // Đặt thông báo lỗi logout
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutButton;
