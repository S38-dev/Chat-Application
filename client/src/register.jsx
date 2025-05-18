import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); 
    formData.append('username', username);
    formData.append('password', password);
    formData.append('profile_pic', profilePic);

    try {
      const res = await axios.post('/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      console.log("User:", res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="file"
        name="profile_pic"
        accept="image/*"
        onChange={(e) => setProfilePic(e.target.files[0])}
      />

      <button type="submit">Register</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default RegisterForm;
